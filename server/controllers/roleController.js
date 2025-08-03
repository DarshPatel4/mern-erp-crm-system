const Role = require('../models/Role');
const User = require('../models/User');

// Get all roles
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find({ isActive: true });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new role
exports.createRole = async (req, res) => {
  try {
    const { name, description, color, permissions } = req.body;
    
    // Check if role already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ message: 'Role with this name already exists' });
    }

    const role = new Role({
      name,
      description,
      color,
      permissions
    });

    const savedRole = await role.save();
    res.status(201).json(savedRole);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update role
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const role = await Role.findByIdAndUpdate(id, updates, { new: true });
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete role
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if any users are using this role
    const usersWithRole = await User.countDocuments({ role: id });
    if (usersWithRole > 0) {
      return res.status(400).json({ message: 'Cannot delete role that is assigned to users' });
    }
    
    const role = await Role.findByIdAndDelete(id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get role by ID
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id);
    
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    
    res.json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update role user count
exports.updateRoleUserCount = async (req, res) => {
  try {
    const roles = await Role.find();
    
    for (const role of roles) {
      const userCount = await User.countDocuments({ role: role.name });
      role.userCount = userCount;
      await role.save();
    }
    
    res.json({ message: 'Role user counts updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 