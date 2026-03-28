import React from 'react';
import { SEVERITY_CLASSES, SEVERITY_LABELS } from '../../utils/constants.js';
import { formatClassName } from '../../utils/formatters.js';

/**
 * Displays disease details: severity badge and description.
 * @param {object} report - Report data from API
 * @param {object} prediction - Prediction data from API
 */
function DiseaseInfo({ report, prediction }) {
  const severity = report?.severity || 'none';
  const badgeClass = SEVERITY_CLASSES[severity] || 'badge-healthy';
  const severityLabel = SEVERITY_LABELS[severity] || 'Unknown';

  const isHealthy = prediction?.is_healthy || severity === 'none';

  return (
    <div className="disease-info card">
      <div className="disease-info-header">
        <div className="disease-status-row">
          {isHealthy ? (
            <span className="status-icon healthy">✓</span>
          ) : (
            <span className="status-icon diseased">!</span>
          )}
          <h3 className="disease-name">
            {isHealthy
              ? 'No Disease Detected'
              : formatClassName(prediction?.disease_name || prediction?.class_name || 'Unknown Disease')}
          </h3>
        </div>
        <span className={`severity-badge ${badgeClass}`}>{severityLabel}</span>
      </div>

      {report?.description && (
        <div className="disease-description">
          <p>{report.description}</p>
        </div>
      )}

      {prediction?.crop_name && (
        <div className="disease-crop-tag">
          <span className="crop-tag-label">Crop:</span>
          <span className="crop-tag-value">{formatClassName(prediction.crop_name)}</span>
        </div>
      )}
    </div>
  );
}

export default DiseaseInfo;
