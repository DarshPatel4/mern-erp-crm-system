const mongoose = require('mongoose');
const Lead = require('./models/Lead');
const Employee = require('./models/Employee');
const Task = require('./models/Task');
const Invoice = require('./models/Invoice');
const EmployeeTask = require('./models/EmployeeTask');

// Initialize analytics collections with sample data if they don't exist
const initAnalyticsData = async () => {
  try {
    console.log('Initializing analytics data...');

    // Check if we have any leads, if not create some sample data
    const leadCount = await Lead.countDocuments();
    if (leadCount === 0) {
      console.log('Creating sample leads for analytics...');
      const sampleLeads = [
        {
          name: 'Acme Corporation',
          email: 'contact@acme.com',
          phone: '+1-555-0123',
          company: 'Acme Corp',
          status: 'converted',
          source: 'Website',
          region: 'North America',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        },
        {
          name: 'TechStart Inc',
          email: 'info@techstart.com',
          phone: '+1-555-0124',
          company: 'TechStart Inc',
          status: 'qualified',
          source: 'Referral',
          region: 'North America',
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        },
        {
          name: 'Global Solutions',
          email: 'sales@global.com',
          phone: '+44-20-7946-0958',
          company: 'Global Solutions Ltd',
          status: 'new',
          source: 'Cold Call',
          region: 'Europe',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        },
        {
          name: 'Asia Pacific Corp',
          email: 'contact@asiapacific.com',
          phone: '+81-3-1234-5678',
          company: 'Asia Pacific Corp',
          status: 'proposal',
          source: 'Trade Show',
          region: 'Asia',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        }
      ];
      await Lead.insertMany(sampleLeads);
    }

    // Check if we have any employees, if not create some sample data
    const employeeCount = await Employee.countDocuments();
    if (employeeCount === 0) {
      console.log('Creating sample employees for analytics...');
      const sampleEmployees = [
        {
          name: 'John Smith',
          email: 'john@company.com',
          role: 'Developer',
          department: 'Development',
          status: 'active',
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
        },
        {
          name: 'Sarah Johnson',
          email: 'sarah@company.com',
          role: 'Sales Manager',
          department: 'Sales',
          status: 'active',
          createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
        },
        {
          name: 'Mike Wilson',
          email: 'mike@company.com',
          role: 'Marketing Specialist',
          department: 'Marketing',
          status: 'active',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        },
        {
          name: 'Lisa Brown',
          email: 'lisa@company.com',
          role: 'HR Manager',
          department: 'HR',
          status: 'active',
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
        },
        {
          name: 'David Lee',
          email: 'david@company.com',
          role: 'Finance Manager',
          department: 'Finance',
          status: 'active',
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
        }
      ];
      await Employee.insertMany(sampleEmployees);
    }

    // Check if we have any tasks, if not create some sample data
    const taskCount = await Task.countDocuments();
    if (taskCount === 0) {
      console.log('Creating sample tasks for analytics...');
      const employees = await Employee.find();
      const sampleTasks = [
        {
          title: 'Complete project documentation',
          description: 'Write comprehensive documentation for the new feature',
          status: 'Completed',
          priority: 'High',
          due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          assigned_to: employees[0]?._id || new mongoose.Types.ObjectId(),
          created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
        },
        {
          title: 'Client presentation preparation',
          description: 'Prepare slides and materials for client presentation',
          status: 'In Progress',
          priority: 'Medium',
          due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          assigned_to: employees[1]?._id || new mongoose.Types.ObjectId(),
          created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
        },
        {
          title: 'Code review session',
          description: 'Review and provide feedback on team code submissions',
          status: 'Pending',
          priority: 'Low',
          due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          assigned_to: employees[2]?._id || new mongoose.Types.ObjectId(),
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        },
        {
          title: 'Database optimization',
          description: 'Optimize database queries for better performance',
          status: 'Overdue',
          priority: 'High',
          due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          assigned_to: employees[3]?._id || new mongoose.Types.ObjectId(),
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        }
      ];
      await Task.insertMany(sampleTasks);
    }

    // Check if we have any invoices, if not create some sample data
    const invoiceCount = await Invoice.countDocuments();
    if (invoiceCount === 0) {
      console.log('Creating sample invoices for analytics...');
      const sampleInvoices = [
        {
          clientName: 'Acme Corporation',
          clientEmail: 'contact@acme.com',
          totalAmount: 5000,
          status: 'paid',
          dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          paidDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000)
        },
        {
          clientName: 'TechStart Inc',
          clientEmail: 'info@techstart.com',
          totalAmount: 3500,
          status: 'pending',
          dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
        },
        {
          clientName: 'Global Solutions',
          clientEmail: 'sales@global.com',
          totalAmount: 7500,
          status: 'paid',
          dueDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          paidDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        },
        {
          clientName: 'Asia Pacific Corp',
          clientEmail: 'contact@asiapacific.com',
          totalAmount: 4200,
          status: 'overdue',
          dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
        }
      ];
      await Invoice.insertMany(sampleInvoices);
    }

    // Create employee tasks for performance analytics
    const employeeTaskCount = await EmployeeTask.countDocuments();
    if (employeeTaskCount === 0) {
      console.log('Creating sample employee tasks for analytics...');
      const employees = await Employee.find();
      const tasks = await Task.find();
      
      if (employees.length > 0 && tasks.length > 0) {
        const sampleEmployeeTasks = [];
        
        // Assign tasks to employees
        employees.forEach((employee, empIndex) => {
          tasks.forEach((task, taskIndex) => {
            if ((empIndex + taskIndex) % 2 === 0) { // Assign every other task
              // Map task status to EmployeeTask status enum
              let employeeTaskStatus = 'pending';
              if (task.status === 'Completed') {
                employeeTaskStatus = 'completed';
              } else if (task.status === 'In Progress') {
                employeeTaskStatus = 'in-progress';
              } else if (task.status === 'Overdue') {
                employeeTaskStatus = 'urgent';
              }

              // Map task priority to EmployeeTask priority enum
              let employeeTaskPriority = 'medium';
              if (task.priority === 'High') {
                employeeTaskPriority = 'high';
              } else if (task.priority === 'Low') {
                employeeTaskPriority = 'low';
              } else if (task.priority === 'Medium') {
                employeeTaskPriority = 'medium';
              }

              sampleEmployeeTasks.push({
                employeeId: employee._id,
                title: task.title,
                description: task.description,
                dueDate: task.due_date,
                status: employeeTaskStatus,
                priority: employeeTaskPriority,
                completedAt: task.status === 'Completed' ? new Date() : null
              });
            }
          });
        });
        
        if (sampleEmployeeTasks.length > 0) {
          await EmployeeTask.insertMany(sampleEmployeeTasks);
        }
      }
    }

    console.log('Analytics data initialization completed successfully!');
  } catch (error) {
    console.error('Error initializing analytics data:', error);
  }
};

module.exports = initAnalyticsData;
