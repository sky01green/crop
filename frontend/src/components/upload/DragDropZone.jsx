import React, { useState, useRef } from 'react';
import { ACCEPTED_IMAGE_TYPES, ACCEPTED_EXTENSIONS } from '../../utils/constants.js';

/**
 * Drag-and-drop zone with visual feedback.
 * @param {function} onFileDrop - Called with the dropped/selected File
 * @param {boolean} disabled
 */
function DragDropZone({ onFileDrop, disabled = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set false if leaving the zone itself (not a child)
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file && ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      onFileDrop(file);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFileDrop(file);
    // Reset so same file can be re-selected
    e.target.value = '';
  };

  return (
    <div
      className={`drag-drop-zone ${isDragging ? 'drag-active' : ''} ${disabled ? 'drag-disabled' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
          inputRef.current?.click();
        }
      }}
      aria-label="Upload image by dragging or clicking"
    >
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES.join(',')}
        onChange={handleInputChange}
        style={{ display: 'none' }}
        disabled={disabled}
        aria-hidden="true"
      />

      <div className="drag-drop-content">
        <div className="drag-drop-icon" aria-hidden="true">
          {isDragging ? (
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="56" height="56">
              <rect x="4" y="4" width="40" height="40" rx="8" stroke="currentColor" strokeWidth="2.5" strokeDasharray="6 3" />
              <path d="M24 16 L24 32 M16 24 L24 16 L32 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="56" height="56">
              <rect x="4" y="4" width="40" height="40" rx="8" stroke="currentColor" strokeWidth="2" strokeDasharray="6 3" />
              <path d="M24 30 L24 18 M18 24 L24 18 L30 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 34 L34 34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </div>
        <p className="drag-drop-title">
          {isDragging ? 'Release to upload' : 'Drag & drop your image here'}
        </p>
        <p className="drag-drop-subtitle">or click to browse</p>
        <p className="drag-drop-hint">Supports: {ACCEPTED_EXTENSIONS} (max 10 MB)</p>
      </div>
    </div>
  );
}

export default DragDropZone;
