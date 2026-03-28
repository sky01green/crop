import React from 'react';
import TreatmentCard from './TreatmentCard.jsx';
import { SEVERITY_CLASSES, SEVERITY_LABELS } from '../../utils/constants.js';
import { formatClassName, formatDate } from '../../utils/formatters.js';

/**
 * Full health report display component.
 * Shows severity, description, symptoms, causes, treatment, prevention, and products.
 * @param {object} report - Report object from API
 * @param {object} prediction - Prediction object from API
 */
function HealthReport({ report, prediction }) {
  if (!report) {
    return (
      <div className="report-empty card">
        <p>No health report available for this scan.</p>
      </div>
    );
  }

  const severity = report.severity || 'none';
  const badgeClass = SEVERITY_CLASSES[severity] || 'badge-healthy';
  const severityLabel = SEVERITY_LABELS[severity] || 'Unknown';
  const isHealthy = prediction?.is_healthy || severity === 'none';

  return (
    <article className="health-report print-area">
      {/* Report Header */}
      <header className="report-header">
        <div className="report-header-content">
          <div className="report-title-row">
            <h2 className="report-title">Crop Health Report</h2>
            <span className={`severity-badge severity-badge-lg ${badgeClass}`}>{severityLabel}</span>
          </div>
          {prediction && (
            <div className="report-meta">
              <span>
                <strong>Crop:</strong>{' '}
                {formatClassName(prediction.crop_name || prediction.class_name?.split('___')?.[0] || 'Unknown')}
              </span>
              {!isHealthy && (
                <span>
                  <strong>Condition:</strong>{' '}
                  {formatClassName(prediction.disease_name || prediction.class_name || 'Unknown')}
                </span>
              )}
              {prediction.created_at && (
                <span>
                  <strong>Scanned:</strong> {formatDate(prediction.created_at)}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Status banner */}
        <div className={`report-status-banner ${isHealthy ? 'status-healthy' : 'status-diseased'}`}>
          <span className="report-status-icon">{isHealthy ? '✅' : '⚠️'}</span>
          <p className="report-status-text">
            {isHealthy
              ? 'Your crop appears healthy. Continue good farming practices.'
              : 'Disease detected. See treatment recommendations below.'}
          </p>
        </div>
      </header>

      {/* Description */}
      {report.description && (
        <section className="report-section">
          <h3 className="report-section-title">Overview</h3>
          <p className="report-description">{report.description}</p>
        </section>
      )}

      {/* Symptoms */}
      {report.symptoms && (
        <section className="report-section">
          <TreatmentCard
            title="Symptoms"
            type="symptoms"
            content={report.symptoms}
          />
        </section>
      )}

      {/* Causes */}
      {report.causes && (
        <section className="report-section">
          <TreatmentCard
            title="Causes"
            type="causes"
            content={report.causes}
          />
        </section>
      )}

      {/* Treatment */}
      {report.treatment && (
        <section className="report-section">
          <TreatmentCard
            title="Recommended Treatment"
            type="treatment"
            content={report.treatment}
          />
        </section>
      )}

      {/* Prevention */}
      {report.prevention && (
        <section className="report-section">
          <TreatmentCard
            title="Prevention Measures"
            type="prevention"
            content={report.prevention}
          />
        </section>
      )}

      {/* Recommended Products */}
      {report.recommended_products && (
        <section className="report-section">
          <TreatmentCard
            title="Recommended Products"
            type="products"
            content={report.recommended_products}
          />
        </section>
      )}

      {/* Fallback for other report fields */}
      {!report.symptoms && !report.causes && !report.treatment && !report.prevention && (
        <section className="report-section">
          <div className="card report-no-details">
            <p>
              {isHealthy
                ? 'Your crop is healthy! Maintain good irrigation, soil health, and regular monitoring.'
                : 'Detailed treatment information is not available. Consult a local agricultural expert.'}
            </p>
          </div>
        </section>
      )}
    </article>
  );
}

export default HealthReport;
