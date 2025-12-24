# 🔍 AI-Powered Merge Review & Conflict Prevention Guide

> **Primary Goal**: Enable ALL 10 features (F100-F109) to merge to main **WITHOUT conflicts**  
> **Document Type**: ZERO-CONFLICT Merge Protocol with Predictive Conflict Detection  
> **Target Audience**: AI Coding Assistants (GitHub Copilot), Team Developers  
> **Version**: 1.1 (Team-Enabled with Conflict Prediction)  
> **Last Updated**: 2025-10-03  

---

## 🎯 AI Quick Reference - Read This First

**When developer asks: "Merge my feature branch to main"**

### Step 1: Identify Feature & Owner (2 seconds)
```
Feature: F[100-109] from branch name
Owner: Check "Feature Ownership Table" in Section 1.2
```

### Step 2: Check Shared File Conflicts (5 seconds)
```
Scan "Critical Shared Files Matrix" in Section 2.3
Files to watch: SecurityConfig.java, AuthContext.tsx, Header.tsx, User.java
```

### Step 3: Check Feature Conflicts (5 seconds)
```
Scan "Feature Conflict Matrix" in Section 3.4
Look for: CRITICAL or HIGH severity conflicts with this feature
```

### Step 4: Decision Tree
```
✅ NO CONFLICTS FOUND → Proceed to 6-Phase Review (Sections 4-9)
⚠️ LOW/MEDIUM CONFLICTS → Proceed with caution, notify developer
🔴 HIGH/CRITICAL CONFLICTS → STOP! Request coordination with other owner
```

### Step 5: Execute & Score
```
Run Phases 1-6 → Calculate Score (0-100) → Decision:
- Score ≥ 90 + No conflicts = APPROVE
- Score 70-89 + No CRITICAL conflicts = APPROVE WITH CONDITIONS  
- Score < 70 OR CRITICAL conflicts = REJECT + Provide coordination plan
```

---

## 📋 Executive Summary

This document provides a comprehensive AI-powered merge review protocol designed to **prevent merge conflicts** before they occur when merging feature branches into the main branch. The protocol uses predictive conflict detection across 10 features (F100-F109) managed by 5 developers, with automated identification of shared file conflicts and feature interaction risks.

---

## 🚀 Quick Start for Team Members

### For Individual Feature Developers

**Before you start merging your feature to main, follow these steps:**

1. **Identify Your Feature**
   ```
   Your Feature Number: F[100-109]
   Your Name: [Check table below]
   Your Branch: F[NUMBER][FEATURENAME]
   ```

2. **Run Pre-Merge Checklist with AI**
   ```markdown
   Ask your AI assistant:
   "Based on 06-Merge-review-prompt.md, review my feature branch F[YOUR_NUMBER] 
   for merging into main. I am [YOUR_NAME] working on [FEATURE_NAME]."
   ```

3. **AI Will Check**
   - ✅ Your code follows architecture patterns
   - ✅ No conflicts with other features
   - ✅ Tests are passing (80%+ coverage)
   - ✅ Documentation is complete
   - ✅ Ready to merge safely

4. **Execute Merge**
   ```bash
   # AI will guide you through:
   git checkout main
   git pull origin main
   git merge F[YOUR_NUMBER][FEATURE] --no-ff
   git push origin main
   ```

### Team Feature Assignments

| Owner | Features | Potential Conflicts With |
|-------|----------|--------------------------|
| **Junayeed Halim** | F100 (Registration), F101 (Authentication) | ⚠️ Jungwook (F102 User Mgmt - AuthContext) |
| **Jungwook Van** | F102 (User Mgmt), F106 (Payment) | ⚠️ Junayeed (F101 Auth), Damaq (F105 Order) |
| **Mikhail Zhelnin** | F103 (Menu Display), F104 (Menu Mgmt) | ⚠️ Damaq (F105 Order - MenuItem FK) |
| **Damaq Zain** | F105 (Order), F108 (Reservation) | ⚠️ Jungwook (F106 Payment), Aaron (F107, F109) |
| **Aaron Urayan** | F107 (Delivery), F109 (Res Mgmt) | ⚠️ Damaq (F108 Reservation) |

### Coordination Protocol

**High-Priority Coordination Required:**
1. **Junayeed ↔ Jungwook**: AuthContext.tsx structure
2. **Jungwook ↔ Damaq**: Order-Payment relationship (orderId FK)
3. **Mikhail ↔ Damaq**: MenuItem in Order entity
4. **Aaron ↔ Damaq**: Reservation entity structure, Header.tsx navigation

**When to Communicate:**
- 🔴 **Before starting**: Post in team channel when working on shared files
- 🟡 **During development**: Coordinate if modifying SecurityConfig, AuthContext, Header
- 🟢 **Before merge**: Run AI review and share results with conflicting feature owners

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

## � Critical Shared Files Matrix (Check FIRST for Conflicts)

**AI: Scan this matrix BEFORE starting Phase 1 review**

### Backend Shared Files (High Conflict Risk)

| File Path | Features Using It | Conflict Type | Coordination Required |
|-----------|-------------------|---------------|----------------------|
| `SecurityConfig.java` | F100, F101, F102, F106 | Authentication & Authorization | ✅ Junayeed + Jungwook must coordinate |
| `User.java` (Entity) | F100, F101, F102 | User model structure | ✅ Junayeed + Jungwook must coordinate |
| `MenuItem.java` (Entity) | F103, F104, F105 | Menu-Order relationship | ✅ Mikhail + Damaq must coordinate |
| `Order.java` (Entity) | F105, F106, F108 | Order-Payment-Reservation FK | ✅ Damaq + Jungwook must coordinate |
| `Payment.java` (Entity) | F105, F106 | Payment fields & orderId FK | ✅ Damaq + Jungwook CRITICAL |
| `Reservation.java` (Entity) | F107, F108, F109 | Reservation structure | ✅ Aaron + Damaq must coordinate |
| `CorsConfig.java` | ALL (F100-F109) | CORS policy | ⚠️ Low risk - additive changes only |
| `application.properties` | ALL (F100-F109) | Database/Port config | ⚠️ Low risk - usually no conflicts |

### Frontend Shared Files (High Conflict Risk)

| File Path | Features Using It | Conflict Type | Coordination Required |
|-----------|-------------------|---------------|----------------------|
| `AuthContext.tsx` | F100, F101, F102 | Auth state management | ✅ Junayeed + Jungwook CRITICAL |
| `Header.tsx` | F102, F105, F107, F108, F109 | Navigation links | ✅ All managers coordinate |
| `api.ts` (services) | ALL (F100-F109) | API base URL & helpers | ⚠️ Low risk - additive changes |
| `App.tsx` | F100-F109 | Route definitions | ⚠️ Medium risk - new routes OK |
| `types/user.ts` | F100, F101, F102 | User TypeScript types | ✅ Junayeed + Jungwook must sync |
| `types/order.ts` | F105, F106 | Order TypeScript types | ✅ Damaq + Jungwook must sync |
| `types/reservation.ts` | F107, F108, F109 | Reservation types | ✅ Aaron + Damaq must sync |

### AI Conflict Detection Rules

**When feature branch touches these files:**

1. **CRITICAL FILES** (Stop & Coordinate):
   - `SecurityConfig.java` → Check if F100, F101, F102, or F106 in progress
   - `AuthContext.tsx` → Check if F100, F101, or F102 in progress
   - `Payment.java` OR `Order.java` → Check if F105 or F106 in progress

2. **HIGH-RISK FILES** (Review Changes Carefully):
   - `Header.tsx` → Check if any manager features (F102, F104, F105, F107, F109) in progress
   - Entity files (`User.java`, `MenuItem.java`, `Reservation.java`) → Check related features

3. **SAFE FILES** (Low Conflict Risk):
   - New controller files (e.g., `PaymentController.java`)
   - New component files (e.g., `PaymentManagementPanel.tsx`)
   - New service files (feature-specific)
   - Test files (usually isolated)

**AI Decision Logic:**
```
IF feature touches CRITICAL file:
  → CHECK if other feature owner has open PR/branch
  → IF yes: REJECT merge, request coordination
  → IF no: Proceed with caution

IF feature touches HIGH-RISK file:
  → ANALYZE changes (additive vs. modifying)
  → IF modifying existing code: Request review
  → IF only adding new code: Proceed

IF feature only touches SAFE files:
  → Fast-track review (lower scrutiny)
```

---

## �🔍 Pre-Merge Review Checklist (AI Agent Instructions)

### Phase 1: Initial Assessment (5 minutes)

#### 1.1 Branch Metadata Analysis
```prompt
ANALYZE the following about the feature branch:
- Branch name pattern: F[NUMBER][FEATURE_NAME] (e.g., F102USERMANAGEMENT, F106PAYMENTMANAGEMENT)
- Feature owner identification (see table below)
- Last commit date and commit message quality
- Number of commits (prefer squashed/clean history)
- Divergence from main branch (commit count behind main)

FEATURE OWNERSHIP TABLE:
| Feature # | Name | Description | Owner |
|-----------|------|-------------|-------|
| F100 | User Registration | Customers create account with email/password | Junayeed Halim |
| F101 | User Authentication | Login system for registered customers | Junayeed Halim |
| F102 | User Management (Manager) | Managers view/edit/delete customer accounts | Jungwook Van |
| F103 | Menu Display | View items by category, search, filter | Mikhail Zhelnin |
| F104 | Menu Management (Manager) | Create/update/delete menu items | Mikhail Zhelnin |
| F105 | Order Management | Create orders with payment and confirmation | Damaq Zain |
| F106 | Payment Management | Handle payments and transaction processing | Jungwook Van |
| F107 | Delivery Management | Manage deliveries, track status, assign drivers | Aaron Urayan |
| F108 | Table Reservation | Customers book tables with availability check | Damaq Zain |
| F109 | Reservation Management | Managers approve/deny/manage reservations | Aaron Urayan |

OUTPUT FORMAT:
- Branch: [name]
- Feature: [feature description from table]
- Owner: [team member name from table]
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

OUTPUT: AI CONFLICT DETECTION MATRIX (Priority-Sorted)

### 🔴 CRITICAL CONFLICTS (Must Coordinate Before Merge)

| Feature A | Feature B | Conflict Point | Action Required | Owner A | Owner B |
|-----------|-----------|----------------|-----------------|---------|---------|
| F105 Order | F106 Payment | `Payment.java` needs `orderId` FK | ⚠️ Damaq merge F105 first, then Jungwook adds orderId in F106 | Damaq Zain | Jungwook Van |
| F101 Auth | F102 User Mgmt | `AuthContext.tsx` state structure | ⚠️ Junayeed & Jungwook sync on user state shape before merging | Junayeed Halim | Jungwook Van |
| F100 Registration | F102 User Mgmt | `User.java` entity fields | ⚠️ Junayeed defines base fields, Jungwook adds manager fields | Junayeed Halim | Jungwook Van |
| F102 User | F106 Payment | `User.java` needs `userId` for Payment FK | ⚠️ Jungwook owns both - coordinate in single session | Jungwook Van | Jungwook Van |

**AI Decision:** IF current feature is in CRITICAL conflict → **REJECT merge** → Request coordination call

### 🟡 HIGH CONFLICTS (Review Changes Carefully)

| Feature A | Feature B | Conflict Point | Action Required | Owner A | Owner B |
|-----------|-----------|----------------|-----------------|---------|---------|
| F103 Menu | F105 Order | `Order.java` needs `menuItemId` FK | ⚠️ Mikhail merge F103 first, Damaq references MenuItem | Mikhail Zhelnin | Damaq Zain |
| F107 Delivery | F108 Reservation | `Header.tsx` navigation links | ⚠️ Aaron & Damaq coordinate on menu item order | Aaron Urayan | Damaq Zain |
| F108 Reservation | F109 Res Mgmt | `Reservation.java` entity structure | ⚠️ Damaq defines customer fields, Aaron adds manager fields | Damaq Zain | Aaron Urayan |

**AI Decision:** IF current feature is in HIGH conflict → **PROCEED WITH CAUTION** → Add warning message

### 🟢 LOW CONFLICTS (Same Owner - Easy Coordination)

| Feature A | Feature B | Conflict Point | Resolution | Owner |
|-----------|-----------|----------------|------------|-------|
| F100 Registration | F101 Auth | `User.java` & `AuthContext` | Same developer - merge in sequence | Junayeed Halim |
| F103 Menu Display | F104 Menu Mgmt | `MenuItem.java` & `MenuService` | Same developer - shared understanding | Mikhail Zhelnin |
| F107 Delivery | F109 Res Mgmt | `Header.tsx` manager menu | Same developer - consistent navigation | Aaron Urayan |

**AI Decision:** IF current feature is in LOW conflict (same owner) → **APPROVE** → Note coordination

---

### AI Conflict Resolution Workflow

**For CRITICAL Conflicts:**
```
1. IDENTIFY conflicting features from matrix
2. CHECK if other feature already merged to main:
   - IF YES: Current feature must adapt to merged changes
   - IF NO: STOP merge, request coordination meeting
3. PROVIDE coordination script:
   "⚠️ F[X] conflicts with F[Y] on [FILE]. Contact [OWNER_Y] before merging."
4. SUGGEST merge order:
   "Recommended: Merge F[X] first (has base entity), then F[Y] (has FK)"
```

**For HIGH Conflicts:**
```
1. ANALYZE change type:
   - Additive changes (new fields/methods) → Lower risk
   - Modifying changes (rename/remove) → Higher risk
2. IF additive only: APPROVE with monitoring
3. IF modifying: REQUEST review from other owner
```

**For LOW Conflicts:**
```
1. NOTE in merge report: "Same owner as F[X]"
2. SUGGEST: "Consider merging F[X] and F[Y] together for consistency"
3. APPROVE merge
```

RESOLUTION RECOMMENDATIONS:
[AI will auto-generate specific steps based on detected conflicts]
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
F106 Payment Management (Jungwook Van):
  - PaymentController (new file)
  - PaymentService (new file)
  - PaymentRepository (new file)
  - Payment entity (new file)
  - PaymentManagementPanel (new component)
  
F109 Reservation Management (Aaron Urayan):
  - ReservationController (new file)
  - ReservationService (new file)
  - ReservationRepository (new file)
  - Reservation entity (new file)
  - ReservationManagementPanel (new component)

CONFLICT: None! Completely separate modules.

F103 Menu Display (Mikhail Zhelnin):
  - MenuController (read-only endpoints)
  - MenuService (display logic)
  - MenuGrid component (new)
  - MenuCard component (new)
  
F105 Order Management (Damaq Zain):
  - OrderController (new file)
  - OrderService (new file)
  - Order entity (new file)
  - OrderManagementPanel (new)

CONFLICT: None! Different domains.

BAD EXAMPLE (High Conflict Risk):
F102 User Management (Jungwook Van):
  - Modifies SecurityConfig.java (auth rules for user endpoints)
  
F106 Payment Management (Jungwook Van):
  - Modifies SecurityConfig.java (auth rules for payment endpoints)

CONFLICT: Both modify same file!
SOLUTION: Coordinate SecurityConfig changes, merge one at a time.
NOTE: Same owner (Jungwook Van) - easier to coordinate!

F101 User Authentication (Junayeed Halim):
  - Modifies AuthContext.tsx (login/logout state)
  
F102 User Management (Jungwook Van):
  - Modifies AuthContext.tsx (user profile state)

CONFLICT: Both modify same frontend context!
SOLUTION: Coordinate context changes between Junayeed and Jungwook.

F107 Delivery Management (Aaron Urayan):
  - Modifies Header.tsx (adds Delivery menu item)
  
F108 Table Reservation (Damaq Zain):
  - Modifies Header.tsx (adds Reservation menu item)

CONFLICT: Both modify navigation!
SOLUTION: Coordinate Header.tsx changes between Aaron and Damaq.
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

### Team Contacts & Feature Ownership
- **F100 User Registration**: Junayeed Halim
- **F101 User Authentication**: Junayeed Halim
- **F102 User Management (Manager)**: Jungwook Van
- **F103 Menu Display**: Mikhail Zhelnin
- **F104 Menu Management (Manager)**: Mikhail Zhelnin
- **F105 Order Management**: Damaq Zain
- **F106 Payment Management**: Jungwook Van
- **F107 Delivery Management**: Aaron Urayan
- **F108 Table Reservation**: Damaq Zain
- **F109 Reservation Management (Manager)**: Aaron Urayan

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

## 📇 AI Quick Reference Card (Print & Keep Visible)

### 🎯 Merge Request Processing (10-Second Decision)

```
┌─────────────────────────────────────────────────────────────┐
│  DEVELOPER ASKS: "Merge F[XXX] to main"                    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: Extract Info (2 sec)                              │
│  ✓ Feature: F[100-109] from branch name                    │
│  ✓ Owner: Lookup in Feature Ownership Table (line 278)     │
│  ✓ Files: Run `git diff --name-only main...F[XXX]`         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: Check Shared Files Matrix (3 sec)                 │
│  📍 Location: Line 206 "Critical Shared Files Matrix"      │
│  🔍 Search for files in changed list:                       │
│     - SecurityConfig.java → CRITICAL                        │
│     - AuthContext.tsx → CRITICAL                            │
│     - User.java / Order.java / Payment.java → CRITICAL     │
│     - Header.tsx → HIGH                                     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: Check Conflict Matrix (3 sec)                     │
│  📍 Location: Line 489 "AI Conflict Detection Matrix"      │
│  🔍 Find this feature in matrix:                            │
│     🔴 CRITICAL → REJECT + Request coordination             │
│     🟡 HIGH → Proceed with caution warnings                 │
│     🟢 LOW → Fast-track approval                            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 4: Execute 6-Phase Review (2-5 min)                  │
│  Phase 1: Branch metadata (lines 278-320)                  │
│  Phase 2: Structural integrity (lines 322-450)             │
│  Phase 3: Dependency analysis (lines 452-585)              │
│  Phase 4: Testing verification (lines 652-820)             │
│  Phase 5: Documentation check (lines 1012-1120)            │
│  Phase 6: Merge simulation (lines 1122-1280)               │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  STEP 5: Calculate Score & Decide (1 sec)                  │
│  Score Formula: (Phase1×15 + Phase2×25 + Phase3×20 +       │
│                  Phase4×25 + Phase5×10 + Phase6×5) / 100   │
│                                                              │
│  Decision Matrix:                                           │
│  ✅ Score ≥ 90 + No CRITICAL conflicts = APPROVE            │
│  ⚠️ Score 70-89 + No CRITICAL = APPROVE WITH CONDITIONS     │
│  🔴 Score < 70 OR CRITICAL conflicts = REJECT               │
└─────────────────────────────────────────────────────────────┘
```

### 🚨 Critical File Quick Lookup

**IF feature touches these → STOP & CHECK:**
- `SecurityConfig.java` → Check F100, F101, F102, F106
- `AuthContext.tsx` → Check F100, F101, F102
- `User.java` → Check F100, F101, F102
- `Payment.java` → Check F105, F106 (CRITICAL: orderId FK)
- `Order.java` → Check F105, F106, F108
- `MenuItem.java` → Check F103, F104, F105
- `Reservation.java` → Check F107, F108, F109
- `Header.tsx` → Check F102, F105, F107, F108, F109

### 🎯 Merge Order Recommendations (Dependency-Based)

```
Layer 1 (Merge First - Foundation):
├─ F100 User Registration (Junayeed)
├─ F103 Menu Display (Mikhail)
└─ F107 Delivery Management (Aaron)

Layer 2 (Merge Second - Auth & Core Features):
├─ F101 User Authentication (Junayeed) [depends on F100]
├─ F104 Menu Management (Mikhail) [depends on F103]
└─ F108 Table Reservation (Damaq) [depends on F107]

Layer 3 (Merge Third - Manager Features):
├─ F102 User Management (Jungwook) [depends on F100, F101]
├─ F105 Order Management (Damaq) [depends on F103]
└─ F109 Reservation Management (Aaron) [depends on F108]

Layer 4 (Merge Last - Complex Integrations):
└─ F106 Payment Management (Jungwook) [depends on F102, F105]
```

### 📞 Emergency Contact Protocol

**When CRITICAL conflict detected:**
```
1. STOP merge process
2. IDENTIFY conflicting features from matrix (line 489)
3. LOOKUP owner names from table (line 278)
4. GENERATE coordination message:
   
   "🔴 MERGE BLOCKED: F[XXX] conflicts with F[YYY]
    
    Conflict Point: [FILE/ENTITY NAME]
    Your Feature: F[XXX] ([OWNER_X])
    Conflicting Feature: F[YYY] ([OWNER_Y])
    
    Action Required:
    1. Contact [OWNER_Y] to discuss [CONFLICT POINT]
    2. Agree on merge order (recommend F[YYY] first)
    3. Update your feature to accommodate merged changes
    
    Estimated Coordination Time: 15-30 minutes"
```

### 🔢 Scoring Quick Reference

| Phase | Weight | Pass Criteria | Common Issues |
|-------|--------|---------------|---------------|
| 1. Metadata | 15% | Clean branch name, <50 commits behind | Stale branch, unclear naming |
| 2. Structural | 25% | Follows patterns, proper layers | Mixed concerns, wrong file locations |
| 3. Dependency | 20% | No circular deps, clean imports | Tight coupling, shared entity mods |
| 4. Testing | 25% | 80%+ coverage, all tests pass | Low coverage, flaky tests |
| 5. Documentation | 10% | API docs, component docs updated | Missing docs, outdated README |
| 6. Merge Simulation | 5% | 0 conflicts, clean merge | File conflicts, diverged history |

**Minimum Passing Score**: 70/100 (with no CRITICAL conflicts)  
**Recommended Score**: 90+/100 for immediate approval

---

**Document Version**: 1.1 (Team-Enabled with Conflict Prediction)  
**Last Updated**: 2025-10-03  
**Next Review Date**: After all 10 features merged  
**Maintained By**: Le Restaurant Development Team  
**Primary Goal**: ZERO-CONFLICT integration of F100-F109 to main  
**Status**: ✅ Active - Production Use - Team-Enabled
