import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TeacherLogin.css'; // Importing CSS file

const TeacherLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isNewTeacher, setIsNewTeacher] = useState(false);  // Toggle for login/signup
  const [error, setError] = useState('');
  const [semesters, setSemesters] = useState([]);  // Store semesters
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const navigate = useNavigate();

  // Handle signup or login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isNewTeacher) {
      // Sign-up logic
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      try {
        const response = await axios.post('http://localhost:5000/teacher/signup', {
          email,
          password,
          confirmPassword,
          name,
          teacherId,
          phone,
          department,
        });

        if (response.data.success) {
          navigate('/teacher/login');
        } else {
          setError('Error signing up. Please try again.');
        }
      } catch (err) {
        console.error(err);
        setError('Server error. Please try again.');
      }
    } else {
      // Login logic
      try {
        const response = await axios.post('http://localhost:5000/teacher/login', { email, password });

        if (response.data.success) {
          // Store JWT token for future requests
          localStorage.setItem('teacherToken', response.data.token);
          navigate('/teacher/select-semester');
        } else {
          setError('Invalid credentials');
        }
      } catch (err) {
        console.error(err);
        setError('Server error. Please try again.');
      }
    }
  };

  // Fetch available semesters
  const fetchSemesters = async () => {
    try {
      const response = await axios.get('http://localhost:5000/teacher/semesters');
      if (response.data.success) {
        setSemesters(response.data.semesters);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch semesters');
    }
  };

  // Handle semester selection
  const handleSemesterChange = async (e) => {
    const semesterId = e.target.value;
    setSelectedSemester(semesterId);

    // Fetch courses for the selected semester
    try {
      const response = await axios.get(`http://localhost:5000/teacher/courses/${semesterId}`);
      if (response.data.success) {
        setSelectedCourse(response.data.courses[0].courseId);  // Select the first course by default
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch courses');
    }
  };

  // Handle course selection and preferences submission
  const submitPreferences = async () => {
    if (!selectedSemester || !selectedCourse) {
      setError('Please select both semester and course');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/teacher/submit-preferences', {
        semester: selectedSemester,
        course: selectedCourse,
      });

      if (response.data.success) {
        navigate('/teacher/dashboard');
      } else {
        setError('Failed to submit preferences');
      }
    } catch (err) {
      console.error(err);
      setError('Error while submitting preferences');
    }
  };

  return (
    <div className="teacher-login-container">
      <h2>{isNewTeacher ? 'Teacher Signup' : 'Teacher Login'}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="teacher-form">
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {isNewTeacher && (
          <>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Teacher ID</label>
              <input
                type="text"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <button type="submit" className="submit-btn">
          {isNewTeacher ? 'Sign Up' : 'Login'}
        </button>
      </form>

      <div className="toggle-signup">
        <p>
          {isNewTeacher ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span onClick={() => setIsNewTeacher(!isNewTeacher)}>
            {isNewTeacher ? 'Login here' : 'Sign Up'}
          </span>
        </p>
      </div>

      {!isNewTeacher && (
        <div className="semester-selection">
          <button onClick={fetchSemesters} className="fetch-semesters-btn">Fetch Available Semesters</button>

          {semesters.length > 0 && (
            <div className="semester-courses">
              <select onChange={handleSemesterChange} value={selectedSemester}>
                <option value="">Select Semester</option>
                {semesters.map((semester) => (
                  <option key={semester._id} value={semester._id}>
                    {semester.semesterName} - {semester.year}
                  </option>
                ))}
              </select>

              {selectedSemester && (
                <div>
                  <label>Select Course</label>
                  <select
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    value={selectedCourse}
                  >
                    {/* Dynamically render courses */}
                  </select>
                </div>
              )}

              <button onClick={submitPreferences} className="submit-preferences-btn">Submit Preferences</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherLogin;
