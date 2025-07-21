const Department = require('../models/Department');

exports.getDepartments = async (req, res) => {
  try {
    const records = await Department.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch departments', details: err.message });
  }
}; 