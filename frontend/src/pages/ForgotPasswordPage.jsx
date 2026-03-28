import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/authService.js';
import { validateEmail } from '../utils/validators.js';
import Button from '../components/common/Button.jsx';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoToken, setDemoToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    const emailResult = validateEmail(email);
    if (!emailResult.valid) {
      setError(emailResult.error);
      return;
    }

    setLoading(true);
    try {
      const result = await forgotPassword(email);
      setMessage(result.message);
      if (result.reset_token_demo) {
        setDemoToken(result.reset_token_demo);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <h2 className="auth-title">Reset Password</h2>
          <p className="auth-subtitle">
            Enter your email and we'll send you a link to reset your password.
          </p>

          {error && (
            <div className="alert alert-error" role="alert">
              {error}
            </div>
          )}

          {message && (
            <div className="alert alert-success" role="alert">
              {message}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              id="email"
              className={`form-input ${error ? 'input-error' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <Button type="submit" variant="primary" fullWidth loading={loading}>
            Send Reset Link
          </Button>

          {demoToken && (
            <div className="demo-notice" style={{ marginTop: '1rem', padding: '1rem', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '0.5rem' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: '600', color: '#0369a1', marginBottom: '0.5rem' }}>
                🚀 Demo Mode:
              </p>
              <p style={{ fontSize: '0.75rem', color: '#0c4a6e', marginBottom: '0.5rem' }}>
                Since there is no email server configured, use the link below to go to the reset page:
              </p>
              <Link 
                to={`/reset-password?token=${demoToken}`} 
                style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 'bold', wordBreak: 'break-all' }}
              >
                Reset Password Link
              </Link>
            </div>
          )}

          <p className="auth-footer">
            Remembered your password?{' '}
            <Link to="/login" className="auth-link">
              Back to Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
