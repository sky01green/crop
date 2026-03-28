import React from 'react';
import { formatConfidence } from '../../utils/formatters.js';
import { CONFIDENCE_THRESHOLDS } from '../../utils/constants.js';

/**
 * Visual progress bar showing confidence percentage.
 * Green ≥ 80%, Yellow ≥ 60%, Red < 60%
 * @param {number} confidence - Value 0–1 or 0–100
 * @param {boolean} showLabel
 */
function ConfidenceBar({ confidence, showLabel = true }) {
  const pct = confidence <= 1 ? confidence * 100 : confidence;
  const rounded = Math.min(100, Math.max(0, pct));

  let colorClass = 'bar-low';
  if (rounded >= CONFIDENCE_THRESHOLDS.HIGH) colorClass = 'bar-high';
  else if (rounded >= CONFIDENCE_THRESHOLDS.MEDIUM) colorClass = 'bar-medium';

  return (
    <div className="confidence-bar-wrapper">
      {showLabel && (
        <div className="confidence-bar-header">
          <span className="confidence-label">Confidence</span>
          <span className={`confidence-value ${colorClass}`}>{formatConfidence(confidence)}</span>
        </div>
      )}
      <div className="confidence-track" role="progressbar" aria-valuenow={rounded} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={`confidence-fill ${colorClass}`}
          style={{ width: `${rounded}%`, transition: 'width 0.6s ease' }}
        />
      </div>
    </div>
  );
}

export default ConfidenceBar;
