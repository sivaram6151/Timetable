import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage'; // Import LandingPage component
import AdminLogin from './components/AdminLogin'; // Admin login component
import AdminDashboard from './components/AdminDashboard'; // Admin dashboard component
import TeacherLogin from './components/TeacherLogin'; // Teacher login component
import StudentPortal from './components/StudentPortal'; // Student portal component
import CreateTimetable from './components/CreateTimetable'; // Admin create timetable component
import ViewSemester from './components/ViewSemester';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/teacher/login" element={<TeacherLogin />} />
        <Route path="/admin/view-semester" element={<ViewSemester />} />
        <Route path="/student/portal" element={<StudentPortal />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/create-timetable" element={<CreateTimetable />} />
        {/* Add more routes for admin functionality here */}
      </Routes>
    </Router>
  );
}

export default App;
