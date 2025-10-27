# Azure Pipeline Automated Deployment Setup

This guide explains how to set up the automated CI/CD pipeline for Le Restaurant.

## 📋 Prerequisites

1. **Azure Resources Created:**
   - ✅ Resource Group: `le-restaurant-rg`
   - ✅ App Service: `le-restaurant` (Java 17)
   - ✅ Static Web App: `le-restaurant-frontend`
   - ✅ PostgreSQL Database: `le-restaurant-db-1813` (optional)

2. **Azure DevOps Setup:**
   - Azure DevOps organization and project
   - Repository connected to Azure DevOps

## 🚀 Setup Steps

### Step 1: Get Static Web Apps Deployment Token

```bash
az staticwebapp secrets list \
  --name le-restaurant-frontend \
  --resource-group le-restaurant-rg \
  --query "properties.apiKey" -o tsv
```

**Save this token** - you'll need it in Step 3.

### Step 2: Create Azure Service Connection

1. Go to Azure DevOps → **Project Settings**
2. Navigate to **Service connections** → **New service connection**
3. Select **Azure Resource Manager**
4. Choose **Service principal (automatic)**
5. Select your subscription and resource group: `le-restaurant-rg`
6. Name it: `le-restaurant-azure-connection`
7. Click **Save**

### Step 3: Create Pipeline Variable Group

1. Go to **Pipelines** → **Library** → **+ Variable group**
2. Name: `le-restaurant-deploy`
3. Add the following variable:

| Variable Name | Value | Secret |
|--------------|-------|--------|
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | `<token-from-step-1>` | ✅ **YES** (click padlock icon) |

4. Click **Save**

### Step 4: Update Pipeline YAML

Open `azure-pipelines-deploy.yml` and update line 59:

```yaml
AZURE_SUBSCRIPTION: le-restaurant-azure-connection  # Your service connection name
```

### Step 5: Create the Pipeline in Azure DevOps

1. Go to **Pipelines** → **New Pipeline**
2. Select **Azure Repos Git** (or your repository source)
3. Select your repository: `le-restaurant`
4. Choose **Existing Azure Pipelines YAML file**
5. Select branch: `main`
6. Path: `/azure-pipelines-deploy.yml`
7. Click **Continue**

### Step 6: Link Variable Group

Before running, ensure the variable group is linked:

1. Click **Edit** pipeline
2. Click **⋮** (three dots) → **Triggers**
3. Go to **Variables** tab
4. Click **Variable groups**
5. Link `le-restaurant-deploy` group
6. Click **Save**

### Step 7: Run the Pipeline

1. Click **Run pipeline**
2. Select branch: `main`
3. Click **Run**

## 📊 What the Pipeline Does

### Stage 1: Code Quality ✅
- Frontend: ESLint analysis
- Backend: Checkstyle analysis

### Stage 2: Build & Test ✅
- **Frontend:**
  - Install dependencies
  - Run tests with coverage (80% threshold)
  - Build production bundle
  - Publish artifacts

- **Backend:**
  - Run unit tests with JaCoCo coverage (80% threshold)
  - Build JAR file
  - Publish artifacts

- **E2E Tests:**
  - Run 10 scenario integration tests

### Stage 3: Security Scan 🔒
- Frontend: `npm audit`
- Backend: Dependency vulnerability check

### Stage 4: Deploy to Azure 🚀
- **Backend Deployment:**
  - Deploy JAR to Azure App Service
  - Configure environment variables
  - Set CORS for frontend URL
  - Get backend URL

- **Frontend Deployment:**
  - Build with backend API URL from previous job
  - Deploy to Azure Static Web Apps
  - Automatically connected to backend

### Stage 5: Post-Deployment Validation ✅
- Health check backend (`/actuator/health`)
- Health check frontend
- Display deployment summary

## 🔄 Automatic Deployment Triggers

The pipeline automatically runs when:
- ✅ Code is pushed to `main` branch
- ✅ Pull request is created to `main` or `develop`

**Excluded paths** (won't trigger pipeline):
- README.md
- docs/
- Any *.md files

## 🎯 Expected Results

After successful deployment:

```
✅ Backend: https://le-restaurant.azurewebsites.net
✅ Frontend: https://yellow-ground-042c31000.3.azurestaticapps.net
✅ All tests passed
✅ Coverage ≥ 80%
✅ Health checks passed
✅ Frontend ↔ Backend connected
```

## 🛠️ Manual Deployment (If Pipeline Not Set Up)

If you need to deploy manually without the pipeline:

### Backend:
```bash
cd backend
./gradlew clean bootJar -x test
cd build/libs
az webapp deployment source config-zip \
  --name le-restaurant \
  --resource-group le-restaurant-rg \
  --src le-restaurant-backend-0.0.1-SNAPSHOT.jar
```

### Frontend:
```bash
cd frontend
echo "VITE_API_BASE_URL=https://le-restaurant.azurewebsites.net/api" > .env.production
npm ci
npm run build
npx @azure/static-web-apps-cli deploy ./dist \
  --deployment-token "YOUR_TOKEN" \
  --env production
```

## 🔍 Monitoring Deployments

View pipeline runs:
1. Go to **Pipelines** → Select `le-restaurant-deploy`
2. View build history and logs
3. Check test results and coverage reports

View deployed apps:
1. Azure Portal → Resource Groups → `le-restaurant-rg`
2. View App Service logs
3. View Static Web App analytics

## 🚨 Troubleshooting

### Pipeline fails at "Deploy Backend"
- **Issue:** Service connection not authorized
- **Fix:** Go to service connection → Grant access to all pipelines

### Pipeline fails at "Deploy Frontend"
- **Issue:** Missing deployment token
- **Fix:** Verify `AZURE_STATIC_WEB_APPS_API_TOKEN` is set in variable group

### Health check fails
- **Issue:** App not started yet
- **Fix:** Wait 1-2 minutes, backend takes time to boot on Azure

### CORS errors in browser
- **Issue:** Frontend URL not in CORS whitelist
- **Fix:** Update `CORS_ALLOWED_ORIGINS` in pipeline YAML line 475

## 📚 Additional Resources

- [Azure Pipelines Documentation](https://learn.microsoft.com/en-us/azure/devops/pipelines/)
- [Azure App Service Deployment](https://learn.microsoft.com/en-us/azure/app-service/deploy-run-package)
- [Azure Static Web Apps Deployment](https://learn.microsoft.com/en-us/azure/static-web-apps/deployment-github-actions)

---

**Questions?** Check the deployment logs in Azure DevOps for detailed error messages.
