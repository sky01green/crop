import React, { useState, useCallback, useEffect } from 'react';
import DragDropZone from './DragDropZone.jsx';
import ImagePreview from './ImagePreview.jsx';
import { validateImageFile } from '../../utils/validators.js';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES } from '../../utils/constants.js';

/**
 * Full image upload widget: drag-drop zone + preview + validation.
 * @param {function} onFileSelect - Called with the valid File (or null if removed)
 * @param {boolean} disabled
 */
function ImageUploader({ onFileSelect, disabled = false }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');

  // Revoke object URL on cleanup to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFile = useCallback((file) => {
    setError('');
    const validation = validateImageFile(file, ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES);
    if (!validation.valid) {
      setError(validation.error);
      onFileSelect(null);
      return;
    }

    // Revoke previous URL
    if (previewUrl) URL.revokeObjectURL(previewUrl);

    const url = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(url);
    onFileSelect(file);
  }, [previewUrl, onFileSelect]);

  const handleRemove = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setError('');
    onFileSelect(null);
  }, [previewUrl, onFileSelect]);

  return (
    <div className="image-uploader">
      {!selectedFile ? (
        <DragDropZone onFileDrop={handleFile} disabled={disabled} />
      ) : (
        <ImagePreview
          file={selectedFile}
          previewUrl={previewUrl}
          onRemove={handleRemove}
        />
      )}

      {error && (
        <div className="upload-error alert alert-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
