# 🚀 Quick Start Guide - Unit Testing for F102 & F106

## ⚡ 5-Minute Setup

### Prerequisites Check
```powershell
# Check Node.js version (need 18.x+)
node --version

# Check Java version (need 17+)
java -version

# Check npm version (need 9.x+)
npm --version
```

---

## 🎯 Quick Commands

### Frontend Tests

#### Run All Tests
```powershell
cd frontend
npm test
```

#### Run with Coverage
```powershell
npm run test:coverage
```

#### Interactive UI Mode
```powershell
npm run test:ui
```

#### Watch Mode (Development)
```powershell
npm run test:watch
```

### Backend Tests

#### Run All Tests
```powershell
cd backend
.\gradlew test
```

#### Run with Coverage Report
```powershell
.\gradlew test jacocoTestReport
```

#### Verify Coverage Threshold (80%)
```powershell
.\gradlew jacocoTestCoverageVerification
```

---

## 📊 View Coverage Reports

### Frontend
```powershell
# After running: npm run test:coverage
start coverage/index.html
```

### Backend
```powershell
# After running: .\gradlew jacocoTestReport
start build/reports/jacoco/test/html/index.html
```

---

## 🧪 Test Specific Features

### F102 User Management Tests
```powershell
# Frontend
npm test -- UserManagementPanel

# Backend
.\gradlew test --tests "*UserControllerTest"
.\gradlew test --tests "*UserServiceTest"
```

### F106 Payment Management Tests
```powershell
# Frontend
npm test -- PaymentManagementPanel

# Backend
.\gradlew test --tests "*PaymentControllerTest"
```

---

## 📁 Key Files Location

### Frontend
- Tests: `frontend/src/components/organisms/__tests__/`
- Config: `frontend/vitest.config.ts`
- Setup: `frontend/src/test/setup.ts`
- Coverage: `frontend/coverage/`

### Backend
- Tests: `backend/src/test/java/com/lerestaurant/le_restaurant_backend/`
- Config: `backend/build.gradle`
- Coverage: `backend/build/reports/jacoco/`

---

## 🐛 Common Issues

### Issue: Tests not running
**Solution**: Install dependencies first
```powershell
# Frontend
cd frontend
npm install

# Backend
cd backend
.\gradlew build
```

### Issue: Coverage below 80%
**Solution**: Add more test cases
```powershell
# Check which lines are uncovered
npm run test:coverage  # Then open coverage/index.html
```

### Issue: Mock not working
**Solution**: Check mock setup in test file
```typescript
// Ensure mock is before test
vi.mock('../../../hooks/useUserApi', () => ({
  useUserApi: () => ({ /* mock implementation */ }),
}));
```

---

## 📚 Documentation Index

1. **TEST_STRATEGY.md** - Overall testing approach
2. **TEST_EXECUTION_GUIDE.md** - Detailed step-by-step instructions
3. **TESTING_SUMMARY.md** - Complete implementation summary
4. **azure-pipelines-testing.yml** - CI/CD configuration

---

## ✅ Pre-Commit Checklist

Before pushing code:

- [ ] `npm test` (all frontend tests pass)
- [ ] `npm run test:coverage` (coverage ≥80%)
- [ ] `.\gradlew test` (all backend tests pass)
- [ ] `.\gradlew jacocoTestReport` (check coverage)
- [ ] Review uncovered lines in coverage reports
- [ ] Fix any failing tests
- [ ] Commit and push

---

## 🎯 Test Statistics

### Frontend
- **UserManagementPanel**: 18 tests
- **PaymentManagementPanel**: 22 tests
- **Total**: 40 tests

### Backend
- **UserControllerTest**: 26 tests
- **PaymentControllerTest**: 24 tests
- **UserServiceTest**: 21 tests
- **Total**: 71 tests

### Combined
- **Total Test Files**: 5
- **Total Test Cases**: 111
- **Coverage Target**: 80%
- **Test Lines of Code**: ~2,000

---

## 💡 Pro Tips

1. **Use watch mode** during development: `npm run test:watch`
2. **Run specific tests** to save time: `npm test -- UserManagement`
3. **Check coverage reports** regularly to find gaps
4. **Use test UI** for interactive debugging: `npm run test:ui`
5. **Run backend tests faster**: `.\gradlew test --parallel`

---

## 🆘 Need Help?

- **Frontend Tests**: Check `TEST_EXECUTION_GUIDE.md` page 3-5
- **Backend Tests**: Check `TEST_EXECUTION_GUIDE.md` page 6-8
- **Coverage Reports**: Check `TEST_EXECUTION_GUIDE.md` page 9-12
- **CI/CD Pipeline**: Check `TEST_EXECUTION_GUIDE.md` page 13-16

---

## 🚀 Next Steps

1. ✅ Run tests locally: `npm test` and `.\gradlew test`
2. ✅ Check coverage: `npm run test:coverage`
3. ✅ Review coverage reports in browser
4. ✅ Push to trigger Azure Pipeline
5. ✅ Monitor pipeline execution in Azure DevOps

---

**Last Updated**: January 2025  
**Quick Start Version**: 1.0.0  
**Estimated Setup Time**: 5 minutes
