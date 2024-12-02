const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { Admin } = require('../models/Admin');
const Semester = require('../models/Semester');
const Timetable = require('../models/Timetable');
const jsPDF = require('jspdf');

const router = express.Router();

const handleError = (res, status, message, details = null) => {
  res.status(status).json({
    success: false,
    message,
    ...(details && { errorDetails: details }),
  });
};

// Login route for Admin (remains the same as in your original code)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the hashed password with the provided password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ adminId: admin._id, email: admin.email }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Expiration time for the token
    });

    // Return the token
    return res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error, please try again later' });
  }
});

// Enhanced route to create a semester with dynamic course structure
router.post('/create-semester', async (req, res) => {
  const { semesterName, year, courses, stream } = req.body;

  console.log('Received data:', req.body);

  // Validate input 
  if (!semesterName || !year || !stream) {
    return handleError(res, 400, 'Missing required semester details: semesterName, year, and stream');
  }

  if (courses && courses.length > 0) {
    for (let course of courses) {
      if (!course.courseId || !course.courseName) {
        return handleError(res, 400, 'Course ID and name are required');
      }
    }
  }

  try {
    // Create new semester document
    const newSemester = new Semester({
      semesterName,
      year: parseInt(year),
      courses,
      stream,
    });

    // Save the new semester to the database
    await newSemester.save();

    return res.json({
      success: true,
      message: 'Semester created successfully',
    });
  } catch (error) {
    console.error('Error creating semester:', error);
    return handleError(res, 500, 'Server error while creating semester', error.message);
  }
});

// Route to fetch all semesters
router.get('/view-semesters', async (req, res) => {
  try {
    // Fetch all semesters, sorted by year and semester name
    const semesters = await Semester.find().sort({ year: 1, semesterName: 1 });
    res.json({
      success: true,
      semesters
    });
  } catch (err) {
    console.error('Error fetching semesters:', err);
    handleError(res, 500, 'Failed to fetch semesters', err);
  }
});

// Route to fetch courses by semester
router.get('/view-courses/:semesterId', async (req, res) => {
  const { semesterId } = req.params;

  try {
    const semester = await Semester.findById(semesterId);
    if (!semester) return handleError(res, 404, 'Semester not found');

    res.json({
      success: true,
      courses: semester.courses
    });
  } catch (err) {
    console.error('Error fetching courses:', err);
    handleError(res, 500, 'Failed to fetch courses', err);
  }
});

// Route to export semester data to PDF
router.get('/export-semester-pdf/:semesterId', async (req, res) => {
  const { semesterId } = req.params;

  try {
    const semester = await Semester.findById(semesterId);
    if (!semester) return handleError(res, 404, 'Semester not found');

    const doc = new jsPDF();
    doc.text(`Semester: ${semester.semesterName} (${semester.year})`, 10, 10);
    doc.text(`Stream: ${semester.stream}`, 10, 20);

    // Using autoTable for better PDF formatting
    doc.autoTable({
      head: [['Course ID', 'Course Name', 'Theory Hours', 'Lab Hours']],
      body: semester.courses.map(course => [
        course.courseId,
        course.courseName,
        course.theoryHours,
        course.labHours,
      ]),
      startY: 30
    });

    const pdf = doc.output('arraybuffer');
    res.setHeader('Content-Type', 'application/pdf');
    res.send(Buffer.from(pdf));
  } catch (err) {
    console.error('Error generating PDF:', err);
    handleError(res, 500, 'Failed to generate PDF', err);
  }
});

// Route to update an existing semester
router.put('/update-semester/:semesterId', async (req, res) => {
  const { semesterId } = req.params;
  const { semesterName, year, courses = [], stream } = req.body;

  try {
    // Find the existing semester
    const semester = await Semester.findById(semesterId);
    if (!semester) return handleError(res, 404, 'Semester not found');

    // Update semester details
    if (semesterName) semester.semesterName = semesterName;
    if (year) semester.year = year;
    if (stream) semester.stream = stream;

    // If courses are provided, replace existing courses
    if (courses.length > 0) {
      semester.courses = courses.map(course => ({
        courseId: course.courseId || null,
        courseName: course.courseName || null,
        theoryHours: course.theoryHours || 0,
        labHours: course.labHours || 0
      }));
    }

    // Save the updated semester
    await semester.save();

    res.json({
      success: true,
      message: 'Semester updated successfully',
      semester
    });
  } catch (err) {
    console.error('Error updating semester:', err);
    handleError(res, 500, 'Failed to update semester', err);
  }
});

// Route to delete a semester
router.delete('/delete-semester/:semesterId', async (req, res) => {
  const { semesterId } = req.params;

  try {
    const deletedSemester = await Semester.findByIdAndDelete(semesterId);

    if (!deletedSemester) return handleError(res, 404, 'Semester not found');

    res.json({
      success: true,
      message: 'Semester deleted successfully',
      deletedSemester
    });
  } catch (err) {
    console.error('Error deleting semester:', err);
    handleError(res, 500, 'Failed to delete semester', err);
  }
});

module.exports = router;