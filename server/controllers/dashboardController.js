const Lead = require('../models/Lead');
const Employee = require('../models/Employee');
const Invoice = require('../models/Invoice');
const Task = require('../models/Task');

exports.getDashboardSummary = async (req, res) => {
  try {
    // Active Leads (status not Lost or Closed Won)
    const activeLeads = await Lead.countDocuments({ status: { $nin: ['Lost', 'Closed Won'] } });
    // Monthly Revenue (sum of Paid invoices in current month)
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const monthlyRevenueAgg = await Invoice.aggregate([
      { $match: { status: 'Paid', createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const monthlyRevenue = monthlyRevenueAgg[0]?.total || 0;
    // Tasks Due Today
    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
    const tasksDueToday = await Task.countDocuments({ dueDate: { $gte: today, $lt: tomorrow }, status: 'Pending' });
    // Total Leads
    const totalLeads = await Lead.countDocuments();
    // Calculate leads change (comparing current month vs previous month)
    const currentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const previousMonth = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
    const currentMonthLeads = await Lead.countDocuments({ createdAt: { $gte: currentMonth } });
    const previousMonthLeads = await Lead.countDocuments({ 
      createdAt: { $gte: previousMonth, $lt: currentMonth } 
    });
    const leadsChange = previousMonthLeads > 0 ? 
      ((currentMonthLeads - previousMonthLeads) / previousMonthLeads * 100).toFixed(1) : 
      currentMonthLeads > 0 ? 100 : 0;
    // Leads Target (set to 150 or 20% more than current total, whichever is higher)
    const leadsTarget = Math.max(150, Math.round(totalLeads * 1.2));
    // Leads Achieved (percentage of target achieved)
    const leadsAchieved = Math.round((totalLeads / leadsTarget) * 100);
    // Employee Count
    const employeeCount = await Employee.countDocuments();
    // Employee Change (mocked)
    const employeeChange = 5.2;
    // Departments (mocked)
    const departments = 5;
    // Avg Tenure (mocked)
    const avgTenure = 3.2;
    // Revenue (sum of all Paid invoices)
    const revenueAgg = await Invoice.aggregate([
      { $match: { status: 'Paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const revenue = revenueAgg[0]?.total || 0;
    // Revenue Change (mocked)
    const revenueChange = 8.2;
    // Sales/Services (mocked)
    const sales = Math.round(revenue * 0.75);
    const services = revenue - sales;
    // Ongoing Tasks (Pending)
    const ongoingTasks = await Task.countDocuments({ status: 'Pending' });
    // Tasks Change (mocked)
    const tasksChange = -4.2;
    // Urgent/High/Normal Tasks
    const urgentTasks = await Task.countDocuments({ priority: 'High', status: 'Pending' });
    const highTasks = await Task.countDocuments({ priority: 'Medium', status: 'Pending' });
    const normalTasks = await Task.countDocuments({ priority: 'Low', status: 'Pending' });
    // Performance (mocked)
    const performance = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      current: [5000, 9000, 12000, 15000, 13000, 17000, 20000],
      previous: [4000, 7000, 10000, 12000, 11000, 14000, 16000]
    };
    // Notifications (mocked)
    const notifications = [
      { type: 'info', message: 'New lead assigned to you', detail: 'Acme Corp - Enterprise Plan', time: '5 minutes ago' },
      { type: 'success', message: 'Invoice #1234 paid', detail: '$1,200.00 received', time: '1 hour ago' },
      { type: 'warning', message: 'Task deadline approaching', detail: 'Website redesign project', time: '3 hours ago' },
      { type: 'comment', message: 'New comment on task', detail: 'Mobile app development', time: '5 hours ago' }
    ];
    // Sales Pipeline (real counts by lead status - using actual statuses from Lead model)
    const pipelineStages = ['New', 'Contacted', 'Converted', 'Lost'];
    const salesPipeline = await Promise.all(
      pipelineStages.map(async label => ({ label, value: await Lead.countDocuments({ status: label }) }))
    );
    
    // Additional lead statistics for dashboard
    const leadStats = await Lead.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          totalLeads: { $sum: 1 },
          convertedLeads: { $sum: { $cond: [{ $eq: ['$status', 'Converted'] }, 1, 0] } },
          newLeads: { $sum: { $cond: [{ $eq: ['$status', 'New'] }, 1, 0] } },
          contactedLeads: { $sum: { $cond: [{ $eq: ['$status', 'Contacted'] }, 1, 0] } },
          lostLeads: { $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] } },
          highPriorityLeads: { $sum: { $cond: [{ $eq: ['$priority', 'High'] }, 1, 0] } },
          totalValue: { $sum: '$estimatedValue' }
        }
      }
    ]);
    // Upcoming Tasks (next 4 pending tasks by due date)
    const upcomingTasksDocs = await Task.find({ status: 'Pending' }).sort({ dueDate: 1 }).limit(4);
    const upcomingTasks = upcomingTasksDocs.map(t => ({
      title: t.title,
      due: `Due in ${Math.ceil((t.dueDate - new Date()) / (1000*60*60*24))} days`,
      priority: t.priority.charAt(0).toUpperCase() + t.priority.slice(1)
    }));

    // Recent Leads (last 4 leads created)
    const recentLeadsDocs = await Lead.find({ isActive: true })
      .populate('assignedTo', 'name')
      .sort({ createdAt: -1 })
      .limit(4);
    const recentLeads = recentLeadsDocs.map(lead => ({
      id: lead._id,
      company: lead.company,
      email: lead.email,
      status: lead.status,
      priority: lead.priority,
      value: lead.estimatedValue || 0,
      lastContact: lead.lastContact,
      assignedTo: lead.assignedTo?.name || 'Unassigned'
    }));
    res.json({
      welcome: {
        name: req.user?.name || 'User',
        today: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      },
      kpis: {
        activeLeads,
        monthlyRevenue,
        tasksDueToday,
        totalLeads,
        leadsChange,
        leadsTarget,
        leadsAchieved,
        employeeCount,
        employeeChange,
        departments,
        avgTenure,
        revenue,
        revenueChange,
        sales,
        services,
        ongoingTasks,
        tasksChange,
        urgentTasks,
        highTasks,
        normalTasks
      },
      leadStats: leadStats[0] || {
        totalLeads: 0,
        convertedLeads: 0,
        newLeads: 0,
        contactedLeads: 0,
        lostLeads: 0,
        highPriorityLeads: 0,
        totalValue: 0
      },
      performance,
      notifications,
      salesPipeline,
      upcomingTasks,
      recentLeads
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load dashboard data', details: err.message });
  }
}; 