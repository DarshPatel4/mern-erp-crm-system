# Employee Dashboard Backend Implementation

This document describes the backend implementation for the Employee Dashboard in the ERP-CRM system.

## Overview

The Employee Dashboard provides employees with access to their personal information, attendance tracking, task management, leave requests, payroll information, and notifications. All functionality is secured with JWT authentication and role-based access control.

## New Collections Created

### 1. EmployeeAttendance
Stores daily attendance records including check-in/check-out times, working hours, breaks, and status.

**Key Fields:**
- `employeeId`: Reference to employee
- `date`: Attendance date
- `checkInTime`: Check-in timestamp
- `checkOutTime`: Check-out timestamp
- `workingHours`: Total working minutes
- `status`: present, absent, leave, completed
- `breakStartTime`, `breakEndTime`: Break tracking
- `totalBreakTime`: Break duration in minutes

### 2. EmployeeTask
Manages tasks assigned to employees with priority, due dates, and status tracking.

**Key Fields:**
- `employeeId`: Reference to employee
- `title`, `description`: Task details
- `dueDate`: Task deadline
- `status`: pending, in-progress, completed, cancelled
- `priority`: low, medium, high, urgent
- `assignedBy`: Who assigned the task
- `completedAt`: Completion timestamp

### 3. EmployeeLeave
Handles leave requests and approvals with validation and status tracking.

**Key Fields:**
- `employeeId`: Reference to employee
- `leaveType`: Annual, Sick, Personal, etc.
- `startDate`, `endDate`: Leave period
- `duration`: Leave duration description
- `reason`: Leave justification
- `status`: pending, approved, rejected, cancelled
- `approvedBy`: Approval authority
- `totalDays`: Calculated leave days

### 4. EmployeePayroll
Stores monthly payroll information including salary breakdown and deductions.

**Key Fields:**
- `employeeId`: Reference to employee
- `month`, `year`: Payroll period
- `basicSalary`: Base salary
- `houseAllowance`, `transportAllowance`: Allowances
- `performanceBonus`: Performance-based bonus
- `grossSalary`: Total before deductions
- `incomeTax`, `socialSecurity`, `healthInsurance`: Deductions
- `netSalary`: Final salary after deductions
- `payslipGenerated`: Payslip status

### 5. EmployeeNotification
Manages employee notifications with read/unread status and priority levels.

**Key Fields:**
- `employeeId`: Reference to employee
- `title`, `message`: Notification content
- `type`: task, success, warning, info, error
- `category`: assignment, leave, payroll, performance
- `isRead`: Read status
- `priority`: low, medium, high, urgent
- `actionUrl`: Related action link

## API Endpoints

### Employee Dashboard
- `GET /api/employee-dashboard/summary/:employeeId` - Get dashboard overview
- `GET /api/employee-dashboard/attendance/:employeeId` - Get attendance data
- `GET /api/employee-dashboard/tasks/:employeeId` - Get employee tasks
- `GET /api/employee-dashboard/leaves/:employeeId` - Get leave requests
- `GET /api/employee-dashboard/payroll/:employeeId` - Get payroll data
- `GET /api/employee-dashboard/notifications/:employeeId` - Get notifications
- `PUT /api/employee-dashboard/notifications/:notificationId/read` - Mark notification as read

### Employee Attendance
- `POST /api/employee-attendance/check-in/:employeeId` - Check in for the day
- `POST /api/employee-attendance/check-out/:employeeId` - Check out for the day
- `POST /api/employee-attendance/start-break/:employeeId` - Start break
- `POST /api/employee-attendance/end-break/:employeeId` - End break
- `GET /api/employee-attendance/today-status/:employeeId` - Get today's status
- `GET /api/employee-attendance/monthly-summary/:employeeId` - Get monthly summary

### Employee Leave
- `POST /api/employee-leave/apply/:employeeId` - Apply for leave
- `GET /api/employee-leave/requests/:employeeId` - Get leave requests
- `GET /api/employee-leave/balance/:employeeId` - Get leave balance
- `PUT /api/employee-leave/cancel/:employeeId/:leaveId` - Cancel leave request
- `GET /api/employee-leave/request/:employeeId/:leaveId` - Get specific leave request

### Employee Payroll
- `GET /api/employee-payroll/data/:employeeId` - Get payroll data
- `GET /api/employee-payroll/payslip/:employeeId/:payslipId` - Get payslip
- `GET /api/employee-payroll/summary/:employeeId` - Get yearly summary
- `GET /api/employee-payroll/download/:employeeId/:payslipId` - Download payslip
- `GET /api/employee-payroll/tax-info/:employeeId` - Get tax information

### Employee Profile
- `GET /api/employee-profile/:employeeId` - Get employee profile
- `PUT /api/employee-profile/:employeeId` - Update profile
- `PUT /api/employee-profile/:employeeId/picture` - Update profile picture
- `POST /api/employee-profile/:employeeId/request-update` - Request profile update
- `GET /api/employee-profile/:employeeId/update-history` - Get update history



## Controllers

### 1. employeeDashboardController.js
Main controller for dashboard functionality including:
- Dashboard summary with aggregated statistics
- Attendance data retrieval
- Task management
- Leave request handling
- Payroll data access
- Notification management

### 2. employeeAttendanceController.js
Handles attendance operations:
- Check-in/check-out logic
- Break management
- Working hours calculation
- Daily and monthly summaries
- Status tracking

### 3. employeeLeaveController.js
Manages leave functionality:
- Leave application with validation
- Overlap checking
- Leave balance calculation
- Request cancellation
- Status tracking

### 4. employeePayrollController.js
Handles payroll operations:
- Monthly payroll data
- Yearly summaries
- Tax calculations
- Payslip management
- Download functionality

### 5. employeeProfileController.js
Manages profile operations:
- Profile viewing and updating
- Picture management
- Update request workflow
- History tracking

## Sample Data

The `sampleEmployeeData.js` file provides sample data for testing:

1. **Attendance Records**: 30 days of sample attendance data
2. **Tasks**: 4 sample tasks with different priorities and statuses
3. **Leave Requests**: Sample annual and sick leave requests
4. **Payroll Data**: 3 months of sample payroll records
5. **Notifications**: Sample notifications for various events

### How to Use Sample Data

1. **Set Employee ID**: Update `SAMPLE_EMPLOYEE_ID` in the file with an actual employee ID from your database
2. **Run the Script**: Execute `node sampleEmployeeData.js` to populate the database
3. **Test Functionality**: Use the populated data to test all dashboard features

## Security Features

- **JWT Authentication**: All endpoints require valid JWT tokens
- **Role-Based Access**: Employee endpoints are restricted to authenticated users
- **Data Isolation**: Employees can only access their own data
- **Input Validation**: All inputs are validated before processing
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes

## Database Indexes

The following indexes are created for optimal performance:

- **EmployeeAttendance**: `{ employeeId: 1, date: 1 }`
- **EmployeeTask**: `{ employeeId: 1, status: 1, dueDate: 1 }`
- **EmployeeLeave**: `{ employeeId: 1, status: 1, startDate: 1 }`
- **EmployeePayroll**: `{ employeeId: 1, month: 1, year: 1 }`
- **EmployeeNotification**: `{ employeeId: 1, isRead: 1, createdAt: 1 }`

## Error Handling

All controllers implement comprehensive error handling:
- **Validation Errors**: 400 Bad Request for invalid inputs
- **Not Found Errors**: 404 for missing resources
- **Server Errors**: 500 for internal server issues
- **Business Logic Errors**: Appropriate error messages for business rule violations

## Performance Considerations

- **Aggregation Pipelines**: Used for complex calculations and summaries
- **Indexed Queries**: All queries use appropriate indexes
- **Pagination**: Large result sets are paginated
- **Efficient Updates**: Bulk operations where possible
- **Connection Pooling**: MongoDB connection optimization

## Testing

### Postman Testing

1. **Authentication**: Use valid JWT token in Authorization header
2. **Employee ID**: Replace `:employeeId` with actual employee ID
3. **Test Scenarios**: Test all CRUD operations for each endpoint
4. **Error Cases**: Test with invalid inputs and unauthorized access

### Sample Test Data

The sample data provides realistic scenarios for testing:
- Multiple attendance patterns
- Various task priorities and statuses
- Different leave types and approval states
- Comprehensive payroll information
- Diverse notification types

## Future Enhancements

- **Real-time Updates**: WebSocket integration for live updates
- **File Uploads**: Support for document attachments in leave requests
- **Email Notifications**: Automated email alerts for important events
- **Mobile API**: Optimized endpoints for mobile applications
- **Advanced Analytics**: Detailed performance and attendance analytics
- **Integration**: Connect with external HR and payroll systems

## Troubleshooting

### Common Issues

1. **MongoDB Connection**: Ensure MONGO_URI is set in .env file
2. **Employee ID**: Verify employee ID exists in employees collection
3. **JWT Token**: Check token validity and expiration
4. **Data Population**: Run sample data script with correct employee ID

### Debug Mode

Enable debug logging by setting environment variable:
```bash
DEBUG=employee-dashboard:*
```

## Support

For technical support or questions about the Employee Dashboard implementation, refer to:
- API documentation
- Database schema documentation
- Frontend integration guide
- Sample data usage instructions
