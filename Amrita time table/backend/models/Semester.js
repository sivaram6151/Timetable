const mongoose = require('mongoose');

// Define the course schema with required fields
const courseSchema = new mongoose.Schema({
  courseId: { 
    type: String, 
    required: true,
  },
  courseName: { 
    type: String, 
    required: true,
  },
  theoryHours: { 
    type: Number, 
    default: 0,
  },
  labHours: { 
    type: Number, 
    default: 0,
  },
});

// Define the semester schema
const semesterSchema = new mongoose.Schema({
  semesterName: { 
    type: String, 
    required: true,
  },
  year: { 
    type: Number, 
    required: true,
  },
  courses: [courseSchema],
  stream: { 
    type: String, 
    required: true,
  },
});

// Check if the model is already defined and avoid redefining it
const Semester = mongoose.models.Semester || mongoose.model('Semester', semesterSchema);

module.exports = Semester;