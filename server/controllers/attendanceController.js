const Attendance = require('../models/Attendance');
const Employee = require('../models/Employee');

exports.getAttendance = async (req, res) => {
  try {
    const { employee, month } = req.query;
    const query = {};
    if (employee) query.employee = employee;
    if (month) {
      const [year, m] = month.split('-');
      const start = new Date(year, m - 1, 1);
      const end = new Date(year, m, 1);
      query.date = { $gte: start, $lt: end };
    }
    const records = await Attendance.find(query).populate('employee', 'name');
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch attendance', details: err.message });
  }
}; 