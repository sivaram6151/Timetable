const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Teacher } = require('../models/Teacher');  // Teacher model
const Semester = require('../models/Semester');    // Semester model
const router = express.Router();

// Teacher SignUp Route
router.post('/signup', async (req, res) => {
  const { name, teacherId, phoneNumber, department, email, password, confirmPassword } = req.body;

  try {
    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Teacher already exists with this email' });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new teacher
    const newTeacher = new Teacher({
      name,
      teacherId,
      phoneNumber,
      department,
      email,
      password: hashedPassword,
    });

    // Save to database
    await newTeacher.save();

    // Generate JWT token
    const token = jwt.sign({ id: newTeacher._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ success: true, token, message: 'Teacher created successfully' });
  } catch (err) {
    console.error('Error in teacher signup:', err);
    res.status(500).json({ message: 'Server error, please try again' });
  }
});

// Teacher Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find teacher by email
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ message: 'Teacher not found with this email' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: teacher._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ success: true, token, message: 'Login successful' });
  } catch (err) {
    console.error('Error in teacher login:', err);
    res.status(500).json({ message: 'Server error, please try again' });
  }
});

// Fetch Available Semesters and Courses
router.get('/semesters', async (req, res) => {
  try {
    const semesters = await Semester.find();
    if (semesters.length === 0) {
      return res.status(404).json({ message: 'No semesters found' });
    }
    res.json({ success: true, semesters });
  } catch (err) {
    console.error('Error fetching semesters:', err);
    res.status(500).json({ message: 'Server error, please try again' });
  }
});

// Submit Teacher Preferences (for enrolling in courses)
router.post('/submit-preferences', async (req, res) => {
  const { teacherId, semesterId, selectedCourses } = req.body;

  try {
    // Fetch the teacher and semester data
    const teacher = await Teacher.findById(teacherId);
    const semester = await Semester.findById(semesterId);

    if (!teacher || !semester) {
      return res.status(400).json({ message: 'Invalid teacher or semester' });
    }

    // Check if the semester is already filled (if all courses have been assigned)
    const remainingCourses = semester.courses.filter(course => course.teachers.length === 0);
    if (remainingCourses.length === 0) {
      return res.status(400).json({ message: 'All courses in this semester are already filled' });
    }

    // Assign the selected courses to the teacher
    selectedCourses.forEach(courseId => {
      const course = semester.courses.find(course => course.courseId === courseId);
      if (course && course.teachers.length < 1) {
        course.teachers.push(teacher._id); // Add teacher ID to the course
      }
    });

    // Save the updated semester with the assigned courses
    await semester.save();

    res.json({ success: true, message: 'Preferences submitted successfully' });
  } catch (err) {
    console.error('Error submitting preferences:', err);
    res.status(500).json({ message: 'Server error, please try again' });
  }
});

module.exports = router;
