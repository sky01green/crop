import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPrediction } from '../services/predictionService.js';
import { getMediaUrl } from '../utils/formatters.js';
import PredictionResult from '../components/prediction/PredictionResult.jsx';
import HealthReport from '../components/report/HealthReport.jsx';
import Loading from '../components/common/Loading.jsx';

function ResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchResult = async () => {
      try {
        const data = await getPrediction(id);
        setPrediction(data.prediction);
        setReport(data.report);
      } catch (err) {
        const msg = err.response?.status === 404
          ? 'Prediction not found.'
          : err.response?.data?.message || 'Failed to load result.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [id]);

  if (loading) return <Loading fullPage message="Loading result..." />;

  if (error) {
    return (
      <div className="page-container">
        <div className="alert alert-error">{error}</div>
        <div className="error-actions">
          <Link to="/upload" className="btn btn-primary">Try Again</Link>
          <Link to="/history" className="btn btn-outline">View History</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="result-page page-container">
      <div className="result-nav">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <div className="result-nav-actions">
          <Link to="/upload" className="btn btn-outline">New Scan</Link>
          {report && (
            <Link to={`/report/${id}`} className="btn btn-primary">
              Full Report
            </Link>
          )}
        </div>
      </div>

      {/* Uploaded image */}
      {prediction?.image_url && (
        <div className="result-image-wrapper">
          <img
            src={getMediaUrl(prediction.image_url)}
            alt="Analyzed crop"
            className="result-image"
          />
        </div>
      )}

      <PredictionResult prediction={prediction} report={report} showReportLink />

      {/* Inline summary of health report */}
      {report && (
        <section className="result-report-preview">
          <h2 className="section-heading">Health Report Summary</h2>
          <HealthReport prediction={prediction} report={report} />
        </section>
      )}
    </div>
  );
}

export default ResultPage;
