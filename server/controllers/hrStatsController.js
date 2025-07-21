const Employee = require('../models/Employee');
const Department = require('../models/Department');
const Leave = require('../models/Leave');

exports.getHRStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: 'Active' });
    // On Leave: count of employees who have an approved leave for today
    const today = new Date();
    const onLeaveEmployees = await Leave.countDocuments({
      status: 'Approved',
      startDate: { $lte: today },
      endDate: { $gte: today }
    });
    const departments = await Department.countDocuments();
    // Pending leave requests
    const pendingLeaveRequests = await Leave.countDocuments({ status: 'Pending' });
    res.json({
      totalEmployees,
      activeEmployees,
      onLeaveEmployees,
      departments,
      pendingLeaveRequests
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch HR stats', details: err.message });
  }
}; 