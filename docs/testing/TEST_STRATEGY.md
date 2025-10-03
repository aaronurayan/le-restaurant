# Unit Testing Strategy for Le Restaurant
## F102 User Management & F106 Payment Management

**Version:** 1.0.0  
**Date:** October 1, 2025  
**Author:** Le Restaurant Development Team

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Testing Pyramid](#testing-pyramid)
3. [Test Coverage Goals](#test-coverage-goals)
4. [Frontend Testing Strategy](#frontend-testing-strategy)
5. [Backend Testing Strategy](#backend-testing-strategy)
6. [CI/CD Integration](#cicd-integration)
7. [Test Execution Plan](#test-execution-plan)
8. [Maintenance Guidelines](#maintenance-guidelines)

---

## 1. Executive Summary

This document outlines the comprehensive testing strategy for **F102 User Management** and **F106 Payment Management** features. The strategy follows industry best practices and ensures high code quality through automated testing in Azure DevOps Pipelines.

### Key Objectives
- Achieve **minimum 80% code coverage** for critical business logic
- Implement **automated testing** in CI/CD pipeline
- Ensure **fast feedback loops** (< 5 minutes for unit tests)
- Maintain **test reliability** (> 95% pass rate)
- Enable **parallel test execution** for faster builds

### Technology Stack
- **Frontend:** Vitest + React Testing Library + Mock Service Worker (MSW)
- **Backend:** JUnit 5 + Mockito + Spring Boot Test
- **CI/CD:** Azure DevOps Pipelines
- **Coverage:** Istanbul (Frontend) + JaCoCo (Backend)

---

## 2. Testing Pyramid

```
                    /\
                   /  \
                  /    \
                 /  E2E \        < 10% - End-to-End Tests
                /--------\
               /          \
              / Integration \    < 20% - Integration Tests
             /--------------\
            /                \
           /   Unit Tests     \  < 70% - Unit Tests (FOCUS)
          /--------------------\
```

### Distribution Strategy
- **70% Unit Tests**: Fast, isolated, test individual functions/components
- **20% Integration Tests**: Test component interactions and API contracts
- **10% E2E Tests**: Critical user workflows (login, payment processing)

**For F102 & F106, we focus primarily on Unit Tests** to establish a solid foundation.

---

## 3. Test Coverage Goals

### Overall Coverage Targets

| Metric | Minimum | Target | Excellent |
|--------|---------|--------|-----------|
| Line Coverage | 70% | 80% | 90% |
| Branch Coverage | 65% | 75% | 85% |
| Function Coverage | 75% | 85% | 95% |

### Feature-Specific Coverage

#### F102 User Management
| Component | Type | Coverage Target | Priority |
|-----------|------|----------------|----------|
| UserManagementPanel | Frontend | 85% | HIGH |
| UserFormModal | Frontend | 80% | HIGH |
| useUserApi Hook | Frontend | 90% | CRITICAL |
| UserController | Backend | 85% | HIGH |
| UserService | Backend | 90% | CRITICAL |
| UserRepository | Backend | 75% | MEDIUM |

#### F106 Payment Management
| Component | Type | Coverage Target | Priority |
|-----------|------|----------------|----------|
| PaymentManagementPanel | Frontend | 85% | HIGH |
| CartSidebar | Frontend | 80% | HIGH |
| usePaymentApi Hook | Frontend | 90% | CRITICAL |
| PaymentController | Backend | 85% | HIGH |
| PaymentService | Backend | 90% | CRITICAL |
| PaymentRepository | Backend | 75% | MEDIUM |

---

## 4. Frontend Testing Strategy

### 4.1 Testing Framework Setup

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        'dist/'
      ],
      statements: 80,
      branches: 75,
      functions: 85,
      lines: 80
    }
  }
});
```

### 4.2 Test Categories

#### A. Component Tests
**Purpose:** Verify UI behavior and user interactions

**Example Test Structure:**
```typescript
describe('UserManagementPanel', () => {
  describe('Rendering', () => {
    it('should render panel when isOpen is true');
    it('should display loading spinner while fetching data');
    it('should show error message when API fails');
  });

  describe('User Interactions', () => {
    it('should filter users by search term');
    it('should filter users by role');
    it('should open create modal on add button click');
  });

  describe('CRUD Operations', () => {
    it('should create new user successfully');
    it('should update existing user');
    it('should delete user with confirmation');
  });
});
```

#### B. Hook Tests
**Purpose:** Test custom React hooks in isolation

**Example Test Structure:**
```typescript
describe('useUserApi', () => {
  describe('Data Loading', () => {
    it('should load users on mount');
    it('should handle API errors gracefully');
    it('should use mock data when backend unavailable');
  });

  describe('CRUD Operations', () => {
    it('should create user and refresh list');
    it('should update user and update state');
    it('should delete user and remove from list');
  });

  describe('Filtering', () => {
    it('should filter by role');
    it('should filter by status');
    it('should search by email');
  });
});
```

#### C. Service Tests
**Purpose:** Test API service layer

**Example Test Structure:**
```typescript
describe('UserApiService', () => {
  describe('API Calls', () => {
    it('should call GET /api/users with correct params');
    it('should handle 404 errors');
    it('should retry failed requests');
  });

  describe('Data Transformation', () => {
    it('should transform API response to User type');
    it('should handle null values');
  });
});
```

### 4.3 Mocking Strategy

#### API Mocking with MSW
```typescript
// src/test/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  // User Management
  rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockUsers));
  }),
  
  rest.post('/api/users', (req, res, ctx) => {
    return res(ctx.status(201), ctx.json(newUser));
  }),

  // Payment Management
  rest.get('/api/payments', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockPayments));
  }),
];
```

### 4.4 Test Data Management

```typescript
// src/test/fixtures/userFixtures.ts
export const mockUser = {
  id: 1,
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: UserRole.CUSTOMER,
  status: UserStatus.ACTIVE
};

export const mockUsers = [mockUser, ...];
```

---

## 5. Backend Testing Strategy

### 5.1 Testing Framework Setup

```xml
<!-- pom.xml or build.gradle -->
<dependencies>
    <!-- JUnit 5 -->
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <scope>test</scope>
    </dependency>
    
    <!-- Mockito -->
    <dependency>
        <groupId>org.mockito</groupId>
        <artifactId>mockito-core</artifactId>
        <scope>test</scope>
    </dependency>
    
    <!-- Spring Boot Test -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    
    <!-- JaCoCo for Coverage -->
    <dependency>
        <groupId>org.jacoco</groupId>
        <artifactId>jacoco-maven-plugin</artifactId>
        <version>0.8.10</version>
    </dependency>
</dependencies>
```

### 5.2 Test Categories

#### A. Controller Tests (Web Layer)
**Purpose:** Test HTTP request/response handling

**Example Test Structure:**
```java
@WebMvcTest(UserController.class)
class UserControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private UserService userService;
    
    @Test
    @DisplayName("GET /api/users - should return list of users")
    void getAllUsers_ShouldReturnUserList() throws Exception {
        // Given
        List<User> users = Arrays.asList(mockUser1, mockUser2);
        when(userService.getAllUsers()).thenReturn(users);
        
        // When & Then
        mockMvc.perform(get("/api/users"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.length()").value(2))
            .andExpect(jsonPath("$[0].email").value("test@example.com"));
    }
    
    @Test
    @DisplayName("POST /api/users - should create user")
    void createUser_ShouldReturnCreatedUser() throws Exception {
        // Given
        CreateUserRequest request = new CreateUserRequest(...);
        User createdUser = new User(...);
        when(userService.createUser(any())).thenReturn(createdUser);
        
        // When & Then
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists());
    }
    
    @Test
    @DisplayName("POST /api/users - should return 400 for invalid data")
    void createUser_WithInvalidData_ShouldReturn400() throws Exception {
        // Test validation errors
    }
}
```

#### B. Service Tests (Business Logic)
**Purpose:** Test business logic in isolation

**Example Test Structure:**
```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @InjectMocks
    private UserService userService;
    
    @Test
    @DisplayName("createUser - should hash password and save user")
    void createUser_ShouldHashPasswordAndSave() {
        // Given
        CreateUserRequest request = createValidRequest();
        String hashedPassword = "hashed_password";
        when(passwordEncoder.encode(request.getPassword()))
            .thenReturn(hashedPassword);
        when(userRepository.save(any(User.class)))
            .thenAnswer(i -> i.getArgument(0));
        
        // When
        User result = userService.createUser(request);
        
        // Then
        assertNotNull(result);
        assertEquals(hashedPassword, result.getPassword());
        verify(userRepository).save(any(User.class));
    }
    
    @Test
    @DisplayName("createUser - should throw exception for duplicate email")
    void createUser_WithDuplicateEmail_ShouldThrowException() {
        // Given
        when(userRepository.existsByEmail(anyString())).thenReturn(true);
        
        // When & Then
        assertThrows(DuplicateEmailException.class, () -> {
            userService.createUser(request);
        });
    }
}
```

#### C. Repository Tests (Data Layer)
**Purpose:** Test database interactions

**Example Test Structure:**
```java
@DataJpaTest
class UserRepositoryTest {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private TestEntityManager entityManager;
    
    @Test
    @DisplayName("findByEmail - should return user when exists")
    void findByEmail_WhenUserExists_ShouldReturnUser() {
        // Given
        User user = createTestUser();
        entityManager.persist(user);
        entityManager.flush();
        
        // When
        Optional<User> found = userRepository.findByEmail(user.getEmail());
        
        // Then
        assertTrue(found.isPresent());
        assertEquals(user.getEmail(), found.get().getEmail());
    }
    
    @Test
    @DisplayName("findByEmail - should return empty when not exists")
    void findByEmail_WhenUserNotExists_ShouldReturnEmpty() {
        // When
        Optional<User> found = userRepository.findByEmail("nonexistent@example.com");
        
        // Then
        assertFalse(found.isPresent());
    }
}
```

### 5.3 Test Naming Convention

Follow **Given-When-Then** pattern:
```
methodName_stateUnderTest_expectedBehavior()

Examples:
- createUser_WithValidData_ShouldReturnCreatedUser()
- getUserById_WhenUserNotFound_ShouldThrow404()
- updatePaymentStatus_ToPending_ShouldUpdateSuccessfully()
```

---

## 6. CI/CD Integration

### 6.1 Azure Pipeline Structure

```yaml
# azure-pipelines.yml
trigger:
  branches:
    include:
      - main
      - develop
      - feature/*
      - F102*
      - F106*

pool:
  vmImage: 'ubuntu-latest'

variables:
  NODE_VERSION: '18.x'
  JAVA_VERSION: '17'

stages:
  - stage: Test
    displayName: 'Run Tests'
    jobs:
      - job: FrontendTests
        displayName: 'Frontend Unit Tests'
        steps:
          - task: NodeTool@0
            inputs:
              versionSpec: $(NODE_VERSION)
            displayName: 'Install Node.js'

          - script: |
              cd frontend
              npm ci
            displayName: 'Install Dependencies'

          - script: |
              cd frontend
              npm run test:ci
            displayName: 'Run Unit Tests'

          - script: |
              cd frontend
              npm run test:coverage
            displayName: 'Generate Coverage Report'

          - task: PublishCodeCoverageResults@1
            inputs:
              codeCoverageTool: 'Cobertura'
              summaryFileLocation: '$(System.DefaultWorkingDirectory)/frontend/coverage/cobertura-coverage.xml'
              reportDirectory: '$(System.DefaultWorkingDirectory)/frontend/coverage'
            displayName: 'Publish Frontend Coverage'

          - task: PublishTestResults@2
            inputs:
              testResultsFormat: 'JUnit'
              testResultsFiles: '**/junit.xml'
              searchFolder: '$(System.DefaultWorkingDirectory)/frontend'
              mergeTestResults: true
              testRunTitle: 'Frontend Unit Tests'
            displayName: 'Publish Test Results'

      - job: BackendTests
        displayName: 'Backend Unit Tests'
        steps:
          - task: JavaToolInstaller@0
            inputs:
              versionSpec: $(JAVA_VERSION)
              jdkArchitectureOption: 'x64'
              jdkSourceOption: 'PreInstalled'
            displayName: 'Install Java'

          - script: |
              cd backend
              ./gradlew clean test jacocoTestReport
            displayName: 'Run Unit Tests & Coverage'

          - task: PublishCodeCoverageResults@1
            inputs:
              codeCoverageTool: 'JaCoCo'
              summaryFileLocation: '$(System.DefaultWorkingDirectory)/backend/build/reports/jacoco/test/jacocoTestReport.xml'
              reportDirectory: '$(System.DefaultWorkingDirectory)/backend/build/reports/jacoco/test/html'
            displayName: 'Publish Backend Coverage'

          - task: PublishTestResults@2
            inputs:
              testResultsFormat: 'JUnit'
              testResultsFiles: '**/TEST-*.xml'
              searchFolder: '$(System.DefaultWorkingDirectory)/backend/build/test-results'
              mergeTestResults: true
              testRunTitle: 'Backend Unit Tests'
            displayName: 'Publish Test Results'

  - stage: QualityGate
    displayName: 'Quality Gate'
    dependsOn: Test
    jobs:
      - job: CheckCoverage
        displayName: 'Verify Coverage Thresholds'
        steps:
          - script: |
              echo "Checking coverage thresholds..."
              # Add custom coverage verification logic
            displayName: 'Verify Coverage'

  - stage: Build
    displayName: 'Build Application'
    dependsOn: QualityGate
    condition: succeeded()
    jobs:
      - job: BuildFrontend
        displayName: 'Build Frontend'
        steps:
          - script: |
              cd frontend
              npm run build
            displayName: 'Build Frontend'

      - job: BuildBackend
        displayName: 'Build Backend'
        steps:
          - script: |
              cd backend
              ./gradlew build -x test
            displayName: 'Build Backend'
```

### 6.2 Test Execution Flow

```
┌─────────────────┐
│  Code Commit    │
└────────┬────────┘
         │
         v
┌─────────────────┐
│ Trigger Pipeline│
└────────┬────────┘
         │
         v
┌─────────────────────────────────┐
│  Stage 1: Test                  │
│  ┌───────────┐  ┌────────────┐ │
│  │ Frontend  │  │  Backend   │ │
│  │   Tests   │  │   Tests    │ │
│  └───────────┘  └────────────┘ │
│       │              │          │
│       v              v          │
│  ┌───────────┐  ┌────────────┐ │
│  │ Coverage  │  │  Coverage  │ │
│  │  Report   │  │   Report   │ │
│  └───────────┘  └────────────┘ │
└────────┬────────────────────────┘
         │
         v
┌─────────────────┐
│ Stage 2: Gate   │  ← Check coverage thresholds
└────────┬────────┘
         │
         v (if pass)
┌─────────────────┐
│ Stage 3: Build  │
└─────────────────┘
```

### 6.3 Failure Handling

| Scenario | Action |
|----------|--------|
| Tests fail | Pipeline stops, developer notified |
| Coverage below threshold | Pipeline stops, report generated |
| Build fails | Pipeline stops, logs captured |
| Intermittent failures | Auto-retry up to 2 times |

---

## 7. Test Execution Plan

### 7.1 Local Development

#### Frontend
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test UserManagementPanel.test.tsx

# Run tests for specific feature
npm test -- --grep "F102"
```

#### Backend
```bash
# Run all tests
./gradlew test

# Run with coverage
./gradlew test jacocoTestReport

# Run specific test class
./gradlew test --tests UserServiceTest

# Run specific test method
./gradlew test --tests UserServiceTest.createUser_ShouldHashPasswordAndSave

# Continuous testing
./gradlew test --continuous
```

### 7.2 CI/CD Execution

Tests run automatically on:
- **Every push** to feature branches
- **Pull requests** to develop/main
- **Scheduled builds** (nightly)

### 7.3 Performance Targets

| Metric | Target | Maximum |
|--------|--------|---------|
| Frontend unit tests | < 30s | < 60s |
| Backend unit tests | < 60s | < 120s |
| Total pipeline | < 5min | < 10min |
| Test reliability | > 95% | > 90% |

---

## 8. Maintenance Guidelines

### 8.1 Test Maintenance Checklist

- [ ] **Update tests when requirements change**
- [ ] **Remove obsolete tests** when features are removed
- [ ] **Refactor duplicate test code** into helpers
- [ ] **Keep test data minimal** and focused
- [ ] **Review test coverage** monthly
- [ ] **Fix flaky tests** immediately

### 8.2 Code Review Checklist

For every PR:
- [ ] All tests pass locally and in CI
- [ ] New code has corresponding tests
- [ ] Coverage meets minimum thresholds
- [ ] Tests follow naming conventions
- [ ] No commented-out tests
- [ ] Mock data is realistic

### 8.3 Troubleshooting Guide

#### Common Issues

**Issue: Tests timeout**
- Solution: Increase timeout in vitest.config.ts or use `vi.setConfig({ testTimeout: 10000 })`

**Issue: Mock data not working**
- Solution: Verify MSW handlers are registered in setup.ts

**Issue: Coverage not accurate**
- Solution: Check exclusion patterns in coverage config

**Issue: Flaky tests**
- Solution: Add explicit waits, avoid testing implementation details

---

## 9. Success Metrics

### 9.1 Key Performance Indicators (KPIs)

| KPI | Current | Target | Status |
|-----|---------|--------|--------|
| Overall Coverage | - | 80% | 🎯 Target |
| Test Execution Time | - | < 5min | 🎯 Target |
| Test Pass Rate | - | > 95% | 🎯 Target |
| Bugs Found by Tests | - | > 70% | 🎯 Target |
| Mean Time to Detect (MTTD) | - | < 1hr | 🎯 Target |

### 9.2 Quality Metrics

- **Code Coverage:** Line, Branch, Function coverage
- **Test Reliability:** Pass rate over time
- **Test Speed:** Execution time trends
- **Bug Detection:** Percentage of bugs caught by tests
- **Test Maintenance:** Time spent fixing tests

---

## 10. Appendix

### 10.1 Glossary

- **Unit Test:** Test of a single function/component in isolation
- **Integration Test:** Test of multiple components working together
- **E2E Test:** Test of complete user workflow
- **Mock:** Fake object that simulates real behavior
- **Stub:** Predefined response to method calls
- **Code Coverage:** Percentage of code executed by tests

### 10.2 References

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [JUnit 5 Documentation](https://junit.org/junit5/)
- [Mockito Documentation](https://site.mockito.org/)
- [Azure DevOps Pipelines](https://docs.microsoft.com/azure/devops/pipelines/)

### 10.3 Contact

For questions or issues:
- **Team Lead:** [Your Name]
- **DevOps:** [DevOps Contact]
- **Slack:** #le-restaurant-testing

---

**Document Version:** 1.0.0  
**Last Updated:** October 1, 2025  
**Next Review:** November 1, 2025
