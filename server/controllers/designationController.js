const Designation = require('../models/Designation');

exports.getDesignations = async (req, res) => {
  try {
    const records = await Designation.find().populate('department', 'name');
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch designations', details: err.message });
  }
}; 