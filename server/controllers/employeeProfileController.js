const Employee = require('../models/Employee');

// Get employee profile
exports.getProfile = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await Employee.findById(employeeId)
      .select('-password')
      .populate('department', 'name')
      .populate('designation', 'name');

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee profile:', error);
    res.status(500).json({ error: 'Failed to fetch employee profile' });
  }
};

// Update employee profile (personal information only)
exports.updateProfile = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      emergencyContact
    } = req.body;

    // Only allow updating personal information
    const updateData = {};
    
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (emergencyContact) updateData.emergencyContact = emergencyContact;

    // Add update timestamp
    updateData.lastProfileUpdate = new Date();

    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({
      message: 'Profile updated successfully',
      employee: updatedEmployee
    });
  } catch (error) {
    console.error('Error updating employee profile:', error);
    res.status(500).json({ error: 'Failed to update employee profile' });
  }
};

// Update profile picture
exports.updateProfilePicture = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { profilePicture } = req.body;

    if (!profilePicture) {
      return res.status(400).json({ error: 'Profile picture is required' });
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      employeeId,
      { 
        profilePicture,
        lastProfileUpdate: new Date()
      },
      { new: true }
    ).select('-password');

    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({
      message: 'Profile picture updated successfully',
      profilePicture: updatedEmployee.profilePicture
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ error: 'Failed to update profile picture' });
  }
};

// Request profile update (for HR approval)
exports.requestProfileUpdate = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const updateRequest = req.body;

    // Create a profile update request
    // This would typically go to a separate collection for approval workflow
    // For now, we'll just log the request
    
    console.log('Profile update request:', {
      employeeId,
      requestedChanges: updateRequest,
      timestamp: new Date()
    });

    res.json({
      message: 'Profile update request submitted for HR approval',
      requestId: `REQ_${Date.now()}`,
      status: 'pending'
    });
  } catch (error) {
    console.error('Error submitting profile update request:', error);
    res.status(500).json({ error: 'Failed to submit profile update request' });
  }
};

// Get profile update history
exports.getProfileUpdateHistory = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // This would typically fetch from a profile update requests collection
    // For now, return mock data
    const updateHistory = [
      {
        id: 'REQ_001',
        type: 'Personal Information',
        requestedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: 'approved',
        approvedBy: 'HR Manager',
        approvedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'REQ_002',
        type: 'Profile Picture',
        requestedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        status: 'approved',
        approvedBy: 'HR Manager',
        approvedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000)
      }
    ];

    res.json(updateHistory);
  } catch (error) {
    console.error('Error fetching profile update history:', error);
    res.status(500).json({ error: 'Failed to fetch profile update history' });
  }
};
