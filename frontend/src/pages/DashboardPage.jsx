import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { getStats, getHistory } from '../services/predictionService.js';
import Loading from '../components/common/Loading.jsx';
import { formatClassName, formatRelativeTime, formatConfidence } from '../utils/formatters.js';
import { SEVERITY_CLASSES, SEVERITY_LABELS } from '../utils/constants.js';

function StatCard({ label, value, icon, colorClass = '' }) {
  return (
    <div className={`stat-card card ${colorClass}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <p className="stat-value">{value}</p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  );
}

function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentPredictions, setRecentPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, historyData] = await Promise.all([
          getStats(),
          getHistory(1, 5),
        ]);
        setStats(statsData);
        setRecentPredictions(historyData.predictions || []);
      } catch (err) {
        setError('Failed to load dashboard data. Please refresh the page.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading fullPage message="Loading your dashboard..." />;

  return (
    <div className="dashboard-page page-container">
      {/* Welcome Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0] || 'Farmer'} 👋</h1>
          <p className="page-subtitle">Here's an overview of your crop health monitoring.</p>
        </div>
        <Link to="/upload" className="btn btn-primary">
          + New Scan
        </Link>
      </div>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {/* Stats Grid */}
      {stats && (
        <div className="stats-grid">
          <StatCard
            label="Total Scans"
            value={stats.total_scans ?? 0}
            icon="🔬"
            colorClass="stat-total"
          />
          <StatCard
            label="Healthy"
            value={stats.healthy_count ?? 0}
            icon="🌿"
            colorClass="stat-healthy"
          />
          <StatCard
            label="Diseased"
            value={stats.diseased_count ?? 0}
            icon="⚠️"
            colorClass="stat-diseased"
          />
          <StatCard
            label="Crops Scanned"
            value={stats.crops_scanned ?? 0}
            icon="🌾"
            colorClass="stat-crops"
          />
        </div>
      )}

      {/* Recent Scans */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2 className="section-heading">Recent Scans</h2>
          <Link to="/history" className="section-link">View all →</Link>
        </div>

        {recentPredictions.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-icon">🌱</div>
            <h3>No scans yet</h3>
            <p>Upload your first crop image to get started.</p>
            <Link to="/upload" className="btn btn-primary">
              Analyze First Crop
            </Link>
          </div>
        ) : (
          <div className="recent-list">
            {recentPredictions.map((pred) => {
              const severity = pred.report?.severity || (pred.is_healthy ? 'none' : 'unknown');
              const badgeClass = SEVERITY_CLASSES[severity] || '';
              return (
                <Link key={pred.id} to={`/result/${pred.id}`} className="recent-item card">
                  <div className="recent-item-content">
                    <div className="recent-item-name">
                      <span className="recent-status-dot" data-healthy={pred.is_healthy} />
                      <span>{formatClassName(pred.class_name || pred.crop_name || 'Unknown')}</span>
                    </div>
                    {severity !== 'unknown' && (
                      <span className={`severity-badge ${badgeClass}`}>
                        {SEVERITY_LABELS[severity] || severity}
                      </span>
                    )}
                  </div>
                  <div className="recent-item-meta">
                    <span className="recent-confidence">{formatConfidence(pred.confidence)}</span>
                    <span className="recent-date">{formatRelativeTime(pred.created_at)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="dashboard-section">
        <h2 className="section-heading">Quick Actions</h2>
        <div className="quick-actions">
          <Link to="/upload" className="quick-action-card card">
            <span className="quick-action-icon">📸</span>
            <span>New Scan</span>
          </Link>
          <Link to="/history" className="quick-action-card card">
            <span className="quick-action-icon">📚</span>
            <span>View History</span>
          </Link>
          <Link to="/profile" className="quick-action-card card">
            <span className="quick-action-icon">👤</span>
            <span>My Profile</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
