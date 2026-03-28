import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { validateEmail, validatePassword, validateName, validatePasswordMatch } from '../../utils/validators.js';
import Button from '../common/Button.jsx';

function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    const nameResult = validateName(formData.name);
    const emailResult = validateEmail(formData.email);
    const passwordResult = validatePassword(formData.password);
    const matchResult = validatePasswordMatch(formData.password, formData.confirmPassword);

    if (!nameResult.valid) newErrors.name = nameResult.error;
    if (!emailResult.valid) newErrors.email = emailResult.error;
    if (!passwordResult.valid) newErrors.password = passwordResult.error;
    if (!matchResult.valid) newErrors.confirmPassword = matchResult.error;

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
    const result = await register(formData.name, formData.email, formData.password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard', { replace: true });
    } else {
      setApiError(result.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      <h2 className="auth-title">Create account</h2>
      <p className="auth-subtitle">Join CropScan and start monitoring your crops</p>

      {apiError && (
        <div className="alert alert-error" role="alert">
          {apiError}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="name" className="form-label">Full name</label>
        <input
          type="text"
          id="name"
          name="name"
          className={`form-input ${errors.name ? 'input-error' : ''}`}
          value={formData.name}
          onChange={handleChange}
          placeholder="John Farmer"
          autoComplete="name"
          required
        />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>

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
          placeholder="Min 8 characters, include a number"
          autoComplete="new-password"
          required
        />
        {errors.password && <span className="form-error">{errors.password}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword" className="form-label">Confirm password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Repeat your password"
          autoComplete="new-password"
          required
        />
        {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
      </div>

      <Button type="submit" variant="primary" fullWidth loading={loading}>
        Create Account
      </Button>

      <p className="auth-footer">
        Already have an account?{' '}
        <Link to="/login" className="auth-link">
          Sign in
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;
