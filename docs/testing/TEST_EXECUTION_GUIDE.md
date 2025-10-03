# Test Execution Guide

## 📖 Overview

This document provides comprehensive instructions for running unit tests locally for **F102 User Management** and **F106 Payment Management** features, viewing coverage reports, and interpreting CI/CD results.

---

## 🏗️ Prerequisites

### Frontend Requirements
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Dependencies**: Install with `npm install`

### Backend Requirements
- **Java JDK**: 17 or higher
- **Gradle**: 7.x or higher (or use wrapper)
- **Dependencies**: Auto-installed by Gradle

---

## 🧪 Running Tests Locally

### Frontend Tests (Vitest + React Testing Library)

#### Run All Tests
```powershell
cd frontend
npm test
```

#### Run Tests for Specific Features
```powershell
# F102 User Management tests only
npm test -- UserManagementPanel

# F106 Payment Management tests only
npm test -- PaymentManagementPanel
```

#### Run Tests in Watch Mode (Development)
```powershell
npm test -- --watch
```

#### Run Tests with Coverage Report
```powershell
npm run test:coverage
```

#### Run Tests in UI Mode (Interactive)
```powershell
npm test -- --ui
```

### Backend Tests (JUnit 5 + Mockito)

#### Run All Tests
```powershell
cd backend
.\gradlew test
```

#### Run Tests for Specific Features
```powershell
# F102 User Management tests only
.\gradlew test --tests "*UserControllerTest"
.\gradlew test --tests "*UserServiceTest"

# F106 Payment Management tests only
.\gradlew test --tests "*PaymentControllerTest"
.\gradlew test --tests "*PaymentServiceTest"
```

#### Run Tests with Coverage Report
```powershell
.\gradlew test jacocoTestReport
```

#### Run Tests and Verify Coverage Thresholds
```powershell
.\gradlew test jacocoTestCoverageVerification
```

---

## 📊 Viewing Coverage Reports

### Frontend Coverage Reports

After running `npm run test:coverage`:

1. **Terminal Output**: Shows summary in console
   ```
   Coverage Summary:
   Statements   : 85.23% ( 1234/1448 )
   Branches     : 82.45% ( 567/688 )
   Functions    : 87.12% ( 234/268 )
   Lines        : 85.67% ( 1201/1402 )
   ```

2. **HTML Report**: Open in browser
   ```powershell
   # Windows
   start frontend/coverage/index.html
   
   # Or manually navigate to:
   # frontend/coverage/index.html
   ```

3. **Coverage Report Sections**:
   - **Summary**: Overall coverage percentages
   - **File Browser**: Click files to see line-by-line coverage
   - **Color Coding**:
     - 🟢 **Green**: Line executed during tests
     - 🔴 **Red**: Line NOT executed
     - 🟡 **Yellow**: Partial branch coverage

### Backend Coverage Reports

After running `.\gradlew jacocoTestReport`:

1. **Terminal Output**: Summary appears in console
   ```
   Task :jacocoTestReport
   Coverage report generated: build/reports/jacoco/test/html/index.html
   ```

2. **HTML Report**: Open in browser
   ```powershell
   # Windows
   start backend/build/reports/jacoco/test/html/index.html
   ```

3. **XML Report** (for CI/CD):
   - Location: `backend/build/reports/jacoco/test/jacocoTestReport.xml`
   - Used by Azure Pipeline for coverage publishing

4. **Coverage Metrics**:
   - **Instruction Coverage**: Bytecode instruction execution
   - **Branch Coverage**: Decision points (if/else/switch)
   - **Line Coverage**: Source code lines executed
   - **Method Coverage**: Methods invoked during tests
   - **Class Coverage**: Classes loaded during tests

---

## 🎯 Interpreting Test Results

### Frontend Test Output

#### Successful Test Run
```
✓ src/components/organisms/__tests__/UserManagementPanel.test.tsx (18)
  ✓ Rendering (5)
    ✓ should render panel when isOpen is true
    ✓ should not render when isOpen is false
    ...
  ✓ User Interactions (5)
  ✓ CRUD Operations (4)
  ✓ Accessibility (2)
  ✓ Edge Cases (2)

Test Files  1 passed (1)
     Tests  18 passed (18)
  Duration  2.34s
```

#### Failed Test Example
```
✗ should create user successfully
  
  AssertionError: expected 'POST' to equal 'PUT'
  
  ❯ src/components/organisms/__tests__/UserManagementPanel.test.tsx:123:45
    121|   const createButton = screen.getByText('Create User');
    122|   await user.click(createButton);
    123|   expect(mockCreateUser).toHaveBeenCalledWith(expect.objectContaining({
         |                                             ^
    124|     username: 'newuser',
```

**How to Fix**:
1. Navigate to file path shown (line 123)
2. Check assertion expectations vs actual values
3. Verify mock setup and component behavior
4. Re-run test after fix

### Backend Test Output

#### Successful Test Run
```
UserControllerTest > GET /api/users - List All Users > Should return list of all users successfully PASSED
UserControllerTest > POST /api/users - Create User > Should create new user successfully PASSED
UserControllerTest > DELETE /api/users/{id} - Delete User > Should delete user successfully PASSED

BUILD SUCCESSFUL in 8s
5 actionable tasks: 5 executed
```

#### Failed Test Example
```
UserServiceTest > Create User Tests > Should create user with encoded password FAILED
    org.opentest4j.AssertionFailedError: 
    expected: "encodedPassword"
     but was: "plainPassword"
        at UserServiceTest.shouldCreateUserWithEncodedPassword(UserServiceTest.java:87)
```

**How to Fix**:
1. Check line 87 in UserServiceTest.java
2. Verify mock setup for `passwordEncoder.encode()`
3. Ensure service calls encoder before saving
4. Re-run test: `.\gradlew test --tests "*UserServiceTest"`

---

## 🚀 CI/CD Pipeline Results

### Accessing Azure Pipeline

1. Navigate to Azure DevOps project
2. Go to **Pipelines** → **Builds**
3. Select latest run for your branch

### Pipeline Stages

#### 1️⃣ **Code Quality**
- **ESLint** (Frontend): JavaScript/TypeScript linting
- **Checkstyle** (Backend): Java code style verification

**Interpreting Results**:
- ✅ **Pass**: No linting errors
- ❌ **Fail**: Click "View Logs" to see specific violations

#### 2️⃣ **Unit Tests**
- **Frontend Tests**: Vitest execution with coverage
- **Backend Tests**: JUnit execution with JaCoCo

**Interpreting Results**:
- **Test Summary**: Shows pass/fail counts
- **Coverage Report**: Published as artifact
- **Download**: Click "Tests" tab → "Coverage" artifact

#### 3️⃣ **Quality Gate**
- **Coverage Verification**: Checks 80% threshold
- **Security Scan** (if enabled): Vulnerability detection

**Common Failures**:
| Error | Meaning | Fix |
|-------|---------|-----|
| `Coverage below threshold` | <80% line coverage | Add more tests |
| `Quality gate failed` | Coverage or security issue | Check specific metrics |
| `Unhandled vulnerabilities` | Security scan found issues | Update dependencies |

#### 4️⃣ **Build & Deploy**
- **Frontend Build**: `npm run build` (dist folder)
- **Backend Build**: `gradle build` (JAR file)
- **Deploy**: To staging (main branch only)

### Downloading Coverage Reports from Pipeline

1. Navigate to pipeline run
2. Click **"1 published"** artifacts link
3. Download **coverage-frontend** or **coverage-backend**
4. Extract ZIP and open `index.html`

---

## 🔧 Troubleshooting Common Issues

### Frontend Issues

#### ❌ `Cannot find module '@testing-library/jest-dom'`
```powershell
npm install --save-dev @testing-library/jest-dom
```

#### ❌ `ReferenceError: global is not defined`
- Ensure `vitest.config.ts` has `globals: true`
- Check `src/test/setup.ts` is correctly configured

#### ❌ `TypeError: Cannot read property 'matchMedia' of undefined`
- Already mocked in `src/test/setup.ts`
- If still failing, verify setup file is loaded

### Backend Issues

#### ❌ `Could not find method jacoco() for arguments`
```gradle
// Ensure build.gradle has:
plugins {
    id 'jacoco'
}
```

#### ❌ `Rule violated for class UserController: lines covered ratio is 0.75`
- Coverage below 80% threshold
- Add more test cases for uncovered scenarios
- Check coverage report for specific lines

#### ❌ `org.mockito.exceptions.misusing.UnnecessaryStubbingException`
- Remove unused `when()` stubs from test
- Only mock methods actually called during test

---

## 📈 Coverage Metrics Explained

### Line Coverage
**Definition**: Percentage of executable lines run during tests

**Target**: ≥80% for F102 and F106 features

**Example**:
```java
// Covered (✅)
public void deleteUser(Long id) {
    if (userRepository.existsById(id)) {  // Line 1 ✅
        userRepository.deleteById(id);    // Line 2 ✅
    } else {
        throw new Exception("Not found"); // Line 3 ❌ (not covered)
    }
}
```
**Coverage**: 2/3 lines = 66.67% ❌ (fails threshold)

### Branch Coverage
**Definition**: Percentage of decision points (if/else) executed

**Target**: ≥80% for F102 and F106 features

**Example**:
```typescript
// Test should cover both branches:
if (user.status === 'ACTIVE') {  // Branch 1: true ✅, false ✅
    enableFeatures();            // Covered ✅
} else {
    disableFeatures();           // Covered ✅
}
```
**Coverage**: 2/2 branches = 100% ✅

### Function Coverage
**Definition**: Percentage of functions called during tests

**Target**: ≥80% for F102 and F106 features

---

## 📋 Test Execution Checklist

Before committing code:

- [ ] Run all frontend tests: `npm test`
- [ ] Check frontend coverage: `npm run test:coverage`
- [ ] Run all backend tests: `.\gradlew test`
- [ ] Check backend coverage: `.\gradlew jacocoTestReport`
- [ ] Verify coverage thresholds: `.\gradlew jacocoTestCoverageVerification`
- [ ] Fix any failing tests
- [ ] Ensure coverage ≥80% for changed files
- [ ] Review uncovered lines and add tests if critical
- [ ] Commit and push changes
- [ ] Monitor Azure Pipeline run

---

## 🆘 Getting Help

### Resources
- **Vitest Documentation**: https://vitest.dev
- **React Testing Library**: https://testing-library.com/react
- **JUnit 5 User Guide**: https://junit.org/junit5/docs/current/user-guide/
- **Mockito Documentation**: https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html
- **JaCoCo Documentation**: https://www.jacoco.org/jacoco/trunk/doc/

### Team Contacts
- **Frontend Lead**: [Contact Info]
- **Backend Lead**: [Contact Info]
- **DevOps Engineer**: [Contact Info]

---

## 📝 Quick Reference Commands

### Frontend
```powershell
npm test                    # Run all tests
npm test -- --watch         # Watch mode
npm run test:coverage       # With coverage
npm test -- UserManagement  # Specific feature
```

### Backend
```powershell
.\gradlew test                           # Run all tests
.\gradlew test --tests "*UserController" # Specific class
.\gradlew jacocoTestReport               # Generate report
.\gradlew jacocoTestCoverageVerification # Verify threshold
```

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Maintained By**: Le Restaurant Development Team
