const Department = require('../models/Department');
const Employee = require('../models/Employee');

exports.getDepartments = async (req, res) => {
  try {
    const records = await Department.find();

    // Refresh employee counts based on Employee collection
    const departmentNames = records.map(d => d.name);
    const counts = await Employee.aggregate([
      { $match: { department: { $in: departmentNames } } },
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);
    const nameToCount = counts.reduce((acc, c) => { acc[c._id] = c.count; return acc; }, {});

    const updated = await Promise.all(records.map(async (dept) => {
      const newCount = nameToCount[dept.name] || 0;
      if (dept.employeeCount !== newCount) {
        dept.employeeCount = newCount;
        await dept.save();
      }
      return dept;
    }));

    res.json(updated);
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

// Update department (supports rename and color change)
exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    // If name changes, propagate to Employee documents that reference by name
    const nameChanged = name && name !== department.name;
    const previousName = department.name;

    if (typeof name === 'string' && name.trim().length > 0) {
      department.name = name.trim();
    }
    if (typeof color === 'string' && color.trim().length > 0) {
      department.color = color.trim();
    }

    await department.save();

    if (nameChanged) {
      await Employee.updateMany({ department: previousName }, { $set: { department: department.name } });
    }

    // Update count post-change
    const employeeCount = await Employee.countDocuments({ department: department.name });
    if (department.employeeCount !== employeeCount) {
      department.employeeCount = employeeCount;
      await department.save();
    }

    res.json(department);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update department', details: err.message });
  }
};

// Delete department. Optionally reassign employees to "Unassigned" if requested
exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reassignTo } = req.body || {};
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ error: 'Department not found' });
    }

    const employeeCount = await Employee.countDocuments({ department: department.name });
    if (employeeCount > 0) {
      if (!reassignTo) {
        return res.status(400).json({ error: 'Department has employees. Provide reassignTo or remove employees first.' });
      }
      // Ensure target exists (create Unassigned if needed)
      let target = await Department.findOne({ name: reassignTo });
      if (!target) {
        target = new Department({ name: reassignTo, color: '#6B7280' });
        await target.save();
      }
      await Employee.updateMany({ department: department.name }, { $set: { department: target.name } });
      target.employeeCount = await Employee.countDocuments({ department: target.name });
      await target.save();
    }

    await Department.findByIdAndDelete(id);
    return res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete department', details: err.message });
  }
};