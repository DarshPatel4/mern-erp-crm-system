const Leave = require('../models/Leave');
const Employee = require('../models/Employee');

exports.getLeaves = async (req, res) => {
  try {
    const { employee, status } = req.query;
    const query = {};
    if (employee) query.employee = employee;
    if (status) query.status = status;
    const records = await Leave.find(query)
      .populate('employee', 'name')
      .populate('approver', 'name')
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch leaves', details: err.message });
  }
}; 