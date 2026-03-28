// Severity levels returned by the API
export const SEVERITY_LEVELS = {
  NONE: 'none',
  MILD: 'mild',
  MODERATE: 'moderate',
  SEVERE: 'severe',
};

// CSS class names for severity badges
export const SEVERITY_CLASSES = {
  none: 'badge-healthy',
  mild: 'badge-mild',
  moderate: 'badge-moderate',
  severe: 'badge-severe',
};

// Human-readable severity labels
export const SEVERITY_LABELS = {
  none: 'Healthy',
  mild: 'Mild',
  moderate: 'Moderate',
  severe: 'Severe',
};

// Colors for severity (used in inline styles where needed)
export const SEVERITY_COLORS = {
  none: '#2E7D32',
  mild: '#F9A825',
  moderate: '#E65100',
  severe: '#B71C1C',
};

// Confidence thresholds for color coding
export const CONFIDENCE_THRESHOLDS = {
  HIGH: 80,    // green
  MEDIUM: 60,  // yellow
  LOW: 0,      // red
};

// Max file size for image uploads (10 MB)
export const MAX_FILE_SIZE_MB = 10;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// Accepted image MIME types
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

// Accepted file extensions (for display)
export const ACCEPTED_EXTENSIONS = '.jpg, .jpeg, .png, .webp';

// Default pagination
export const DEFAULT_PAGE_SIZE = 20;

// App name
export const APP_NAME = 'CropScan';
export const APP_TAGLINE = 'AI-Powered Crop Disease Detection';
