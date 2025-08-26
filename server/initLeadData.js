const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Lead = require('./models/Lead');
const Employee = require('./models/Employee');

dotenv.config();

const sampleLeads = [
  {
    company: 'Acme Corporation',
    email: 'john@acmecorp.com',
    status: 'Contacted',
    priority: 'High',
    lastContact: new Date('2023-07-24'),
    notes: 'Interested in our enterprise solution',
    phone: '+1-555-0123',
    source: 'Website',
    estimatedValue: 50000
  },
  {
    company: 'TechCorp Inc.',
    email: 'sarah@techcorp.com',
    status: 'New',
    priority: 'Medium',
    lastContact: new Date('2023-07-22'),
    notes: 'Looking for CRM integration',
    phone: '+1-555-0456',
    source: 'Referral',
    estimatedValue: 25000
  },
  {
    company: 'Global Industries',
    email: 'robert@globalind.com',
    status: 'Converted',
    priority: 'High',
    lastContact: new Date('2023-07-20'),
    notes: 'Successfully converted to customer',
    phone: '+1-555-0789',
    source: 'Cold Call',
    estimatedValue: 75000
  },
  {
    company: 'Nova Systems',
    email: 'michael@novasystems.com',
    status: 'Lost',
    priority: 'Low',
    lastContact: new Date('2023-07-18'),
    notes: 'Competitor offered better pricing',
    phone: '+1-555-0321',
    source: 'Social Media',
    estimatedValue: 15000
  },
  {
    company: 'Stellar Solutions',
    email: 'jennifer@stellarsolutions.com',
    status: 'Contacted',
    priority: 'Medium',
    lastContact: new Date('2023-07-17'),
    notes: 'Second meeting scheduled',
    phone: '+1-555-0654',
    source: 'Website',
    estimatedValue: 35000
  },
  {
    company: 'Innovation Labs',
    email: 'david@innovationlabs.com',
    status: 'New',
    priority: 'High',
    lastContact: new Date('2023-07-25'),
    notes: 'Startup with high potential',
    phone: '+1-555-0987',
    source: 'Referral',
    estimatedValue: 40000
  },
  {
    company: 'Future Dynamics',
    email: 'lisa@futuredynamics.com',
    status: 'Contacted',
    priority: 'Medium',
    lastContact: new Date('2023-07-23'),
    notes: 'Needs custom development',
    phone: '+1-555-0147',
    source: 'Cold Call',
    estimatedValue: 60000
  },
  {
    company: 'Peak Performance',
    email: 'mark@peakperformance.com',
    status: 'New',
    priority: 'Low',
    lastContact: new Date('2023-07-26'),
    notes: 'Small business, budget conscious',
    phone: '+1-555-0258',
    source: 'Website',
    estimatedValue: 12000
  }
];

async function initLeadData() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');

    // Get active employees for assignment
    const employees = await Employee.find({ status: 'Active' });
    
    if (employees.length === 0) {
      console.log('No active employees found. Please add employees first.');
      return;
    }

    // Clear existing leads
    await Lead.deleteMany({});
    console.log('Cleared existing leads');

    // Add sample leads with employee assignments
    for (let i = 0; i < sampleLeads.length; i++) {
      const lead = sampleLeads[i];
      const assignedEmployee = employees[i % employees.length]; // Distribute leads among employees
      
      await Lead.create({
        ...lead,
        assignedTo: assignedEmployee._id
      });
    }

    console.log(`Added ${sampleLeads.length} sample leads`);
    
    // Display created leads
    const createdLeads = await Lead.find().populate('assignedTo', 'name');
    console.log('\nCreated leads:');
    createdLeads.forEach(lead => {
      console.log(`- ${lead.company} (${lead.status}) - Assigned to: ${lead.assignedTo.name}`);
    });

  } catch (error) {
    console.error('Error initializing lead data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the script
if (require.main === module) {
  initLeadData();
}

module.exports = initLeadData; 