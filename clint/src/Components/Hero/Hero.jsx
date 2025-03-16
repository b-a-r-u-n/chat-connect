import React from 'react';
import './Hero.css';
import { Link } from 'react-router-dom';

const Hero = () => {
  const image1 = "https://images.pexels.com/photos/20175138/pexels-photo-20175138/free-photo-of-a-woman-sitting-on-the-ground-with-her-phone.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
  const image2 = "https://images.pexels.com/photos/13929248/pexels-photo-13929248.jpeg?auto=compress&cs=tinysrgb&w=600";

  return (
    <div className="hero-container">
      {/* Hero Section */}
      <div className="hero-content">
        <div className="hero-gradient"></div>

        {/* Hero Text */}
        <div className="hero-text-container">
          <h1 className="hero-title">ChatConnect: Stay Connected, Always!</h1>

          {/* Polaroid Images */}
          <div className="polaroid-container">
            <div className="polaroid">
              <img src={image1} alt="User 1" className="polaroid-image" />
            </div>
            <div className="polaroid">
              <img src={image2} alt="User 2" className="polaroid-image" />
            </div>
          </div>

          <p className="hero-description">
            Discover, connect, and share your moments with millions of users worldwide. Join the revolution today!
          </p>

          {/* CTA Buttons */}
          <div className="cta-buttons">
            <Link to="/auth">
              <button className="hero-button primary-button">Get Started</button>
            </Link>
            <button className="hero-button secondary-button">Learn More</button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="features-title">Why Join ChatConnect?</h2>
        
        <div className="extra-info">
          <p>ChatConnect brings people together with real-time updates, interactive posts, and a dynamic social experience.</p>
        </div>

        {/* Mobile Preview */}
        <div className="mobile-preview">
          <div className="mobile-preview-inner">
            <img src={image1} alt="App Preview" className="mobile-preview-image" />
          </div>
        </div>

        <div className="features-button-container">
          <button className="features-button">Start Exploring</button>
        </div>
      </div>

      {/* About Us Section */}
      <div className="about-us">
        <h2 className="about-title">Our Vision</h2>
        <p className="about-description">
          At ChatConnect, we believe in meaningful interactions. Our AI-powered platform helps you stay updated with your favorite content while fostering real connections across the globe.
        </p>
      </div>
    </div>
  );
};

export default Hero;
