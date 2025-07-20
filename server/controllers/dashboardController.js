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
    // Leads Change (mocked for now)
    const leadsChange = 12.5;
    // Leads Target (mocked)
    const leadsTarget = 150;
    // Leads Achieved (mocked)
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
    // Sales Pipeline (real counts by status)
    const pipelineStages = ['New', 'Contacted', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won'];
    const salesPipeline = await Promise.all(
      pipelineStages.map(async label => ({ label, value: await Lead.countDocuments({ status: label }) }))
    );
    // Upcoming Tasks (next 4 pending tasks by due date)
    const upcomingTasksDocs = await Task.find({ status: 'Pending' }).sort({ dueDate: 1 }).limit(4);
    const upcomingTasks = upcomingTasksDocs.map(t => ({
      title: t.title,
      due: `Due in ${Math.ceil((t.dueDate - new Date()) / (1000*60*60*24))} days`,
      priority: t.priority.charAt(0).toUpperCase() + t.priority.slice(1)
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
      performance,
      notifications,
      salesPipeline,
      upcomingTasks
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load dashboard data', details: err.message });
  }
}; 