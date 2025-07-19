const express = require('express');
const { auth, roleCheck } = require('../middleware/auth');

const router = express.Router();

router.get('/admin-data', auth, roleCheck('admin'), (req, res) => {
  res.json({ message: 'This is protected admin data.' });
});

module.exports = router; 