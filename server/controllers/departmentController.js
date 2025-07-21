const Department = require('../models/Department');

exports.getDepartments = async (req, res) => {
  try {
    const records = await Department.find();
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch departments', details: err.message });
  }
};

exports.createDepartment = async (req, res) => {
  try {
    const { name, color } = req.body;
    if (!name || !color) {
      return res.status(400).json({ error: 'Name and color are required' });
    }
    const exists = await Department.findOne({ name });
    if (exists) {
      return res.status(400).json({ error: 'Department already exists' });
    }
    const department = new Department({ name, color });
    await department.save();
    res.status(201).json(department);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create department', details: err.message });
  }
}; 