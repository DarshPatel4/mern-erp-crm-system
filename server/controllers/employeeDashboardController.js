const Employee = require('../models/Employee');
const EmployeeAttendance = require('../models/EmployeeAttendance');
const EmployeeTask = require('../models/EmployeeTask');
const EmployeeLeave = require('../models/EmployeeLeave');
const EmployeePayroll = require('../models/EmployeePayroll');
const EmployeeNotification = require('../models/EmployeeNotification');
const mongoose = require('mongoose');

// Get employee dashboard summary data
exports.getDashboardSummary = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // Get current month's attendance
    const monthStart = new Date(currentYear, currentMonth - 1, 1);
    const monthEnd = new Date(currentYear, currentMonth, 0);

    const [attendanceStats, taskStats, leaveBalance, notifications] = await Promise.all([
      // Attendance statistics
      EmployeeAttendance.aggregate([
        {
          $match: {
            employeeId: new mongoose.Types.ObjectId(employeeId),
            date: { $gte: monthStart, $lte: monthEnd }
          }
        },
        {
          $group: {
            _id: null,
            totalDays: { $sum: 1 },
            presentDays: {
              $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] }
            },
            absentDays: {
              $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] }
            },
            leaveDays: {
              $sum: { $cond: [{ $eq: ['$status', 'leave'] }, 1, 0] }
            }
          }
        }
      ]),

      // Task statistics
      EmployeeTask.aggregate([
        {
          $match: {
            employeeId: new mongoose.Types.ObjectId(employeeId),
            dueDate: { $gte: new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            },
            inProgress: {
              $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] }
            },
            urgent: {
              $sum: { $cond: [{ $eq: ['$status', 'urgent'] }, 1, 0] }
            }
          }
        }
      ]),

      // Leave balance
      EmployeeLeave.aggregate([
        {
          $match: {
            employeeId: new mongoose.Types.ObjectId(employeeId),
            status: 'approved',
            startDate: { $gte: new Date(currentYear, 0, 1) }
          }
        },
        {
          $group: {
            _id: '$leaveType',
            totalDays: { $sum: '$totalDays' }
          }
        }
      ]),

      // Recent notifications
      EmployeeNotification.find({
        employeeId: new mongoose.Types.ObjectId(employeeId),
        isRead: false
      })
      .sort({ createdAt: -1 })
      .limit(5)
    ]);

    // Calculate attendance rate
    const attendanceData = attendanceStats[0] || { totalDays: 0, presentDays: 0 };
    const attendanceRate = attendanceData.totalDays > 0 
      ? Math.round((attendanceData.presentDays / attendanceData.totalDays) * 100) 
      : 0;

    // Calculate task completion rate
    const taskData = taskStats[0] || { total: 0, completed: 0 };
    const taskCompletionRate = taskData.total > 0 
      ? Math.round((taskData.completed / taskData.total) * 100) 
      : 0;

    // Calculate leave balance
    const leaveBalanceData = leaveBalance.reduce((acc, leave) => {
      acc[leave._id] = leave.totalDays;
      return acc;
    }, {});

    const response = {
      attendanceRate,
      thisMonth: {
        days: attendanceData.totalDays || 0,
        status: attendanceData.presentDays > 0 ? 'Present' : 'Not Started'
      },
      tasksCompleted: {
        completed: taskData.completed || 0,
        total: taskData.total || 0
      },
      leaveBalance: {
        annual: 12 - (leaveBalanceData['Annual Leave'] || 0),
        sick: 5 - (leaveBalanceData['Sick Leave'] || 0),
        personal: 3 - (leaveBalanceData['Personal Leave'] || 0)
      },
      performance: 4.8, // This would come from performance reviews
      notifications: notifications.map(n => ({
        id: n._id,
        title: n.title,
        message: n.message,
        type: n.type,
        time: n.createdAt
      }))
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

// Get employee attendance data
exports.getAttendanceData = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { month, year } = req.query;

    const query = { employeeId: new mongoose.Types.ObjectId(employeeId) };
    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const attendance = await EmployeeAttendance.find(query)
      .sort({ date: 1 });

    res.json(attendance);
  } catch (error) {
    console.error('Error fetching attendance data:', error);
    res.status(500).json({ error: 'Failed to fetch attendance data' });
  }
};

// Get employee tasks
exports.getTasks = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { status, priority } = req.query;

    const query = { employeeId: new mongoose.Types.ObjectId(employeeId) };
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await EmployeeTask.find(query)
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// Get employee leave requests
exports.getLeaveRequests = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { status } = req.query;

    const query = { employeeId: new mongoose.Types.ObjectId(employeeId) };
    if (status) query.status = status;

    const leaves = await EmployeeLeave.find(query)
      .sort({ startDate: -1 });

    res.json(leaves);
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    res.status(500).json({ error: 'Failed to fetch leave requests' });
  }
};

// Get employee payroll data
exports.getPayrollData = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { month, year } = req.query;

    const query = { employeeId: new mongoose.Types.ObjectId(employeeId) };
    if (month && year) {
      query.month = parseInt(month);
      query.year = parseInt(year);
    }

    const payroll = await EmployeePayroll.find(query)
      .sort({ year: -1, month: -1 });

    res.json(payroll);
  } catch (error) {
    console.error('Error fetching payroll data:', error);
    res.status(500).json({ error: 'Failed to fetch payroll data' });
  }
};

// Get employee notifications
exports.getNotifications = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { unreadOnly } = req.query;

    const query = { employeeId: new mongoose.Types.ObjectId(employeeId) };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await EmployeeNotification.find(query)
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

// Mark notification as read
exports.markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    await EmployeeNotification.findByIdAndUpdate(notificationId, {
      isRead: true,
      readAt: new Date()
    });

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};
