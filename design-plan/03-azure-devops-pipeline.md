# 🚀 Azure DevOps Pipeline Configuration

> **Reference Document**: Complete Azure DevOps CI/CD pipeline setup for Le Restaurant Java application.

## 📋 Pipeline Overview

### Pipeline Strategy
**Approach**: GitFlow with Feature Branches  
**Environments**: Development → Staging → Production  
**Automation Level**: Fully automated with manual approval gates  
**Quality Gates**: Code coverage, security scans, performance tests  

---

## 🔄 CI/CD Workflow

### Branch Strategy & Triggers

```
┌─────────────────────────────────────────────────────────────────┐
│                        Branch Strategy                         │
│                                                                 │
│  main branch     ──────────────────────────────────────────────►│
│    │                                                            │
│    ├─ develop   ──────────────────────────────────────────────►│
│    │    │                                                       │
│    │    ├─ feature/menu-management ──────────────────────────►│
│    │    ├─ feature/order-system ──────────────────────────────►│
│    │    └─ hotfix/critical-bug ──────────────────────────────►│
│    │                                                            │
│    └─ release/v1.0 ──────────────────────────────────────────►│
└─────────────────────────────────────────────────────────────────┘

Pipeline Triggers:
├─ Feature branches → CI only (build + test)
├─ Develop branch   → CI + Deploy to Dev environment
├─ Release branches → CI + Deploy to Staging
└─ Main branch      → CI + Deploy to Production (with approval)
```

---

## 🛠️ Pipeline Configuration Files

### 1. Main CI/CD Pipeline (`azure-pipelines.yml`)

```yaml
# Azure DevOps Pipeline for Le Restaurant
# Trigger on multiple branches with different behaviors

trigger:
  branches:
    include:
    - main
    - develop
    - release/*
    - feature/*
  paths:
    exclude:
    - README.md
    - docs/*
    - design-plan/*

pr:
  branches:
    include:
    - main
    - develop
  paths:
    exclude:
    - README.md
    - docs/*

variables:
  # Build Variables
  buildConfiguration: 'Release'
  javaVersion: '17'
  mavenVersion: '3.8.6'
  
  # Azure Variables
  azureSubscription: 'le-restaurant-service-connection'
  appServiceName: 'le-restaurant-app'
  resourceGroupName: 'rg-le-restaurant'
  
  # Database Variables
  sqlServerName: 'sql-le-restaurant'
  databaseName: 'db-le-restaurant'

stages:
# =============================================================================
# CONTINUOUS INTEGRATION STAGE
# =============================================================================
- stage: CI
  displayName: 'Continuous Integration'
  jobs:
  - job: Build
    displayName: 'Build and Test'
    pool:
      vmImage: 'ubuntu-latest'
    
    steps:
    # Setup Java Environment
    - task: JavaToolInstaller@0
      displayName: 'Setup Java $(javaVersion)'
      inputs:
        versionSpec: '$(javaVersion)'
        jdkArchitectureOption: 'x64'
        jdkSourceOption: 'PreInstalled'
    
    # Cache Maven Dependencies
    - task: Cache@2
      displayName: 'Cache Maven Dependencies'
      inputs:
        key: 'maven | "$(Agent.OS)" | pom.xml'
        restoreKeys: |
          maven | "$(Agent.OS)"
          maven
        path: $(MAVEN_CACHE_FOLDER)
    
    # Run Maven Build
    - task: Maven@3
      displayName: 'Maven Build'
      inputs:
        mavenPomFile: 'pom.xml'
        goals: 'clean compile'
        options: '-DskipTests=true'
        javaHomeOption: 'JDKVersion'
        jdkVersionOption: '$(javaVersion)'
        mavenVersionOption: 'Default'
    
    # Run Unit Tests
    - task: Maven@3
      displayName: 'Run Unit Tests'
      inputs:
        mavenPomFile: 'pom.xml'
        goals: 'test'
        javaHomeOption: 'JDKVersion'
        jdkVersionOption: '$(javaVersion)'
        testResultsFiles: '**/surefire-reports/TEST-*.xml'
    
    # Run Integration Tests
    - task: Maven@3
      displayName: 'Run Integration Tests'
      inputs:
        mavenPomFile: 'pom.xml'
        goals: 'verify'
        options: '-DskipUnitTests=true'
        javaHomeOption: 'JDKVersion'
        jdkVersionOption: '$(javaVersion)'
    
    # Code Coverage Analysis
    - task: Maven@3
      displayName: 'Generate Code Coverage'
      inputs:
        mavenPomFile: 'pom.xml'
        goals: 'jacoco:report'
        javaHomeOption: 'JDKVersion'
        jdkVersionOption: '$(javaVersion)'
    
    # Publish Test Results
    - task: PublishTestResults@2
      displayName: 'Publish Test Results'
      condition: succeededOrFailed()
      inputs:
        testResultsFormat: 'JUnit'
        testResultsFiles: '**/surefire-reports/TEST-*.xml'
        mergeTestResults: true
        testRunTitle: 'Unit Tests'
    
    # Publish Code Coverage
    - task: PublishCodeCoverageResults@1
      displayName: 'Publish Code Coverage'
      inputs:
        codeCoverageTool: 'JaCoCo'
        summaryFileLocation: '**/site/jacoco/jacoco.xml'
        reportDirectory: '**/site/jacoco'
        failIfCoverageEmpty: true
    
    # Security Scan with OWASP Dependency Check
    - task: dependency-check-build-task@6
      displayName: 'OWASP Dependency Check'
      inputs:
        projectName: 'le-restaurant'
        scanPath: '.'
        format: 'ALL'
        additionalArguments: '--enableRetired --enableExperimental'
    
    # SonarQube Analysis
    - task: SonarQubePrepare@4
      displayName: 'Prepare SonarQube Analysis'
      inputs:
        SonarQube: 'SonarQube-Connection'
        scannerMode: 'Other'
        extraProperties: |
          sonar.projectKey=le-restaurant
          sonar.projectName=Le Restaurant
          sonar.java.coveragePlugin=jacoco
          sonar.coverage.jacoco.xmlReportPaths=**/site/jacoco/jacoco.xml
    
    - task: SonarQubeAnalyze@4
      displayName: 'Run SonarQube Analysis'
    
    - task: SonarQubePublish@4
      displayName: 'Publish SonarQube Results'
      inputs:
        pollingTimeoutSec: '300'
    
    # Build Application JAR
    - task: Maven@3
      displayName: 'Package Application'
      inputs:
        mavenPomFile: 'pom.xml'
        goals: 'package'
        options: '-DskipTests=true'
        javaHomeOption: 'JDKVersion'
        jdkVersionOption: '$(javaVersion)'
    
    # Copy Files for Deployment
    - task: CopyFiles@2
      displayName: 'Copy JAR Files'
      inputs:
        contents: |
          target/*.jar
          scripts/**
          azure/**
        targetFolder: '$(Build.ArtifactStagingDirectory)'
    
    # Publish Build Artifacts
    - task: PublishBuildArtifacts@1
      displayName: 'Publish Build Artifacts'
      inputs:
        pathToPublish: '$(Build.ArtifactStagingDirectory)'
        artifactName: 'le-restaurant-app'
        publishLocation: 'Container'

# =============================================================================
# DEPLOYMENT STAGES
# =============================================================================
- stage: DeployDev
  displayName: 'Deploy to Development'
  dependsOn: CI
  condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/develop'))
  variables:
    environmentName: 'development'
    appServiceName: 'le-restaurant-dev'
    sqlDatabaseName: 'db-le-restaurant-dev'
  
  jobs:
  - deployment: DeployToAzure
    displayName: 'Deploy to Azure App Service (Dev)'
    pool:
      vmImage: 'ubuntu-latest'
    environment: 'le-restaurant-dev'
    
    strategy:
      runOnce:
        deploy:
          steps:
          - template: templates/deploy-to-azure.yml
            parameters:
              environmentName: '$(environmentName)'
              appServiceName: '$(appServiceName)'
              sqlDatabaseName: '$(sqlDatabaseName)'

- stage: DeployStaging
  displayName: 'Deploy to Staging'
  dependsOn: CI
  condition: and(succeeded(), startsWith(variables['Build.SourceBranch'], 'refs/heads/release/'))
  variables:
    environmentName: 'staging'
    appServiceName: 'le-restaurant-staging'
    sqlDatabaseName: 'db-le-restaurant-staging'
  
  jobs:
  - deployment: DeployToAzure
    displayName: 'Deploy to Azure App Service (Staging)'
    pool:
      vmImage: 'ubuntu-latest'
    environment: 'le-restaurant-staging'
    
    strategy:
      runOnce:
        deploy:
          steps:
          - template: templates/deploy-to-azure.yml
            parameters:
              environmentName: '$(environmentName)'
              appServiceName: '$(appServiceName)'
              sqlDatabaseName: '$(sqlDatabaseName)'
          
          # Run Smoke Tests
          - task: PowerShell@2
            displayName: 'Run Smoke Tests'
            inputs:
              targetType: 'filePath'
              filePath: 'scripts/smoke-tests.ps1'
              arguments: '-BaseUrl https://$(appServiceName).azurewebsites.net'

- stage: DeployProduction
  displayName: 'Deploy to Production'
  dependsOn: CI
  condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
  variables:
    environmentName: 'production'
    appServiceName: 'le-restaurant-prod'
    sqlDatabaseName: 'db-le-restaurant-prod'
  
  jobs:
  - deployment: DeployToAzure
    displayName: 'Deploy to Azure App Service (Production)'
    pool:
      vmImage: 'ubuntu-latest'
    environment: 'le-restaurant-production'
    
    strategy:
      runOnce:
        deploy:
          steps:
          - template: templates/deploy-to-azure.yml
            parameters:
              environmentName: '$(environmentName)'
              appServiceName: '$(appServiceName)'
              sqlDatabaseName: '$(sqlDatabaseName)'
          
          # Run Full Test Suite
          - task: PowerShell@2
            displayName: 'Run Production Tests'
            inputs:
              targetType: 'filePath'
              filePath: 'scripts/production-tests.ps1'
              arguments: '-BaseUrl https://$(appServiceName).azurewebsites.net'
          
          # Send Deployment Notification
          - task: PowerShell@2
            displayName: 'Send Deployment Notification'
            inputs:
              targetType: 'inline'
              script: |
                Write-Host "Production deployment completed successfully!"
                # Add notification logic here (Slack, Teams, Email)
```

### 2. Deployment Template (`templates/deploy-to-azure.yml`)

```yaml
# Reusable deployment template for Azure App Service
parameters:
- name: environmentName
  type: string
- name: appServiceName
  type: string
- name: sqlDatabaseName
  type: string

steps:
# Download Build Artifacts
- task: DownloadBuildArtifacts@0
  displayName: 'Download Build Artifacts'
  inputs:
    buildType: 'current'
    downloadType: 'single'
    artifactName: 'le-restaurant-app'
    downloadPath: '$(System.ArtifactsDirectory)'

# Azure Login
- task: AzureResourceManagerTemplateDeployment@3
  displayName: 'Deploy Azure Infrastructure'
  inputs:
    deploymentScope: 'Resource Group'
    azureResourceManagerConnection: '$(azureSubscription)'
    subscriptionId: '$(subscriptionId)'
    action: 'Create Or Update Resource Group'
    resourceGroupName: '$(resourceGroupName)'
    location: 'Australia East'
    templateLocation: 'Linked artifact'
    csmFile: '$(System.ArtifactsDirectory)/le-restaurant-app/azure/arm-template.json'
    csmParametersFile: '$(System.ArtifactsDirectory)/le-restaurant-app/azure/parameters-${{ parameters.environmentName }}.json'
    overrideParameters: |
      -appServiceName "${{ parameters.appServiceName }}"
      -sqlDatabaseName "${{ parameters.sqlDatabaseName }}"
      -environment "${{ parameters.environmentName }}"

# Database Migration
- task: SqlAzureDacpacDeployment@1
  displayName: 'Deploy Database Changes'
  inputs:
    azureSubscription: '$(azureSubscription)'
    authenticationType: 'server'
    serverName: '$(sqlServerName).database.windows.net'
    databaseName: '${{ parameters.sqlDatabaseName }}'
    sqlUsername: '$(sqlUsername)'
    sqlPassword: '$(sqlPassword)'
    deployType: 'SqlTask'
    sqlFile: '$(System.ArtifactsDirectory)/le-restaurant-app/scripts/database-migration.sql'

# Deploy Application
- task: AzureWebApp@1
  displayName: 'Deploy to Azure App Service'
  inputs:
    azureSubscription: '$(azureSubscription)'
    appType: 'webAppLinux'
    appName: '${{ parameters.appServiceName }}'
    package: '$(System.ArtifactsDirectory)/le-restaurant-app/target/*.jar'
    runtimeStack: 'JAVA|17-java17'
    startUpCommand: 'java -jar /home/site/wwwroot/app.jar'

# Configure App Settings
- task: AzureAppServiceSettings@1
  displayName: 'Configure App Settings'
  inputs:
    azureSubscription: '$(azureSubscription)'
    appName: '${{ parameters.appServiceName }}'
    resourceGroupName: '$(resourceGroupName)'
    appSettings: |
      [
        {
          "name": "SPRING_PROFILES_ACTIVE",
          "value": "${{ parameters.environmentName }}"
        },
        {
          "name": "SPRING_DATASOURCE_URL",
          "value": "jdbc:sqlserver://$(sqlServerName).database.windows.net:1433;database=${{ parameters.sqlDatabaseName }};encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;"
        },
        {
          "name": "SPRING_DATASOURCE_USERNAME",
          "value": "$(sqlUsername)"
        },
        {
          "name": "SPRING_DATASOURCE_PASSWORD",
          "value": "$(sqlPassword)"
        },
        {
          "name": "APPLICATIONINSIGHTS_CONNECTION_STRING",
          "value": "$(appInsightsConnectionString)"
        }
      ]

# Health Check
- task: PowerShell@2
  displayName: 'Application Health Check'
  inputs:
    targetType: 'inline'
    script: |
      $maxAttempts = 10
      $attempt = 1
      $healthCheckUrl = "https://${{ parameters.appServiceName }}.azurewebsites.net/actuator/health"
      
      do {
        try {
          Write-Host "Health check attempt $attempt of $maxAttempts"
          $response = Invoke-RestMethod -Uri $healthCheckUrl -Method Get -TimeoutSec 30
          
          if ($response.status -eq "UP") {
            Write-Host "✅ Application is healthy!"
            exit 0
          }
        }
        catch {
          Write-Host "⚠️ Health check failed: $($_.Exception.Message)"
        }
        
        if ($attempt -lt $maxAttempts) {
          Write-Host "Waiting 30 seconds before next attempt..."
          Start-Sleep -Seconds 30
        }
        
        $attempt++
      } while ($attempt -le $maxAttempts)
      
      Write-Host "❌ Application health check failed after $maxAttempts attempts"
      exit 1
```

---

## 🔧 Pipeline Features

### Quality Gates

#### 1. Code Quality Gates
```yaml
# Quality Gate Configuration
- task: SonarQubePublish@4
  displayName: 'Publish SonarQube Quality Gate'
  inputs:
    pollingTimeoutSec: '300'

# Fail build if quality gate fails
- task: PowerShell@2
  displayName: 'Check Quality Gate'
  inputs:
    targetType: 'inline'
    script: |
      $qualityGateStatus = "$(SONARQUBE_QUALITY_GATE_STATUS)"
      if ($qualityGateStatus -ne "PASSED") {
        Write-Host "##vso[task.logissue type=error]Quality gate failed: $qualityGateStatus"
        exit 1
      }
```

#### 2. Security Gates
```yaml
# Security Scanning
- task: WhiteSource@21
  displayName: 'WhiteSource Security Scan'
  inputs:
    cwd: '$(System.DefaultWorkingDirectory)'

# OWASP ZAP Security Testing
- task: owaspzap@1
  displayName: 'OWASP ZAP Security Scan'
  inputs:
    aggressivemode: false
    threshold: 'Medium'
    scantype: 'targetedScan'
    url: 'https://$(appServiceName).azurewebsites.net'
```

#### 3. Performance Gates
```yaml
# Load Testing
- task: AzureLoadTest@1
  displayName: 'Azure Load Testing'
  inputs:
    azureSubscription: '$(azureSubscription)'
    loadTestConfigFile: 'tests/load-test-config.yaml'
    resourceGroup: '$(resourceGroupName)'
    loadTestResource: 'le-restaurant-loadtest'
```

### Notification Configuration

#### 1. Slack Integration
```yaml
# Slack Notification Template
- task: SlackNotification@1
  displayName: 'Notify Slack Channel'
  condition: always()
  inputs:
    SlackApiToken: '$(slackToken)'
    Channel: '#deployments'
    Message: |
      🚀 **Deployment Status**: $(Agent.JobStatus)
      📦 **Build**: $(Build.BuildNumber)
      🌿 **Branch**: $(Build.SourceBranchName)
      🔗 **Pipeline**: [View Pipeline]($(System.TeamFoundationCollectionUri)$(System.TeamProject)/_build/results?buildId=$(Build.BuildId))
    IconUrl: 'https://github.com/microsoft/azure-pipelines-extensions/raw/master/Extensions/Slack/Src/Tasks/PostMessageV1/icon.png'
```

#### 2. Email Notifications
```yaml
# Email Notification
- task: EmailReport@1
  displayName: 'Send Email Report'
  inputs:
    sendMailConditionConfig: 'Always'
    subject: 'Le Restaurant Deployment - $(Agent.JobStatus)'
    to: 'team@lerestaurant.com'
    body: |
      Deployment Summary:
      - Build: $(Build.BuildNumber)
      - Branch: $(Build.SourceBranchName)
      - Status: $(Agent.JobStatus)
      - Environment: $(environmentName)
```

---

## 📊 Pipeline Monitoring

### Key Metrics to Track

1. **Build Metrics**
   - Build success rate
   - Build duration
   - Test coverage percentage
   - Code quality scores

2. **Deployment Metrics**
   - Deployment frequency
   - Deployment success rate
   - Mean time to deployment
   - Rollback frequency

3. **Quality Metrics**
   - Security vulnerabilities found
   - Code coverage trends
   - Technical debt ratio
   - Bug escape rate

### Dashboard Configuration

```yaml
# Azure DevOps Dashboard Widgets
widgets:
  - name: "Build Success Rate"
    type: "chart"
    query: "Build success rate over last 30 days"
  
  - name: "Test Results Trend"
    type: "chart"
    query: "Test pass/fail trends"
  
  - name: "Code Coverage"
    type: "chart"
    query: "Code coverage percentage over time"
  
  - name: "Deployment Frequency"
    type: "chart"
    query: "Deployments per environment per week"
```

---

## 🛡️ Security Configuration

### Service Connections

1. **Azure Resource Manager**
   - Service Principal with minimal required permissions
   - Separate connections for each environment
   - Regular credential rotation

2. **Database Connections**
   - Azure Key Vault integration for secrets
   - Managed identity authentication where possible
   - Connection string encryption

### Variable Groups

```yaml
# Variable Group: le-restaurant-common
variables:
- name: javaVersion
  value: '17'
- name: mavenVersion
  value: '3.8.6'
- name: buildConfiguration
  value: 'Release'

# Variable Group: le-restaurant-dev (Development)
variables:
- name: appServiceName
  value: 'le-restaurant-dev'
- name: sqlDatabaseName
  value: 'db-le-restaurant-dev'
- name: environmentName
  value: 'development'

# Variable Group: le-restaurant-prod (Production)
variables:
- name: appServiceName
  value: 'le-restaurant-prod'
- name: sqlDatabaseName
  value: 'db-le-restaurant-prod'
- name: environmentName
  value: 'production'
```

---

## 🔄 Rollback Strategy

### Automated Rollback

```yaml
# Rollback Job Template
- job: RollbackOnFailure
  displayName: 'Rollback on Deployment Failure'
  condition: failed()
  
  steps:
  - task: AzureAppServiceManage@0
    displayName: 'Rollback to Previous Version'
    inputs:
      azureSubscription: '$(azureSubscription)'
      action: 'Swap Slots'
      webAppName: '$(appServiceName)'
      resourceGroupName: '$(resourceGroupName)'
      sourceSlot: 'staging'
      targetSlot: 'production'
      preserveVnet: true
```

### Manual Rollback Process

1. **Identify Issue**: Monitor alerts and health checks
2. **Decision Point**: Determine if rollback is necessary
3. **Execute Rollback**: Use Azure DevOps release management
4. **Verify Rollback**: Confirm system stability
5. **Post-Incident**: Document and analyze root cause

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-27  
**Status**: Reference Configuration 