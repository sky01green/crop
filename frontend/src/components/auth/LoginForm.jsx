import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { validateEmail, validatePassword } from '../../utils/validators.js';
import Button from '../common/Button.jsx';

function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.from?.pathname || '/dashboard';

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [slowLoadingMsg, setSlowLoadingMsg] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-level error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    const emailResult = validateEmail(formData.email);
    const passwordResult = validatePassword(formData.password);
    if (!emailResult.valid) newErrors.email = emailResult.error;
    if (!passwordResult.valid) newErrors.password = passwordResult.error;
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setSlowLoadingMsg(false);

    // If it takes more than 15s, show a warning that server is waking up
    const slowTimer = setTimeout(() => {
      setSlowLoadingMsg(true);
    }, 15000);

    const result = await login(formData.email, formData.password);
    
    clearTimeout(slowTimer);
    setSlowLoadingMsg(false);
    setLoading(false);

    if (result.success) {
      navigate(redirectTo, { replace: true });
    } else {
      setApiError(result.error || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <h2 className="auth-title">Welcome back</h2>
      <p className="auth-subtitle">Sign in to your CropScan account</p>

      {apiError && (
        <div className="alert alert-error" role="alert">
          {apiError}
        </div>
      )}

      {slowLoadingMsg && (
        <div className="alert alert-warning" role="alert" style={{ backgroundColor: '#fff3cd', color: '#856404', padding: '1rem', borderRadius: '0.375rem', marginBottom: '1rem', border: '1px solid #ffeeba', animation: 'pulse 2s infinite' }}>
          <strong>Server is waking up.</strong> This happens on the free tier after inactivity and can take up to 2 minutes. Please wait...
        </div>
      )}

      <div className="form-group">
        <label htmlFor="email" className="form-label">Email address</label>
        <input
          type="email"
          id="email"
          name="email"
          className={`form-input ${errors.email ? 'input-error' : ''}`}
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        {errors.email && <span className="form-error">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          className={`form-input ${errors.password ? 'input-error' : ''}`}
          value={formData.password}
          onChange={handleChange}
          placeholder="Your password"
          autoComplete="current-password"
          required
        />
        {errors.password && <span className="form-error">{errors.password}</span>}
        <div className="form-helper">
          <Link to="/forgot-password" style={{ fontSize: '0.875rem', color: 'var(--primary-color)', textDecoration: 'none' }}>
            Forgot password?
          </Link>
        </div>
      </div>

      <Button type="submit" variant="primary" fullWidth loading={loading}>
        Sign In
      </Button>

      <p className="auth-footer">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="auth-link">
          Create one
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
