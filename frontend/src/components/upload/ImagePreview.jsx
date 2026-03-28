import React from 'react';
import { formatFileSize } from '../../utils/formatters.js';

/**
 * Displays a preview of the selected image with metadata and a remove button.
 * @param {File} file - The selected image File object
 * @param {string} previewUrl - Object URL for the preview
 * @param {function} onRemove - Called when user clicks remove
 */
function ImagePreview({ file, previewUrl, onRemove }) {
  if (!file || !previewUrl) return null;

  return (
    <div className="image-preview">
      <div className="image-preview-wrapper">
        <img
          src={previewUrl}
          alt="Selected crop image preview"
          className="preview-img"
        />
        <button
          type="button"
          className="preview-remove-btn"
          onClick={onRemove}
          aria-label="Remove selected image"
          title="Remove image"
        >
          &times;
        </button>
      </div>
      <div className="preview-meta">
        <span className="preview-filename" title={file.name}>
          📄 {file.name.length > 40 ? `${file.name.slice(0, 37)}...` : file.name}
        </span>
        <span className="preview-filesize">{formatFileSize(file.size)}</span>
      </div>
    </div>
  );
}

export default ImagePreview;
