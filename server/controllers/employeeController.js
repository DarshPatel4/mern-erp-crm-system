const Employee = require('../models/Employee');

exports.getEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', department = '', status = '' } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    if (department) query.department = department;
    if (status) query.status = status;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Employee.countDocuments(query);
    const employees = await Employee.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(parseInt(limit));
    res.json({ employees, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employees', details: err.message });
  }
}; 