import api from './api.js';

/**
 * Upload an image and get a disease prediction.
 * @param {File} file - Image file to analyze
 * @param {function} onUploadProgress - Optional progress callback
 * @returns {Promise<{prediction_id, prediction, report}>}
 */
export async function uploadAndPredict(file, onUploadProgress) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await api.post('/predictions/predict', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 180000, // 3 minutes — TensorFlow inference + Render cold start can be slow
    onUploadProgress,
  });
  return response.data;
}

/**
 * Get a single prediction by ID.
 * @param {string} id
 * @returns {Promise<{prediction, report}>}
 */
export async function getPrediction(id) {
  const response = await api.get(`/predictions/${id}`);
  return response.data;
}

/**
 * Fetch paginated prediction history.
 * @param {number} page - Page number (default 1)
 * @param {number} perPage - Items per page (default 20)
 * @returns {Promise<{predictions, total, page, pages}>}
 */
export async function getHistory(page = 1, perPage = 20) {
  const response = await api.get('/predictions/history', {
    params: { page, per_page: perPage },
  });
  return response.data;
}

/**
 * Delete a prediction by ID.
 * @param {string} id
 * @returns {Promise<{message: string}>}
 */
export async function deletePrediction(id) {
  const response = await api.delete(`/predictions/${id}`);
  return response.data;
}

/**
 * Get aggregate stats for the current user.
 * @returns {Promise<{total_scans, healthy_count, diseased_count, crops_scanned}>}
 */
export async function getStats() {
  const response = await api.get('/predictions/stats');
  return response.data;
}
