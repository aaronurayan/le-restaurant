# ☁️ Azure Deployment Guide for Le Restaurant

## Overview
This guide provides **step-by-step instructions** for deploying the Le Restaurant Spring Boot application to Microsoft Azure. Designed specifically for **university students** with **free Azure credits**.

---

## 🎓 Prerequisites

### Required Accounts & Software
- [ ] **Azure Account**: [Azure for Students](https://azure.microsoft.com/en-us/free/students/) (Free $100 credit)
- [ ] **Java 17**: [Download OpenJDK](https://adoptium.net/)
- [ ] **Maven 3.6+**: [Download Maven](https://maven.apache.org/download.cgi)
- [ ] **Git**: [Download Git](https://git-scm.com/downloads)
- [ ] **Azure CLI**: [Install Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)
- [ ] **IDE**: IntelliJ IDEA Community or Visual Studio Code

### Verify Installation
```bash
# Check Java version
java -version

# Check Maven version  
mvn -version

# Check Git version
git --version

# Check Azure CLI
az --version
```

---

## 🚀 Step 1: Azure Account Setup

### 1.1 Create Azure Account
1. Visit [Azure for Students](https://azure.microsoft.com/en-us/free/students/)
2. Sign up with your **university email address**
3. Verify your student status
4. Receive **$100 free credits** (no credit card required)

### 1.2 Login to Azure Portal
1. Go to [Azure Portal](https://portal.azure.com)
2. Sign in with your Azure account
3. Familiarize yourself with the dashboard

### 1.3 Login via Azure CLI
```bash
# Login to Azure CLI
az login

# Verify login and see subscriptions
az account list --output table

# Set default subscription (if multiple)
az account set --subscription "Azure for Students"
```

---

## 🗄️ Step 2: Create Azure SQL Database

### 2.1 Create Resource Group
```bash
# Create resource group
az group create \
  --name le-restaurant-rg \
  --location eastus

# Verify resource group creation
az group list --output table
```

### 2.2 Create SQL Server
```bash
# Create SQL Server (replace with your values)
az sql server create \
  --name le-restaurant-sql-server \
  --resource-group le-restaurant-rg \
  --location eastus \
  --admin-user sqladmin \
  --admin-password "YourSecurePassword123!"

# Note: Choose a strong password and remember it!
```

### 2.3 Configure Firewall Rules
```bash
# Allow Azure services to access SQL Server
az sql server firewall-rule create \
  --resource-group le-restaurant-rg \
  --server le-restaurant-sql-server \
  --name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0

# Allow your IP address (for development)
az sql server firewall-rule create \
  --resource-group le-restaurant-rg \
  --server le-restaurant-sql-server \
  --name AllowMyIP \
  --start-ip-address $(curl -s https://ipinfo.io/ip) \
  --end-ip-address $(curl -s https://ipinfo.io/ip)
```

### 2.4 Create SQL Database
```bash
# Create database (Basic tier for students)
az sql db create \
  --resource-group le-restaurant-rg \
  --server le-restaurant-sql-server \
  --name le-restaurant-db \
  --service-objective Basic \
  --max-size 2GB

# Get connection string
az sql db show-connection-string \
  --server le-restaurant-sql-server \
  --name le-restaurant-db \
  --client jdbc
```

**Save the connection string!** You'll need it for application configuration.

---

## 🌐 Step 3: Create App Service

### 3.1 Create App Service Plan
```bash
# Create App Service Plan (Free tier)
az appservice plan create \
  --name le-restaurant-plan \
  --resource-group le-restaurant-rg \
  --location eastus \
  --sku F1 \
  --is-linux

# Verify creation
az appservice plan list --output table
```

### 3.2 Create Web App
```bash
# Create Web App with Java 17
az webapp create \
  --resource-group le-restaurant-rg \
  --plan le-restaurant-plan \
  --name le-restaurant-app-[YOUR-INITIALS] \
  --runtime "JAVA:17-java17" \
  --startup-file "java -jar /home/site/wwwroot/app.jar"

# Note: Replace [YOUR-INITIALS] with your initials to ensure unique name
```

### 3.3 Configure Application Settings
```bash
# Set database connection string
az webapp config appsettings set \
  --resource-group le-restaurant-rg \
  --name le-restaurant-app-[YOUR-INITIALS] \
  --settings \
  AZURE_SQL_CONNECTION_STRING="jdbc:sqlserver://le-restaurant-sql-server.database.windows.net:1433;database=le-restaurant-db;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;" \
  AZURE_SQL_USERNAME="sqladmin" \
  AZURE_SQL_PASSWORD="YourSecurePassword123!" \
  SPRING_PROFILES_ACTIVE="azure"
```

---

## 📦 Step 4: Prepare Spring Boot Application

### 4.1 Update Application Configuration
Create `src/main/resources/application-azure.yml`:

```yaml
spring:
  profiles:
    active: azure
  
  datasource:
    url: ${AZURE_SQL_CONNECTION_STRING}
    username: ${AZURE_SQL_USERNAME}
    password: ${AZURE_SQL_PASSWORD}
    driver-class-name: com.microsoft.sqlserver.jdbc.SQLServerDriver
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.SQLServerDialect
        format_sql: true
  
  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true
    
server:
  port: ${PORT:8080}

logging:
  level:
    com.lerestaurant: INFO
    org.springframework.security: DEBUG
```

### 4.2 Update Maven Configuration
Update `pom.xml` to include Azure plugin:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
        
        <!-- Azure App Service Maven Plugin -->
        <plugin>
            <groupId>com.microsoft.azure</groupId>
            <artifactId>azure-webapp-maven-plugin</artifactId>
            <version>2.5.0</version>
            <configuration>
                <subscriptionId>${AZURE_SUBSCRIPTION_ID}</subscriptionId>
                <resourceGroup>le-restaurant-rg</resourceGroup>
                <appName>le-restaurant-app-[YOUR-INITIALS]</appName>
                <pricingTier>F1</pricingTier>
                <region>eastus</region>
                <runtime>
                    <os>Linux</os>
                    <javaVersion>Java 17</javaVersion>
                    <webContainer>Java SE</webContainer>
                </runtime>
                <deployment>
                    <resources>
                        <resource>
                            <directory>${project.basedir}/target</directory>
                            <includes>
                                <include>*.jar</include>
                            </includes>
                        </resource>
                    </resources>
                </deployment>
            </configuration>
        </plugin>
    </plugins>
</build>
```

---

## 🚀 Step 5: Deploy Application

### 5.1 Build Application
```bash
# Clean and build the project
mvn clean package -DskipTests

# Verify JAR file is created
ls -la target/*.jar
```

### 5.2 Deploy to Azure App Service

#### Option A: Using Azure CLI
```bash
# Deploy JAR file
az webapp deploy \
  --resource-group le-restaurant-rg \
  --name le-restaurant-app-[YOUR-INITIALS] \
  --src-path target/le-restaurant-0.0.1-SNAPSHOT.jar \
  --type jar
```

#### Option B: Using Maven Plugin
```bash
# Deploy using Maven plugin
mvn azure-webapp:deploy
```

### 5.3 Verify Deployment
```bash
# Check deployment status
az webapp show \
  --resource-group le-restaurant-rg \
  --name le-restaurant-app-[YOUR-INITIALS] \
  --query state

# View application logs
az webapp log tail \
  --resource-group le-restaurant-rg \
  --name le-restaurant-app-[YOUR-INITIALS]
```

---

## 🔧 Step 6: Configure Domain and SSL

### 6.1 Get Application URL
```bash
# Get default URL
az webapp show \
  --resource-group le-restaurant-rg \
  --name le-restaurant-app-[YOUR-INITIALS] \
  --query defaultHostName \
  --output tsv
```

Your application will be available at:
`https://le-restaurant-app-[YOUR-INITIALS].azurewebsites.net`

### 6.2 Enable HTTPS Redirect
```bash
# Force HTTPS redirect
az webapp update \
  --resource-group le-restaurant-rg \
  --name le-restaurant-app-[YOUR-INITIALS] \
  --https-only true
```

---

## 📊 Step 7: Set Up Monitoring

### 7.1 Enable Application Insights
```bash
# Create Application Insights
az monitor app-insights component create \
  --app le-restaurant-insights \
  --location eastus \
  --resource-group le-restaurant-rg \
  --application-type web

# Get instrumentation key
az monitor app-insights component show \
  --app le-restaurant-insights \
  --resource-group le-restaurant-rg \
  --query instrumentationKey \
  --output tsv
```

### 7.2 Configure Application Insights
```bash
# Add Application Insights to Web App
az webapp config appsettings set \
  --resource-group le-restaurant-rg \
  --name le-restaurant-app-[YOUR-INITIALS] \
  --settings \
  APPINSIGHTS_INSTRUMENTATION_KEY="[INSTRUMENTATION-KEY]"
```

---

## 🔄 Step 8: Set Up CI/CD Pipeline

### 8.1 Enable Deployment from GitHub
1. Go to Azure Portal → App Service → Deployment Center
2. Choose **GitHub** as source
3. Authorize Azure to access your GitHub
4. Select repository and branch
5. Azure will create GitHub Actions workflow automatically

### 8.2 Manual GitHub Actions Setup
Create `.github/workflows/azure-deploy.yml`:

```yaml
name: Deploy to Azure App Service

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Java 17
      uses: actions/setup-java@v2
      with:
        java-version: '17'
        distribution: 'adopt'
    
    - name: Cache Maven packages
      uses: actions/cache@v2
      with:
        path: ~/.m2
        key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}
    
    - name: Run tests
      run: mvn clean test
    
    - name: Build with Maven
      run: mvn clean package -DskipTests
    
    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'le-restaurant-app-[YOUR-INITIALS]'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: './target/*.jar'
```

---

## 🧪 Step 9: Testing Deployment

### 9.1 Health Check
```bash
# Check if application is running
curl -f https://le-restaurant-app-[YOUR-INITIALS].azurewebsites.net/actuator/health
```

### 9.2 Database Connection Test
```bash
# Test database connectivity
curl -f https://le-restaurant-app-[YOUR-INITIALS].azurewebsites.net/api/health/database
```

### 9.3 Manual Testing
1. Open browser and go to your application URL
2. Test user registration
3. Test login functionality
4. Verify database operations

---

## 💰 Cost Management for Students

### 9.1 Monitor Usage
```bash
# Check current spending
az consumption usage list \
  --billing-period-name $(az billing period list --query '[0].name' -o tsv) \
  --top 10
```

### 9.2 Set Up Budget Alerts
1. Go to Azure Portal → Cost Management + Billing
2. Create budget for $50 (half of student credits)
3. Set up email alerts at 80% and 100%

### 9.3 Resource Optimization
- **Use Free Tier**: F1 App Service Plan (free)
- **Basic Database**: Basic tier SQL Database ($5/month)
- **Turn off when not needed**: Stop App Service during non-development hours

---

## 🔧 Troubleshooting Guide

### Common Issues and Solutions

#### Issue 1: Database Connection Failed
```bash
# Check firewall rules
az sql server firewall-rule list \
  --resource-group le-restaurant-rg \
  --server le-restaurant-sql-server

# Add your current IP
az sql server firewall-rule create \
  --resource-group le-restaurant-rg \
  --server le-restaurant-sql-server \
  --name AllowCurrentIP \
  --start-ip-address $(curl -s https://ipinfo.io/ip) \
  --end-ip-address $(curl -s https://ipinfo.io/ip)
```

#### Issue 2: Application Won't Start
```bash
# Check application logs
az webapp log tail \
  --resource-group le-restaurant-rg \
  --name le-restaurant-app-[YOUR-INITIALS]

# Check configuration
az webapp config appsettings list \
  --resource-group le-restaurant-rg \
  --name le-restaurant-app-[YOUR-INITIALS]
```

#### Issue 3: Out of Memory
```bash
# Scale up to higher tier (temporarily)
az appservice plan update \
  --name le-restaurant-plan \
  --resource-group le-restaurant-rg \
  --sku B1

# Scale back down when done
az appservice plan update \
  --name le-restaurant-plan \
  --resource-group le-restaurant-rg \
  --sku F1
```

---

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] Azure account setup complete
- [ ] Resource group created
- [ ] SQL Database configured
- [ ] App Service created
- [ ] Application settings configured

### Application Setup
- [ ] Azure profile configuration added
- [ ] Database connection string updated
- [ ] Maven Azure plugin configured
- [ ] Application built successfully
- [ ] Tests passing

### Deployment
- [ ] JAR file deployed to Azure
- [ ] Application starting successfully
- [ ] Database migrations executed
- [ ] Health checks passing
- [ ] HTTPS redirect enabled

### Post-Deployment
- [ ] Application Insights configured
- [ ] CI/CD pipeline setup
- [ ] Budget alerts configured
- [ ] Documentation updated
- [ ] Team access configured

---

## 📚 Additional Resources

### Azure Documentation
- [Azure App Service Documentation](https://docs.microsoft.com/en-us/azure/app-service/)
- [Azure SQL Database Documentation](https://docs.microsoft.com/en-us/azure/azure-sql/)
- [Azure CLI Reference](https://docs.microsoft.com/en-us/cli/azure/)

### Spring Boot on Azure
- [Spring Boot on Azure Guide](https://docs.microsoft.com/en-us/azure/developer/java/spring-framework/)
- [Azure Spring Boot Starters](https://github.com/Azure/azure-sdk-for-java/tree/main/sdk/spring)

### Cost Management
- [Azure Cost Management](https://docs.microsoft.com/en-us/azure/cost-management-billing/)
- [Azure Free Account FAQ](https://azure.microsoft.com/en-us/free/free-account-faq/)

---

This deployment guide provides everything needed to successfully deploy the Le Restaurant application to Azure using student credits efficiently. 