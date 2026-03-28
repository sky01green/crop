import api from './api.js';

/**
 * Get a report by its own ID.
 * @param {string} id - Report ID
 * @returns {Promise<{report, prediction}>}
 */
export async function getReport(id) {
  const response = await api.get(`/reports/${id}`);
  return response.data;
}

/**
 * Get the report associated with a specific prediction.
 * @param {string} predictionId - Prediction ID
 * @returns {Promise<{prediction, report}>}
 */
export async function getReportByPrediction(predictionId) {
  const response = await api.get(`/predictions/${predictionId}`);
  return response.data;
}
