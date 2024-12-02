const express = require('express');
const router = express.Router();
const Timetable = require('../models/Timetable');
const { body, validationResult } = require('express-validator');  // Ensure this is imported

// Endpoint to fetch timetable by semester and department
router.post('/timetable', [
  // Validate input parameters
  body('semester').notEmpty().withMessage('Semester is required'),
  body('department').notEmpty().withMessage('Department is required'),
], async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { semester, department } = req.body;

  try {
    const timetable = await Timetable.findOne({ semester, department });

    if (!timetable) {
      return res.status(404).json({ success: false, message: 'Timetable not found' });
    }

    // Respond with the timetable
    res.json({ success: true, timetable: timetable.timetable });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
