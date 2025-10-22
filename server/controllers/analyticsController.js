const Lead = require('../models/Lead');
const Employee = require('../models/Employee');
const Task = require('../models/Task');
const Invoice = require('../models/Invoice');
const EmployeeTask = require('../models/EmployeeTask');
const mongoose = require('mongoose');

// Helper function to get date range based on filter
const getDateRange = (filter) => {
  const now = new Date();
  const startDate = new Date();
  
  switch (filter) {
    case '30days':
      startDate.setDate(now.getDate() - 30);
      break;
    case '90days':
      startDate.setDate(now.getDate() - 90);
      break;
    case '1year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate.setDate(now.getDate() - 30);
  }
  
  return { startDate, endDate: now };
};

// Get analytics data
const getAnalyticsData = async (req, res) => {
  try {
    const { filter = '30days' } = req.query;
    const { startDate, endDate } = getDateRange(filter);
    
    // Get summary data
    const [
      totalClients,
      totalEmployees,
      activeLeads,
      openTasks,
      pendingInvoices,
      previousPeriodData
    ] = await Promise.all([
      // Current period data
      Lead.countDocuments({ status: { $in: ['converted', 'customer'] } }),
      Employee.countDocuments(),
      Lead.countDocuments({ status: { $in: ['new', 'contacted', 'qualified', 'proposal'] } }),
      Task.countDocuments({ status: { $in: ['Pending', 'In Progress'] } }),
      Invoice.countDocuments({ status: 'pending' }),
      
      // Previous period data for comparison
      getPreviousPeriodData(filter)
    ]);

    // Calculate percentage changes
    const clientsChange = calculatePercentageChange(previousPeriodData.clients, totalClients);
    const employeesChange = calculatePercentageChange(previousPeriodData.employees, totalEmployees);
    const leadsChange = calculatePercentageChange(previousPeriodData.leads, activeLeads);
    const tasksChange = calculatePercentageChange(previousPeriodData.tasks, openTasks);
    const invoicesChange = calculatePercentageChange(previousPeriodData.invoices, pendingInvoices);

    // Get overdue invoices percentage
    const overdueInvoices = await Invoice.countDocuments({
      status: 'pending',
      dueDate: { $lt: new Date() }
    });
    const overduePercentage = pendingInvoices > 0 ? Math.round((overdueInvoices / pendingInvoices) * 100) : 0;

    // Get revenue data for the past 12 months
    const revenueData = await getRevenueData();
    
    // Get lead conversion data
    const leadData = await getLeadConversionData();
    
    // Get employee performance data
    const employeePerformance = await getEmployeePerformanceData();
    
    // Get task status data
    const taskData = await getTaskStatusData();
    
    // Get lead distribution data
    const leadDistribution = await getLeadDistributionData();
    
    // Get top clients
    const topClients = await getTopClients();
    
    // Get top performers
    const topPerformers = await getTopPerformers();

    res.json({
      summary: {
        totalClients,
        totalEmployees,
        activeLeads,
        openTasks,
        pendingInvoices,
        clientsChange,
        employeesChange,
        leadsChange,
        tasksChange,
        invoicesChange,
        overduePercentage
      },
      revenue: revenueData,
      leads: leadData,
      employeePerformance,
      tasks: taskData,
      leadDistribution,
      topClients,
      topPerformers
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
};

// Export analytics data
const exportAnalytics = async (req, res) => {
  try {
    const { format = 'pdf', filter = '30days' } = req.query;
    
    // Get analytics data
    const analyticsData = await getAnalyticsDataForExport(filter);
    
    if (format === 'csv') {
      const csv = generateCSV(analyticsData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=analytics-report.csv');
      res.send(csv);
    } else {
      // For PDF, you would use a PDF generation library like puppeteer or jsPDF
      res.status(501).json({ error: 'PDF export not implemented yet' });
    }
  } catch (error) {
    console.error('Error exporting analytics:', error);
    res.status(500).json({ error: 'Failed to export analytics data' });
  }
};

// Helper functions
const getPreviousPeriodData = async (filter) => {
  const now = new Date();
  let startDate, endDate;
  
  switch (filter) {
    case '30days':
      startDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000); // 60 days ago
      endDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
      break;
    case '90days':
      startDate = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000); // 180 days ago
      endDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); // 90 days ago
      break;
    case '1year':
      startDate = new Date(now.getFullYear() - 2, 0, 1); // 2 years ago
      endDate = new Date(now.getFullYear() - 1, 11, 31); // 1 year ago
      break;
    default:
      startDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
      endDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  const [clients, employees, leads, tasks, invoices] = await Promise.all([
    Lead.countDocuments({ 
      status: { $in: ['converted', 'customer'] },
      createdAt: { $gte: startDate, $lte: endDate }
    }),
    Employee.countDocuments({ 
      createdAt: { $gte: startDate, $lte: endDate }
    }),
    Lead.countDocuments({ 
      status: { $in: ['new', 'contacted', 'qualified', 'proposal'] },
      createdAt: { $gte: startDate, $lte: endDate }
    }),
    Task.countDocuments({ 
      status: { $in: ['Pending', 'In Progress'] },
      created_at: { $gte: startDate, $lte: endDate }
    }),
    Invoice.countDocuments({ 
      status: 'pending',
      createdAt: { $gte: startDate, $lte: endDate }
    })
  ]);

  return { clients, employees, leads, tasks, invoices };
};

const calculatePercentageChange = (oldValue, newValue) => {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return Math.round(((newValue - oldValue) / oldValue) * 100);
};

const getRevenueData = async () => {
  try {
    const months = [];
    const revenue = [];
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleString('default', { month: 'short' });
      months.push(monthName);
      
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const monthlyRevenue = await Invoice.aggregate([
        {
          $match: {
            status: 'paid',
            paidDate: { $gte: startOfMonth, $lte: endOfMonth }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$totalAmount' }
          }
        }
      ]);
      
      revenue.push(monthlyRevenue.length > 0 ? monthlyRevenue[0].total : 0);
    }
    
    return { months, revenue };
  } catch (error) {
    console.error('Error getting revenue data:', error);
    return { months: [], revenue: [] };
  }
};

const getLeadConversionData = async () => {
  try {
    const totalLeads = await Lead.countDocuments();
    const opportunities = await Lead.countDocuments({ status: { $in: ['qualified', 'proposal'] } });
    const converted = await Lead.countDocuments({ status: 'converted' });
    
    return { totalLeads, opportunities, converted };
  } catch (error) {
    console.error('Error getting lead conversion data:', error);
    return { totalLeads: 0, opportunities: 0, converted: 0 };
  }
};

const getEmployeePerformanceData = async () => {
  try {
    const departments = ['Development', 'Sales', 'Marketing', 'HR', 'Finance'];
    const completionRates = [];
    
    for (const dept of departments) {
      const employees = await Employee.find({ department: dept });
      const employeeIds = employees.map(emp => emp._id);
      
      const totalTasks = await EmployeeTask.countDocuments({ 
        employeeId: { $in: employeeIds } 
      });
      const completedTasks = await EmployeeTask.countDocuments({ 
        employeeId: { $in: employeeIds },
        status: 'completed'
      });
      
      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      completionRates.push(completionRate);
    }
    
    return { departments, completionRates };
  } catch (error) {
    console.error('Error getting employee performance data:', error);
    return { departments: ['Development', 'Sales', 'Marketing', 'HR', 'Finance'], completionRates: [0, 0, 0, 0, 0] };
  }
};

const getTaskStatusData = async () => {
  try {
    const [completed, inProgress, pending, overdue] = await Promise.all([
      Task.countDocuments({ status: 'Completed' }),
      Task.countDocuments({ status: 'In Progress' }),
      Task.countDocuments({ status: 'Pending' }),
      Task.countDocuments({ 
        status: { $in: ['Pending', 'In Progress'] },
        due_date: { $lt: new Date() }
      })
    ]);
    
    return { completed, inProgress, pending, overdue };
  } catch (error) {
    console.error('Error getting task status data:', error);
    return { completed: 0, inProgress: 0, pending: 0, overdue: 0 };
  }
};

const getLeadDistributionData = async () => {
  try {
    const regions = await Lead.aggregate([
      {
        $group: {
          _id: '$region',
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          name: '$_id',
          count: 1,
          _id: 0
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    return regions;
  } catch (error) {
    console.error('Error getting lead distribution data:', error);
    return [];
  }
};

const getTopClients = async () => {
  try {
    const topClients = await Invoice.aggregate([
      {
        $match: { status: 'paid' }
      },
      {
        $group: {
          _id: '$clientName',
          totalRevenue: { $sum: '$totalAmount' },
          invoiceCount: { $sum: 1 }
        }
      },
      {
        $sort: { totalRevenue: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          name: '$_id',
          totalRevenue: 1,
          invoiceCount: 1,
          industry: 'Technology', // Default industry, you can enhance this
          _id: 0
        }
      }
    ]);
    
    return topClients;
  } catch (error) {
    console.error('Error getting top clients:', error);
    return [];
  }
};

const getTopPerformers = async () => {
  try {
    const topPerformers = await EmployeeTask.aggregate([
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employee'
        }
      },
      {
        $unwind: '$employee'
      },
      {
        $group: {
          _id: '$employeeId',
          name: { $first: '$employee.name' },
          role: { $first: '$employee.role' },
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      },
      {
        $addFields: {
          completionRate: {
            $round: [
              { $multiply: [{ $divide: ['$completedTasks', '$totalTasks'] }, 100] },
              1
            ]
          }
        }
      },
      {
        $match: { totalTasks: { $gte: 1 } } // Only employees with at least 1 task
      },
      {
        $sort: { completionRate: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          name: 1,
          role: 1,
          completionRate: 1,
          completedTasks: 1,
          _id: 0
        }
      }
    ]);
    
    return topPerformers;
  } catch (error) {
    console.error('Error getting top performers:', error);
    return [];
  }
};

const getAnalyticsDataForExport = async (filter) => {
  // This would return the same data structure as getAnalyticsData
  // but optimized for export
  return {};
};

const generateCSV = (data) => {
  // Simple CSV generation
  let csv = 'Metric,Value,Change\n';
  csv += `Total Clients,${data.summary?.totalClients || 0},${data.summary?.clientsChange || 0}%\n`;
  csv += `Total Employees,${data.summary?.totalEmployees || 0},${data.summary?.employeesChange || 0}%\n`;
  csv += `Active Leads,${data.summary?.activeLeads || 0},${data.summary?.leadsChange || 0}%\n`;
  csv += `Open Tasks,${data.summary?.openTasks || 0},${data.summary?.tasksChange || 0}%\n`;
  csv += `Pending Invoices,${data.summary?.pendingInvoices || 0},${data.summary?.invoicesChange || 0}%\n`;
  return csv;
};

module.exports = {
  getAnalyticsData,
  exportAnalytics
};
