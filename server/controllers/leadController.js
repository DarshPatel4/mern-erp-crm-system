const Lead = require('../models/Lead');
const Employee = require('../models/Employee');

// Get all leads with pagination, sorting, and filtering
exports.getLeads = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search = '',
      status = '',
      priority = '',
      assignedTo = ''
    } = req.query;

    const skip = (page - 1) * limit;
    
    // Build filter object
    const filter = { isActive: true };
    
    if (search) {
      filter.$or = [
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const leads = await Lead.find(filter)
      .populate('assignedTo', 'name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Lead.countDocuments(filter);

    res.json({
      leads,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        totalRecords: total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get lead by ID
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('assignedTo', 'name email');
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new lead
exports.createLead = async (req, res) => {
  try {
    const lead = new Lead(req.body);
    const savedLead = await lead.save();
    const populatedLead = await Lead.findById(savedLead._id).populate('assignedTo', 'name email');
    res.status(201).json(populatedLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update lead
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email');
    
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete lead (soft delete)
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }
    
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get lead statistics
exports.getLeadStats = async (req, res) => {
  try {
    const stats = await Lead.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalLeads: { $sum: 1 },
          convertedLeads: {
            $sum: { $cond: [{ $eq: ['$status', 'Converted'] }, 1, 0] }
          },
          needsFollowUp: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ['$status', 'Converted'] },
                    { $ne: ['$status', 'Lost'] },
                    {
                      $or: [
                        { $eq: ['$lastContact', null] },
                        {
                          $lte: [
                            '$lastContact',
                            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
                          ]
                        }
                      ]
                    }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const result = stats[0] || { totalLeads: 0, convertedLeads: 0, needsFollowUp: 0 };
    const conversionRate = result.totalLeads > 0 
      ? ((result.convertedLeads / result.totalLeads) * 100).toFixed(1) 
      : 0;

    res.json({
      totalLeads: result.totalLeads,
      convertedLeads: result.convertedLeads,
      conversionRate: parseFloat(conversionRate),
      needsFollowUp: result.needsFollowUp
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get employees for assignment dropdown
exports.getEmployeesForAssignment = async (req, res) => {
  try {
    const employees = await Employee.find({ status: 'Active' })
      .select('name email')
      .sort({ name: 1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export leads to CSV
exports.exportLeads = async (req, res) => {
  try {
    const { search = '', status = '', priority = '', assignedTo = '' } = req.query;
    
    // Build filter object
    const filter = { isActive: true };
    
    if (search) {
      filter.$or = [
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;

    const leads = await Lead.find(filter)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    // Generate CSV content
    const csvHeaders = [
      'Company',
      'Email',
      'Phone',
      'Status',
      'Priority',
      'Assigned To',
      'Last Contact',
      'Source',
      'Estimated Value',
      'Notes',
      'Created Date'
    ];

    const csvRows = leads.map(lead => [
      `"${lead.company || ''}"`,
      `"${lead.email || ''}"`,
      `"${lead.phone || ''}"`,
      `"${lead.status || ''}"`,
      `"${lead.priority || ''}"`,
      `"${lead.assignedTo?.name || 'Unassigned'}"`,
      `"${lead.lastContact ? new Date(lead.lastContact).toISOString().split('T')[0] : ''}"`,
      `"${lead.source || ''}"`,
      `"${lead.estimatedValue || ''}"`,
      `"${(lead.notes || '').replace(/"/g, '""')}"`,
      `"${lead.createdAt ? new Date(lead.createdAt).toISOString().split('T')[0] : ''}"`
    ]);

    const csvContent = [csvHeaders.join(','), ...csvRows.map(row => row.join(','))].join('\n');

    // Set response headers for CSV download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="leads_export_${new Date().toISOString().split('T')[0]}.csv"`);
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Pragma', 'no-cache');

    res.send(csvContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 