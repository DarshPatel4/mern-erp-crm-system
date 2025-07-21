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

exports.createEmployee = async (req, res) => {
  try {
    const { name, email, department, designation, hireDate, status } = req.body;
    const employee = new Employee({ name, email, department, designation, hireDate, status });
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create employee', details: err.message });
  }
};

exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch employee', details: err.message });
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { name, email, department, designation, hireDate, status } = req.body;
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { name, email, department, designation, hireDate, status },
      { new: true, runValidators: true }
    );
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update employee', details: err.message });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete employee', details: err.message });
  }
}; 