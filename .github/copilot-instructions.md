# Le Restaurant AI Coding Agent Instructions

## Project Overview
**Le Restaurant** is a collaborative UTS academic project (Spring 2025) built as a restaurant management system with feature-based team ownership. The system uses **Spring Boot 3.x (Java)** backend with **React 18 + TypeScript + Vite** frontend, following layered architecture patterns and deployed via Azure DevOps pipelines.

## Architecture & Structure

### Backend: Layered Spring Boot (Gradle)
```
backend/src/main/java/com/lerestaurant/le_restaurant_backend/
├── controller/     # REST endpoints with @RestController
├── service/        # Business logic with @Service, @Transactional
├── repository/     # Spring Data JPA interfaces with @Repository
├── entity/         # JPA entities (User, Payment, MenuItem, etc.)
├── dto/            # Data transfer objects (UserDto, UserCreateRequestDto, etc.)
└── config/         # Security, CORS, database configuration
```

**Key patterns:**
- **DTOs for all API boundaries**: Never expose entities directly. Use `[Entity]Dto` for responses, `[Entity]CreateRequestDto` and `[Entity]UpdateRequestDto` for requests.
- **Service layer is @Transactional**: All business logic in services, wrapped in transactions
- **Constructor injection**: Use `@Autowired` on constructor, not fields
- **CORS configured**: `@CrossOrigin(origins = "http://localhost:5173")` on controllers
- **Password encryption**: Use injected `PasswordEncoder` in UserService
- **Exception handling**: Catch `RuntimeException` in controllers, return appropriate HTTP status with error maps

### Frontend: Atomic Design Pattern
```
frontend/src/
├── components/
│   ├── atoms/      # Basic UI elements (Button, Input)
│   ├── molecules/  # Composite components (MenuCard, SearchBar)
│   ├── organisms/  # Complex sections (UserManagementPanel, CartSidebar)
│   ├── templates/  # Page layouts (MainLayout)
│   └── routes/     # Route guards (ProtectedRoute)
├── hooks/          # Custom hooks (useUserApi, usePaymentApi)
├── services/       # API client (api.ts with fetch wrapper)
├── contexts/       # React Context (AuthContext.tsx)
├── types/          # TypeScript types (user.ts, payment.ts)
└── pages/          # Page components
```

**Key patterns:**
- **Export conventions**: Organisms use `export default`, atoms/molecules use named exports (`export const`)
- **Component structure**: `ComponentName: React.FC<ComponentNameProps> = ({ props }) => { }`
- **API hooks pattern**: Each feature has dedicated hooks (e.g., `useUserApi()`, `usePaymentApi()`) that manage loading states, errors, and CRUD operations
- **Base URL**: `const API_BASE_URL = 'http://localhost:8080/api'` in `services/api.ts`
- **TypeScript enums**: Use `UserRole`, `UserStatus`, `PaymentStatus` from `types/` directory

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
- **Test structure**: Mock repositories with `@Mock`, inject into service with `@InjectMocks`
- **Naming**: `[MethodName]_[Scenario]_[ExpectedBehavior]` (e.g., `createUser_WithValidData_ReturnsUserDto`)

### Frontend Testing (Vitest + React Testing Library)
- **80% coverage required** (configured in `vitest.config.ts`)
- Run tests: `cd frontend && npm run test`
- Coverage: `npm run test:coverage` → `coverage/index.html`
- **Mock hooks**: Use `vi.mock('../../../hooks/useUserApi')` in test files
- **Test user interactions**: Use `@testing-library/user-event` for clicks/typing
- **Assertions**: Use `screen.getByRole()`, `waitFor()`, `expect().toBeInTheDocument()`

### CI/CD Pipeline
- **Azure Pipelines** run tests automatically on push/PR
- Backend: `azure-pipelines-testing.yml` (builds backend, runs tests, publishes coverage)
- Frontend: `azure-pipelines.yml` (builds frontend, deploys to Azure Static Web Apps)
- **Pipeline must pass** before merging

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
Defined in `Actual-design-plan/coding-standards/naming-conventions-dictionary.md`:

- **Java classes**: PascalCase, suffix with type (e.g., `UserController`, `UserService`, `UserRepository`)
- **Java methods**: camelCase, verb-noun pattern (e.g., `createUser`, `getUserById`, `deleteUser`)
- **TypeScript components**: PascalCase (e.g., `UserManagementPanel`, `CartSidebar`)
- **Hooks**: `use` prefix + camelCase (e.g., `useUserApi`, `usePaymentApi`)
- **DTOs**: `[Entity][Operation]RequestDto` or `[Entity]Dto` (e.g., `UserCreateRequestDto`, `UserDto`)
- **Database**: snake_case for tables/columns (e.g., `user_id`, `created_at`)

## Common Pitfalls & Solutions

### Backend
- **Don't expose entities**: Always return DTOs from controllers
- **Transaction management**: Service methods modify data must have `@Transactional`
- **Password handling**: Never store plaintext; use `passwordEncoder.encode()` in UserService
- **Validation**: DTOs should have validation annotations (`@NotNull`, `@Email`, etc.)

### Frontend
- **State management**: Use custom hooks (e.g., `useUserApi()`) for API state, not raw `useState` for API calls
- **Loading states**: Always handle `loading` from API hooks to show spinners/disable buttons
- **Error handling**: Display errors from `error` state in API hooks
- **Type safety**: Import types from `types/` directory; avoid `any`

### Testing
- **Mock external dependencies**: Backend mocks repositories; frontend mocks API hooks
- **Test isolation**: Each test should be independent; use `beforeEach` to reset state
- **Coverage exclusions**: Config files, DTOs, entities are excluded (see `build.gradle` and `vitest.config.ts`)

## Documentation References
- **System architecture**: `Actual-design-plan/system-architecture/architecture-overview.md`
- **API endpoints**: Check controller `@RequestMapping` annotations
- **Database schema**: `Actual-design-plan/database-design/database-schema.md`
- **Use cases**: `Actual-design-plan/use-cases/[Feature]-UseCases/*.md`
- **Testing strategy**: `TEST_STRATEGY.md` for comprehensive testing guidelines

## When Modifying Code
1. **Check feature ownership** in README.md before editing components
2. **Run tests locally** before pushing (`./gradlew test` and `npm run test`)
3. **Ensure 80% coverage** for F102 & F106 features
4. **Follow naming conventions** from coding standards dictionary
5. **Use DTOs** for all API communication
6. **Update tests** when changing business logic
