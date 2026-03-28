import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="footer-logo">🌿 CropScan</span>
          <p className="footer-tagline">AI-powered crop health monitoring for modern farmers.</p>
        </div>

        <nav className="footer-links" aria-label="Footer navigation">
          <div className="footer-col">
            <h4>App</h4>
            <Link to="/">Home</Link>
            <Link to="/upload">Analyze Crop</Link>
            <Link to="/history">History</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Register</Link>
            <Link to="/profile">Profile</Link>
          </div>
        </nav>
      </div>

      <div className="footer-bottom">
        <p>&copy; {year} CropScan. All rights reserved.</p>
        <a
          href="https://www.perplexity.ai/computer"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-attribution"
        >
          Created with Perplexity Computer
        </a>
      </div>
    </footer>
  );
}

export default Footer;
