import React from 'react';
import { Link } from 'react-router-dom';
import ConfidenceBar from './ConfidenceBar.jsx';
import DiseaseInfo from './DiseaseInfo.jsx';
import { formatClassName } from '../../utils/formatters.js';

/**
 * Main prediction result card.
 * Shows: crop name, disease, confidence, healthy/diseased status.
 * @param {object} prediction - Prediction object from API
 * @param {object} report - Health report object from API
 * @param {boolean} showReportLink - Show link to full report
 */
function PredictionResult({ prediction, report, showReportLink = true }) {
  if (!prediction) return null;

  const isHealthy = prediction.is_healthy;
  const cropName = prediction.crop_name
    ? formatClassName(prediction.crop_name)
    : formatClassName(prediction.class_name?.split('___')?.[0] || '');

  return (
    <section className="prediction-result">
      <div className="result-status-banner" data-healthy={isHealthy}>
        <div className="result-status-content">
          <span className="result-status-icon">{isHealthy ? '🌿' : '⚠️'}</span>
          <div>
            <h2 className="result-status-title">
              {isHealthy ? 'Crop is Healthy' : 'Disease Detected'}
            </h2>
            <p className="result-crop-subtitle">
              Crop: <strong>{cropName || 'Unknown'}</strong>
            </p>
          </div>
        </div>
      </div>

      <div className="result-body">
        <DiseaseInfo prediction={prediction} report={report} />

        <div className="result-confidence card">
          <h4 className="card-section-title">Detection Confidence</h4>
          <ConfidenceBar confidence={prediction.confidence} />
          <p className="confidence-note">
            {prediction.confidence >= 0.8
              ? 'High confidence result — reliable diagnosis.'
              : prediction.confidence >= 0.6
              ? 'Moderate confidence — consider a second scan.'
              : 'Low confidence — please try with a clearer image.'}
          </p>
        </div>

        {showReportLink && report && (
          <div className="result-actions">
            <Link to={`/report/${prediction.id}`} className="btn btn-primary">
              View Full Health Report
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default PredictionResult;
