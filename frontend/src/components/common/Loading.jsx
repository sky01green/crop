import React from 'react';

/**
 * Loading spinner component.
 * @param {string} message - Optional loading message
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {boolean} fullPage - Center spinner in the full viewport
 */
function Loading({ message = '', size = 'md', fullPage = false }) {
  const spinnerClass = `spinner spinner-${size}`;

  return (
    <div className={`loading-container ${fullPage ? 'loading-fullpage' : ''}`} role="status" aria-live="polite">
      <div className={spinnerClass} aria-hidden="true" />
      {message && <p className="loading-message">{message}</p>}
      <span className="sr-only">{message || 'Loading...'}</span>
    </div>
  );
}

export default Loading;
