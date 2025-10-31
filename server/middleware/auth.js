const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

function roleCheck(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient role' });
    }
    next();
  };
}

function ensureEmployeeAccess(paramName = 'employeeId') {
  return (req, res, next) => {
    const { role, userId, employeeId: tokenEmployeeId } = req.user || {};

    if (role !== 'employee') {
      return next();
    }

    const targetId = req.params[paramName] || req.body[paramName] || req.query[paramName];

    if (!targetId) {
      return res.status(400).json({ message: 'Employee identifier is required' });
    }

    if (tokenEmployeeId && tokenEmployeeId !== targetId) {
      return res.status(403).json({ message: 'Access denied: cannot access other employee records' });
    }

    if (!tokenEmployeeId) {
      return res.status(403).json({ message: 'Access denied: employee profile not linked' });
    }

    next();
  };
}

module.exports = { auth, roleCheck, ensureEmployeeAccess };