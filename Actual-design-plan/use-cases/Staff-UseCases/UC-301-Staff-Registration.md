# Use Case UC-301: Staff User Registration

## Use Case Information
- **Use Case ID**: UC-301
- **Use Case Name**: Staff User Registration
- **Related User Story**: FR-301
- **Actor**: Staff User
- **System**: Le Restaurant Management System
- **Date Created**: 2025-01-27
- **Version**: 1.0

---

## Use Case Description
**Brief Description**: Restaurant staff members can register for system access to create their user profile with appropriate roles and permissions for restaurant operations.

**Primary Actor**: Staff User (New Employee)
**Secondary Actors**: Manager (for approval), HR System, Email Service
**Stakeholders**: 
- Staff User: Needs system access to perform job duties
- Restaurant Manager: Must approve and manage staff access
- HR Department: Maintains employee records and access control
- System Security: Ensures proper role-based access control

---

## Preconditions
- Staff member has been hired by the restaurant
- Staff member has received invitation code or registration link from manager
- Staff registration system is operational
- Manager approval workflow is available

---

## Postconditions
**Success Postconditions**:
- Staff user profile is created with pending approval status
- Manager receives notification for approval
- Staff member receives confirmation of registration submission
- Appropriate role and permissions are assigned upon approval
- Staff can access system after manager approval

**Failure Postconditions**:
- No staff account is created if registration fails
- Manager is notified of registration issues
- Staff member receives appropriate error messages
- System maintains security and data integrity

---

## Main Success Scenario (Basic Flow)
1. Staff member receives registration invitation from manager containing:
   - Registration link with invitation token
   - Employee ID or reference number
   - Department/role information
   - Registration deadline
2. Staff member clicks registration link
3. System validates invitation token and displays staff registration form:
   - Personal Information (Full Name, Employee ID)
   - Contact Information (Email, Phone Number)
   - Employment Details (Department, Position, Start Date)
   - Login Credentials (Username, Password, Confirm Password)
   - Emergency Contact Information
   - Agreement to staff policies and procedures
4. Staff member fills in all required information
5. System validates input data in real-time:
   - Employee ID matches HR system records
   - Email format and uniqueness validation
   - Password meets security requirements (NFR-101)
   - All required fields are completed
6. Staff member accepts staff policies and code of conduct
7. Staff member submits registration form
8. System performs comprehensive validation:
   - Cross-references employee data with HR system
   - Verifies invitation token validity
   - Checks for duplicate staff accounts
9. System creates staff user record with "Pending Approval" status
10. System assigns temporary basic permissions
11. System sends notification to assigned manager:
    - New staff registration pending approval
    - Staff member details and requested access level
    - Approval/rejection options
12. System sends confirmation to staff member:
    - Registration submitted successfully
    - Pending manager approval notice
    - Expected approval timeframe
13. Manager reviews and approves staff registration (UC-101)
14. System activates staff account with full role permissions
15. System sends approval notification to staff member
16. Staff member can now log in and access assigned system features

---

## Alternative Flows

### Alternative Flow A1: Bulk Staff Registration
**Trigger**: Step 1 - Manager initiates bulk registration for multiple staff
1. Manager uploads staff list with employee details
2. System generates individual invitation tokens for each staff member
3. System sends batch invitation emails
4. Each staff member follows individual registration process
5. Continue with main flow from step 2 for each staff member

### Alternative Flow A2: Role-Specific Registration
**Trigger**: Step 3 - Different roles require different information
1. System detects staff role from invitation (Waiter, Chef, Host, etc.)
2. System displays role-specific registration form:
   - Waiters: Service training certifications
   - Kitchen Staff: Food safety certifications
   - Managers: Management experience and credentials
3. Staff member completes role-specific requirements
4. Continue with main flow from step 5

### Alternative Flow A3: Temporary Staff Registration
**Trigger**: Step 1 - Registration for temporary/seasonal staff
1. System identifies temporary staff invitation
2. System displays simplified registration form
3. System sets automatic account expiration date
4. Manager approval includes duration of access
5. System automatically deactivates account at expiration

---

## Exception Flows

### Exception E1: Invalid Invitation Token
**Trigger**: Step 3 - Invitation token is invalid or expired
1. System detects invalid or expired token
2. System displays error: "Invalid or expired invitation link"
3. System provides contact information for manager
4. Staff member must request new invitation from manager
5. Use case terminates

### Exception E2: Employee ID Not Found
**Trigger**: Step 8 - Employee ID doesn't match HR records
1. System fails to verify employee in HR system
2. System displays error: "Employee ID not found in HR system"
3. System provides options:
   - Contact HR department
   - Contact hiring manager
   - Re-enter employee information
4. Staff member must resolve HR system discrepancy

### Exception E3: Duplicate Staff Account
**Trigger**: Step 8 - Staff member already has account
1. System detects existing account for employee
2. System displays message: "Account already exists for this employee"
3. System provides options:
   - Reset password for existing account
   - Contact manager for account reactivation
   - Contact IT support for assistance

### Exception E4: Manager Approval Timeout
**Trigger**: Step 13 - Manager doesn't respond within timeframe
1. System detects approval timeout (48 hours)
2. System sends reminder notification to manager
3. System escalates to senior manager after 72 hours
4. System notifies staff member of delay
5. Pending registration remains in queue

---

## Special Requirements

### Non-Functional Requirements
- **Security**: Role-based access control must be implemented (NFR-104)
- **Security**: All staff data must be encrypted and secure (NFR-101, NFR-103)
- **Performance**: Registration process must complete within 5 seconds (NFR-204)
- **Reliability**: Integration with HR system must be reliable (NFR-501)
- **Usability**: Registration process must be intuitive for all staff levels (NFR-401)

### Business Rules
- BR-501: All staff registrations require manager approval
- BR-502: Employee ID must match HR system records
- BR-503: Staff accounts automatically expire if not approved within 7 days
- BR-504: Each staff member can have only one active account
- BR-505: Role permissions are assigned based on job position

---

## Technology and Data Variations
**Input Data**: 
- Invitation token and employee identification
- Personal and contact information
- Employment details and role information
- Login credentials and security information
- Policy acknowledgments and agreements

**Output Data**:
- Registration confirmation messages
- Manager approval notifications
- Account activation confirmations
- Role and permission assignments
- Integration updates to HR system

---

## Frequency of Occurrence
- **Regular Usage**: 5-15 new staff registrations per month
- **Peak Periods**: Beginning of seasons, major hiring cycles
- **Temporary Staff**: Additional 10-20 registrations during peak seasons

---

## Assumptions
- Staff members have basic computer literacy for registration
- HR system integration is reliable and up-to-date
- Managers check and respond to approval requests promptly
- Email system reliably delivers notifications

---

## Related Use Cases
- **UC-101**: User Registration Management (Manager approval)
- **UC-302**: Staff Registration Details View
- **UC-305**: Staff User Login
- **UC-306**: Staff User Logout

---

## Open Issues
- Integration requirements with specific HR systems need definition
- Role hierarchy and permission matrix needs detailed specification
- Background check integration requirements need clarification
- Compliance with labor law requirements needs review 