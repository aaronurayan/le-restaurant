# Use Case UC-201: Email Verification Process

## Use Case Information
- **Use Case ID**: UC-201
- **Use Case Name**: Email Verification Process
- **Related User Story**: FR-201
- **Actor**: Customer User
- **System**: Le Restaurant Management System
- **Date Created**: 2025-01-27
- **Version**: 1.0

---

## Use Case Description
**Brief Description**: Customer User can verify their email address through a confirmation link sent to their registered email to activate their account and ensure email validity.

**Primary Actor**: Customer User (Registered but Unverified)
**Secondary Actors**: Email Service, Token Validation System
**Stakeholders**: 
- Customer User: Needs to activate account for system access
- Restaurant Management: Ensures valid customer contact information
- System Security: Prevents fake account creation

---

## Preconditions
- Customer has completed initial registration (UC-200)
- Customer has access to registered email account
- Email verification system is operational
- Verification token has been generated and sent

---

## Postconditions
**Success Postconditions**:
- Customer email address is verified and marked as confirmed
- Customer account is activated for full system access
- Customer can log in and use all restaurant services
- Verification token is invalidated after successful use

**Failure Postconditions**:
- Account remains unverified if verification fails
- Customer receives appropriate error messages
- Failed verification attempts are logged
- Customer can request new verification email

---

## Main Success Scenario (Basic Flow)
1. Customer receives email with subject "Verify Your Restaurant Account"
2. Customer opens verification email
3. Email contains:
   - Welcome message
   - Account activation instructions
   - Verification link with embedded token
   - Link expiration information (24 hours)
   - Alternative manual verification option
4. Customer clicks verification link in email
5. System receives verification request with token
6. System validates verification token:
   - Token exists in database
   - Token has not expired (within 24 hours)
   - Token has not been used previously
   - Token matches customer account
7. System marks email address as verified
8. System updates account status to "Active"
9. System invalidates verification token
10. System displays account activation success page:
    - "Email verified successfully!"
    - "Your account is now active"
    - "Login" button to access services
11. System logs successful email verification
12. System sends welcome email with account details
13. Customer can now log in and access all restaurant features

---

## Alternative Flows

### Alternative Flow A1: Manual Verification Code Entry
**Trigger**: Step 4 - Customer prefers manual code entry
1. Customer clicks "Enter verification code manually" link
2. System displays verification code entry form
3. Customer enters verification code from email
4. System validates entered code
5. Continue with main flow from step 7

### Alternative Flow A2: Resend Verification Email
**Trigger**: Step 1 - Customer did not receive email
1. Customer navigates to login page
2. Customer attempts to log in with unverified account
3. System displays "Account not verified" message
4. System provides "Resend verification email" option
5. Customer clicks "Resend verification email"
6. System generates new verification token
7. System sends new verification email
8. Continue with main flow from step 1

### Alternative Flow A3: Verification from Mobile App
**Trigger**: Step 4 - Customer opens link on mobile device
1. Customer clicks verification link on mobile device
2. System detects mobile user agent
3. System displays mobile-optimized verification page
4. System offers option to open restaurant mobile app
5. Continue with main flow from step 5

---

## Exception Flows

### Exception E1: Expired Verification Token
**Trigger**: Step 6 - Token has expired
1. System detects token expiration (>24 hours old)
2. System displays error message: "Verification link has expired"
3. System provides options:
   - "Request new verification email"
   - "Contact support for assistance"
4. Customer can request new verification email
5. System generates and sends new token

### Exception E2: Invalid or Tampered Token
**Trigger**: Step 6 - Token validation fails
1. System detects invalid token format or tampering
2. System logs security incident
3. System displays error: "Invalid verification link"
4. System provides secure verification resend option
5. Customer must request new verification email

### Exception E3: Already Verified Account
**Trigger**: Step 6 - Account is already verified
1. System detects account is already active
2. System displays message: "Account already verified"
3. System provides direct login option
4. Customer can proceed to login

### Exception E4: Email Service Failure
**Trigger**: Step 12 - Welcome email fails to send
1. System successfully verifies account
2. System fails to send welcome email
3. System logs email service error
4. Account verification is still successful
5. Customer can proceed to login

---

## Special Requirements

### Non-Functional Requirements
- **Security**: Verification tokens must be cryptographically secure (NFR-103)
- **Security**: All verification actions must be logged (NFR-105)
- **Performance**: Token validation must occur within 2 seconds (NFR-201)
- **Usability**: Verification process must be intuitive and clear (NFR-401)
- **Reliability**: System must handle verification even during high load (NFR-501)

### Business Rules
- BR-401: Verification tokens expire after 24 hours
- BR-402: Each token can only be used once
- BR-403: Unverified accounts cannot access protected features
- BR-404: Customers can request maximum 5 verification emails per day
- BR-405: Verification links must use HTTPS encryption

---

## Technology and Data Variations
**Input Data**: 
- Verification token from email link
- Customer email address
- Timestamp of verification attempt
- User agent and IP address information

**Output Data**:
- Account activation confirmations
- Welcome emails and messages
- Error messages for failed verifications
- Security logs for verification attempts

---

## Frequency of Occurrence
- **Expected Usage**: 20-50 verifications per day (matching registrations)
- **Peak Periods**: Following registration peaks
- **Resend Requests**: 5-10% of initial verifications

---

## Assumptions
- Customers check email within 24 hours of registration
- Email providers deliver verification emails reliably
- Customers understand email verification concept
- Internet connectivity is stable for verification process

---

## Related Use Cases
- **UC-200**: Customer User Registration
- **UC-206**: Customer User Login
- **UC-203**: Password Reset Process
- **UC-101**: User Registration Management

---

## Open Issues
- Email deliverability improvements needed
- Mobile app deep linking integration
- Alternative verification methods (SMS) consideration
- Accessibility compliance for verification pages 