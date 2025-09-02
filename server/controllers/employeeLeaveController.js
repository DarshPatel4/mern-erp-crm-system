const EmployeeLeave = require('../models/EmployeeLeave');
const Employee = require('../models/Employee');
const mongoose = require('mongoose');

// Apply for leave
exports.applyLeave = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const {
      leaveType,
      startDate,
      endDate,
      duration,
      reason,
      supportingDocuments
    } = req.body;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start < new Date()) {
      return res.status(400).json({ error: 'Start date cannot be in the past' });
    }
    
    if (end < start) {
      return res.status(400).json({ error: 'End date cannot be before start date' });
    }

    // Check for overlapping leave requests
    const overlappingLeave = await EmployeeLeave.findOne({
      employeeId: new mongoose.Types.ObjectId(employeeId),
      status: { $in: ['pending', 'approved'] },
      $or: [
        {
          startDate: { $lte: end },
          endDate: { $gte: start }
        }
      ]
    });

    if (overlappingLeave) {
      return res.status(400).json({ error: 'Leave request overlaps with existing approved or pending leave' });
    }

    // Create leave request
    const leaveRequest = await EmployeeLeave.create({
      employeeId: new mongoose.Types.ObjectId(employeeId),
      leaveType,
      startDate: start,
      endDate: end,
      duration,
      reason,
      supportingDocuments: supportingDocuments || [],
      status: 'pending',
      totalDays: Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
    });

    res.status(201).json({
      message: 'Leave request submitted successfully',
      leaveRequest: {
        id: leaveRequest._id,
        leaveType: leaveRequest.leaveType,
        startDate: leaveRequest.startDate,
        endDate: leaveRequest.endDate,
        duration: leaveRequest.duration,
        status: leaveRequest.status,
        totalDays: leaveRequest.totalDays
      }
    });
  } catch (error) {
    console.error('Error applying for leave:', error);
    res.status(500).json({ error: 'Failed to submit leave request' });
  }
};

// Get employee's leave requests
exports.getLeaveRequests = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { status, year } = req.query;

    let query = { employeeId: new mongoose.Types.ObjectId(employeeId) };
    
    if (status) {
      query.status = status;
    }
    
    if (year) {
      const yearStart = new Date(parseInt(year), 0, 1);
      const yearEnd = new Date(parseInt(year), 11, 31);
      query.startDate = { $gte: yearStart, $lte: yearEnd };
    }

    const leaveRequests = await EmployeeLeave.find(query)
      .sort({ startDate: -1 })
      .populate('approvedBy', 'name');

    res.json(leaveRequests);
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    res.status(500).json({ error: 'Failed to fetch leave requests' });
  }
};

// Get leave balance
exports.getLeaveBalance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const currentYear = new Date().getFullYear();

    // Get approved leaves for current year
    const approvedLeaves = await EmployeeLeave.find({
      employeeId: new mongoose.Types.ObjectId(employeeId),
      status: 'approved',
      startDate: { $gte: new Date(currentYear, 0, 1) }
    });

    // Calculate leave balance by type
    const leaveBalance = {};
    const totalLeaveDays = 20; // Default annual leave days

    approvedLeaves.forEach(leave => {
      if (!leaveBalance[leave.leaveType]) {
        leaveBalance[leave.leaveType] = 0;
      }
      leaveBalance[leave.leaveType] += leave.totalDays;
    });

    // Calculate remaining balance
    const totalUsed = Object.values(leaveBalance).reduce((sum, days) => sum + days, 0);
    const remainingBalance = totalLeaveDays - totalUsed;

    res.json({
      totalLeaveDays,
      usedLeaveDays: totalUsed,
      remainingBalance,
      leaveBalanceByType: leaveBalance,
      year: currentYear
    });
  } catch (error) {
    console.error('Error fetching leave balance:', error);
    res.status(500).json({ error: 'Failed to fetch leave balance' });
  }
};

// Cancel leave request
exports.cancelLeaveRequest = async (req, res) => {
  try {
    const { employeeId, leaveId } = req.params;

    const leaveRequest = await EmployeeLeave.findOne({
      _id: leaveId,
      employeeId: new mongoose.Types.ObjectId(employeeId)
    });

    if (!leaveRequest) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    if (leaveRequest.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending leave requests can be cancelled' });
    }

    if (new Date(leaveRequest.startDate) <= new Date()) {
      return res.status(400).json({ error: 'Cannot cancel leave that has already started' });
    }

    await EmployeeLeave.findByIdAndUpdate(leaveId, { status: 'cancelled' });

    res.json({ message: 'Leave request cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling leave request:', error);
    res.status(500).json({ error: 'Failed to cancel leave request' });
  }
};

// Get leave request by ID
exports.getLeaveRequestById = async (req, res) => {
  try {
    const { employeeId, leaveId } = req.params;

    const leaveRequest = await EmployeeLeave.findOne({
      _id: leaveId,
      employeeId: new mongoose.Types.ObjectId(employeeId)
    }).populate('approvedBy', 'name');

    if (!leaveRequest) {
      return res.status(404).json({ error: 'Leave request not found' });
    }

    res.json(leaveRequest);
  } catch (error) {
    console.error('Error fetching leave request:', error);
    res.status(500).json({ error: 'Failed to fetch leave request' });
  }
};
