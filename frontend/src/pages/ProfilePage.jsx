import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { getStats } from '../services/predictionService.js';
import api from '../services/api.js';
import { validatePassword, validatePasswordMatch } from '../utils/validators.js';
import Button from '../components/common/Button.jsx';
import Loading from '../components/common/Loading.jsx';
import { formatDate } from '../utils/formatters.js';

function ProfilePage() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Password change form state
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwErrors, setPwErrors] = useState({});
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwApiError, setPwApiError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch {
        // Non-critical — silently fail
      } finally {
        setStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handlePwChange = (e) => {
    const { name, value } = e.target;
    setPwForm((prev) => ({ ...prev, [name]: value }));
    if (pwErrors[name]) setPwErrors((prev) => ({ ...prev, [name]: '' }));
    setPwApiError('');
    setPwSuccess('');
  };

  const validatePwForm = () => {
    const errors = {};
    if (!pwForm.currentPassword) errors.currentPassword = 'Current password is required.';
    const newPwResult = validatePassword(pwForm.newPassword);
    if (!newPwResult.valid) errors.newPassword = newPwResult.error;
    const matchResult = validatePasswordMatch(pwForm.newPassword, pwForm.confirmPassword);
    if (!matchResult.valid) errors.confirmPassword = matchResult.error;
    return errors;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errors = validatePwForm();
    if (Object.keys(errors).length > 0) {
      setPwErrors(errors);
      return;
    }

    setPwLoading(true);
    try {
      await api.post('/auth/change-password', {
        current_password: pwForm.currentPassword,
        new_password: pwForm.newPassword,
      });
      setPwSuccess('Password updated successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwApiError(
        err.response?.data?.message || 'Failed to change password. Please check your current password.'
      );
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="profile-page page-container">
      <h1 className="page-title">My Profile</h1>

      {/* User Info Card */}
      <section className="profile-section">
        <div className="card profile-info-card">
          <div className="profile-avatar">
            {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div className="profile-details">
            <h2 className="profile-name">{user?.name || 'Unknown User'}</h2>
            <p className="profile-email">{user?.email || '—'}</p>
            {user?.created_at && (
              <p className="profile-joined">
                Member since {formatDate(user.created_at)}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="profile-section">
        <h2 className="section-heading">Scan Statistics</h2>
        {statsLoading ? (
          <Loading message="Loading stats..." />
        ) : stats ? (
          <div className="profile-stats-grid">
            <div className="card profile-stat">
              <p className="stat-value">{stats.total_scans ?? 0}</p>
              <p className="stat-label">Total Scans</p>
            </div>
            <div className="card profile-stat">
              <p className="stat-value healthy-text">{stats.healthy_count ?? 0}</p>
              <p className="stat-label">Healthy</p>
            </div>
            <div className="card profile-stat">
              <p className="stat-value diseased-text">{stats.diseased_count ?? 0}</p>
              <p className="stat-label">Diseased</p>
            </div>
            <div className="card profile-stat">
              <p className="stat-value">{stats.crops_scanned ?? 0}</p>
              <p className="stat-label">Crops Scanned</p>
            </div>
          </div>
        ) : (
          <p className="text-muted">No statistics available.</p>
        )}
      </section>

      {/* Change Password */}
      <section className="profile-section">
        <h2 className="section-heading">Change Password</h2>
        <div className="card">
          <form onSubmit={handlePasswordSubmit} noValidate>
            {pwSuccess && <div className="alert alert-success">{pwSuccess}</div>}
            {pwApiError && <div className="alert alert-error">{pwApiError}</div>}

            <div className="form-group">
              <label htmlFor="currentPassword" className="form-label">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                className={`form-input ${pwErrors.currentPassword ? 'input-error' : ''}`}
                value={pwForm.currentPassword}
                onChange={handlePwChange}
                autoComplete="current-password"
              />
              {pwErrors.currentPassword && <span className="form-error">{pwErrors.currentPassword}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                className={`form-input ${pwErrors.newPassword ? 'input-error' : ''}`}
                value={pwForm.newPassword}
                onChange={handlePwChange}
                autoComplete="new-password"
              />
              {pwErrors.newPassword && <span className="form-error">{pwErrors.newPassword}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={`form-input ${pwErrors.confirmPassword ? 'input-error' : ''}`}
                value={pwForm.confirmPassword}
                onChange={handlePwChange}
                autoComplete="new-password"
              />
              {pwErrors.confirmPassword && <span className="form-error">{pwErrors.confirmPassword}</span>}
            </div>

            <Button type="submit" variant="primary" loading={pwLoading}>
              Update Password
            </Button>
          </form>
        </div>
      </section>

      {/* Sign Out */}
      <section className="profile-section">
        <Button variant="danger" onClick={logout}>
          Sign Out
        </Button>
      </section>
    </div>
  );
}

export default ProfilePage;
