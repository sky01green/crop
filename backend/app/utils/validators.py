"""
Input validation utilities.
Used by routes to validate user input before processing.
"""
import re


def validate_email(email):
    """
    Validate email format using regex.
    Returns True if valid, False otherwise.
    """
    if not email:
        return False
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validate_password(password):
    """
    Validate password strength.
    Returns None if valid, or an error message string.
    """
    if not password:
        return 'Password is required'
    if len(password) < 6:
        return 'Password must be at least 6 characters long'
    if len(password) > 128:
        return 'Password must be less than 128 characters'
    return None
