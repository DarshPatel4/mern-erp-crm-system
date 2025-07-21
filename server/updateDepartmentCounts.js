const mongoose = require('mongoose');
const Department = require('./models/Department');
const Employee = require('./models/Employee');
require('dotenv').config();

async function updateCounts() {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const departments = await Department.find();
  for (const dep of departments) {
    const count = await Employee.countDocuments({ department: dep.name });
    dep.employeeCount = count;
    await dep.save();
  }
  console.log('Department employee counts updated!');
  process.exit();
}

updateCounts(); 