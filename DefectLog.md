# Defect Log & Resolution (Individual)

## DEF-001

| Field | Content |
|-------|---------|
| Defect ID | DEF-001 |
| Severity | P1 - High (Security Vulnerability) |
| Feature | F102 User Registration |
| Discovered | 2024-10-15 (Security Testing) |
| Reporter | Junayeed Halim |
| Assignee | Junayeed Halim|
| Description | User registration allowed weak passwords, enabling brute force attacks and compromising account security. Users could register with passwords like "123" or "password", violating password strength requirements. |
| Steps to Reproduce | 1. Attempt to register a new user with password "123" 2. Observe successful registration despite weak password 3. Verify password is hashed and stored |
| Expected Behavior | Registration should reject passwords that don't meet strength criteria (min 8 chars, uppercase, lowercase, number, special char). |
| Actual Behavior | Any non-empty password was accepted during registration. |
| Root Cause | Missing password strength validation in UserService.createUser() method before hashing. |
| Fix | Added password strength validation function and check before password encoding. |
| Code Change | **Before (WRONG):**<br>```java<br>@Transactional<br>public UserDto createUser(UserCreateRequestDto request) {<br>    // Check for duplicate email<br>    if (userRepository.findByEmail(request.getEmail()).isPresent()) {<br>        throw new RuntimeException("User already exists");<br>    }<br>    User user = new User();<br>    user.setEmail(request.getEmail());<br>    user.setPasswordHash(passwordEncoder.encode(request.getPassword()));<br>    user.setFirstName(request.getFirstName());<br>    user.setLastName(request.getLastName());<br>    user.setPhoneNumber(request.getPhoneNumber());<br>    user.setRole(User.UserRole.CUSTOMER);<br>    user.setStatus(User.UserStatus.ACTIVE);<br>    User saved = userRepository.save(user);<br>    return convertToDto(saved);<br>}<br>```<br>**After (CORRECT):**<br>```java<br>@Transactional<br>public UserDto createUser(UserCreateRequestDto request) {<br>    // Check for duplicate email<br>    if (userRepository.findByEmail(request.getEmail()).isPresent()) {<br>        throw new RuntimeException("User already exists");<br>    }<br>    // Validate password strength<br>    if (!isPasswordStrong(request.getPassword())) {<br>        throw new IllegalArgumentException("Password does not meet strength requirements");<br>    }<br>    User user = new User();<br>    user.setEmail(request.getEmail());<br>    user.setPasswordHash(passwordEncoder.encode(request.getPassword()));<br>    user.setFirstName(request.getFirstName());<br>    user.setLastName(request.getLastName());<br>    user.setPhoneNumber(request.getPhoneNumber());<br>    user.setRole(User.UserRole.CUSTOMER);<br>    user.setStatus(User.UserStatus.ACTIVE);<br>    User saved = userRepository.save(user);<br>    return convertToDto(saved);<br>}<br><br>private boolean isPasswordStrong(String password) {<br>    return password != null && password.length() >= 8 &&<br>           password.matches(".*[A-Z].*") &&<br>           password.matches(".*[a-z].*") &&<br>           password.matches(".*\\d.*") &&<br>           password.matches(".*[!@#$%^&*()].*");<br>}<br>``` |
