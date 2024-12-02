const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  semesterName: { type: String, required: false }, // Make optional
  year: { type: Number, required: false }, // Make optional
  stream: { 
    type: String, 
    required: false,  // Make it optional
    enum: ['CSE', 'ECE', 'AIE'],
  },
  courses: [{
    code: { type: String, required: false }, // Make optional
    name: { type: String, required: false }, // Make optional
    theoryHours: { type: Number, default: 0 }, // Default to 0 if not provided
    labHours: { type: Number, default: 0 }, // Default to 0 if not provided
  }],
});

// Ensure that semesterName and stream combination is unique
timetableSchema.index({ semesterName: 1, stream: 1 }, { unique: true });

const Timetable = mongoose.model('Timetable', timetableSchema);

module.exports = Timetable;
