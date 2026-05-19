import React from 'react'
import { FaBook, FaUsers, FaExchangeAlt, FaShieldAlt, FaRocket, FaClock, FaArrowRight, FaSignInAlt, FaUserPlus } from 'react-icons/fa'
import './Landing.css'

const Landing = ({ onLogin, onGetStarted }) => {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="brand">
            <FaBook className="brand-icon" />
            <span>Smart-Lib</span>
          </div>
          <div className="nav-btns">
            <button className="btn-secondary" onClick={onLogin}>
              <FaSignInAlt /> Login
            </button>
            <button className="btn-primary" onClick={onGetStarted}>
              <FaUserPlus /> Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero">
        <div className="hero-content">
          <div className="badge">Next Generation LMS</div>
          <h1>Manage Your Library <span className="text-gradient">Smarter</span></h1>
          <p>
            Experience the most intuitive and powerful Library Management System. 
            Track books, manage users, and automate transactions with ease.
          </p>
          <div className="hero-cta">
            <button className="btn-primary btn-lg" onClick={onGetStarted}>
              Get Started for Free <FaArrowRight />
            </button>
            <button className="btn-outline btn-lg" onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}>
              Learn More
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="glass-card main-card">
            <div className="card-header">
              <div className="dots"><span></span><span></span><span></span></div>
            </div>
            <div className="card-body">
              <div className="skeleton-line title"></div>
              <div className="skeleton-grid">
                <div className="skeleton-item"></div>
                <div className="skeleton-item"></div>
                <div className="skeleton-item"></div>
              </div>
              <div className="skeleton-line"></div>
              <div className="skeleton-line short"></div>
            </div>
          </div>
          <div className="floating-card c1">
            <FaExchangeAlt /> <span>12+ Returns Today</span>
          </div>
          <div className="floating-card c2">
            <FaUsers /> <span>20+ Active Users</span>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="section-header">
          <h2>Everything you need</h2>
          <p>Powerful tools to simplify your library operations</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><FaBook /></div>
            <h3>Book Catalog</h3>
            <p>Easily manage your collection with advanced search and categorization.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaUsers /></div>
            <h3>User Management</h3>
            <p>Keep track of borrowers, their history, and membership details seamlessly.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaExchangeAlt /></div>
            <h3>Fast Transactions</h3>
            <p>Borrow and return books in seconds with our optimized workflow.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaShieldAlt /></div>
            <h3>Secure Data</h3>
            <p>Your library's data is protected with industry-standard security protocols.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaRocket /></div>
            <h3>High Performance</h3>
            <p>Lightning fast speeds even with thousands of records and users.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><FaClock /></div>
            <h3>Real-time Tracking</h3>
            <p>Monitor due dates and overdue items with automatic notifications.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="about-container">
          <div className="about-image">
            <div className="stack-container">
              <div className="stack-card s1"></div>
              <div className="stack-card s2"></div>
              <div className="stack-card s3"></div>
            </div>
          </div>
          <div className="about-content">
            <h2>About <span className="text-gradient">Smart-Lib</span></h2>
            <p>
              Smart-Lib is a modern Library Management System (LMS) designed to bridge the gap 
              between traditional book keeping and the digital age. Built with React and Node.js, 
              it offers a seamless experience for both librarians and members.
            </p>
            <ul className="about-list">
              <li>Comprehensive Analytics Dashboard</li>
              <li>Automated Fine Calculation</li>
              <li>Intuitive Search & Filtering</li>
              <li>Responsive Mobile Design</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-card">
          <h2>Ready to modernize your library?</h2>
          <p>Join hundreds of institutions using Smart-Lib today.</p>
          <button className="btn-primary btn-lg" onClick={onGetStarted}>
            Join Now <FaUserPlus />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <FaBook className="brand-icon" />
            <span>Smart-Lib</span>
          </div>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Contact Us</a>
          </div>
          <p className="copyright">&copy; 2026 Smart-Lib. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Landing
