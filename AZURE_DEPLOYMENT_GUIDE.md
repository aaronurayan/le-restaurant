# Azure Deployment Configuration Guide

This guide explains how to configure Azure resources and pipeline variables for deploying the Le Restaurant application.

## 📋 Prerequisites

- Azure subscription with active credits
- Azure DevOps organization and project
- Owner or Contributor access to Azure subscription
- Azure CLI installed locally (optional but recommended)

## 🏗️ Step 1: Create Azure Resources

### 1.1 Create Resource Group

```bash
# Login to Azure
az login

# Create resource group
az group create \
  --name le-restaurant-rg \
  --location eastus
```

### 1.2 Create Azure App Service for Backend

```bash
# Create App Service Plan (Linux)
az appservice plan create \
  --name le-restaurant-plan \
  --resource-group le-restaurant-rg \
  --location eastus \
  --is-linux \
  --sku B1

# Create Web App for Backend
az webapp create \
  --name le-restaurant-backend \
  --resource-group le-restaurant-rg \
  --plan le-restaurant-plan \
  --runtime "JAVA:17-java17"

# Configure startup command
az webapp config set \
  --name le-restaurant-backend \
  --resource-group le-restaurant-rg \
  --startup-file "java -jar /home/site/wwwroot/le-restaurant-backend-0.0.1-SNAPSHOT.jar"

# Enable logging
az webapp log config \
  --name le-restaurant-backend \
  --resource-group le-restaurant-rg \
  --application-logging filesystem \
  --detailed-error-messages true \
  --failed-request-tracing true \
  --web-server-logging filesystem

# Set environment variables
az webapp config appsettings set \
  --name le-restaurant-backend \
  --resource-group le-restaurant-rg \
  --settings \
    SPRING_PROFILES_ACTIVE=prod \
    SERVER_PORT=8080 \
    JAVA_OPTS="-Xms512m -Xmx1024m"
```

### 1.3 Create Azure Static Web Apps for Frontend

```bash
# Create Static Web App
az staticwebapp create \
  --name le-restaurant-frontend \
  --resource-group le-restaurant-rg \
  --location eastus2 \
  --sku Free

# Get the deployment token (needed for pipeline)
az staticwebapp secrets list \
  --name le-restaurant-frontend \
  --resource-group le-restaurant-rg \
  --query "properties.apiKey" -o tsv
```

**Important:** Save the deployment token - you'll need it for the pipeline configuration!

### 1.4 Optional: Create Azure Database (if needed)

```bash
# Create PostgreSQL Flexible Server
az postgres flexible-server create \
  --name le-restaurant-db \
  --resource-group le-restaurant-rg \
  --location eastus \
  --admin-user adminuser \
  --admin-password "YourSecurePassword123!" \
  --sku-name Standard_B1ms \
  --storage-size 32 \
  --version 14

# Create database
az postgres flexible-server db create \
  --resource-group le-restaurant-rg \
  --server-name le-restaurant-db \
  --database-name lerestaurant

# Configure firewall to allow Azure services
az postgres flexible-server firewall-rule create \
  --resource-group le-restaurant-rg \
  --name le-restaurant-db \
  --rule-name AllowAzureServices \
  --start-ip-address 0.0.0.0 \
  --end-ip-address 0.0.0.0
```

## 🔧 Step 2: Configure Azure DevOps Pipeline

### 2.1 Create Service Connection

1. Go to Azure DevOps Project Settings
2. Navigate to **Service connections** → **New service connection**
3. Select **Azure Resource Manager**
4. Choose **Service principal (automatic)**
5. Select your subscription and resource group
6. Name it: `le-restaurant-azure-connection`
7. Click **Save**

### 2.2 Create Pipeline Variables

Go to **Pipelines** → **Library** → **Variable groups** and create a new group named `le-restaurant-deploy`:

#### Required Variables:

| Variable Name | Value | Secret |
|--------------|-------|--------|
| `AZURE_SUBSCRIPTION` | `le-restaurant-azure-connection` | No |
| `BACKEND_APP_NAME` | `le-restaurant-backend` | No |
| `FRONTEND_APP_NAME` | `le-restaurant-frontend` | No |
| `RESOURCE_GROUP` | `le-restaurant-rg` | No |
| `AZURE_STATIC_WEB_APPS_API_TOKEN` | `<your-deployment-token>` | **Yes** |

#### Optional Variables (if using database):

| Variable Name | Value | Secret |
|--------------|-------|--------|
| `DB_HOST` | `le-restaurant-db.postgres.database.azure.com` | No |
| `DB_NAME` | `lerestaurant` | No |
| `DB_USERNAME` | `adminuser` | No |
| `DB_PASSWORD` | `YourSecurePassword123!` | **Yes** |

### 2.3 Update Pipeline YAML

Open `azure-pipelines-deploy.yml` and update the variables section:

```yaml
variables:
  # ... existing variables ...
  
  # Update with your actual Azure resource names
  AZURE_SUBSCRIPTION: 'le-restaurant-azure-connection'
  BACKEND_APP_NAME: 'le-restaurant-backend'
  FRONTEND_APP_NAME: 'le-restaurant-frontend'
  RESOURCE_GROUP: 'le-restaurant-rg'
```

### 2.4 Link Variable Group to Pipeline

In your `azure-pipelines-deploy.yml`, add at the top:

```yaml
variables:
  - group: le-restaurant-deploy
  # ... rest of variables ...
```

## 🚀 Step 3: Create Pipeline in Azure DevOps

1. Go to **Pipelines** → **New Pipeline**
2. Select **Azure Repos Git** (or your repository source)
3. Select your repository: `le-restaurant`
4. Choose **Existing Azure Pipelines YAML file**
5. Select the branch: `main`
6. Path: `/azure-pipelines-deploy.yml`
7. Click **Continue** → **Run**

## 🔐 Step 4: Configure Environments

### 4.1 Create Environments

1. Go to **Pipelines** → **Environments**
2. Create two environments:
   - `production-backend`
   - `production-frontend`

### 4.2 Add Approval Gates (Optional but Recommended)

For each environment:
1. Click on the environment
2. Go to **⋮** → **Approvals and checks**
3. Add **Approvals**
4. Select approvers (team leads, managers)
5. Save

## 📱 Step 5: Configure Backend for Azure

Update `backend/src/main/resources/application-prod.properties`:

```properties
# Server Configuration
server.port=8080
server.compression.enabled=true

# Database Configuration (if using Azure PostgreSQL)
spring.datasource.url=jdbc:postgresql://${DB_HOST}:5432/${DB_NAME}?sslmode=require
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# Logging Configuration
logging.level.root=INFO
logging.level.com.lerestaurant=INFO
logging.file.name=/home/LogFiles/application.log

# CORS Configuration (update with your frontend URL)
cors.allowed-origins=https://le-restaurant-frontend.azurestaticapps.net

# Actuator Configuration
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=when-authorized
```

## 🌐 Step 6: Configure Frontend for Azure

Update `frontend/src/services/api.ts`:

```typescript
// Determine API base URL based on environment
const getApiBaseUrl = () => {
  // Production: Use Azure App Service URL
  if (import.meta.env.PROD) {
    return 'https://le-restaurant-backend.azurewebsites.net/api';
  }
  
  // Development: Use localhost
  return 'http://localhost:8080/api';
};

export const API_BASE_URL = getApiBaseUrl();
```

Create `frontend/staticwebapp.config.json`:

```json
{
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["anonymous"]
    },
    {
      "route": "/*",
      "serve": "/index.html",
      "statusCode": 200
    }
  ],
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/images/*.{png,jpg,gif}", "/css/*"]
  },
  "responseOverrides": {
    "404": {
      "rewrite": "/index.html",
      "statusCode": 200
    }
  },
  "globalHeaders": {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Content-Security-Policy": "default-src 'self' https://le-restaurant-backend.azurewebsites.net"
  }
}
```

## 🧪 Step 7: Test Deployment

### 7.1 Trigger Pipeline

1. Commit and push your changes to `main` branch
2. Pipeline should automatically trigger
3. Monitor the pipeline execution in Azure DevOps

### 7.2 Manual Pipeline Run

If needed, manually run the pipeline:
1. Go to **Pipelines**
2. Select `le-restaurant-deploy`
3. Click **Run pipeline**
4. Select branch: `main`
5. Click **Run**

### 7.3 Verify Deployment

After successful deployment:

```bash
# Test Backend
curl https://le-restaurant-backend.azurewebsites.net/actuator/health

# Test Frontend
curl https://le-restaurant-frontend.azurestaticapps.net
```

Or visit in browser:
- Backend: `https://le-restaurant-backend.azurewebsites.net/actuator/health`
- Frontend: `https://le-restaurant-frontend.azurestaticapps.net`

## 📊 Step 8: Monitor Application

### 8.1 Enable Application Insights

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
  --query instrumentationKey -o tsv

# Configure backend to use Application Insights
az webapp config appsettings set \
  --name le-restaurant-backend \
  --resource-group le-restaurant-rg \
  --settings APPLICATIONINSIGHTS_CONNECTION_STRING="<connection-string>"
```

### 8.2 View Logs

```bash
# Stream backend logs
az webapp log tail \
  --name le-restaurant-backend \
  --resource-group le-restaurant-rg

# Download logs
az webapp log download \
  --name le-restaurant-backend \
  --resource-group le-restaurant-rg \
  --log-file logs.zip
```

## 🔄 Step 9: Configure Continuous Deployment

The pipeline is already configured for continuous deployment from `main` branch. Any push to `main` will:

1. ✅ Run code quality checks
2. 🧪 Execute tests with coverage validation
3. 🔒 Perform security scans
4. 📦 Build artifacts
5. 🚀 Deploy to Azure (if all checks pass)
6. ✅ Validate deployment health

## 🛠️ Troubleshooting

### Backend deployment fails

```bash
# Check backend logs
az webapp log tail --name le-restaurant-backend --resource-group le-restaurant-rg

# Restart backend
az webapp restart --name le-restaurant-backend --resource-group le-restaurant-rg
```

### Frontend not loading

1. Check Static Web Apps configuration
2. Verify `staticwebapp.config.json` is in the build output
3. Check browser console for CORS errors

### Database connection issues

```bash
# Test database connectivity
az postgres flexible-server connect \
  --name le-restaurant-db \
  --resource-group le-restaurant-rg \
  --admin-user adminuser
```

## 📝 Cost Estimation

Estimated monthly costs (USD):
- App Service Plan (B1): ~$13/month
- Static Web Apps (Free): $0/month
- PostgreSQL Flexible Server (B1ms): ~$12/month
- **Total: ~$25/month**

## 🔗 Useful Links

- [Azure App Service Documentation](https://learn.microsoft.com/en-us/azure/app-service/)
- [Azure Static Web Apps Documentation](https://learn.microsoft.com/en-us/azure/static-web-apps/)
- [Azure DevOps Pipelines](https://learn.microsoft.com/en-us/azure/devops/pipelines/)
- [Spring Boot on Azure](https://learn.microsoft.com/en-us/azure/developer/java/spring-framework/)

## 🎯 Next Steps

1. ✅ Configure custom domain names
2. ✅ Set up SSL certificates
3. ✅ Configure auto-scaling rules
4. ✅ Set up backup and disaster recovery
5. ✅ Configure monitoring alerts
6. ✅ Implement blue-green deployment strategy

---

**Need Help?** Contact the DevOps team or refer to the Azure documentation links above.
