import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../services/authService.js';
import { validatePassword } from '../utils/validators.js';
import Button from '../components/common/Button.jsx';

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const passwordResult = validatePassword(password);
    if (!passwordResult.valid) {
      setError(passwordResult.error);
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. The reset link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-form" style={{ textAlign: 'center' }}>
            <h2 className="auth-title">Password Reset Successfully</h2>
            <div className="alert alert-success" role="alert" style={{ marginBottom: '1.5rem' }}>
              Your password has been reset! You will be redirected to the login page shortly.
            </div>
            <Link to="/login" className="auth-link">
              Go to Sign In now
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <h2 className="auth-title">Set New Password</h2>
          <p className="auth-subtitle">
            Enter your new password below.
          </p>

          {error && (
            <div className="alert alert-error" role="alert" style={{ marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password" className="form-label">New Password</label>
            <input
              type="password"
              id="password"
              className={`form-input ${error ? 'input-error' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              required
              disabled={!token}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              className={`form-input ${error ? 'input-error' : ''}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your new password"
              required
              disabled={!token}
            />
          </div>

          <Button type="submit" variant="primary" fullWidth loading={loading} disabled={!token}>
            Reset Password
          </Button>

          <p className="auth-footer">
            <Link to="/login" className="auth-link">
              Back to Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
