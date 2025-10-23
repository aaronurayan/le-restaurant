# 🚀 Azure Deployment Checklist

Use this checklist to ensure all steps are completed before and after deployment.

## ✅ Pre-Deployment Checklist

### 1. Azure Resources Setup
- [ ] Azure subscription is active and has sufficient credits
- [ ] Resource group created: `le-restaurant-rg`
- [ ] App Service Plan created: `le-restaurant-plan` (B1 or higher)
- [ ] App Service created: `le-restaurant-backend`
- [ ] Static Web App created: `le-restaurant-frontend`
- [ ] PostgreSQL database created (if needed)
- [ ] Application Insights configured (optional)

### 2. Azure DevOps Configuration
- [ ] Service connection created: `le-restaurant-azure-connection`
- [ ] Variable group created: `le-restaurant-deploy`
- [ ] All required variables added to variable group:
  - [ ] `AZURE_SUBSCRIPTION`
  - [ ] `BACKEND_APP_NAME`
  - [ ] `FRONTEND_APP_NAME`
  - [ ] `RESOURCE_GROUP`
  - [ ] `AZURE_STATIC_WEB_APPS_API_TOKEN` (secret)
- [ ] Environments created:
  - [ ] `production-backend`
  - [ ] `production-frontend`
- [ ] Approval gates configured (if needed)

### 3. Code Configuration
- [ ] Backend `application-prod.properties` configured
- [ ] Frontend `.env.production` created and configured
- [ ] Frontend `staticwebapp.config.json` updated
- [ ] CORS origins updated with actual frontend URL
- [ ] Database connection strings updated (if using database)
- [ ] API base URLs updated in frontend code

### 4. Pipeline Configuration
- [ ] `azure-pipelines-deploy.yml` created
- [ ] Variable group linked in pipeline YAML
- [ ] Azure resource names updated in pipeline
- [ ] Branch triggers configured correctly
- [ ] Coverage thresholds set appropriately

### 5. Security Configuration
- [ ] Secrets stored in Azure Key Vault or Pipeline Variables (not in code)
- [ ] App Service authentication configured (if needed)
- [ ] SSL/TLS certificates configured
- [ ] Firewall rules configured
- [ ] CORS origins restricted to known domains

### 6. Testing
- [ ] All unit tests passing locally
- [ ] Integration tests passing (if applicable)
- [ ] Code coverage meets threshold (80%)
- [ ] Manual testing completed on local environment
- [ ] Build completes successfully locally

## 🔄 During Deployment

### 7. Pipeline Execution
- [ ] Pipeline triggered successfully
- [ ] Code quality stage passed
- [ ] Build and test stage passed
- [ ] Security scan stage passed
- [ ] Backend deployment completed
- [ ] Frontend deployment completed
- [ ] Post-deployment validation passed

### 8. Monitor Pipeline
- [ ] Watch for any errors or warnings
- [ ] Review test results
- [ ] Check coverage reports
- [ ] Verify artifacts are created
- [ ] Confirm approvals processed (if configured)

## ✅ Post-Deployment Checklist

### 9. Verify Backend Deployment
- [ ] Backend URL is accessible: `https://le-restaurant-backend.azurewebsites.net`
- [ ] Health check endpoint responds: `/actuator/health`
- [ ] API endpoints respond correctly
- [ ] Database connection working (if applicable)
- [ ] Logs are being generated
- [ ] No errors in Application Insights (if configured)

```bash
# Test backend health
curl https://le-restaurant-backend.azurewebsites.net/actuator/health

# Expected response:
# {"status":"UP"}
```

### 10. Verify Frontend Deployment
- [ ] Frontend URL is accessible: `https://le-restaurant-frontend.azurestaticapps.net`
- [ ] Homepage loads correctly
- [ ] All routes work (no 404 errors)
- [ ] Static assets load (CSS, JS, images)
- [ ] API calls to backend work
- [ ] CORS is configured correctly
- [ ] No console errors in browser

```bash
# Test frontend accessibility
curl https://le-restaurant-frontend.azurestaticapps.net

# Should return HTML content
```

### 11. Functional Testing
- [ ] User authentication works
- [ ] User registration works
- [ ] Payment management features work
- [ ] Menu item management works
- [ ] All CRUD operations function correctly
- [ ] Forms validate properly
- [ ] Error messages display correctly

### 12. Performance Testing
- [ ] Page load times acceptable (<3 seconds)
- [ ] API response times reasonable (<1 second)
- [ ] No memory leaks detected
- [ ] Database queries optimized
- [ ] Static assets cached properly

### 13. Monitoring Setup
- [ ] Application Insights configured and collecting data
- [ ] Alerts configured for critical errors
- [ ] Log retention policies set
- [ ] Dashboard created for monitoring
- [ ] Error tracking configured

### 14. Documentation
- [ ] Deployment guide reviewed
- [ ] API documentation updated
- [ ] Environment variables documented
- [ ] Troubleshooting guide available
- [ ] Runbook created for operations team

### 15. Backup and Recovery
- [ ] Database backup configured (if applicable)
- [ ] Backup restoration tested
- [ ] Disaster recovery plan documented
- [ ] Rollback plan prepared

## 🔍 Verification Commands

### Backend Health Check
```bash
# Basic health check
curl -i https://le-restaurant-backend.azurewebsites.net/actuator/health

# Detailed health check (if authorized)
curl -i https://le-restaurant-backend.azurewebsites.net/actuator/info

# Check metrics
curl -i https://le-restaurant-backend.azurewebsites.net/actuator/metrics
```

### Frontend Verification
```bash
# Check frontend is accessible
curl -I https://le-restaurant-frontend.azurestaticapps.net

# Check routing works
curl -I https://le-restaurant-frontend.azurestaticapps.net/login
curl -I https://le-restaurant-frontend.azurestaticapps.net/dashboard
```

### View Logs
```bash
# Stream backend logs
az webapp log tail \
  --name le-restaurant-backend \
  --resource-group le-restaurant-rg

# Download logs
az webapp log download \
  --name le-restaurant-backend \
  --resource-group le-restaurant-rg \
  --log-file backend-logs.zip
```

## 🚨 Rollback Plan

If deployment fails or critical issues are found:

### Quick Rollback Steps
1. **Stop Current Deployment**
   ```bash
   # Stop the app service
   az webapp stop --name le-restaurant-backend --resource-group le-restaurant-rg
   ```

2. **Revert to Previous Version**
   - Go to Azure Portal
   - Navigate to App Service → Deployment Center
   - Select previous deployment
   - Click "Redeploy"

3. **Verify Rollback**
   - Check health endpoints
   - Test critical functionality
   - Monitor logs for errors

4. **Communicate Issue**
   - Notify team of rollback
   - Document issue in incident log
   - Create ticket for investigation

## 📊 Success Criteria

Deployment is considered successful when:

- ✅ All pipeline stages pass
- ✅ Health checks return 200 OK
- ✅ Frontend loads without errors
- ✅ Backend API responds correctly
- ✅ Database connections work (if applicable)
- ✅ No critical errors in logs
- ✅ All functional tests pass
- ✅ Performance meets requirements

## 📝 Notes

- Keep this checklist updated as deployment process evolves
- Review checklist after each deployment for improvements
- Document any issues encountered and their solutions
- Share learnings with the team

---

**Last Updated:** October 22, 2025  
**Next Review:** After first production deployment
