const mongoose = require('mongoose');
const EmployeeAttendance = require('./models/EmployeeAttendance');
const EmployeeTask = require('./models/EmployeeTask');
const EmployeeLeave = require('./models/EmployeeLeave');
const EmployeePayroll = require('./models/EmployeePayroll');
const EmployeeNotification = require('./models/EmployeeNotification');

// Sample data for employee with ID (replace with actual employee ID from your database)
const SAMPLE_EMPLOYEE_ID = '68b679ec0fc77f7236204416'; // Replace this with actual employee ID

// Sample attendance data for the last 30 days
const sampleAttendanceData = [
  {
    employeeId: SAMPLE_EMPLOYEE_ID,
    date: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000),
    checkInTime: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000),
    checkOutTime: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000),
    workingHours: 480,
    status: 'completed',
    breakStartTime: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000),
    breakEndTime: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000),
    totalBreakTime: 60,
    notes: 'Regular workday'
  },
  {
    employeeId: SAMPLE_EMPLOYEE_ID,
    date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
    checkInTime: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
    checkOutTime: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000),
    workingHours: 480,
    status: 'completed',
    breakStartTime: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000),
    breakEndTime: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000),
    totalBreakTime: 60,
    notes: 'Early start'
  },
  {
    employeeId: SAMPLE_EMPLOYEE_ID,
    date: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000),
    checkInTime: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000),
    checkOutTime: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000),
    workingHours: 480,
    status: 'completed',
    breakStartTime: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000),
    breakEndTime: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000),
    totalBreakTime: 60,
    notes: 'Regular workday'
  }
];

// Sample task data
const sampleTaskData = [
  {
    employeeId: SAMPLE_EMPLOYEE_ID,
    title: 'Complete Project Documentation',
    description: 'Finalize the technical documentation for the new ERP module',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'in-progress',
    priority: 'high',
    assignedBy: 'Project Manager',
    notes: 'Include API documentation and user guides'
  },
  {
    employeeId: SAMPLE_EMPLOYEE_ID,
    title: 'Code Review for Team Members',
    description: 'Review pull requests from junior developers',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: 'pending',
    priority: 'medium',
    assignedBy: 'Tech Lead',
    notes: 'Focus on code quality and best practices'
  },
  {
    employeeId: SAMPLE_EMPLOYEE_ID,
    title: 'Database Optimization',
    description: 'Optimize database queries for better performance',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    status: 'pending',
    priority: 'low',
    assignedBy: 'System Architect',
    notes: 'Analyze slow queries and implement improvements'
  },
  {
    employeeId: SAMPLE_EMPLOYEE_ID,
    title: 'Bug Fix - Login Issue',
    description: 'Fix authentication bug in the login system',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    status: 'completed',
    priority: 'urgent',
    assignedBy: 'QA Team',
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    notes: 'Issue resolved - JWT token validation fixed'
  }
];

// Sample leave data
const sampleLeaveData = [
  {
    employeeId: SAMPLE_EMPLOYEE_ID,
    leaveType: 'Annual Leave',
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
    duration: '3 days',
    reason: 'Family vacation',
    status: 'pending',
    totalDays: 3,
    notes: 'Planning to visit family in another city'
  },
  {
    employeeId: SAMPLE_EMPLOYEE_ID,
    leaveType: 'Sick Leave',
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    duration: '1 day',
    reason: 'Not feeling well',
    status: 'approved',
    approvedBy: 'HR Manager',
    approvedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    totalDays: 1,
    notes: 'Doctor\'s note provided'
  }
];

// Sample payroll data for the current year
const samplePayrollData = [
  {
    employeeId: SAMPLE_EMPLOYEE_ID,
    month: 1,
    year: 2024,
    basicSalary: 5000,
    houseAllowance: 1000,
    transportAllowance: 500,
    performanceBonus: 800,
    otherAllowances: 200,
    grossSalary: 7500,
    incomeTax: 750,
    socialSecurity: 375,
    healthInsurance: 150,
    otherDeductions: 100,
    totalDeductions: 1375,
    netSalary: 6125,
    payslipGenerated: true,
    notes: 'January 2024 payslip'
  },
  {
    employeeId: SAMPLE_EMPLOYEE_ID,
    month: 2,
    year: 2024,
    basicSalary: 5000,
    houseAllowance: 1000,
    transportAllowance: 500,
    performanceBonus: 600,
    otherAllowances: 200,
    grossSalary: 7300,
    incomeTax: 730,
    socialSecurity: 365,
    healthInsurance: 150,
    otherDeductions: 100,
    totalDeductions: 1345,
    netSalary: 5955,
    payslipGenerated: true,
    notes: 'February 2024 payslip'
  },
  {
    employeeId: SAMPLE_EMPLOYEE_ID,
    month: 3,
    year: 2024,
    basicSalary: 5000,
    houseAllowance: 1000,
    transportAllowance: 500,
    performanceBonus: 1000,
    otherAllowances: 200,
    grossSalary: 7700,
    incomeTax: 770,
    socialSecurity: 385,
    healthInsurance: 150,
    otherDeductions: 100,
    totalDeductions: 1405,
    netSalary: 6295,
    payslipGenerated: true,
    notes: 'March 2024 payslip'
  }
];

// Sample notification data
const sampleNotificationData = [
  {
    employeeId: SAMPLE_EMPLOYEE_ID,
    title: 'New Task Assigned',
    message: 'You have been assigned a new task: Database Optimization',
    type: 'task',
    category: 'assignment',
    isRead: false,
    priority: 'medium',
    actionUrl: '/employee-dashboard/tasks'
  },
  {
    employeeId: SAMPLE_EMPLOYEE_ID,
    title: 'Leave Request Approved',
    message: 'Your sick leave request for January 15th has been approved',
    type: 'success',
    category: 'leave',
    isRead: false,
    priority: 'low',
    actionUrl: '/employee-dashboard/leave'
  },
  {
    employeeId: SAMPLE_EMPLOYEE_ID,
    title: 'Performance Review Due',
    message: 'Your quarterly performance review is due next week',
    type: 'reminder',
    category: 'performance',
    isRead: true,
    readAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    priority: 'high',
    actionUrl: '/employee-dashboard/performance'
  },
  {
    employeeId: SAMPLE_EMPLOYEE_ID,
    title: 'Payslip Available',
    message: 'Your March 2024 payslip is now available for download',
    type: 'info',
    category: 'payroll',
    isRead: false,
    priority: 'medium',
    actionUrl: '/employee-dashboard/payroll'
  }
];

// Function to populate sample data
async function populateSampleData() {
  try {
    console.log('Starting to populate sample employee data...');
    
    // Check if employee ID is set
    if (SAMPLE_EMPLOYEE_ID === 'YOUR_EMPLOYEE_ID_HERE') {
      console.error('❌ Please set SAMPLE_EMPLOYEE_ID to an actual employee ID from your database');
      console.log('To find an employee ID, check your employees collection in MongoDB');
      return;
    }

    // Clear existing data for this employee
    await Promise.all([
      EmployeeAttendance.deleteMany({ employeeId: SAMPLE_EMPLOYEE_ID }),
      EmployeeTask.deleteMany({ employeeId: SAMPLE_EMPLOYEE_ID }),
      EmployeeLeave.deleteMany({ employeeId: SAMPLE_EMPLOYEE_ID }),
      EmployeePayroll.deleteMany({ employeeId: SAMPLE_EMPLOYEE_ID }),
      EmployeeNotification.deleteMany({ employeeId: SAMPLE_EMPLOYEE_ID })
    ]);

    console.log('✅ Cleared existing data for employee:', SAMPLE_EMPLOYEE_ID);

    // Insert sample data
    const [attendanceResult, taskResult, leaveResult, payrollResult, notificationResult] = await Promise.all([
      EmployeeAttendance.insertMany(sampleAttendanceData),
      EmployeeTask.insertMany(sampleTaskData),
      EmployeeLeave.insertMany(sampleLeaveData),
      EmployeePayroll.insertMany(samplePayrollData),
      EmployeeNotification.insertMany(sampleNotificationData)
    ]);

    console.log('✅ Sample data populated successfully!');
    console.log(`   - Attendance records: ${attendanceResult.length}`);
    console.log(`   - Tasks: ${taskResult.length}`);
    console.log(`   - Leave requests: ${leaveResult.length}`);
    console.log(`   - Payroll records: ${payrollResult.length}`);
    console.log(`   - Notifications: ${notificationResult.length}`);

    console.log('\n🎉 Employee dashboard is now ready with sample data!');
    console.log('You can now test the employee dashboard functionality.');

  } catch (error) {
    console.error('❌ Error populating sample data:', error);
  }
}

// Function to get sample data without inserting (for reference)
function getSampleData() {
  return {
    attendance: sampleAttendanceData,
    tasks: sampleTaskData,
    leaves: sampleLeaveData,
    payroll: samplePayrollData,
    notifications: sampleNotificationData
  };
}

module.exports = {
  populateSampleData,
  getSampleData,
  SAMPLE_EMPLOYEE_ID
};

// If this file is run directly, populate the data
if (require.main === module) {
  // Connect to MongoDB first
  require('dotenv').config();
  
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected');
    return populateSampleData();
  })
  .then(() => {
    console.log('Sample data population completed');
    process.exit(0);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
}
