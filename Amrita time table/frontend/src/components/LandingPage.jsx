import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Import the navigation hook for routing
import './LandingPage.css'; // Import CSS for styling

const LandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0); // Keep track of the current slide
  const slides = [
    'frontend\\public\\asea.jpg',
    'frontend\\public\\aseb.jpg',
    'frontend\\public\\asec.jpg',
    'frontend\\public\\asee.jpg'
   
  ]; // Array of slide images
  const navigate = useNavigate(); // Use navigate for button navigation

  // Change slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prevSlide => (prevSlide + 1) % slides.length);
    }, 4000); // 4000ms (4 seconds) interval for slide change

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [slides.length]);

  return (
    <div className="landing-page">
      {/* Slideshow background */}
      <div className="slideshow-container">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${currentSlide === index ? 'fade' : ''}`}
          >
            <img src={slide} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </div>

      {/* Welcome text */}
      <div className="welcome-text">
        <h1>Welcome to Amrita TimeTable Scheduler Portal</h1>
      </div>

      {/* Buttons for navigation */}
      <div className="button-container">
        <button className="login-button" onClick={() => navigate('/admin/login')}>
          College Admin Login
        </button>
        <button className="login-button" onClick={() => navigate('/teacher/login')}>
          Teacher Login
        </button>
        <button className="login-button" onClick={() => navigate('/student/portal')}>
          Student Login
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
