import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ViewSemester.css';

const ViewSemester = () => {
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [error, setError] = useState('');

  // Fetch semesters when the component loads
  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/view-semesters');
        setSemesters(response.data.semesters);
      } catch (error) {
        setError('Failed to fetch semesters. Please try again.');
      }
    };

    fetchSemesters();
  }, []);

  // Fetch courses for the selected semester
  const fetchCourses = async (semesterId) => {
    try {
      const response = await axios.post('http://localhost:5000/admin/view-courses', {
        semesterId,
      });
      setSelectedCourses(response.data.courses);
    } catch (error) {
      setError('Failed to fetch courses. Please try again.');
    }
  };

  // Handle semester selection
  const handleSemesterSelect = (e) => {
    const semesterId = e.target.value;
    setSelectedSemester(semesterId);
    if (semesterId) {
      fetchCourses(semesterId);
    }
  };

  return (
    <div className="view-semester">
      <h2>View Created Semesters</h2>
      
      {/* Dropdown to select semester */}
      <div className="semester-select">
        <label htmlFor="semester">Select Semester</label>
        <select
          id="semester"
          value={selectedSemester}
          onChange={handleSemesterSelect}
          required
        >
          <option value="">-- Select Semester --</option>
          {semesters.map((semester) => (
            <option key={semester._id} value={semester._id}>
              {semester.semesterName} - {semester.stream} - {semester.year}
            </option>
          ))}
        </select>
      </div>

      {/* Display selected courses */}
      {selectedSemester && selectedCourses.length > 0 && (
        <div className="courses-table">
          <h3>Courses for Semester {selectedSemester}</h3>
          <table>
            <thead>
              <tr>
                <th>Course ID</th>
                <th>Course Name</th>
                <th>Theory Hours</th>
                <th>Lab Hours</th>
              </tr>
            </thead>
            <tbody>
              {selectedCourses.map((course, index) => (
                <tr key={index}>
                  <td>{course.courseId}</td>
                  <td>{course.courseName}</td>
                  <td>{course.theoryHours}</td>
                  <td>{course.labHours}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Error message */}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default ViewSemester;
