import React from 'react';

const SECTION_ICONS = {
  treatment: '💊',
  prevention: '🛡️',
  symptoms: '🔍',
  causes: '🧬',
  products: '🧴',
  default: '📋',
};

/**
 * Card component for a report section (treatment, prevention, symptoms, etc.)
 * @param {string} title - Section heading
 * @param {string} icon - Emoji icon (overrides default)
 * @param {string|string[]} content - Text or array of bullet points
 * @param {string} type - Section type key for auto-icon lookup
 */
function TreatmentCard({ title, icon, content, type = 'default' }) {
  const displayIcon = icon || SECTION_ICONS[type] || SECTION_ICONS.default;

  const renderContent = () => {
    if (!content) return <p className="treatment-empty">No information available.</p>;

    if (Array.isArray(content)) {
      return (
        <ul className="treatment-list">
          {content.map((item, i) => (
            <li key={i} className="treatment-list-item">
              {item}
            </li>
          ))}
        </ul>
      );
    }

    // Could be a newline-delimited string
    const lines = String(content).split(/\n+/).filter(Boolean);
    if (lines.length > 1) {
      return (
        <ul className="treatment-list">
          {lines.map((line, i) => (
            <li key={i} className="treatment-list-item">
              {line.replace(/^[-•*]\s*/, '')}
            </li>
          ))}
        </ul>
      );
    }

    return <p className="treatment-text">{content}</p>;
  };

  return (
    <div className="treatment-card card">
      <div className="treatment-card-header">
        <span className="treatment-icon" aria-hidden="true">{displayIcon}</span>
        <h4 className="treatment-title">{title}</h4>
      </div>
      <div className="treatment-body">{renderContent()}</div>
    </div>
  );
}

export default TreatmentCard;
