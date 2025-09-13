import React, { useState, useRef } from 'react';
import { uploadPDF } from '../services/api';

function PDFUploader({ onSummarize }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    
    if (selectedFile) {
      // Validate file type
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a PDF file only.');
        return;
      }
      
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (selectedFile.size > maxSize) {
        setError('File size must be less than 10MB.');
        return;
      }
      
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const response = await uploadPDF(file);
      
      if (response && response.text) {
        // Pass extracted text to parent component for summarization
        onSummarize(response.text);
      } else {
        throw new Error('No text extracted from PDF');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload PDF');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleOpenPDF = () => {
    if (file) {
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    }
  };

  return (
    <div className="upload-section">
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="pdf-upload-input"
      />
      
      {error && <div className="error-message">{error}</div>}
      
      {!file ? (
        <label htmlFor="pdf-upload-input" className="file-upload-button">
          Select PDF File
        </label>
      ) : (
        <div className="uploaded-file-container">
          <div 
            className="pdf-logo" 
            onClick={handleOpenPDF}
            title="Click to open PDF"
          ></div>
          
          <span className="uploaded-file-name">{file.name}</span>
          
          <span className="file-size">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
          
          <button 
            onClick={handleRemoveFile} 
            className="file-remove-btn"
            aria-label="Remove file"
          >
            ×
          </button>
        </div>
      )}
      
      {file && (
        <button 
          onClick={handleUpload} 
          disabled={isUploading}
          className="upload-btn"
        >
          {isUploading ? 'Processing...' : 'Upload & Extract Text'}
        </button>
      )}
    </div>
  );
}

export default PDFUploader;
