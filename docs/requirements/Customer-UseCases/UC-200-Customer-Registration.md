# Use Case UC-200: Customer User Registration

## Use Case Information
- **Use Case ID**: UC-200
- **Use Case Name**: Customer User Registration
- **Related User Story**: FR-200
- **Actor**: Customer User
- **System**: Le Restaurant Management System
- **Date Created**: 2025-01-27
- **Version**: 1.0

---

## Use Case Description
**Brief Description**: A new customer can register an account using their full name, email, password, and phone number to access the restaurant system and maintain their information for future visits.

**Primary Actor**: Customer User (New)
**Secondary Actors**: Email Verification Service, Database System
**Stakeholders**: 
- Customer User: Wants to create account for restaurant services
- Restaurant Management: Needs customer data for service delivery
- System: Maintains user data integrity and security

---

## Preconditions
- Customer has internet access to the registration page
- Customer has valid email address and phone number
- Registration system is operational
- Email verification service is available

---

## Postconditions
**Success Postconditions**:
- New customer account is created in the system
- Customer receives email verification link
- Customer can log in after email verification
- Customer data is stored securely in database
- Registration confirmation is displayed

**Failure Postconditions**:
- No account is created if registration fails
- Customer receives appropriate error messages
- System maintains data integrity
- Failed registration attempts are logged

---

## Main Success Scenario (Basic Flow)
1. Customer navigates to restaurant website
2. Customer clicks "Register" or "Sign Up" button
3. System displays registration form with required fields:
   - Full Name (First Name, Last Name)
   - Email Address
   - Phone Number
   - Password
   - Confirm Password
   - Terms of Service acceptance checkbox
4. Customer fills in all required information
5. System validates input in real-time:
   - Name: Non-empty, alphabetic characters
   - Email: Valid email format, not already registered
   - Phone: Valid phone number format
   - Password: Meets strength requirements (see NFR-101)
6. Customer accepts Terms of Service
7. Customer clicks "Register" button
8. System performs final validation of all fields
9. System checks email uniqueness in database
10. System hashes password using bcrypt
11. System creates new customer record in database
12. System generates email verification token
13. System sends verification email to customer's email address
14. System displays registration success message:
    - "Registration successful! Please check your email to verify your account."
    - Instructions for email verification
15. Customer receives and clicks verification link in email
16. System verifies token and activates account
17. System displays account activation confirmation
18. Customer can now log in to access restaurant services

---

## Alternative Flows

### Alternative Flow A1: Social Media Registration
**Trigger**: Step 3 - Customer chooses social media registration
1. Customer selects social media login option (Google, Facebook)
2. System redirects to social media authentication
3. Customer authorizes application access
4. System receives basic profile information
5. System displays pre-filled registration form
6. Customer reviews and completes missing information
7. Continue with main flow from step 7

### Alternative Flow A2: Phone Verification
**Trigger**: Step 12 - System requires phone verification
1. System sends SMS verification code to provided phone number
2. System displays phone verification form
3. Customer enters received verification code
4. System validates code and continues with email verification
5. Continue with main flow from step 13

---

## Exception Flows

### Exception E1: Email Already Exists
**Trigger**: Step 9 - Email is already registered
1. System detects duplicate email address
2. System displays error message: "Email address already registered"
3. System provides options:
   - "Try logging in instead"
   - "Forgot password?"
   - "Use different email address"
4. Customer can choose appropriate option

### Exception E2: Invalid Input Data
**Trigger**: Step 8 - Validation fails
1. System identifies validation errors
2. System displays specific error messages for each field:
   - "Please enter a valid email address"
   - "Password must be at least 8 characters with uppercase, lowercase, and numbers"
   - "Phone number format is invalid"
3. Customer corrects errors and resubmits
4. Return to step 8

### Exception E3: Email Verification Failure
**Trigger**: Step 13 - Email service unavailable
1. System fails to send verification email
2. System logs email service error
3. System displays message: "Registration complete, but verification email failed to send"
4. System provides "Resend Verification Email" option
5. Customer can request email resend when service is available

### Exception E4: Database Connection Error
**Trigger**: Step 11 - Database unavailable
1. System detects database connection failure
2. System displays error: "Registration temporarily unavailable. Please try again later."
3. System logs database error for investigation
4. Customer registration data is not saved
5. Use case terminates

---

## Special Requirements

### Non-Functional Requirements
- **Security**: Passwords must be encrypted using bcrypt with minimum 10 rounds (NFR-101)
- **Security**: All data transmission must use HTTPS encryption (NFR-103)
- **Performance**: Registration process must complete within 5 seconds (NFR-204)
- **Usability**: Clear error messages must guide user corrections (NFR-402)
- **Reliability**: All input data must be validated on both client and server (NFR-504)

### Business Rules
- BR-301: All fields are required for registration
- BR-302: Email addresses must be unique across all user types
- BR-303: Phone numbers should be unique but duplicates allowed for family accounts
- BR-304: Account activation required before system access
- BR-305: Unverified accounts expire after 7 days

---

## Technology and Data Variations
**Input Data**: 
- Customer personal information (name, email, phone)
- Password and confirmation
- Terms of service acceptance
- Optional marketing preferences

**Output Data**:
- Registration confirmation messages
- Email verification messages
- Account activation confirmations
- Error messages and validation feedback

---

## Frequency of Occurrence
- **Expected Usage**: 20-50 new registrations per day
- **Peak Periods**: Weekends and promotional periods
- **Seasonal Variation**: Higher during holiday seasons

---

## Assumptions
- Customers have access to their email for verification
- Email service provider is reliable
- Customers understand basic web form interactions
- Phone numbers provided are accessible for future communications

---

## Related Use Cases
- **UC-201**: Email Verification Process
- **UC-203**: Password Reset
- **UC-206**: Customer User Login
- **UC-101**: User Registration Management (Manager view)

---

## Open Issues
- Social media integration scope needs definition
- Phone verification requirements need clarification
- Data privacy compliance (GDPR, CCPA) needs review
- Integration with marketing systems needs specification 