/**
 * Validate an email address format.
 * @param {string} email
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateEmail(email) {
  if (!email || !email.trim()) {
    return { valid: false, error: 'Email address is required.' };
  }
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email.trim())) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }
  return { valid: true, error: null };
}

/**
 * Validate a password for strength requirements.
 * @param {string} password
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validatePassword(password) {
  if (!password) {
    return { valid: false, error: 'Password is required.' };
  }
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long.' };
  }
  if (!/[A-Za-z]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one letter.' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number.' };
  }
  return { valid: true, error: null };
}

/**
 * Validate a name field.
 * @param {string} name
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateName(name) {
  if (!name || !name.trim()) {
    return { valid: false, error: 'Full name is required.' };
  }
  if (name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters long.' };
  }
  return { valid: true, error: null };
}

/**
 * Check that two password fields match.
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validatePasswordMatch(password, confirmPassword) {
  if (password !== confirmPassword) {
    return { valid: false, error: 'Passwords do not match.' };
  }
  return { valid: true, error: null };
}

/**
 * Validate an image file for type and size constraints.
 * @param {File} file
 * @param {string[]} acceptedTypes - Accepted MIME types
 * @param {number} maxBytes - Maximum file size in bytes
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateImageFile(file, acceptedTypes, maxBytes) {
  if (!file) {
    return { valid: false, error: 'Please select an image file.' };
  }
  if (!acceptedTypes.includes(file.type)) {
    return { valid: false, error: 'Unsupported file type. Please upload a JPG, PNG, or WebP image.' };
  }
  if (file.size > maxBytes) {
    const maxMB = (maxBytes / (1024 * 1024)).toFixed(0);
    return { valid: false, error: `File is too large. Maximum size is ${maxMB} MB.` };
  }
  return { valid: true, error: null };
}
