import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const FEATURES = [
  {
    icon: '🤖',
    title: 'AI-Powered Detection',
    description:
      'Our deep learning model identifies 38+ crop diseases across multiple plant species with high accuracy.',
  },
  {
    icon: '📋',
    title: 'Detailed Health Reports',
    description:
      'Get comprehensive reports with symptoms, causes, treatment plans, and prevention strategies.',
  },
  {
    icon: '📊',
    title: 'Scan History',
    description:
      'Track all your past scans in one place. Monitor crop health over time and spot trends.',
  },
  {
    icon: '⚡',
    title: 'Instant Results',
    description:
      'Upload a photo and receive a diagnosis in seconds — no waiting, no manual lookup.',
  },
  {
    icon: '🌾',
    title: 'Multi-Crop Support',
    description:
      'Supports tomatoes, potatoes, corn, apples, grapes, peppers, strawberries, and more.',
  },
  {
    icon: '🔒',
    title: 'Secure & Private',
    description:
      'Your data is encrypted and stored securely. Your scan history is only visible to you.',
  },
];

const STEPS = [
  { step: '1', title: 'Register', description: 'Create a free account in seconds.' },
  { step: '2', title: 'Upload', description: 'Take or upload a photo of your crop.' },
  { step: '3', title: 'Analyze', description: 'Our AI detects disease instantly.' },
  { step: '4', title: 'Act', description: 'Follow the treatment recommendations.' },
];

function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">AI-Powered Agriculture</div>
          <h1 className="hero-title">
            Detect Crop Diseases <br />
            <span className="hero-accent">Before They Spread</span>
          </h1>
          <p className="hero-subtitle">
            Upload a photo of your plant and get an instant AI diagnosis, severity assessment, and
            step-by-step treatment plan — for free.
          </p>
          <div className="hero-cta">
            {isAuthenticated ? (
              <Link to="/upload" className="btn btn-primary btn-lg">
                Analyze My Crop
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">
                  Sign In
                </Link>
              </>
            )}
          </div>
          <p className="hero-note">No credit card required &middot; Results in seconds</p>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-card-mock">
            <div className="mock-header">
              <span className="mock-dot red" />
              <span className="mock-dot yellow" />
              <span className="mock-dot green" />
            </div>
            <div className="mock-body">
              <div className="mock-image-placeholder">🌿</div>
              <div className="mock-result">
                <div className="mock-label">Status</div>
                <div className="mock-value healthy">Healthy Plant</div>
                <div className="mock-bar-wrapper">
                  <div className="mock-bar" style={{ width: '92%' }} />
                </div>
                <div className="mock-pct">92.4% confidence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="how-section">
        <div className="section-container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">Four simple steps to protect your harvest</p>
          <div className="steps-grid">
            {STEPS.map(({ step, title, description }) => (
              <div key={step} className="step-card">
                <div className="step-number">{step}</div>
                <h3 className="step-title">{title}</h3>
                <p className="step-description">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="section-container">
          <h2 className="section-title">Why CropScan?</h2>
          <p className="section-subtitle">Everything you need to keep crops healthy</p>
          <div className="features-grid">
            {FEATURES.map(({ icon, title, description }) => (
              <div key={title} className="feature-card card">
                <span className="feature-icon">{icon}</span>
                <h3 className="feature-title">{title}</h3>
                <p className="feature-description">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-box">
            <h2 className="cta-title">Ready to protect your crops?</h2>
            <p className="cta-subtitle">
              Join thousands of farmers using AI to detect and treat plant diseases early.
            </p>
            {isAuthenticated ? (
              <Link to="/upload" className="btn btn-primary btn-lg">
                Start Scanning
              </Link>
            ) : (
              <Link to="/register" className="btn btn-primary btn-lg">
                Create Free Account
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
