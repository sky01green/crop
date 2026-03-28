/**
 * Format an ISO date string to a human-readable date.
 * @param {string} dateString - ISO 8601 date string
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string}
 */
export function formatDate(dateString, options = {}) {
  if (!dateString) return 'Unknown date';
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  try {
    return new Intl.DateTimeFormat('en-IN', defaultOptions).format(new Date(dateString));
  } catch {
    return dateString;
  }
}

/**
 * Format a datetime string including time.
 * @param {string} dateString
 * @returns {string}
 */
export function formatDateTime(dateString) {
  return formatDate(dateString, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format a confidence value (0–1 or 0–100) as a percentage string.
 * @param {number} confidence - Value between 0 and 1, or 0 and 100
 * @returns {string}
 */
export function formatConfidence(confidence) {
  if (confidence === null || confidence === undefined) return 'N/A';
  const pct = confidence <= 1 ? confidence * 100 : confidence;
  return `${pct.toFixed(1)}%`;
}

/**
 * Convert a snake_case or underscore class name to a readable title.
 * e.g. "tomato_early_blight" → "Tomato Early Blight"
 * @param {string} className
 * @returns {string}
 */
export function formatClassName(className) {
  if (!className) return '';
  return className
    .split(/[_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Format a crop name from a class label.
 * Assumes format: "crop_disease" or "crop___disease"
 * @param {string} label
 * @returns {string}
 */
export function extractCropName(label) {
  if (!label) return '';
  const parts = label.split(/_{2,}|___/);
  return formatClassName(parts[0]);
}

/**
 * Format file size in bytes to a human-readable string.
 * @param {number} bytes
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

/**
 * Get a relative time string (e.g. "2 hours ago").
 * @param {string} dateString
 * @returns {string}
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr !== 1 ? 's' : ''} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
  return formatDate(dateString);
}

/**
 * Prefix a relative media URL with the backend base URL.
 * e.g. "/uploads/abc.jpg" → "http://localhost:5000/uploads/abc.jpg"
 * @param {string} relativeUrl
 * @returns {string}
 */
export function getMediaUrl(relativeUrl) {
  if (!relativeUrl) return '';
  if (relativeUrl.startsWith('http')) return relativeUrl;
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || '';
  return `${baseUrl}${relativeUrl}`;
}
