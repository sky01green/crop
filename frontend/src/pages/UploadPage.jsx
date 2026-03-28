import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../components/upload/ImageUploader.jsx';
import Button from '../components/common/Button.jsx';
import { uploadAndPredict } from '../services/predictionService.js';

function UploadPage() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');

  const handleFileSelect = useCallback((file) => {
    setSelectedFile(file);
    setError('');
  }, []);

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select an image before analyzing.');
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      const data = await uploadAndPredict(selectedFile, (progressEvent) => {
        const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(pct);
      });

      const predId = data.prediction_id || data.prediction?.id;
      if (predId) {
        navigate(`/result/${predId}`);
      } else {
        setError('Analysis complete but result ID not found. Please try again.');
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Upload failed. Please try again.';
      setError(message);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="upload-page page-container">
      <div className="upload-header">
        <h1 className="page-title">Analyze Your Crop</h1>
        <p className="page-subtitle">
          Upload a clear, close-up photo of your plant leaves for the best results.
        </p>
      </div>

      <div className="upload-body">
        <div className="upload-tips card">
          <h3 className="tips-title">📷 Tips for best results</h3>
          <ul className="tips-list">
            <li>Use a clear, well-lit photo</li>
            <li>Focus on the affected leaf or area</li>
            <li>Avoid blurry or very dark images</li>
            <li>JPG, PNG, and WebP are supported (max 10 MB)</li>
          </ul>
        </div>

        <ImageUploader onFileSelect={handleFileSelect} disabled={uploading} />

        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}

        {uploading && (
          <div className="upload-progress-wrapper">
            <div className="upload-progress-track">
              <div
                className="upload-progress-fill"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="upload-progress-text">
              {uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : 'Analyzing image...'}
            </p>
          </div>
        )}

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleAnalyze}
          loading={uploading}
          disabled={!selectedFile}
        >
          {uploading ? 'Analyzing...' : 'Analyze Crop'}
        </Button>
      </div>
    </div>
  );
}

export default UploadPage;
