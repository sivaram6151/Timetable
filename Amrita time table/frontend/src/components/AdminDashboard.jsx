import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-dashboard">
      <h2>Welcome, College Admin</h2>
      <div className="button-container">
        <button onClick={() => navigate('/admin/create-timetable')} className="action-btn">
          Create Semester
        </button>
        <button onClick={() => navigate('/admin/view-semesters')} className="action-btn">
          View Created Semester
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
