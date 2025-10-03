# 🔍 AI-Powered Merge Review & Conflict Prevention Guide

> **Author Role**: 20-Year Senior Software Architecture Designer  
> **Document Type**: Pre-Merge Review Protocol & Conflict Prevention Strategy  
> **Target Audience**: AI Code Review Agents, Senior Developers, DevOps Engineers  
> **Last Updated**: 2025-10-03  

---

## 📋 Executive Summary

This document provides a comprehensive AI-powered merge review protocol designed to **prevent merge conflicts** before they occur when merging feature branches into the main branch. The protocol is based on 20 years of software architecture experience and leverages AI capabilities to perform deep structural analysis, dependency tracking, and proactive conflict detection.

---

## 🎯 Merge Review Objectives

### Primary Goals
1. **Zero-Conflict Merges**: Detect and resolve conflicts before merge attempts
2. **Architecture Consistency**: Ensure all branches follow established patterns
3. **Breaking Change Detection**: Identify API/interface changes that affect other features
4. **Code Quality Gates**: Verify testing, documentation, and standards compliance
5. **Dependency Integrity**: Track cross-feature dependencies and prevent circular references

### Success Criteria
- ✅ No merge conflicts during main branch integration
- ✅ All feature branches pass comprehensive compatibility checks
- ✅ Zero breaking changes without migration paths
- ✅ 100% test coverage for modified files (minimum 80% overall)
- ✅ Complete documentation for all new APIs/components

---

## 🏗️ Project Architecture Overview (Le Restaurant)

### Backend Architecture (Spring Boot - Layered)
```
backend/src/main/java/com/lerestaurant/le_restaurant_backend/
├── controller/     # REST API endpoints (@RestController, @RequestMapping)
│   ├── HealthController.java
│   ├── MenuController.java
│   ├── PaymentController.java
│   ├── UserController.java
│   └── [FeatureName]Controller.java
│
├── service/        # Business logic (@Service, @Transactional)
│   ├── MenuService.java
│   ├── PaymentService.java
│   ├── UserService.java
│   └── [FeatureName]Service.java
│
├── repository/     # Data access (@Repository, JpaRepository)
│   ├── MenuItemRepository.java
│   ├── PaymentRepository.java
│   ├── UserRepository.java
│   └── [FeatureName]Repository.java
│
├── entity/         # JPA entities (@Entity, @Table)
│   ├── MenuItem.java
│   ├── Payment.java
│   ├── User.java
│   └── [FeatureName].java
│
├── dto/            # Data Transfer Objects
│   ├── [Entity]Dto.java
│   ├── [Entity]CreateRequestDto.java
│   ├── [Entity]UpdateRequestDto.java
│   └── [Entity]ResponseDto.java
│
└── config/         # Configuration classes
    ├── SecurityConfig.java
    ├── CorsConfig.java
    └── DatabaseConfig.java
```

### Frontend Architecture (React - Atomic Design)
```
frontend/src/
├── components/
│   ├── atoms/          # Basic UI elements (Button, Input, Badge, StatusBadge)
│   ├── molecules/      # Composite components (MenuCard, PaymentForm, ReservationForm)
│   ├── organisms/      # Complex sections (Header, MenuGrid, PaymentManagementPanel)
│   ├── templates/      # Page layouts (MainLayout)
│   └── routes/         # Route guards (ProtectedRoute)
│
├── hooks/              # Custom React hooks (useUserApi, usePaymentApi, useMenuApi)
├── services/           # API client (api.ts with fetch wrapper)
├── contexts/           # React Context (AuthContext.tsx)
├── types/              # TypeScript types (user.ts, payment.ts, menu.ts)
├── pages/              # Page components (Home, DeliveryManagement, PaymentManagement)
└── utils/              # Utility functions
```

### Key Architectural Patterns
- **Backend**: Layered Architecture (Controller → Service → Repository → Entity)
- **Frontend**: Atomic Design (Atoms → Molecules → Organisms → Templates → Pages)
- **API**: RESTful with DTOs (never expose entities directly)
- **State Management**: React Context API + Custom Hooks
- **Testing**: JUnit 5 + Mockito (Backend), Vitest + React Testing Library (Frontend)

---

## 🔍 Pre-Merge Review Checklist (AI Agent Instructions)

### Phase 1: Initial Assessment (5 minutes)

#### 1.1 Branch Metadata Analysis
```prompt
ANALYZE the following about the feature branch:
- Branch name pattern: F[NUMBER][FEATURE_NAME] (e.g., F102USERMANAGEMENT, F106PAYMENTMANAGEMENT)
- Feature owner identification from README.md
- Last commit date and commit message quality
- Number of commits (prefer squashed/clean history)
- Divergence from main branch (commit count behind main)

OUTPUT FORMAT:
- Branch: [name]
- Feature: [feature description]
- Owner: [team member name]
- Commits: [count]
- Behind main by: [count] commits
- Status: [READY/NEEDS_REBASE/NEEDS_REVIEW]
```

#### 1.2 File Change Detection
```prompt
LIST all changed files and categorize by:

BACKEND CHANGES:
- Controllers modified: [list]
- Services modified: [list]
- Repositories modified: [list]
- Entities modified: [list]
- DTOs added/modified: [list]
- Config files changed: [list]

FRONTEND CHANGES:
- Atoms added/modified: [list]
- Molecules added/modified: [list]
- Organisms added/modified: [list]
- Hooks added/modified: [list]
- Types added/modified: [list]
- Services modified: [list]

CRITICAL FILES:
- SecurityConfig.java: [YES/NO]
- CorsConfig.java: [YES/NO]
- build.gradle: [YES/NO]
- package.json: [YES/NO]
- azure-pipelines.yml: [YES/NO]

RISK ASSESSMENT:
- High risk files modified: [count]
- Cross-feature dependencies: [list]
```

---

### Phase 2: Structural Integrity Check (10 minutes)

#### 2.1 Backend Layer Validation
```prompt
FOR EACH new/modified backend class, VERIFY:

CONTROLLERS:
✓ Follows naming: [Entity]Controller.java
✓ Has @RestController annotation
✓ Has @RequestMapping("/api/[resource]")
✓ Has @CrossOrigin(origins = "http://localhost:5173")
✓ Methods return ResponseEntity<Map<String, Object>>
✓ Uses DTOs in parameters/responses (NOT entities)
✓ Has error handling (try-catch with error maps)
✓ HTTP methods match REST conventions (GET, POST, PUT, DELETE)

SERVICES:
✓ Follows naming: [Entity]Service.java
✓ Has @Service annotation
✓ Uses @Transactional for data-modifying methods
✓ Uses constructor injection (@Autowired on constructor)
✓ Returns DTOs (NOT entities)
✓ Has proper validation logic
✓ Throws RuntimeException with descriptive messages

REPOSITORIES:
✓ Follows naming: [Entity]Repository.java
✓ Extends JpaRepository<Entity, ID>
✓ Has @Repository annotation
✓ Custom queries use @Query annotation
✓ Method names follow Spring Data conventions

ENTITIES:
✓ Has @Entity and @Table annotations
✓ Has @Id and @GeneratedValue
✓ Uses proper relationships (@OneToMany, @ManyToOne, etc.)
✓ Has @Column annotations with constraints
✓ Has proper equals() and hashCode()
✓ Uses snake_case for table/column names

DTOs:
✓ Follows naming: [Entity]Dto, [Entity]CreateRequestDto, [Entity]UpdateRequestDto
✓ Has validation annotations (@NotNull, @Email, etc.)
✓ Has no business logic (only data)
✓ Matches API contract in documentation

FLAG VIOLATIONS AS:
- [CRITICAL]: Must fix before merge
- [WARNING]: Should review with team
- [INFO]: Consider refactoring
```

#### 2.2 Frontend Component Validation
```prompt
FOR EACH new/modified frontend component, VERIFY:

ATOMS:
✓ Location: components/atoms/[ComponentName].tsx
✓ Export convention: export const [ComponentName]: React.FC
✓ Has proper TypeScript interface ([ComponentName]Props)
✓ No business logic (only presentation)
✓ Uses design system tokens (colors, spacing, typography)
✓ Has accessibility attributes (aria-*, role)

MOLECULES:
✓ Location: components/molecules/[ComponentName].tsx
✓ Export convention: export const [ComponentName]: React.FC
✓ Composes atoms properly
✓ Has local state only (no context/global state)
✓ Passes callbacks as props (no side effects)

ORGANISMS:
✓ Location: components/organisms/[ComponentName].tsx
✓ Export convention: export default [ComponentName]
✓ Can use context/hooks
✓ Handles business logic coordination
✓ Has loading/error states

HOOKS:
✓ Location: hooks/use[FeatureName]Api.ts
✓ Follows naming: use[Feature]Api (e.g., useUserApi, usePaymentApi)
✓ Returns { data, loading, error, ...methods }
✓ Handles API errors properly
✓ Uses services/api.ts for HTTP calls

TYPES:
✓ Location: types/[feature].ts
✓ Matches backend DTO structure
✓ Uses TypeScript enums for status fields
✓ Has proper documentation comments

FLAG VIOLATIONS AS:
- [CRITICAL]: Breaks Atomic Design pattern
- [WARNING]: Inconsistent with existing components
- [INFO]: Missing accessibility features
```

---

### Phase 3: Dependency & Conflict Analysis (15 minutes)

#### 3.1 Cross-Feature Dependency Detection
```prompt
ANALYZE dependencies between feature branches:

BACKEND DEPENDENCIES:
1. CHECK if new entities reference existing entities:
   - Does [NewEntity] have @ManyToOne/@OneToMany to existing entities?
   - Will this cause circular dependencies?
   - Are foreign key constraints properly defined?

2. CHECK if controllers share endpoints:
   - List all @RequestMapping paths in new controllers
   - Compare with existing controllers in main
   - Flag any path conflicts: [CONFLICT] /api/[path] exists in both

3. CHECK if services call other services:
   - List all @Autowired services in new code
   - Verify if those services exist in main
   - Check for circular service dependencies

4. CHECK database schema changes:
   - List new tables, columns, constraints
   - Check if changes conflict with other branches
   - Verify migration scripts are included

FRONTEND DEPENDENCIES:
1. CHECK if new components import shared components:
   - List all imports from atoms/molecules/organisms
   - Verify those components exist in main
   - Check for naming conflicts

2. CHECK if hooks share state/context:
   - List all useContext imports
   - Verify contexts exist and have correct shape
   - Check for context provider conflicts

3. CHECK if types are shared:
   - List all type imports from types/
   - Verify types exist in main
   - Check for type definition conflicts (same name, different shape)

4. CHECK API endpoint usage:
   - List all API calls in hooks/services
   - Verify endpoints exist in backend
   - Check if payload structures match DTOs

OUTPUT CONFLICT MATRIX:
Feature A | Feature B | Conflict Type | Severity | Resolution
----------|-----------|---------------|----------|------------
F102 User | F106 Pay  | Shared Entity | CRITICAL | Need Payment.userId FK
F106 Pay  | F109 Res  | API Path      | WARNING  | Different paths, OK
F109 Res  | F102 User | Type Conflict | CRITICAL | User type mismatch

RESOLUTION RECOMMENDATIONS:
[For each CRITICAL conflict, provide step-by-step resolution]
```

#### 3.2 Breaking Change Detection
```prompt
IDENTIFY potential breaking changes:

BACKEND BREAKING CHANGES:
1. Entity field removals/renames:
   - OLD: User.userName → NEW: User.username
   - IMPACT: Frontend uses userName in API calls
   - ACTION: Add migration + deprecation warning

2. DTO structure changes:
   - OLD: UserDto { name, email } → NEW: UserDto { firstName, lastName, email }
   - IMPACT: Frontend components expect single name field
   - ACTION: Create UserDtoV2 or add name computed field

3. API endpoint changes:
   - OLD: GET /api/users → NEW: GET /api/v1/users
   - IMPACT: All frontend API calls break
   - ACTION: Keep old endpoint with deprecation notice

4. Enum value changes:
   - OLD: UserStatus.ACTIVE → NEW: UserStatus.ENABLED
   - IMPACT: Frontend status checks fail
   - ACTION: Support both values temporarily

FRONTEND BREAKING CHANGES:
1. Component prop changes:
   - OLD: <MenuCard item={} onAdd={} /> → NEW: <MenuCard menuItem={} onAddToCart={} />
   - IMPACT: All pages using MenuCard break
   - ACTION: Keep old props as aliases

2. Hook return structure changes:
   - OLD: useUserApi() returns [users, loading]
   - NEW: useUserApi() returns { data, loading, error }
   - IMPACT: All components using hook break
   - ACTION: Use versioned hook names

3. Type definition changes:
   - OLD: User { id: string } → NEW: User { id: number }
   - IMPACT: Type errors everywhere
   - ACTION: Add migration guide

OUTPUT:
Breaking Changes: [count]
Migration Required: [YES/NO]
Backward Compatible: [YES/NO]
Deprecation Warnings Needed: [list]
```

---

### Phase 4: Testing & Quality Gates (20 minutes)

#### 4.1 Backend Test Coverage Analysis
```prompt
FOR EACH backend class modified/added, VERIFY:

CONTROLLER TESTS:
✓ Location: src/test/java/.../controller/[Entity]ControllerTest.java
✓ Uses @WebMvcTest([Entity]Controller.class)
✓ Mocks service layer with @MockBean
✓ Tests ALL endpoints (GET, POST, PUT, DELETE)
✓ Tests success cases (200, 201, 204)
✓ Tests error cases (400, 404, 500)
✓ Uses MockMvc for HTTP simulation
✓ Asserts response structure and content

REQUIRED TESTS PER CONTROLLER:
- createEntity_WithValidData_ReturnsCreated
- createEntity_WithInvalidData_ReturnsBadRequest
- getEntityById_WithValidId_ReturnsEntity
- getEntityById_WithInvalidId_ReturnsNotFound
- updateEntity_WithValidData_ReturnsUpdated
- updateEntity_WithInvalidId_ReturnsNotFound
- deleteEntity_WithValidId_ReturnsNoContent
- deleteEntity_WithInvalidId_ReturnsNotFound
- getAllEntities_ReturnsEntityList

SERVICE TESTS:
✓ Location: src/test/java/.../service/[Entity]ServiceTest.java
✓ Uses @ExtendWith(MockitoExtension.class)
✓ Mocks repository with @Mock
✓ Injects service with @InjectMocks
✓ Tests business logic thoroughly
✓ Tests validation rules
✓ Tests exception handling
✓ Tests transactional behavior

COVERAGE REQUIREMENTS:
- Minimum 80% line coverage (ENFORCED by JaCoCo)
- 100% for new controller methods
- 100% for new service methods
- All edge cases covered

RUN VERIFICATION:
cd backend
./gradlew test jacocoTestReport
EXPECTED: BUILD SUCCESSFUL, all tests pass

FLAG IF:
- [CRITICAL] Coverage < 80%
- [CRITICAL] Any test failures
- [WARNING] Missing tests for new methods
- [INFO] Coverage < 90% (aim for excellence)
```

#### 4.2 Frontend Test Coverage Analysis
```prompt
FOR EACH frontend component modified/added, VERIFY:

COMPONENT TESTS:
✓ Location: src/components/[category]/__tests__/[Component].test.tsx
✓ Uses Vitest + React Testing Library
✓ Mocks API hooks with vi.mock()
✓ Tests rendering in different states
✓ Tests user interactions (click, type, submit)
✓ Tests loading states
✓ Tests error states
✓ Tests accessibility (screen.getByRole)

REQUIRED TESTS PER COMPONENT:
- renders_WithValidProps_DisplaysCorrectly
- handles_UserInteraction_CallsCallbackCorrectly
- shows_LoadingState_WhenDataIsLoading
- shows_ErrorState_WhenErrorOccurs
- updates_OnPropChange_RendersNewData
- is_Accessible_WithProperAriaLabels

HOOK TESTS:
✓ Tests custom hooks in isolation
✓ Uses @testing-library/react-hooks
✓ Tests loading → success flow
✓ Tests loading → error flow
✓ Tests retry mechanisms
✓ Tests state management

COVERAGE REQUIREMENTS:
- Minimum 80% line coverage (ENFORCED by vitest.config.ts)
- 100% for new organisms/pages
- 100% for new hooks
- All user interactions covered

RUN VERIFICATION:
cd frontend
npm run test:coverage
EXPECTED: All tests pass, coverage > 80%

FLAG IF:
- [CRITICAL] Coverage < 80%
- [CRITICAL] Any test failures
- [WARNING] Missing interaction tests
- [INFO] Missing accessibility tests
```

---

### Phase 5: Documentation & Standards Compliance (10 minutes)

#### 5.1 API Documentation Check
```prompt
FOR EACH new REST endpoint, VERIFY:

BACKEND DOCUMENTATION:
✓ Endpoint documented in API spec (design-plan-reference/04-api-specification.md)
✓ Request payload structure documented
✓ Response structure documented
✓ Error codes documented (400, 401, 403, 404, 500)
✓ Authentication requirements specified
✓ Example requests/responses provided

REQUIRED DOCUMENTATION SECTIONS:
### [HTTP_METHOD] [ENDPOINT_PATH]
**Description**: [What the endpoint does]

**Authentication**: [Required/Not Required]

**Request Body**:
```json
{
  "field": "type",
  ...
}
```

**Response (Success)**:
```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

**Error Codes**:
- 400: [When this occurs]
- 404: [When this occurs]
- 500: [When this occurs]

FRONTEND DOCUMENTATION:
✓ New components documented in frontend-view-explain-doc.md
✓ Component purpose explained
✓ Props interface documented
✓ Usage examples provided
✓ Feature interactions described

FLAG IF:
- [CRITICAL] New API endpoint without documentation
- [CRITICAL] Public component without documentation
- [WARNING] Missing usage examples
- [INFO] Could use more detailed examples
```

#### 5.2 Naming Conventions Verification
```prompt
VERIFY all new code follows naming conventions from:
Actual-design-plan/coding-standards/naming-conventions-dictionary.md

BACKEND NAMING:
✓ Classes: PascalCase with type suffix (UserController, UserService, UserRepository)
✓ Methods: camelCase, verb-noun pattern (createUser, getUserById, deleteUser)
✓ DTOs: [Entity][Operation]RequestDto or [Entity]Dto
✓ Entities: PascalCase matching table name
✓ Database: snake_case for tables/columns (user_id, created_at)

FRONTEND NAMING:
✓ Components: PascalCase (UserManagementPanel, CartSidebar)
✓ Files: Match component name (UserManagementPanel.tsx)
✓ Hooks: use prefix + camelCase (useUserApi, usePaymentApi)
✓ Types: PascalCase (UserDto, PaymentStatus)
✓ Constants: UPPER_SNAKE_CASE (API_BASE_URL)

FLAG VIOLATIONS:
- [CRITICAL] Controller without "Controller" suffix
- [CRITICAL] Hook without "use" prefix
- [WARNING] Inconsistent casing
- [INFO] Could be more descriptive
```

---

### Phase 6: Merge Conflict Simulation (15 minutes)

#### 6.1 Pre-Merge Simulation
```prompt
SIMULATE the merge operation BEFORE actual merge:

STEP 1: Create local merge simulation
git checkout main
git pull origin main
git checkout -b merge-test-[FEATURE_BRANCH]
git merge [FEATURE_BRANCH] --no-commit --no-ff

STEP 2: Analyze merge output
CONFLICTS DETECTED:
- [List all conflicting files]
- [Show conflict markers <<<<<, =====, >>>>>]
- [Categorize by type: code, config, documentation]

STEP 3: Conflict resolution strategy
FOR EACH CONFLICT:
File: [path/to/file]
Conflict Type: [Code/Config/Docs]
Sections in Conflict:
  - Feature Branch: [code snippet]
  - Main Branch: [code snippet]
Resolution Strategy:
  - [KEEP_FEATURE]: Use feature branch version
  - [KEEP_MAIN]: Use main branch version
  - [MERGE_BOTH]: Combine both versions
  - [MANUAL_REVIEW]: Needs human decision

STEP 4: Automated resolution where possible
IF conflict_type == "Config" AND safe_to_merge:
  MERGE both configurations
ELSE IF conflict_type == "Import" AND no_overlap:
  KEEP both imports
ELSE:
  FLAG for manual review

OUTPUT MERGE PLAN:
Total Files Changed: [count]
Files with Conflicts: [count]
Auto-Resolvable: [count]
Manual Review Required: [count]
Estimated Resolution Time: [minutes]
```

#### 6.2 Integration Test Simulation
```prompt
AFTER resolving conflicts, VERIFY integration:

BACKEND INTEGRATION:
1. Run all tests from main + feature branch
   cd backend
   ./gradlew clean test
   EXPECTED: All tests pass (main + feature)

2. Start application
   ./gradlew bootRun
   EXPECTED: Starts without errors, all endpoints accessible

3. Test cross-feature scenarios:
   - If feature A uses feature B's entity, test the relationship
   - If feature A calls feature B's service, test the call
   - If feature A depends on feature B's data, test data flow

FRONTEND INTEGRATION:
1. Run all tests from main + feature branch
   cd frontend
   npm run test
   EXPECTED: All tests pass (main + feature)

2. Build application
   npm run build
   EXPECTED: Builds without errors or warnings

3. Start development server
   npm run dev
   EXPECTED: Starts without errors, all pages accessible

4. Test cross-feature scenarios:
   - If component A uses component B, test composition
   - If hook A calls hook B's context, test context flow
   - If page A routes to page B, test navigation

FLAG IF:
- [CRITICAL] Tests fail after merge
- [CRITICAL] Application won't start
- [CRITICAL] Build errors
- [WARNING] New warnings introduced
```

---

## 🚨 Merge Conflict Prevention Strategies

### Strategy 1: Frequent Rebasing
```bash
# Feature branch owners should rebase DAILY
git checkout [FEATURE_BRANCH]
git fetch origin main
git rebase origin/main

# Resolve conflicts incrementally
# Easier than big bang merge at the end
```

### Strategy 2: Feature Branch Communication Protocol
```markdown
BEFORE starting work on shared areas:
1. Post in team channel: "Working on [Component/Service]"
2. Check if anyone else is modifying it
3. Coordinate changes to avoid conflicts

SHARED AREAS (High Conflict Risk):
- SecurityConfig.java
- CorsConfig.java
- AuthContext.tsx
- api.ts
- types/ directory
- Header.tsx (many features add menu items)
```

### Strategy 3: Modular Feature Design
```
DESIGN features to minimize overlap:

GOOD EXAMPLE (Low Conflict Risk):
F106 Payment Management:
  - PaymentController (new file)
  - PaymentService (new file)
  - PaymentRepository (new file)
  - Payment entity (new file)
  - PaymentManagementPanel (new component)
  
F109 Reservation Management:
  - ReservationController (new file)
  - ReservationService (new file)
  - ReservationRepository (new file)
  - Reservation entity (new file)
  - ReservationManagementPanel (new component)

CONFLICT: None! Completely separate modules.

BAD EXAMPLE (High Conflict Risk):
F102 User Management:
  - Modifies SecurityConfig.java (auth rules)
  
F106 Payment Management:
  - Modifies SecurityConfig.java (payment endpoints)

CONFLICT: Both modify same file!
SOLUTION: Coordinate SecurityConfig changes, merge one at a time.
```

### Strategy 4: API Versioning for Breaking Changes
```java
// Instead of modifying existing endpoint
@GetMapping("/users")  // Keep old version

// Add new versioned endpoint
@GetMapping("/v2/users")  // New version with changes

// Deprecate old version after transition period
@Deprecated
@GetMapping("/users")
```

---

## 📊 Merge Readiness Scorecard

### Scoring System (100 points total)

| Category | Points | Criteria |
|----------|--------|----------|
| **Structural Compliance** | 20 | All files follow architecture patterns |
| **Test Coverage** | 20 | ≥80% coverage, all tests pass |
| **Documentation** | 15 | API docs, component docs complete |
| **Naming Standards** | 10 | All conventions followed |
| **Dependency Safety** | 15 | No circular dependencies, conflicts resolved |
| **Breaking Changes** | 10 | No breaking changes OR migration plan |
| **Code Quality** | 10 | No critical lint errors, clean code |

### Merge Decision Matrix

| Score | Decision | Action Required |
|-------|----------|-----------------|
| 90-100 | **APPROVE** | Ready to merge immediately |
| 75-89 | **APPROVE WITH NOTES** | Merge allowed, address notes in follow-up |
| 60-74 | **REQUEST CHANGES** | Fix critical issues, re-review |
| < 60 | **REJECT** | Major rework needed, schedule architecture review |

---

## 🤖 AI Agent Merge Review Template

### Complete Review Output Format

```markdown
# Merge Review Report: [FEATURE_BRANCH_NAME]

## 📊 Executive Summary
- **Branch**: F[NUMBER][FEATURE_NAME]
- **Feature Owner**: [Name]
- **Merge Readiness Score**: [0-100] / 100
- **Decision**: [APPROVE / APPROVE WITH NOTES / REQUEST CHANGES / REJECT]
- **Estimated Merge Time**: [minutes]

---

## ✅ Phase 1: Initial Assessment (PASS/FAIL)
- [ ] Branch follows naming convention: F[NUMBER][FEATURE_NAME]
- [ ] Branch is up-to-date with main (or < 5 commits behind)
- [ ] Commit history is clean (squashed or logical commits)
- [ ] No merge commits in feature branch

**Files Changed**:
- Backend: [count] files
- Frontend: [count] files
- Config: [count] files
- Tests: [count] files

---

## ✅ Phase 2: Structural Integrity (PASS/FAIL)

### Backend Structure
- [ ] All controllers follow pattern: [Entity]Controller.java
- [ ] All services follow pattern: [Entity]Service.java
- [ ] All repositories follow pattern: [Entity]Repository.java
- [ ] All DTOs follow pattern: [Entity]Dto / [Entity]CreateRequestDto
- [ ] Entities use @Entity, @Table, @Id correctly
- [ ] Controllers use DTOs (never expose entities)
- [ ] Services use @Transactional for data modification
- [ ] Error handling present in controllers

**Violations**: [List any violations with severity]

### Frontend Structure
- [ ] Atoms in components/atoms/ with named exports
- [ ] Molecules in components/molecules/ with named exports
- [ ] Organisms in components/organisms/ with default exports
- [ ] Hooks follow use[Feature]Api pattern
- [ ] Types in types/ directory match backend DTOs
- [ ] Components have proper TypeScript interfaces

**Violations**: [List any violations with severity]

---

## ⚠️ Phase 3: Dependency & Conflict Analysis (CRITICAL/WARNING/OK)

### Cross-Feature Dependencies
**Entity Relationships**:
- [List any new foreign key relationships]
- [Flag circular dependencies]

**API Endpoint Conflicts**:
- [List any conflicting endpoint paths]
- [Resolution: rename or version endpoints]

**Component Dependencies**:
- [List shared component usage]
- [Flag if components don't exist in main]

**Type Conflicts**:
- [List type definition conflicts]
- [Resolution: merge types or use namespaces]

### Conflict Simulation Results
```bash
git merge --no-commit [FEATURE_BRANCH]
```
**Conflicts Detected**: [YES/NO]
**Conflicting Files**: [count]
- [List files with conflicts]

**Auto-Resolvable**: [count] files
**Manual Review Required**: [count] files

---

## 🔬 Phase 4: Testing & Quality (PASS/FAIL)

### Backend Tests
```bash
cd backend && ./gradlew test jacocoTestReport
```
- [ ] All tests pass
- [ ] Coverage ≥ 80% (JaCoCo enforced)
- [ ] New controllers have tests (min 9 tests each)
- [ ] New services have tests (all methods covered)

**Test Results**:
- Total Tests: [count]
- Passed: [count]
- Failed: [count]
- Coverage: [percentage]%

**Missing Tests**: [List any untested methods]

### Frontend Tests
```bash
cd frontend && npm run test:coverage
```
- [ ] All tests pass
- [ ] Coverage ≥ 80% (Vitest enforced)
- [ ] New organisms have tests (min 10 tests each)
- [ ] New hooks have tests (all scenarios covered)

**Test Results**:
- Total Tests: [count]
- Passed: [count]
- Failed: [count]
- Coverage: [percentage]%

**Missing Tests**: [List any untested components]

---

## 📚 Phase 5: Documentation (COMPLETE/INCOMPLETE)

### API Documentation
- [ ] New endpoints documented in 04-api-specification.md
- [ ] Request/response structures defined
- [ ] Error codes documented
- [ ] Authentication requirements specified
- [ ] Usage examples provided

**Missing Documentation**: [List undocumented APIs]

### Component Documentation
- [ ] New components documented in frontend-view-explain-doc.md
- [ ] Props interfaces explained
- [ ] Usage examples provided
- [ ] Feature interactions described

**Missing Documentation**: [List undocumented components]

---

## 🏷️ Phase 6: Naming Standards (COMPLIANT/NON-COMPLIANT)

### Backend Naming Review
- [ ] Controllers: [Entity]Controller pattern
- [ ] Services: [Entity]Service pattern
- [ ] Methods: camelCase, verb-noun pattern
- [ ] DTOs: [Entity]Dto / [Entity]CreateRequestDto pattern
- [ ] Database: snake_case for tables/columns

**Violations**: [List naming violations]

### Frontend Naming Review
- [ ] Components: PascalCase
- [ ] Hooks: use[Feature]Api pattern
- [ ] Files: Match component names
- [ ] Types: PascalCase

**Violations**: [List naming violations]

---

## 💥 Breaking Changes Analysis (NONE/DOCUMENTED/CRITICAL)

### Identified Breaking Changes
[If none, write "No breaking changes detected"]

[If present, list each one with:]
1. **Change Description**: [What changed]
2. **Impact**: [What breaks]
3. **Migration Path**: [How to fix]
4. **Deprecation Timeline**: [When old version removed]

---

## 🎯 Merge Decision & Recommendations

### Final Score Breakdown
- Structural Compliance: [0-20] / 20
- Test Coverage: [0-20] / 20
- Documentation: [0-15] / 15
- Naming Standards: [0-10] / 10
- Dependency Safety: [0-15] / 15
- Breaking Changes: [0-10] / 10
- Code Quality: [0-10] / 10

**TOTAL SCORE**: [0-100] / 100

### Decision: [APPROVE / APPROVE WITH NOTES / REQUEST CHANGES / REJECT]

### Action Items (if not approved)
1. [Specific action required]
2. [Specific action required]
3. [Specific action required]

### Merge Command (if approved)
```bash
git checkout main
git pull origin main
git merge [FEATURE_BRANCH] --no-ff
git push origin main
```

---

## 👥 Human Review Required For
- [ ] Architecture changes affecting multiple features
- [ ] Database schema modifications
- [ ] Security configuration changes
- [ ] Breaking changes affecting frontend-backend contract
- [ ] Performance-critical code paths

---

**Review Completed By**: AI Merge Agent v1.0  
**Review Date**: [ISO 8601 timestamp]  
**Review Duration**: [minutes]  
**Next Steps**: [What to do next]

```

---

## 🔄 Continuous Integration with Azure DevOps

### Pipeline Integration

The merge review process should be integrated into Azure Pipelines:

```yaml
# azure-pipelines-merge-review.yml
trigger:
  branches:
    include:
      - F*  # All feature branches

stages:
  - stage: MergeReview
    displayName: 'AI-Powered Merge Review'
    jobs:
      - job: StructuralAnalysis
        displayName: 'Structural Integrity Check'
        steps:
          - script: |
              # Run AI merge review agent
              python scripts/ai_merge_review.py --branch $(Build.SourceBranch)
            displayName: 'Run Merge Review'
          
          - task: PublishTestResults@2
            displayName: 'Publish Review Results'
            inputs:
              testResultsFormat: 'JUnit'
              testResultsFiles: '**/merge-review-results.xml'
      
      - job: ConflictSimulation
        displayName: 'Merge Conflict Simulation'
        steps:
          - script: |
              git fetch origin main
              git merge origin/main --no-commit --no-ff || echo "Conflicts detected"
            displayName: 'Simulate Merge'
          
          - script: |
              if [ -f .git/MERGE_HEAD ]; then
                echo "##vso[task.logissue type=error]Merge conflicts detected!"
                git merge --abort
                exit 1
              fi
            displayName: 'Check for Conflicts'

  - stage: QualityGates
    dependsOn: MergeReview
    condition: succeeded()
    jobs:
      - job: BackendTests
        steps:
          - task: Gradle@2
            inputs:
              tasks: 'test jacocoTestReport jacocoTestCoverageVerification'
      
      - job: FrontendTests
        steps:
          - script: |
              cd frontend
              npm run test:coverage
```

---

## 📞 Escalation Protocol

### When to Escalate to Human Review

1. **Critical Conflicts** (Escalate Immediately)
   - SecurityConfig.java modifications from multiple branches
   - Database schema changes that affect existing data
   - API versioning breaking changes
   - CORS policy changes affecting multiple features

2. **Architecture Decisions** (Escalate for Discussion)
   - New design patterns introduced
   - Major dependency additions
   - Cross-cutting concerns (logging, authentication, etc.)
   - Performance-critical paths

3. **Business Logic Complexity** (Escalate for Validation)
   - Complex business rules
   - Financial calculations
   - User permissions logic
   - Data privacy concerns

### Escalation Channels
- **Slack**: #le-restaurant-merges
- **Email**: tech-leads@lerestaurant.com
- **Meeting**: Daily standup or emergency architecture review

---

## 📚 Reference Materials

### Key Documents
1. `Actual-design-plan/system-architecture/architecture-overview.md`
2. `Actual-design-plan/coding-standards/naming-conventions-dictionary.md`
3. `design-plan-reference/04-api-specification.md`
4. `frontend/frontend-view-explain-doc.md`
5. `TEST_STRATEGY.md`

### Team Contacts
- **F102 User Management**: [Owner Name]
- **F106 Payment Management**: [Owner Name]
- **F109 Reservation Management**: [Owner Name]

### Tool Versions
- **Java**: 17
- **Spring Boot**: 3.5.5
- **Gradle**: 8.14.3
- **Node.js**: 18+
- **React**: 18
- **TypeScript**: 5.x

---

## 🎓 Best Practices Summary

### For Feature Branch Developers

1. **Start Clean**
   - Create branch from latest main
   - Follow naming: F[NUMBER][FEATURE]

2. **Develop Modularly**
   - Minimize modifications to shared files
   - Create new files instead of editing existing
   - Use dependency injection to avoid tight coupling

3. **Test Continuously**
   - Write tests as you develop
   - Run tests before committing
   - Maintain 80%+ coverage

4. **Document Thoroughly**
   - Update API docs for new endpoints
   - Document new components
   - Add usage examples

5. **Communicate Early**
   - Announce work on shared components
   - Coordinate with other feature owners
   - Ask questions before making assumptions

6. **Rebase Frequently**
   - Rebase daily from main
   - Resolve conflicts incrementally
   - Keep branch up-to-date

7. **Pre-Merge Check**
   - Run full test suite
   - Run merge simulation locally
   - Address all warnings
   - Review your own PR first

---

## 🚀 Future Enhancements

### Phase 1 (Current)
- Manual AI-assisted merge review
- Conflict simulation
- Test coverage verification

### Phase 2 (Planned)
- Automated merge review on PR creation
- AI-suggested conflict resolutions
- Performance regression detection
- Security vulnerability scanning

### Phase 3 (Future)
- Predictive conflict detection (before conflicts occur)
- Auto-merge for low-risk changes
- Machine learning-based merge confidence scoring
- Automated rollback on production issues

---

**Document Version**: 1.0  
**Last Updated**: 2025-10-03  
**Next Review Date**: 2025-11-03  
**Maintained By**: Senior Architecture Team  
**Status**: Active - Production Use
