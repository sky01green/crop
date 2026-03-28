import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPrediction } from '../services/predictionService.js';
import HealthReport from '../components/report/HealthReport.jsx';
import ReportDownload from '../components/report/ReportDownload.jsx';
import Loading from '../components/common/Loading.jsx';

function ReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchReport = async () => {
      try {
        const data = await getPrediction(id);
        setPrediction(data.prediction);
        setReport(data.report);
      } catch (err) {
        const msg =
          err.response?.status === 404
            ? 'Report not found.'
            : err.response?.data?.message || 'Failed to load report.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [id]);

  if (loading) return <Loading fullPage message="Loading health report..." />;

  if (error) {
    return (
      <div className="page-container">
        <div className="alert alert-error">{error}</div>
        <div className="error-actions">
          <Link to="/history" className="btn btn-primary">View History</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="report-page page-container">
      {/* Navigation — hidden on print */}
      <div className="report-nav no-print">
        <button type="button" className="btn btn-ghost" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <ReportDownload predictionId={id} />
      </div>

      {/* Full report content */}
      <HealthReport prediction={prediction} report={report} />

      {/* Bottom actions */}
      <div className="report-bottom-actions no-print">
        <Link to={`/result/${id}`} className="btn btn-outline">
          View Detection Result
        </Link>
        <Link to="/upload" className="btn btn-primary">
          Scan Another Crop
        </Link>
      </div>
    </div>
  );
}

export default ReportPage;
