// models/Admin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')


// Define Admin schema
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Model for Admin
const Admin = mongoose.model('Admin', adminSchema);

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
      // Reference to the Teacher model
  });
  
  // Define Semester schema
  const semesterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    year: { type: Number, required: true },
    courses: [courseSchema],  // Array of courses for this semester
  });
  
  const Semester = mongoose.model('Semester', semesterSchema);

// Function to create default admin if it doesn't exist
const createDefaultAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ email: 'admin@blr.amrita.edu' });
    if (existingAdmin) return; // Default admin already exists

    const defaultEmail = 'admin@blr.amrita.edu';
    const defaultPassword = 'adminpassword';

    // Hash the default password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    // Create and save the default admin
    const defaultAdmin = new Admin({
      email: defaultEmail,
      password: hashedPassword,
    });

    await defaultAdmin.save();
    console.log('Default admin created successfully');
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

module.exports = { Admin, createDefaultAdmin };
