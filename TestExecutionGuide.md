# Test Execution Commands for User Authentication and Registration

## Running Tests

### Run All Backend Tests
```bash
cd le-restaurant/backend && gradlew.bat test
```
- Executes all 29 tests across AuthControllerTest, UserControllerTest, UserServiceTest, UserServiceUnitTest, and LeRestaurantBackendApplicationTests.
- Expected Output: "BUILD SUCCESSFUL" with 29 tests passed.
- If tests don't run (shows "up-to-date"), use `gradlew.bat clean test` to force execution.

### Run Specific Test Class
```bash
gradlew.bat test --tests "*AuthControllerTest"
```

### Run Single Test Method
```bash
gradlew.bat test --tests "*AuthControllerTest.shouldLoginUserSuccessfully"
```

### Generate Coverage Report
```bash
gradlew.bat jacocoTestReport
```
- Opens HTML report in `build/reports/jacoco/test/html/index.html`.

## Test Coverage for Features

### Authentication (UC102)
- **Valid login**: AuthControllerTest.shouldLoginUserSuccessfully, UserServiceTest.registerAndAuthenticate_success.
- **Invalid password**: AuthControllerTest.shouldReturn401WhenInvalidCredentials, UserServiceTest.authenticate_wrongPassword_throws.
- **User not found**: AuthControllerTest.shouldReturn404WhenUserNotFound, UserServiceTest.authenticate_nonExistent_throws.
- **Password security**: UserServiceUnitTest.authenticate_wrongPassword_throws.

### Registration (UC106)
- **Successful registration**: UserControllerTest.shouldCreateUser, UserServiceTest.registerAndAuthenticate_success.
- **Input validation**: UserControllerTest.shouldReturn400WhenEmailIsMissing, shouldReturn400WhenEmailIsInvalid.
- **Duplicate email**: UserControllerTest.shouldReturn409WhenEmailExists, UserServiceUnitTest.createUser_duplicateEmail_throws.
- **Password storage**: UserServiceUnitTest.createUser_success_savesUser.
