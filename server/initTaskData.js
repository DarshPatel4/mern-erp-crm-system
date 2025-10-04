const mongoose = require('mongoose');
const Task = require('./models/Task');
const Employee = require('./models/Employee');
require('dotenv').config();

const sampleTasks = [
  {
    title: 'Website Redesign',
    description: 'Redesign the company website with new branding and improved user experience',
    priority: 'High',
    due_date: new Date('2024-06-20'),
    status: 'In Progress'
  },
  {
    title: 'Client Meeting Preparation',
    description: 'Prepare presentation materials for the upcoming client meeting',
    priority: 'High',
    due_date: new Date('2024-06-10'),
    status: 'Overdue'
  },
  {
    title: 'Content Creation for Blog',
    description: 'Create 5 blog posts about the latest industry trends and best practices',
    priority: 'Medium',
    due_date: new Date('2024-06-25'),
    status: 'Pending'
  },
  {
    title: 'Social Media Campaign',
    description: 'Create and schedule social media posts for the product launch campaign',
    priority: 'Medium',
    due_date: new Date('2024-06-18'),
    status: 'Completed'
  },
  {
    title: 'Bug Fixes for Mobile App',
    description: 'Fix reported bugs in the mobile application and improve performance',
    priority: 'Low',
    due_date: new Date('2024-06-30'),
    status: 'Pending'
  },
  {
    title: 'Database Optimization',
    description: 'Optimize database queries and improve overall system performance',
    priority: 'High',
    due_date: new Date('2024-06-15'),
    status: 'In Progress'
  },
  {
    title: 'User Documentation',
    description: 'Create comprehensive user documentation for the new features',
    priority: 'Medium',
    due_date: new Date('2024-06-22'),
    status: 'Pending'
  },
  {
    title: 'Security Audit',
    description: 'Conduct security audit and implement necessary security measures',
    priority: 'High',
    due_date: new Date('2024-06-12'),
    status: 'Completed'
  }
];

async function initTaskData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Get all employees
    const employees = await Employee.find();
    if (employees.length === 0) {
      console.log('No employees found. Please create employees first.');
      return;
    }

    // Clear existing tasks
    await Task.deleteMany({});
    console.log('Cleared existing tasks');

    // Create sample tasks with random employee assignments
    const tasksWithEmployees = sampleTasks.map(task => ({
      ...task,
      assigned_to: employees[Math.floor(Math.random() * employees.length)]._id
    }));

    await Task.insertMany(tasksWithEmployees);
    console.log(`Created ${sampleTasks.length} sample tasks`);

    // Populate and display created tasks
    const createdTasks = await Task.find().populate('assigned_to', 'name email designation');
    console.log('Sample tasks created:');
    createdTasks.forEach(task => {
      console.log(`- ${task.title} (${task.status}) - Assigned to: ${task.assigned_to.name}`);
    });

  } catch (error) {
    console.error('Error initializing task data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the initialization
initTaskData();
