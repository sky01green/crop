import React from 'react';

/**
 * Reusable button component.
 * @param {string} variant - 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost'
 * @param {boolean} loading - Show spinner and disable button
 * @param {boolean} fullWidth - Expand to full container width
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {React.ReactNode} children
 * @param {object} rest - Any other button props
 */
function Button({
  variant = 'primary',
  loading = false,
  fullWidth = false,
  size = 'md',
  children,
  className = '',
  disabled,
  ...rest
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-full' : '',
    loading ? 'btn-loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {loading && (
        <span className="btn-spinner" aria-hidden="true" />
      )}
      <span className={loading ? 'btn-text-loading' : ''}>{children}</span>
    </button>
  );
}

export default Button;
