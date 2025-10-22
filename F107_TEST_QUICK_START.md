# F107 Test Execution Quick Start Guide

## 🚀 Quick Test Commands

### Backend Tests
```powershell
# Navigate to backend directory
cd backend

# Run all tests
.\gradlew.bat test

# Run only F107 tests
.\gradlew.bat test --tests DeliveryServiceTest

# Generate coverage report
.\gradlew.bat test jacocoTestReport

# View coverage
start build\reports\jacoco\test\html\index.html
```

### Frontend Tests
```powershell
# Navigate to frontend directory
cd frontend

# Run all tests
npm run test

# Run only F107 tests
npm run test -- DeliveryManagementPanel
npm run test -- DeliveryCard
npm run test -- DeliveryForm
npm run test -- useDeliveryApi

# Generate coverage report
npm run test:coverage

# View coverage
start coverage\index.html
```

---

## 📊 Expected Test Results

### Backend (18 tests)
```
DeliveryServiceTest
├── Create Delivery Tests (5)
├── Get Delivery Tests (5)
├── Assign Driver Tests (3)
├── Update Delivery Status Tests (3)
└── Delete Delivery Tests (2)

✅ 18/18 tests passed
📈 Expected coverage: 85%+
```

### Frontend (103 tests)
```
DeliveryManagementPanel.test.tsx (25 tests)
├── Rendering (5)
├── Tab Navigation (4)
├── Search and Filter (3)
├── Create Delivery Assignment (3)
├── Update Delivery Status (1)
├── Assign Delivery Person (1)
├── Archive Functionality (3)
├── Close Panel (2)
└── Edge Cases (3)

DeliveryCard.test.tsx (25 tests)
├── Rendering (4)
├── Status Display (4)
├── Action Buttons (6)
├── Vehicle Type Display (3)
├── Time Display (2)
├── Edge Cases (4)
└── Accessibility (2)

DeliveryForm.test.tsx (25 tests)
├── Rendering (5)
├── Form Validation (5)
├── Form Submission (4)
├── Cancel Button (2)
├── Time Picker (2)
├── Edge Cases (4)
└── Accessibility (3)

useDeliveryApi.test.ts (28 tests)
├── Backend Connection (3)
├── Load Deliveries (4)
├── Create Delivery Assignment (3)
├── Update Delivery Status (3)
├── Assign Delivery Person (3)
├── Load Delivery Persons (2)
├── Error Handling (3)
├── Mock Mode (4)
└── Edge Cases (3)

✅ 103/103 tests passed
📈 Expected coverage: 80%+
```

---

## 🔧 Troubleshooting

### Backend Issues

#### Problem: Java compilation error
```
Error: Class com.sun.tools.javac.tree.JCTree$JCImport...
```
**Solution:**
```powershell
# Check Java version (should be 17 or 21)
java -version

# If wrong version, update JAVA_HOME
# Edit: System Properties > Environment Variables
```

#### Problem: Tests not found
```
No tests found for given includes: [DeliveryServiceTest]
```
**Solution:**
```powershell
# Clean and rebuild
.\gradlew.bat clean build
```

### Frontend Issues

#### Problem: Vitest module not found
```
Cannot find module 'vitest' or its corresponding type declarations
```
**Solution:**
```powershell
# Reinstall dependencies
npm install
```

#### Problem: Tests timeout
```
Error: Test timeout of 5000ms exceeded
```
**Solution:**
```typescript
// Add to test file
vi.setConfig({ testTimeout: 10000 });
```

---

## 📝 Test File Locations

### Backend
```
backend/src/test/java/com/lerestaurant/le_restaurant_backend/service/
└── DeliveryServiceTest.java ✅ (18 tests)
```

### Frontend
```
frontend/src/
├── components/
│   ├── organisms/__tests__/
│   │   └── DeliveryManagementPanel.test.tsx ✅ (25 tests)
│   └── molecules/__tests__/
│       ├── DeliveryCard.test.tsx ✅ (25 tests)
│       └── DeliveryForm.test.tsx ✅ (25 tests)
└── hooks/__tests__/
    └── useDeliveryApi.test.ts ✅ (28 tests)
```

---

## ✅ Pre-Merge Checklist

Before merging F107 to main:

### Backend
- [ ] All 18 DeliveryServiceTest tests pass
- [ ] JaCoCo coverage report shows 80%+ for DeliveryService
- [ ] No compilation warnings
- [ ] `.\gradlew.bat build` succeeds

### Frontend
- [ ] All 103 frontend tests pass
- [ ] Vitest coverage shows 80%+ for F107 components
- [ ] No TypeScript errors (except test type issues)
- [ ] `npm run build` succeeds

### Integration
- [ ] Azure pipeline passes (`azure-pipelines-testing.yml`)
- [ ] No conflicts with main branch
- [ ] All code follows naming conventions
- [ ] Test patterns match F102 standards

---

## 🎯 Coverage Goals

### Backend (JaCoCo)
| Metric | Target | F107 Status |
|--------|--------|-------------|
| Line Coverage | 80% | ✅ Expected 85%+ |
| Branch Coverage | 80% | ✅ Expected 85%+ |
| Method Coverage | 80% | ✅ Expected 90%+ |

### Frontend (Vitest)
| Metric | Target | F107 Status |
|--------|--------|-------------|
| Statements | 80% | ✅ Expected 82%+ |
| Branches | 80% | ✅ Expected 80%+ |
| Functions | 80% | ✅ Expected 85%+ |
| Lines | 80% | ✅ Expected 82%+ |

---

## 🔗 Related Documentation

- **Test Strategy:** `/docs/testing/TEST_STRATEGY.md`
- **Backend Architecture:** `/Actual-design-plan/system-architecture/architecture-overview.md`
- **Naming Conventions:** `/Actual-design-plan/coding-standards/naming-conventions-dictionary.md`
- **F102 Reference:** `backend/src/test/java/.../UserServiceTest.java`
- **Complete Summary:** `/F107_TEST_SUITE_SUMMARY.md`

---

## 📞 Support

**Issue:** Tests failing after merge?  
**Check:** `/INTEGRATION_TEST_STATUS.md`

**Issue:** Coverage below 80%?  
**Check:** JaCoCo/Vitest HTML reports for uncovered lines

**Issue:** Azure pipeline failing?  
**Check:** `azure-pipelines-testing.yml` for configuration

---

## 🎉 Success Criteria

### Backend Test Success
```
BUILD SUCCESSFUL in 12s
5 actionable tasks: 5 executed
Code coverage: 85.2% (target: 80%)
```

### Frontend Test Success
```
Test Files  4 passed (4)
     Tests  103 passed (103)
  Duration  8.45s (in thread 1.2s, 704.17%)
-----------|---------|----------|---------|---------|
File       | % Stmts | % Branch | % Funcs | % Lines |
-----------|---------|----------|---------|---------|
All files  |   82.14 |    80.23 |   85.71 |   82.14 |
```

**Status:** ✅ Ready for merge when both pass!
