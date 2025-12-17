# Le Restaurant AI Coding Agent Instructions

## Project Overview
**Le Restaurant** is a collaborative UTS academic project (Spring 2025) built as a restaurant management system with feature-based team ownership. The system uses **Spring Boot 3.x (Java 17)** backend with **React 18 + TypeScript + Vite** frontend, following layered architecture patterns and deployed via Azure DevOps pipelines to Azure App Service (backend) and Azure Static Web Apps (frontend).

**Live Deployment:**
- Backend: https://le-restaurant-adbrdddye6cbdjf2.australiaeast-01.azurewebsites.net
- Frontend: https://le-restaurant-frontend.azurestaticapps.net
- Database: PostgreSQL 14 on Azure (Australia East)

## Architecture & Structure

### Backend: Layered Spring Boot (Gradle)
```
backend/src/main/java/com/lerestaurant/le_restaurant_backend/
├── controller/     # REST endpoints with @RestController
├── service/        # Business logic with @Service, @Transactional
├── repository/     # Spring Data JPA interfaces with @Repository
├── entity/         # JPA entities (User, Payment, MenuItem, etc.)
├── dto/            # Data transfer objects (UserDto, UserCreateRequestDto, etc.)
├── config/         # Security, CORS, database configuration
├── exception/      # GlobalExceptionHandler with @RestControllerAdvice
└── util/          # Utility classes
```

**Key patterns:**
- **DTOs for all API boundaries**: Never expose entities directly. Use `[Entity]Dto` for responses, `[Entity]CreateRequestDto` and `[Entity]UpdateRequestDto` for requests (see `UserController.java`)
- **Service layer is @Transactional**: All business logic in services, wrapped in transactions (class-level annotation)
- **Constructor injection**: Use `@Autowired` on constructor, not fields (see `UserController.java` line 34-36)
- **Global exception handling**: `GlobalExceptionHandler` with `@RestControllerAdvice` handles all exceptions; controllers don't need try-catch blocks. Returns Map<String, Object> with "error", "timestamp", and optional "fieldErrors" keys
- **CORS configured globally**: Don't add `@CrossOrigin` to controllers; configured in `WebConfig` for all endpoints
- **Password encryption**: Use injected `PasswordEncoder` in UserService (never store plaintext)
- **Validation**: Use `@Valid` on DTOs with Jakarta validation annotations (`@NotNull`, `@Email`, etc.)

### Frontend: Atomic Design Pattern
```
frontend/src/
├── components/
│   ├── atoms/      # Basic UI elements (Button, Input) - named exports
│   ├── molecules/  # Composite components (MenuCard, SearchBar) - named exports
│   ├── organisms/  # Complex sections (UserManagementPanel, CartSidebar) - default exports
│   ├── templates/  # Page layouts (MainLayout)
│   └── routes/     # Route guards (ProtectedRoute)
├── hooks/          # Custom hooks (useUserApi, usePaymentApi, useApiBase)
├── services/       # API client (api.ts, userApiService.ts)
├── contexts/       # React Context (AuthContext.tsx)
├── types/          # TypeScript types (user.ts, payment.ts)
└── pages/          # Page components
```

**Key patterns:**
- **Export conventions**: Organisms use `export default`, atoms/molecules use named exports (`export const`)
- **Component structure**: `ComponentName: React.FC<ComponentNameProps> = ({ props }) => { }` (see UserManagementPanel)
- **API hooks pattern**: Each feature has dedicated hooks (e.g., `useUserApi()`, `usePaymentApi()`) extending `useApiBase()` that manage loading states, errors, and CRUD operations. Return `{ data, loading, error, executeOperation }` objects
- **Service layer**: Dedicated service files (e.g., `userApiService.ts`) encapsulate API calls with types (CreateUserRequest, UpdateUserRequest, UserListResponse)
- **Base URL**: Configured via Vite proxy (`/api` → `http://localhost:8080`) in `vite.config.ts`. Services use relative paths `/api/users`, not full URLs
- **TypeScript enums**: Use `UserRole`, `UserStatus`, `PaymentStatus` from `types/` directory
- **Mock data fallback**: Services gracefully degrade to mock data when backend unavailable (see api.ts TODOs)

## Feature Ownership & Branch Strategy
Each feature (F100-F109) has a designated owner. Features are developed on branches named `F{NUMBER}{FEATURENAME}` (e.g., `F106PAYMENTMANAGEMENT`, `F102USERMANAGEMENT`).

**Critical features for reference:**
- **F102 (User Management)**: UserController, UserService, UserManagementPanel, UserFormModal
- **F106 (Payment Management)**: PaymentController, PaymentService, PaymentManagementPanel, CartSidebar

When working across features, coordinate with the respective owner's code patterns.

## Testing Requirements (MANDATORY)

### Backend Testing (JUnit 5 + Mockito)
- **80% line/branch coverage required** for F102 & F106 (enforced by JaCoCo)
- Run tests: `cd backend && ./gradlew test`
- Coverage report: `build/reports/jacoco/test/html/index.html`
- **Test structure**: Mock repositories with `@Mock`, inject into service with `@InjectMocks`, use `@ExtendWith(MockitoExtension.class)`
- **Naming**: `[MethodName]_[Scenario]_[ExpectedBehavior]` (e.g., `createUser_WithValidData_ReturnsUserDto`)
- **Organization**: Use `@Nested` classes for grouping related tests, `@DisplayName` for readable test names
- **Exclusions**: Config, DTOs, entities, repositories excluded from coverage (see `build.gradle` jacocoTestReport)

### Frontend Testing (Vitest + React Testing Library)
- **80% coverage required** (configured in `vitest.config.ts`)
- Run tests: `cd frontend && npm run test`
- Coverage: `npm run test:coverage` → `coverage/index.html`
- **Mock hooks**: Use `vi.mock('../../../hooks/useUserApi')` in test files before imports
- **Test user interactions**: Use `@testing-library/user-event` for clicks/typing (await user.click(), user.type())
- **Assertions**: Use `screen.getByRole()`, `waitFor()`, `expect().toBeInTheDocument()`
- **Exclusions**: Atoms, molecules, templates, other features (F103-F109) excluded except F102/F106 (see `vitest.config.ts`)

### Integration Tests (Jest + Axios)
- **E2E scenarios**: 10 test files in `integration-tests/` covering F100-F109
- Run: `npm run test:integration` (requires backend on :8080, frontend on :5173)
- **Setup**: `setup.js` waits for servers with health checks before tests
- **Pattern**: Each scenario tests complete user flow (auth → CRUD → validation)

### CI/CD Pipeline
- **Azure Pipelines** (`azure-pipelines.yml`) run tests automatically on push/PR
- Stages: CodeQuality → BuildAndTest → SecurityScan → DeployProduction (disabled by default)
- Backend: Builds JAR, runs JUnit tests, generates JaCoCo coverage, publishes reports
- Frontend: Installs deps, runs Vitest tests, generates coverage, publishes artifacts
- **Pipeline must pass** before merging (80% coverage enforced)

## Development Workflows

### Starting the Application
```powershell
# Backend (runs on http://localhost:8080)
cd backend
./gradlew bootRun

# Frontend (runs on http://localhost:5173)
cd frontend
npm install
npm run dev
```

### Backend Development
```powershell
# Run tests with coverage
./gradlew test jacocoTestReport

# Build JAR
./gradlew build

# Check coverage verification (80% threshold)
./gradlew jacocoTestCoverageVerification
```

### Frontend Development
```powershell
# TypeScript type checking
npx tsc --noEmit

# Linting
npm run lint

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Critical Naming Conventions
Defined in `docs/requirements/coding-standards/naming-conventions-dictionary.md`:

- **Java classes**: PascalCase, suffix with type (e.g., `UserController`, `UserService`, `UserRepository`)
- **Java methods**: camelCase, verb-noun pattern (e.g., `createUser`, `getUserById`, `deleteUser`)
- **TypeScript components**: PascalCase (e.g., `UserManagementPanel`, `CartSidebar`)
- **Hooks**: `use` prefix + camelCase (e.g., `useUserApi`, `usePaymentApi`, `useApiBase`)
- **DTOs**: `[Entity][Operation]RequestDto` or `[Entity]Dto` (e.g., `UserCreateRequestDto`, `UserDto`)
- **Database**: snake_case for tables/columns (e.g., `user_id`, `created_at`)
- **Test methods**: `[MethodName]_[Scenario]_[ExpectedBehavior]` (e.g., `getUserById_WithValidId_ReturnsUser`)

## Common Pitfalls & Solutions

### Backend
- **Don't expose entities**: Always return DTOs from controllers (see UserController - returns UserDto, accepts UserCreateRequestDto)
- **Transaction management**: Service methods that modify data must have `@Transactional` (class-level on all services)
- **Password handling**: Never store plaintext; use `passwordEncoder.encode()` in UserService (injected via constructor)
- **Validation**: DTOs should have validation annotations (`@NotNull`, `@Email`, `@Pattern`, etc.)
- **Exception handling**: Don't catch exceptions in controllers - GlobalExceptionHandler handles all with consistent error format
- **H2 vs PostgreSQL**: Default config uses H2 in-memory DB (localhost:8080/h2-console); Azure uses PostgreSQL

### Frontend
- **State management**: Use custom hooks (e.g., `useUserApi()`) for API state, not raw `useState` for API calls
- **Loading states**: Always handle `loading` from API hooks to show spinners/disable buttons during operations
- **Error handling**: Display errors from `error` state in API hooks; errors are Map<string, any> with "error" and "timestamp" keys
- **Type safety**: Import types from `types/` directory; avoid `any`. Use proper enums (UserRole, UserStatus, PaymentStatus)
- **API URLs**: Use relative paths `/api/users` (proxied by Vite), not absolute URLs `http://localhost:8080/api/users`
- **Mock data**: Services auto-fallback to mock data when backend unavailable (TODOs in api.ts document this pattern)

### Testing
- **Mock external dependencies**: Backend mocks repositories; frontend mocks API hooks with `vi.mock()`
- **Test isolation**: Each test should be independent; use `beforeEach` to reset state and create fresh test data
- **Coverage exclusions**: Config files, DTOs, entities are excluded (see `build.gradle` and `vitest.config.ts` for full list)
- **Integration test prereqs**: Must have backend on :8080 and frontend on :5173 running (setup.js checks health endpoints)

## Documentation References
- **System architecture**: `docs/design/` directory for architecture diagrams and patterns
- **API endpoints**: Check controller `@RequestMapping` annotations or run Swagger UI at localhost:8080/swagger-ui.html
- **Database schema**: H2 console at localhost:8080/h2-console (username: admin, password: 1234)
- **Use cases**: README.md lists all features F100-F109 with owners and descriptions
- **Testing strategy**: `docs/testing/TEST_EXECUTION_GUIDE.md` for comprehensive testing guidelines
- **Deployment**: `docs/10-AZURE-DEPLOYMENT-GUIDE.md` for Azure CLI commands and `docs/11-DEPLOYMENT-CHECKLIST.md` for verification

## When Modifying Code
1. **Check feature ownership** in README.md before editing components (F100-F109 each have designated owners)
2. **Run tests locally** before pushing (`./gradlew test` and `npm run test`)
3. **Ensure 80% coverage** for F102 & F106 features (enforced by JaCoCo and Vitest)
4. **Follow naming conventions** from coding standards dictionary
5. **Use DTOs** for all API communication (never expose entities from controllers)
6. **Update tests** when changing business logic (test file should mirror source file structure)
7. **Check Azure Pipeline** status after push - must be green before merging to main
