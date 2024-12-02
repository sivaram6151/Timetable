import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CreateTimetable.css';

const CreateTimetable = () => {
  const [semesterName, setSemesterName] = useState('');
  const [year, setYear] = useState('');
  const [courseId, setCourseId] = useState('');
  const [courseName, setCourseName] = useState('');
  const [theoryHours, setTheoryHours] = useState('');
  const [labHours, setLabHours] = useState('');
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [stream, setStream] = useState('');
  const [streams] = useState(['CSE', 'ECE', 'AIE']); // Stream options

  useEffect(() => {
    if (semesterName || year || courses.length || stream) {
      setError('');
    }
  }, [semesterName, year, courses, stream]);

  const handleCreateSemester = async (e) => {
    e.preventDefault();

    if (!semesterName || !year || !stream) {
      setError('All fields except courses must be filled');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/admin/create-semester', { 
        semesterName, 
        year, 
        courses, 
        stream 
      });

      if (response.data && response.data.message) {
        setSuccessMessage(response.data.message);
        resetForm();
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Failed to create semester. Please try again.');
      } else {
        setError('Network error. Please try again later.');
      }
    }
  };

  const addCourse = () => {
    if (!courseId || !courseName || !theoryHours || !labHours) {
      setError('All course fields must be filled');
      return;
    }

    const theory = parseInt(theoryHours);
    const lab = parseInt(labHours);

    if (isNaN(theory) || isNaN(lab)) {
      setError('Theory and Lab hours must be valid numbers.');
      return;
    }

    const newCourse = {
      courseId,
      courseName,
      theoryHours: theory,
      labHours: lab,
    };

    setCourses([...courses, newCourse]);
    resetCourseForm();
  };

  const resetCourseForm = () => {
    setCourseId('');
    setCourseName('');
    setTheoryHours('');
    setLabHours('');
  };

  const resetForm = () => {
    setSemesterName('');
    setYear('');
    setCourses([]);
    setStream('');
  };

  const removeCourse = (index) => {
    const updatedCourses = courses.filter((_, i) => i !== index);
    setCourses(updatedCourses);
  };

  const isFormValid = semesterName && year && stream && (courses.length > 0 || !courseId || !courseName || !theoryHours || !labHours);

  return (
    <div className="container">
      <h2>Create Semester and Courses</h2>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <form onSubmit={handleCreateSemester}>
        <input
          type="text"
          placeholder="Semester Name"
          value={semesterName}
          onChange={(e) => setSemesterName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />

        {/* Stream Selection */}
        <select
          value={stream}
          onChange={(e) => setStream(e.target.value)}
          required
        >
          <option value="">Select Stream</option>
          {streams.map((streamOption, index) => (
            <option key={index} value={streamOption}>
              {streamOption}
            </option>
          ))}
        </select>

        {/* Course Fields */}
        <h3>Add Courses</h3>
        <input
          type="text"
          placeholder="Course ID"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Course Name"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Theory Hours"
          value={theoryHours}
          onChange={(e) => setTheoryHours(e.target.value)}
        />
        <input
          type="number"
          placeholder="Lab Hours"
          value={labHours}
          onChange={(e) => setLabHours(e.target.value)}
        />

        <button type="button" onClick={addCourse}>
          Add Course
        </button>

        {/* Display List of Added Courses */}
        {courses.length > 0 && (
          <div className="course-list">
            {courses.map((course, index) => (
              <div key={index} className="course-item">
                <span>{course.courseId}</span>
                <span>{course.courseName}</span>
                <span>{course.theoryHours} Theory, {course.labHours} Lab</span>
                <button type="button" onClick={() => removeCourse(index)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <button type="submit" disabled={!isFormValid}>Save Semester</button>
      </form>
    </div>
  );
};

export default CreateTimetable;