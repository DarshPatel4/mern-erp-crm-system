const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    let employeeId = null;
    if (user.role === 'employee') {
      let employee = await Employee.findOne({ userId: user._id });

      if (!employee) {
        employee = await Employee.findOne({ email: user.email });
      }

      if (employee && !employee.userId) {
        employee.userId = user._id;
        await employee.save();
      }

      employeeId = employee ? employee._id : null;
    }

    const tokenPayload = {
      userId: user._id,
      role: user.role,
      ...(employeeId ? { employeeId } : {})
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeId
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout (handled client-side by deleting token)
router.post('/logout', (req, res) => {
  // No server-side action needed for JWT logout
  res.json({ message: 'Logged out' });
});

module.exports = router; 