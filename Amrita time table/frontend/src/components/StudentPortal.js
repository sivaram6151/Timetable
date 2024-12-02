import React, { useState } from 'react';
import axios from 'axios';

function StudentPortal() {
  const [semester, setSemester] = useState('');
  const [department, setDepartment] = useState('');
  const [timetable, setTimetable] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/student/timetable', {
        semester,
        department
      });

      setTimetable(response.data.timetable);
    } catch (error) {
      console.error('Error fetching timetable:', error);
    }
  };

  return (
    <div className="container">
      <h2>Student Portal</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Semester:</label>
          <select
            className="form-control"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            required
          >
            <option value="">Select Semester</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            {/* Add more semesters here */}
          </select>
        </div>
        <div className="form-group">
          <label>Select Department:</label>
          <select
            className="form-control"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          >
            <option value="">Select Department</option>
            <option value="CS">Computer Science</option>
            <option value="EC">Electronics</option>
            {/* Add more departments here */}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>

      {timetable && (
        <div>
          <h3>Timetable</h3>
          {/* Render the timetable here */}
        </div>
      )}
    </div>
  );
}

export default StudentPortal;
