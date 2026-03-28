import api from './api.js';

/**
 * Authenticate an existing user.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token: string, user: object}>}
 */
export async function loginUser(email, password) {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
}

/**
 * Create a new user account.
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token: string, user: object}>}
 */
export async function registerUser(name, email, password) {
  const response = await api.post('/auth/register', { name, email, password });
  return response.data;
}

/**
 * Fetch the currently authenticated user's profile.
 * @returns {Promise<{user: object}>}
 */
export async function getProfile() {
  const response = await api.get('/auth/profile');
  return response.data;
}

/**
 * Request a password reset link.
 * @param {string} email
 * @returns {Promise<{message: string, reset_token_demo?: string}>}
 */
export async function forgotPassword(email) {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
}

/**
 * Reset password using a token.
 * @param {string} token
 * @param {string} new_password
 * @returns {Promise<{message: string}>}
 */
export async function resetPassword(token, new_password) {
  const response = await api.post('/auth/reset-password', { token, new_password });
  return response.data;
}
