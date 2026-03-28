import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getHistory, deletePrediction } from '../services/predictionService.js';
import Loading from '../components/common/Loading.jsx';
import Button from '../components/common/Button.jsx';
import { formatClassName, formatRelativeTime, formatConfidence, getMediaUrl } from '../utils/formatters.js';
import { SEVERITY_CLASSES, SEVERITY_LABELS } from '../utils/constants.js';

function HistoryCard({ prediction, onDelete, deleting }) {
  const severity = prediction.report?.severity || (prediction.is_healthy ? 'none' : 'moderate');
  const badgeClass = SEVERITY_CLASSES[severity] || '';
  const displayName = formatClassName(prediction.class_name || prediction.crop_name || 'Unknown');

  return (
    <div className={`history-card card ${prediction.is_healthy ? 'card-healthy' : 'card-diseased'}`}>
      {/* Image thumbnail */}
      <div className="history-thumb">
        {prediction.image_url ? (
          <img src={getMediaUrl(prediction.image_url)} alt={displayName} className="history-img" />
        ) : (
          <div className="history-img-placeholder">🌿</div>
        )}
      </div>

      <div className="history-body">
        <div className="history-header">
          <h3 className="history-name">{displayName}</h3>
          <span className={`severity-badge ${badgeClass}`}>
            {SEVERITY_LABELS[severity] || severity}
          </span>
        </div>

        <div className="history-meta">
          <span className="history-confidence">
            Confidence: {formatConfidence(prediction.confidence)}
          </span>
          <span className="history-date">{formatRelativeTime(prediction.created_at)}</span>
        </div>

        <div className="history-actions">
          <Link to={`/result/${prediction.id}`} className="btn btn-sm btn-outline">
            View Result
          </Link>
          {prediction.report && (
            <Link to={`/report/${prediction.id}`} className="btn btn-sm btn-secondary">
              Report
            </Link>
          )}
          <Button
            variant="danger"
            size="sm"
            loading={deleting}
            onClick={() => onDelete(prediction.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

function HistoryPage() {
  const [predictions, setPredictions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  const fetchHistory = useCallback(async (pageNum) => {
    setLoading(true);
    setError('');
    try {
      const data = await getHistory(pageNum);
      setPredictions(data.predictions || []);
      setTotalPages(data.pages || 1);
      setTotal(data.total || 0);
      setPage(pageNum);
    } catch (err) {
      setError('Failed to load history. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory(1);
  }, [fetchHistory]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this scan? This cannot be undone.')) return;

    setDeletingId(id);
    try {
      await deletePrediction(id);
      setPredictions((prev) => prev.filter((p) => p.id !== id));
      setTotal((prev) => prev - 1);
    } catch (err) {
      setError('Failed to delete scan. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="history-page page-container">
      <div className="history-header">
        <div>
          <h1 className="page-title">Scan History</h1>
          <p className="page-subtitle">{total} total scan{total !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/upload" className="btn btn-primary">
          + New Scan
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <Loading message="Loading history..." />
      ) : predictions.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">📭</div>
          <h3>No scans yet</h3>
          <p>Your scan history will appear here after you analyze your first crop.</p>
          <Link to="/upload" className="btn btn-primary">
            Analyze First Crop
          </Link>
        </div>
      ) : (
        <>
          <div className="history-grid">
            {predictions.map((pred) => (
              <HistoryCard
                key={pred.id}
                prediction={pred}
                onDelete={handleDelete}
                deleting={deletingId === pred.id}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => fetchHistory(page - 1)}
              >
                ← Previous
              </Button>
              <span className="pagination-info">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => fetchHistory(page + 1)}
              >
                Next →
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default HistoryPage;
