# Azure DevOps CI/CD Pipeline Guide

This document provides a comprehensive guide to the `azure-pipelines.yml` file for the **Le Restaurant** project. It details the pipeline's architecture, the stages involved, and a troubleshooting guide for common issues that have been resolved.

## 1. Pipeline Overview

The `azure-pipelines.yml` file defines a complete Continuous Integration and Continuous Deployment (CI/CD) workflow for both the frontend and backend applications.

-   **Frontend**: React 18 + TypeScript + Vite
-   **Backend**: Spring Boot 3.x + Java 17 + Gradle

The pipeline is triggered automatically on pushes to the `main` and `develop` branches.

### Pipeline Stages

The pipeline is organized into several distinct stages:

1.  **`CodeQuality`**:
    -   **Jobs**: `FrontendLint`, `BackendLint`
    -   **Purpose**: Performs static code analysis to enforce coding standards. It runs ESLint for the frontend and Checkstyle for the backend.

2.  **`BuildAndTest`**:
    -   **Jobs**: `FrontendBuildTest`, `BackendBuildTest`, `E2EIntegrationTests`
    -   **Purpose**: Compiles the code, runs unit tests, and verifies code coverage. It also executes a suite of scenario-based End-to-End (E2E) integration tests to validate key user journeys.
    -   **Coverage**: Enforces an 80% code coverage threshold for both frontend and backend.

3.  **`SecurityScan`**:
    -   **Jobs**: `DependencyScan`
    -   **Purpose**: Scans for vulnerabilities in third-party dependencies using `npm audit` for the frontend and OWASP `dependencyCheckAnalyze` for the backend.

4.  **`DeployProduction` (Currently Disabled)**:
    -   **Jobs**: `DeployBackend`, `DeployFrontend`
    -   **Purpose**: Deploys the backend to Azure App Service and the frontend to Azure Static Web Apps. This stage only runs on commits to the `main` branch.

5.  **`PostDeploymentValidation` (Currently Disabled)**:
    -   **Jobs**: `HealthCheck`
    -   **Purpose**: Performs basic health checks against the deployed applications to ensure they are running correctly.

## 2. Troubleshooting and Issue Resolution

This section documents the key issues encountered during the pipeline setup and the solutions implemented.

### Issue 1: `npm` Cache Key Mismatch Warning

-   **Problem**: The pipeline was showing a warning: `##[warning]The given cache key has changed in its resolved value between restore and save steps;`. This occurred because `npm install` can modify the `package-lock.json` file, which invalidates the cache key.
-   **Solution**: Replaced `npm install` with `npm ci` in all frontend jobs. `npm ci` (Clean Install) performs a deterministic installation based on `package-lock.json` without modifying it, which ensures cache key consistency.

    ```yaml
    # Before
    - script: |
        cd $(FRONTEND_PATH)
        npm install

    # After
    - script: |
        cd $(FRONTEND_PATH)
        npm ci
    ```

### Issue 2: Azure Service Connection Not Found

-   **Problem**: The pipeline failed with an error indicating that the Azure service connection (`YOUR_AZURE_SUBSCRIPTION_NAME`) could not be found. This happens when the pipeline tries to execute deployment tasks without valid Azure credentials configured in the project settings.
-   **Solution**: To allow the CI/CD process (build, test, scan) to run without requiring Azure access, the deployment-related stages (`DeployProduction` and `PostDeploymentValidation`) and the Azure-specific global variables were commented out.

    ```yaml
    # In 'variables' section
    # AZURE_SUBSCRIPTION: YOUR_AZURE_SUBSCRIPTION_NAME
    # BACKEND_APP_NAME: le-restaurant-backend
    # ...

    # Deployment stages
    # - stage: DeployProduction
    # ...
    # - stage: PostDeploymentValidation
    # ...
    ```

### Issue 3: Gradle Cache Path Resolution Error

-   **Problem**: The backend jobs failed during the post-job "Cache Gradle Dependencies" step with a `tar` error: `tar: /home/vsts/actions-runner/cached/.gradle/caches: Cannot open: No such file or directory`.
-   **Root Cause**: The cache path was configured as `path: $(Agent.HomeDirectory)/.gradle/caches`. However, the `$(Agent.HomeDirectory)` variable points to the agent's tool directory, not the user's home directory where Gradle stores its cache. The correct path for the `vsts` user on the Ubuntu agent is `/home/vsts/.gradle/caches`.
-   **Solution**: The cache path in all three Gradle-related jobs (`BackendLint`, `BackendBuildTest`, `E2EIntegrationTests`) was hardcoded to the correct user home directory path.

    ```yaml
    # In all Gradle Cache@2 tasks

    # Before
    path: $(Agent.HomeDirectory)/.gradle/caches

    # After
    path: /home/vsts/.gradle/caches
    ```

## 3. How to Manage the Pipeline

### Enabling Deployment to Azure

To re-enable deployment, follow these steps:

1.  **Configure Azure Service Connection**:
    -   In Azure DevOps, go to **Project Settings** > **Service connections**.
    -   Create a new service connection to your Azure subscription.
    -   Note the exact name of the service connection you created.

2.  **Update Pipeline Variables**:
    -   In `azure-pipelines.yml`, uncomment the Azure-related variables.
    -   Replace `YOUR_AZURE_SUBSCRIPTION_NAME` with the name of your service connection.
    -   Update `BACKEND_APP_NAME`, `FRONTEND_APP_NAME`, and `RESOURCE_GROUP` to match your Azure resources.
    -   You will also need to create a secret variable named `AZURE_STATIC_WEB_APPS_API_TOKEN` in the pipeline settings UI with the deployment token from your Azure Static Web App.

3.  **Uncomment Deployment Stages**:
    -   Remove the `#` from the `DeployProduction` and `PostDeploymentValidation` stages at the end of the file to re-enable them.

Once these changes are committed to the `main` branch, the pipeline will attempt to deploy the application to your configured Azure resources.

## 4. Environment Variable Management

The pipeline uses several types of variables to manage configuration and secrets.

### Global and Job-Level Variables

-   **Global Variables**: Defined at the top of `azure-pipelines.yml` under the `variables:` block. These are available to all jobs and stages.
    ```yaml
    variables:
      NODE_VERSION: 20.x
      JAVA_VERSION: '17'
      FRONTEND_PATH: frontend
      BACKEND_PATH: backend
    ```
-   **Job-Level Variables**: Can be defined within a specific job to override global variables or create new ones scoped to that job.

### Secret Variables (Setting in Azure DevOps UI)

Secrets like API tokens and subscription keys must not be stored directly in the YAML file. They should be configured in the Azure DevOps UI.

**How to set the `AZURE_STATIC_WEB_APPS_API_TOKEN`:**

1.  **Get the Token**:
    -   Navigate to your Azure Static Web App resource in the Azure Portal.
    -   Go to the **Overview** tab and click **Manage deployment token**.
    -   Copy the token.

2.  **Add the Secret in Azure DevOps**:
    -   In Azure DevOps, go to your pipeline's edit page.
    -   Click the **Variables** button in the top-right corner.
    -   Select **Pipeline variables**.
    -   Click **New variable**.
    -   **Name**: `AZURE_STATIC_WEB_APPS_API_TOKEN`
    -   **Value**: Paste the deployment token you copied.
    -   **IMPORTANT**: Check the **Keep this value secret** box.
    -   Click **OK** and then **Save** the pipeline.

The pipeline can now access this secret using the syntax `$(AZURE_STATIC_WEB_APPS_API_TOKEN)`.

### Output Variables (Sharing Variables Between Jobs)

One job can produce a variable that another job consumes. In our pipeline, the `DeployBackend` job gets the backend's URL and passes it to the `DeployFrontend` job.

**1. Producing the Variable (`DeployBackend` job):**
A task uses a special `task.setvariable` logging command to create an output variable. The `isOutput=true` flag is critical.

```yaml
- task: AzureCLI@2
  name: GetBackendUrl # This name is important for referencing
  displayName: '🔗 Get Backend URL for Frontend'
  inputs:
    # ...
    inlineScript: |
      # ... script to get the URL ...
      echo "##vso[task.setvariable variable=backendUrl;isOutput=true]$BACKEND_FULL_URL"
```

**2. Consuming the Variable (`DeployFrontend` job):**
The consuming job must declare its dependency (`dependsOn`) and then use a specific syntax to access the output variable.

```yaml
- job: DeployFrontend
  displayName: Deploy Frontend to Azure Static Web Apps
  dependsOn: DeployBackend
  variables:
    # Consume the output variable from the 'DeployBackend' job and its task named 'GetBackendUrl'
    BACKEND_API_URL: $[ dependencies.DeployBackend.outputs['GetBackendUrl.backendUrl'] ]
  steps:
    # ...
```

### Injecting Variables into the Frontend Build

The frontend application needs to know the backend API URL at runtime. This is injected during the deployment to Azure Static Web Apps.

The `AzureStaticWebApp@0` task uses the `app_build_args` to pass environment variables. Vite (the frontend build tool) is configured to pick up environment variables prefixed with `VITE_`.

```yaml
- task: AzureStaticWebApp@0
  displayName: '🚀 Deploy to Azure Static Web Apps'
  inputs:
    # ...
    # 🔑 CRITICAL: Inject backend URL as environment variable
    app_build_args: |
      VITE_API_BASE_URL=$(BACKEND_API_URL)
```

This command sets the `VITE_API_BASE_URL` environment variable during the Static Web App's deployment process, making the backend URL available to the React application.
