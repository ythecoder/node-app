# College Management System - Features Documentation

 Table of Contents

1. [System Overview](#system-overview)
2. [Core Features](#core-features)
3. [Database Models](#database-models)
4. [Authentication & Authorization](#authentication--authorization)
5. [API Endpoints](#api-endpoints)
6. [User Roles & Permissions](#user-roles--permissions)
7. [Architecture](#architecture)
8. [Setup Instructions](#setup-instructions)
9. [API Examples](#api-examples)



System Overview

College Management System is a comprehensive multi-tenant SaaS platform for managing college/school operations. It provides role-based access control, student information management, staff management, admission workflows, and leave tracking.

# Key Characteristics

- Multi-tenant Architecture: Supports multiple schools/institutions with complete data isolation
- Enterprise-Grade Security: JWT authentication, password hashing, activity logging
- Granular RBAC: 8 roles with 20+ customizable permissions
- RESTful API: Fully documented with Swagger/OpenAPI
- Scalable Design: Indexed MongoDB queries, soft deletes, audit trails



 Core Features

# 1. User & Role Management 👥

Complete user management with multi-role support and granular permissions.

Features:

- User registration and login with JWT tokens
- Role-based access control (RBAC)
- Multi-factor authentication ready
- User activity logging and audit trails
- Password policies and validation
- Account lockout after failed attempts (5 tries = 30 min lockout)
- Profile management (avatar, contact info, address)
- Password reset functionality



# 2. Student Information System (SIS) 🎓

Comprehensive student data management with rich profiles.

Features:

- Student Profiles:
  - Personal info (name, DOB, gender, nationality, blood group)
  - Academic tracking (class, section, GPA, CGPA, total marks)
  - Medical records (history, allergies, emergency contacts)
  - Disciplinary records (incidents with severity levels)
- Document Management:
  - Multi-version document storage (Aadhaar, Birth Certificate, etc.)
  - Automatic version tracking
  - Document upload with file URLs
- Family Management:
  - Multiple parent/guardian linking
  - Relationship tracking
  - Primary contact designation
- Academic Progress:
  - Class/section allocation
  - Promotion workflow (auto-update to next class)
  - Performance metrics (GPA, CGPA, total marks)
  - Previous class history
- Extracurricular Activities:
  - Activity tracking with achievements
  - Start/end dates
  - Activity descriptions

- Status Tracking: Active, Inactive, Dropped, Graduated, Suspended



# 3. Online Admission System 📝

Complete admission workflow from application to enrollment.

Features:

- Application Submission:
  - Self-service admission form
  - Personal and academic information
  - Parent/guardian details
  - Class preference
- Application Status Tracking:
  - Submitted → Under Review → Interview Scheduled → Approved/Rejected/Waitlisted
- Document Management:
  - Upload proof documents (Birth Certificate, Transfer Certificate, etc.)
  - Multiple file support
- Interview Scheduling:
  - Schedule interview dates
  - Record interview results
- Approval Workflow:
  - Admin review and comments
  - Automatic enrollment number generation on approval
  - Rejection with reason documentation
- Communication:
  - Notification tracking
  - Last notification timestamp



# 4. Staff Management System 👨‍🏫

Complete HR management for teachers and administrative staff.

Features:

- Staff Profiles:
  - Employment information (designation, department, joining date)
  - Employment type (Permanent, Contractual, Part-time)
  - Current status (Active, On Leave, Inactive, Retired, Terminated)
- Qualifications & Experience:
  - Educational qualifications storage
  - Previous work experience tracking
  - Subject specializations
  - Class assignments (multiple classes possible)
  - Class teacher designation
- Salary Management:
  - Basic salary setup
  - Salary structure (Basic pay, Dearness, Allowances, Deductions)
  - Bank account details
  - Flexible allowances/deductions configuration
- Leave Management:
  - Leave balance tracking (Casual, Sick, Earned, Maternity, Paternity, Other)
  - Leave request submission
  - Approval workflow with balance verification
  - Automatic balance deduction on approval
  - Cancel leave with refund
- Performance Tracking:
  - Performance rating (1-5 scale)
  - Performance reviews with timestamps
  - Reviewer information stored
  - Research papers and awards tracking



# 5. Leave Management System 🏖️

Comprehensive leave request and approval system.

Features:

- Leave Request:
  - Multiple leave types (Casual, Sick, Earned, Maternity, Paternity, Other)
  - Auto-calculation of number of days
  - Document upload support (medical certs for sick leave)
  - Request reason documentation
- Approval Workflow:
  - Pending → Approved/Rejected/Cancelled
  - Leave balance validation before approval
  - Automatic balance deduction
  - Comments/reasons documentation
- Balance Tracking:
  - Per-staff balance for each leave type
  - Auto-deduction on approval
  - Refund on cancellation
  - Configurable default balances
- Reporting:
  - Filter by staff, status, month
  - Leave history tracking



# 6. Attendance Management 📊

Student and staff attendance tracking.

Features:

- Multiple Marking Methods:
  - Full-day attendance
  - Period-wise attendance (for detailed tracking)
  - Status options: Present, Absent, Leave, Late
- Approval Workflow:
  - Optional approval requirement
  - Remarks/notes per attendance
  - Marked by staff tracking
- Reporting:
  - Filter by date, student/staff, class
  - Attendance reports generation
  - Individual and bulk attendance views



# 7. Class & Academic Management 📚

Academic structure and organization.

Features:

- Class Setup:
  - Class number (1-12)
  - Section assignment
  - Room/building allocation
  - Capacity management
- Student Enrollment:
  - Multiple students per class
  - Current strength tracking
  - Total capacity
- Subject Assignment:
  - Multiple subjects per class
  - Subject code tracking
  - Teacher assignments
- Timetable Management:
  - Period-wise scheduling
  - Start/end times
  - Teacher assignment per period
  - Day-wise timetables



 Database Models

# 1. Tenant Model

Multi-school/institution support.

```
- schoolName: String (required)
- schoolCode: String (unique)
- address: { street, city, state, postalCode, country }
- contactEmail: String (required)
- contactPhone: String
- website: String
- logo: String
- principalName: String
- academicYear: String
- establishedYear: Number
- subscriptionPlan: [Basic, Premium, Enterprise]
- isActive: Boolean
- totalStudents: Number
- totalStaff: Number
```

# 2. Role Model

Role-based access control.

```
- name: String (enum: SuperAdmin, SchoolAdmin, Principal, Teacher, Accountant, Librarian, Student, Parent)
- description: String
- permissions: [String] (20+ permission types)
- tenantId: ObjectId (Tenant reference)
- isActive: Boolean
```

# 3. User Model

User authentication and profile.

```
- firstName: String (required)
- lastName: String (required)
- email: String (unique, required)
- password: String (hashed, required)
- phone: String
- avatar: String (URL)
- dateOfBirth: Date
- gender: String (enum: Male, Female, Other)
- address: Object
- role: ObjectId (Role reference, required)
- tenantId: ObjectId (Tenant reference, required)
- studentId: ObjectId (Student reference)
- staffId: ObjectId (Staff reference)
- parentId: ObjectId (Parent reference)
- isActive: Boolean
- lastLogin: Date
- loginAttempts: Number
- lockUntil: Date
- passwordChangedAt: Date
- activityLog: [{ action, timestamp, ipAddress, userAgent }]
```

# 4. Student Model

Comprehensive student information.

```
- userId: ObjectId (User reference, required)
- enrollmentNumber: String (unique, required)
- tenantId: ObjectId (Tenant reference)
- dateOfBirth: Date
- nationality: String
- bloodGroup: String
- admissionDate: Date
- currentClass: ObjectId (Class reference)
- currentSection: String
- academicYear: String
- previousClass: String
- medicalHistory: String
- allergies: [String]
- emergencyContact: { name, relationship, phone }
- parents: [{ parentId, relationship, isPrimaryContact }]
- documents: [{ documentType, documentNumber, fileUrl, version }]
- cgpa: Number
- gpa: Number
- totalMarks: Number
- disciplinaryRecord: [{ date, incidentDescription, actionTaken, severity }]
- extracurricularActivities: [{ activityName, achievements, dates }]
- enrollmentStatus: String (enum: Active, Inactive, Dropped, Graduated, Suspended)
- isActive: Boolean
```

# 5. Parent Model

Guardian/parent information.

```
- userId: ObjectId (User reference, required)
- tenantId: ObjectId (Tenant reference)
- parentType: String (enum: Father, Mother, Guardian, Other)
- occupation: String
- company: String
- workPhone: String
- workEmail: String
- annualIncome: Number
- linkedStudents: [{ studentId, relationship }]
- preferredContactMethod: String (enum: Email, Phone, SMS, WhatsApp)
- receiveNotifications: Boolean
- isActive: Boolean
```

# 6. Staff Model

Comprehensive staff/employee information.

```
- userId: ObjectId (User reference)
- staffId: String (unique, required)
- tenantId: ObjectId (Tenant reference)
- designation: String (enum: Principal, VP, Teacher, Accountant, Librarian, Counselor, Admin)
- department: String
- joiningDate: Date (required)
- employmentType: String (enum: Permanent, Contractual, Part-time)
- qualifications: [{ degree, field, institution, yearOfCompletion }]
- subjectsTeaching: [String]
- classesAssigned: [{ classId, section, isClassTeacher }]
- totalExperience: Number (in years)
- previousWorkExperience: [{ designation, institution, dates, reasonForLeaving }]
- basicSalary: Number
- salaryStructure: { basicPay, dearness, allowances, deductions }
- bankAccount: { accountNumber, bankName, ifscCode, accountHolderName }
- leaveBalance: { casual, sick, earned, maternity, paternity, other }
- performanceRating: Number
- performanceReviews: [{ reviewDate, rating, comments, reviewedBy }]
- employmentStatus: String (enum: Active, OnLeave, Inactive, Retired, Terminated)
- researchPapers: [String]
- awards: [String]
- isActive: Boolean
```

# 7. Class Model

Academic class/section information.

```
- className: String (required)
- classNumber: Number (enum: 1-12, required)
- section: String (required)
- tenantId: ObjectId (Tenant reference)
- academicYear: String
- classTeacher: ObjectId (Staff reference)
- totalStrength: Number
- currentStrength: Number
- roomNumber: String
- buildingName: String
- capacity: Number
- students: [ObjectId] (Student references)
- subjects: [{ subjectName, subjectCode, teacher }]
- timetable: [{ day, periodNumber, subject, teacher, startTime, endTime }]
- isActive: Boolean
```

# 8. Admission Model

Admission application tracking.

```
- applicationNumber: String (unique, required)
- tenantId: ObjectId (Tenant reference)
- firstName: String (required)
- lastName: String (required)
- email: String
- phone: String
- dateOfBirth: Date
- gender: String
- applyingForClass: Number (1-12, required)
- academicYear: String (required)
- previousSchool: String
- previousPercentage: Number
- parentName: String
- parentEmail: String
- parentPhone: String
- parentOccupation: String
- documents: [{ documentType, fileUrl, uploadedAt }]
- status: String (enum: Submitted, UnderReview, InterviewScheduled, Approved, Rejected, Waitlisted)
- reviewedBy: ObjectId (User reference)
- reviewDate: Date
- reviewComments: String
- interviewScheduledDate: Date
- interviewResult: String
- admissionDate: Date
- enrollmentNumber: String (generated on approval)
- rejectionReason: String
```

# 9. Leave Model

Staff leave request tracking.

```
- staffId: ObjectId (Staff reference, required)
- tenantId: ObjectId (Tenant reference)
- leaveType: String (enum: Casual, Sick, Earned, Maternity, Paternity, Other, required)
- startDate: Date (required)
- endDate: Date (required)
- numberOfDays: Number (required)
- reason: String (required)
- documentUrl: String
- status: String (enum: Pending, Approved, Rejected, Cancelled)
- approvedBy: ObjectId (User reference)
- approvalDate: Date
- approvalComments: String
```

# 10. Attendance Model

Student and staff attendance records.

```
- studentId: ObjectId (Student reference)
- staffId: ObjectId (Staff reference)
- tenantId: ObjectId (Tenant reference)
- classId: ObjectId (Class reference)
- date: Date (required)
- status: String (enum: Present, Absent, Leave, Late, required)
- remarks: String
- markedBy: ObjectId (User reference)
- periodNumber: Number
- isApproved: Boolean
- approvedBy: ObjectId (User reference)
```



 Authentication & Authorization

# Authentication Flow

1. User Registration → Password hashed with bcrypt
2. User Login → Credentials verified, JWT token generated
3. Token Usage → Token sent in Authorization header for subsequent requests
4. Token Verification → Middleware validates token, extracts userId and tenantId

# JWT Token Structure

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "tenantId": "507f1f77bcf86cd799439012",
  "iat": 1716979200,
  "exp": 1717584000
}
```

# Authorization Middleware

```javascript
// Single permission check
authorize(["students.create"]);

// Multiple permissions (AND)
authorize(["students.create", "students.read"]);

// SuperAdmin bypass
// SuperAdmin role bypasses all permission checks
```



 API Endpoints

# Authentication Endpoints

 Register User

```
POST /api/v1/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass@123",
  "tenantId": "60d5ec49c1234567890abc1",
  "roleId": "60d5ec49c1234567890abc2"
}

Response: 201 Created
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "60d5ec49c1234567890abc3",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "Student"
  }
}
```

 Login

```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass@123",
  "tenantId": "60d5ec49c1234567890abc1"
}

Response: 200 OK
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "60d5ec49c1234567890abc3",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "Student",
    "permissions": ["students.read", "attendance.view"]
  }
}
```

 Get Current User

```
GET /api/v1/auth/me
Authorization: Bearer <token>

Response: 200 OK
{
  "user": {
    "id": "60d5ec49c1234567890abc3",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "Student",
    "permissions": [...]
  }
}
```

 Update Profile

```
PUT /api/v1/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+91-9876543210",
  "avatar": "https://example.com/avatar.jpg"
}

Response: 200 OK
```

 Change Password

```
POST /api/v1/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "oldPassword": "OldPass@123",
  "newPassword": "NewSecurePass@456",
  "confirmPassword": "NewSecurePass@456"
}

Response: 200 OK
{
  "message": "Password changed successfully"
}
```

# User Management Endpoints

 Get All Users

```
GET /api/v1/users?role=Teacher&status=active&search=john
Authorization: Bearer <token>

Query Parameters:
- role: Filter by role name (Teacher, Student, etc.)
- status: Filter by status (active/inactive)
- search: Search in firstName, lastName, email

Response: 200 OK
{
  "count": 5,
  "users": [...]
}
```

 Create User

```
POST /api/v1/users
Authorization: Bearer <token>
X-Tenant-ID: <tenantId>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "password": "SecurePass@123",
  "roleId": "60d5ec49c1234567890abc2",
  "phone": "+91-9876543210",
  "gender": "Female"
}

Response: 201 Created
```

# Student Management Endpoints

 Create Student

```
POST /api/v1/students
Authorization: Bearer <token>
X-Tenant-ID: <tenantId>
Content-Type: application/json

{
  "firstName": "Arjun",
  "lastName": "Kumar",
  "email": "arjun@example.com",
  "password": "StudentPass@123",
  "enrollmentNumber": "STU-2024-001",
  "dateOfBirth": "2008-05-15",
  "gender": "Male",
  "currentClass": "60d5ec49c1234567890abc4",
  "currentSection": "A",
  "academicYear": "2024-2025",
  "emergencyContact": {
    "name": "Ramesh Kumar",
    "relationship": "Father",
    "phone": "+91-9876543210"
  }
}

Response: 201 Created
{
  "message": "Student created successfully",
  "student": {
    "id": "60d5ec49c1234567890abc5",
    "enrollmentNumber": "STU-2024-001",
    "user": {
      "firstName": "Arjun",
      "lastName": "Kumar",
      "email": "arjun@example.com"
    }
  }
}
```

 Get All Students

```
GET /api/v1/students?classId=60d5ec49c1234567890abc4&enrollmentStatus=Active
Authorization: Bearer <token>
X-Tenant-ID: <tenantId>

Response: 200 OK
{
  "count": 45,
  "students": [...]
}
```

 Add Parent to Student

```
POST /api/v1/students/{studentId}/parent
Authorization: Bearer <token>
X-Tenant-ID: <tenantId>
Content-Type: application/json

{
  "parentId": "60d5ec49c1234567890abc6",
  "relationship": "Father",
  "isPrimaryContact": true
}

Response: 200 OK
```

 Upload Student Document

```
POST /api/v1/students/{studentId}/document
Authorization: Bearer <token>
X-Tenant-ID: <tenantId>
Content-Type: application/json

{
  "documentType": "Aadhaar",
  "documentNumber": "123456789012",
  "fileUrl": "https://storage.example.com/aadhaar.pdf"
}

Response: 200 OK
{
  "message": "Document uploaded successfully",
  "document": {
    "documentType": "Aadhaar",
    "fileUrl": "...",
    "uploadedAt": "2024-05-17T10:30:00Z",
    "version": 1
  }
}
```

 Promote Student

```
POST /api/v1/students/{studentId}/promote
Authorization: Bearer <token>
X-Tenant-ID: <tenantId>
Content-Type: application/json

{
  "newClass": "60d5ec49c1234567890abc7",
  "newSection": "B",
  "newAcademicYear": "2025-2026"
}

Response: 200 OK
{
  "message": "Student promoted successfully",
  "student": {...}
}
```

# Admission Endpoints

 Submit Admission Application

```
POST /api/v1/students/apply
X-Tenant-ID: <tenantId>
Content-Type: application/json

{
  "firstName": "Priya",
  "lastName": "Singh",
  "email": "priya@example.com",
  "phone": "+91-9876543210",
  "dateOfBirth": "2009-03-20",
  "gender": "Female",
  "applyingForClass": 9,
  "academicYear": "2024-2025",
  "previousSchool": "XYZ School",
  "previousPercentage": 92.5,
  "parentName": "Rajesh Singh",
  "parentEmail": "rajesh@example.com",
  "parentPhone": "+91-9876543211",
  "parentOccupation": "Engineer"
}

Response: 201 Created
{
  "message": "Admission application submitted successfully",
  "applicationNumber": "APP-60d5-1715964600000",
  "applicationId": "60d5ec49c1234567890abc8"
}
```

 Get All Admissions

```
GET /api/v1/students?status=Pending&academicYear=2024-2025
Authorization: Bearer <token>
X-Tenant-ID: <tenantId>

Response: 200 OK
{
  "count": 12,
  "admissions": [...]
}
```

 Update Admission Status

```
PUT /api/v1/students/{admissionId}/status
Authorization: Bearer <token>
X-Tenant-ID: <tenantId>
Content-Type: application/json

{
  "status": "Approved",
  "reviewComments": "Good academic record"
}

Response: 200 OK
{
  "message": "Admission status updated successfully",
  "admission": {
    "status": "Approved",
    "admissionDate": "2024-05-17T10:30:00Z",
    "enrollmentNumber": "STU-2024-002"
  }
}
```

 Schedule Interview

```
POST /api/v1/students/{admissionId}/interview
Authorization: Bearer <token>
X-Tenant-ID: <tenantId>
Content-Type: application/json

{
  "interviewDate": "2024-06-01T10:00:00Z"
}

Response: 200 OK
{
  "message": "Interview scheduled successfully",
  "interviewDate": "2024-06-01T10:00:00Z"
}
```

# Staff Management Endpoints

 Create Staff

```
POST /api/v1/staff
Authorization: Bearer <token>
X-Tenant-ID: <tenantId>
Content-Type: application/json

{
  "firstName": "Dr. Amit",
  "lastName": "Sharma",
  "email": "amit@example.com",
  "password": "StaffPass@123",
  "staffId": "STF-2024-001",
  "designation": "Teacher",
  "department": "Science",
  "joiningDate": "2024-01-15",
  "employmentType": "Permanent",
  "phone": "+91-9876543210",
  "basicSalary": 50000
}

Response: 201 Created
{
  "message": "Staff created successfully",
  "staff": {
    "id": "60d5ec49c1234567890abc9",
    "staffId": "STF-2024-001",
    "designation": "Teacher"
  }
}
```

 Assign Class to Staff

```
POST /api/v1/staff/{staffId}/class
Authorization: Bearer <token>
X-Tenant-ID: <tenantId>
Content-Type: application/json

{
  "classId": "60d5ec49c1234567890abc4",
  "section": "A",
  "isClassTeacher": true
}

Response: 200 OK
{
  "message": "Class assigned successfully"
}
```

 Update Salary Structure

```
PUT /api/v1/staff/{staffId}/salary
Authorization: Bearer <token>
X-Tenant-ID: <tenantId>
Content-Type: application/json

{
  "basicPay": 55000,
  "dearness": 5000,
  "allowances": {
    "house_rent": 10000,
    "conveyance": 2000
  },
  "deductions": {
    "insurance": 2000,
    "tax": 5000
  },
  "bankAccount": {
    "accountNumber": "1234567890",
    "bankName": "HDFC Bank",
    "ifscCode": "HDFC0001234",
    "accountHolderName": "Dr. Amit Sharma"
  }
}

Response: 200 OK
{
  "message": "Salary structure updated successfully"
}
```

 Add Performance Review

```
POST /api/v1/staff/{staffId}/review
Authorization: Bearer <token>
X-Tenant-ID: <tenantId>
Content-Type: application/json

{
  "rating": 4.5,
  "comments": "Excellent teaching methods and student engagement"
}

Response: 200 OK
{
  "message": "Performance review added successfully"
}
```

# Leave Management Endpoints

 Request Leave

```
POST /api/v1/staff
Authorization: Bearer <token>
X-Tenant-ID: <tenantId>
Content-Type: application/json

{
  "staffId": "60d5ec49c1234567890abc9",
  "leaveType": "Sick",
  "startDate": "2024-06-01",
  "endDate": "2024-06-03",
  "reason": "Medical treatment",
  "documentUrl": "https://storage.example.com/medical_cert.pdf"
}

Response: 201 Created
{
  "message": "Leave request submitted successfully",
  "leave": {
    "id": "60d5ec49c1234567890abca",
    "status": "Pending",
    "numberOfDays": 3
  }
}
```

 Get Leave Balance

```
GET /api/v1/staff/{staffId}/leave-balance
Authorization: Bearer <token>
X-Tenant-ID: <tenantId>

Response: 200 OK
{
  "staffId": "60d5ec49c1234567890abc9",
  "leaveBalance": {
    "casual": 8,
    "sick": 7,
    "earned": 15,
    "maternity": 0,
    "paternity": 0,
    "other": 2
  }
}
```

 Approve Leave

```
POST /api/v1/staff/{leaveId}/approve
Authorization: Bearer <token>
X-Tenant-ID: <tenantId>
Content-Type: application/json

{
  "comments": "Approved - medical leave"
}

Response: 200 OK
{
  "message": "Leave approved successfully",
  "leave": {
    "status": "Approved",
    "approvalDate": "2024-05-17T10:30:00Z"
  }
}
```

 Reject Leave

```
POST /api/v1/staff/{leaveId}/reject
Authorization: Bearer <token>
X-Tenant-ID: <tenantId>
Content-Type: application/json

{
  "comments": "Insufficient balance"
}

Response: 200 OK
{
  "message": "Leave rejected"
}
```



 User Roles & Permissions

# 8 Core Roles

| Role            | Purpose                     | Permissions                                   |
|  |  |  |
| SuperAdmin  | SaaS platform administrator | All permissions                               |
| SchoolAdmin | School administrator        | All school operations, tenant management      |
| Principal   | School principal            | Staff, students, academic decisions           |
| Teacher     | Classroom teacher           | Attendance, marks, class management           |
| Accountant  | Finance staff               | Fees, payroll, financial reports              |
| Librarian   | Library staff               | Library management, resource tracking         |
| Student     | Student user                | View own profile, attendance, marks           |
| Parent      | Guardian user               | View child's info, attendance, communications |

# 20+ Granular Permissions

```
User Management:
- users.create          Create new users
- users.read            View user information
- users.update          Update user details
- users.delete          Delete/deactivate users

Student Management:
- students.create       Create new students
- students.read         View student information
- students.update       Update student records
- students.delete       Delete student records
- students.enroll       Enroll students in classes
- students.promote      Promote students to next class

Staff Management:
- staff.create          Create new staff
- staff.read            View staff information
- staff.update          Update staff details
- staff.delete          Delete staff records

Attendance:
- attendance.mark       Mark attendance
- attendance.read       View attendance records
- attendance.approve    Approve attendance

Fees:
- fees.collect          Collect fees
- fees.view             View fee records
- fees.report           Generate fee reports

Leave:
- leave.request         Request leave
- leave.approve         Approve/reject leave requests
- leave.view            View leave records

Class Management:
- class.manage          Create/update classes
- class.view            View class information

Academic:
- academic.manage       Manage academic settings
- academic.view         View academic information

Reports:
- reports.generate      Generate reports
- reports.view          View reports
```



 Architecture

# Multi-Tenant Design

Every entity includes `tenantId` field for complete data isolation:

```javascript
// Example: All queries filter by tenantId
const students = await Student.find({ tenantId, classId });
```

# Security Layers

1. Authentication: JWT tokens with 7-day expiry
2. Authorization: Role-based permissions
3. Data Isolation: Tenant-scoped queries
4. Password Security: bcrypt hashing with salt rounds = 10
5. Account Protection: 5-attempt lockout × 30 minutes
6. Audit Trail: Activity logging for all users

# Database Indexes

Optimized queries with indexes on:

- `email + tenantId` (User)
- `enrollmentNumber + tenantId` (Student)
- `staffId + tenantId` (Staff)
- `startDate + endDate` (Leave)
- `date + tenantId` (Attendance)

# Error Handling

```javascript
// Standardized error responses
{
  "message": "Error description",
  "error": "Detailed error info"
}
```



 Setup Instructions

# Prerequisites

- Node.js >= 14
- MongoDB running locally or connection string
- npm or yarn

# Backend Setup

1. Install Dependencies

```bash
cd backend
npm install
```

2. Create .env file

```bash
MONGODB_URI=mongodb://localhost:27017/college_management
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
```

3. Start Server

```bash
npm run dev
# Server runs at http://localhost:5000
```

4. Access Swagger Documentation

```
http://localhost:5000/swagger
```

# Frontend Setup

1. Install Dependencies

```bash
cd frontend
npm install
```

2. Start Dev Server

```bash
npm run dev
# Frontend runs at http://localhost:5173 (Vite)
```

# Database Seeding (Optional)

To seed initial data with roles and tenants:

```bash
# Create a seed script or use MongoDB CLI
db.tenants.insertOne({
  schoolName: "ABC Public School",
  schoolCode: "ABS-001",
  contactEmail: "admin@abc-school.com",
  subscriptionPlan: "Premium"
})

db.roles.insertMany([
  { name: "SuperAdmin", tenantId: <tenantId> },
  { name: "SchoolAdmin", tenantId: <tenantId> },
  // ... other roles
])
```



 API Examples

# Example Flow: Complete Student Admission

 Step 1: Submit Admission

```bash
curl -X POST http://localhost:5000/api/v1/students/apply \
  -H "X-Tenant-ID: <tenantId>" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Priya",
    "lastName": "Singh",
    "email": "priya@college.edu",
    "applyingForClass": 9,
    "academicYear": "2024-2025"
  }'
```

 Step 2: Upload Documents

```bash
curl -X POST http://localhost:5000/api/v1/students/<admissionId>/document \
  -H "Authorization: Bearer <token>" \
  -H "X-Tenant-ID: <tenantId>" \
  -H "Content-Type: application/json" \
  -d '{
    "documentType": "Transfer Certificate",
    "fileUrl": "https://storage.com/tc.pdf"
  }'
```

 Step 3: Schedule Interview

```bash
curl -X POST http://localhost:5000/api/v1/students/<admissionId>/interview \
  -H "Authorization: Bearer <token>" \
  -H "X-Tenant-ID: <tenantId>" \
  -H "Content-Type: application/json" \
  -d '{
    "interviewDate": "2024-06-01T10:00:00Z"
  }'
```

 Step 4: Approve Application

```bash
curl -X PUT http://localhost:5000/api/v1/students/<admissionId>/status \
  -H "Authorization: Bearer <token>" \
  -H "X-Tenant-ID: <tenantId>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Approved",
    "reviewComments": "Excellent academic record"
  }'
```

# Example Flow: Staff Leave Request

 Step 1: Request Leave

```bash
curl -X POST http://localhost:5000/api/v1/staff \
  -H "Authorization: Bearer <token>" \
  -H "X-Tenant-ID: <tenantId>" \
  -H "Content-Type: application/json" \
  -d '{
    "staffId": "<staffId>",
    "leaveType": "Sick",
    "startDate": "2024-06-01",
    "endDate": "2024-06-03",
    "reason": "Medical treatment",
    "documentUrl": "https://storage.com/cert.pdf"
  }'
```

 Step 2: Check Leave Balance

```bash
curl -X GET http://localhost:5000/api/v1/staff/<staffId>/leave-balance \
  -H "Authorization: Bearer <token>" \
  -H "X-Tenant-ID: <tenantId>"
```

 Step 3: Approve Leave

```bash
curl -X POST http://localhost:5000/api/v1/staff/<leaveId>/approve \
  -H "Authorization: Bearer <token>" \
  -H "X-Tenant-ID: <tenantId>" \
  -H "Content-Type: application/json" \
  -d '{
    "comments": "Approved - medical leave"
  }'
```



 Response Status Codes

| Code | Meaning      | Usage                                |
| - |  |  |
| 200  | OK           | Successful GET, PUT, DELETE          |
| 201  | Created      | Successful POST (resource created)   |
| 204  | No Content   | Successful DELETE (no response body) |
| 400  | Bad Request  | Missing/invalid parameters           |
| 401  | Unauthorized | Missing/invalid token                |
| 403  | Forbidden    | Insufficient permissions             |
| 404  | Not Found    | Resource doesn't exist               |
| 409  | Conflict     | Resource already exists (duplicate)  |
| 500  | Server Error | Internal server error                |



 Key Validations

# Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (@$!%\*?&)

Example: `SecurePass@123` ✅

# Email Validation

- Valid email format (RFC 5322)
- Unique per tenant

# Enrollment Number

- Unique per tenant
- Format: `STU-YYYY-XXX` or custom

# Staff ID

- Unique per tenant
- Format: `STF-YYYY-XXX` or custom



 Rate Limiting (Recommended for Production)

```
- 100 requests per minute per user
- 1000 requests per minute per tenant
- 10000 requests per minute per API key
```



 Best Practices

1. Always include X-Tenant-ID header in requests
2. Use Authorization Bearer token from login
3. Handle token expiry - refresh every 7 days
4. Validate on frontend before API calls
5. Log all API errors for debugging
6. Implement retry logic for transient failures
7. Cache user permissions in frontend
8. Use pagination for large datasets



 Future Enhancements

- [ ] Attendance report generation
- [ ] Fee management and invoicing
- [ ] Library management system
- [ ] Academic marks and report cards
- [ ] Communication/Notification system
- [ ] Email/SMS notifications
- [ ] File storage integration (AWS S3)
- [ ] Mobile app for parents
- [ ] Analytics and dashboards
- [ ] API rate limiting
- [ ] Two-factor authentication
- [ ] Document encryption



 Support & Contact

For issues, feature requests, or documentation updates:

- Create an issue in the project repository
- Contact: admin@collegemanagement.com
- Documentation: https://docs.collegemanagement.com



Last Updated: May 17, 2026  
Version: 1.0.0  
License: MIT
