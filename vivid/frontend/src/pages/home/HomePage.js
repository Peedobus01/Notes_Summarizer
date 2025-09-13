import React, { useState, useEffect, useRef } from 'react';
import { uploadPDF, summarizeText, logoutUser, getUserProfile } from '../../services/api';
import './HomePage.css';

function HomePage({ onLogout }) {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [summary, setSummary] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Load user profile on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const profileData = await getUserProfile();
        setUser(profileData);
      } catch (err) {
        console.error('Failed to load user profile:', err);
        setError(`Profile Error: ${err.response?.data?.message || 'Unable to load profile'}`);
      }
    };

    loadUserProfile();
  }, []);

  // Drag and Drop Handlers
  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = event.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileSelection(droppedFiles[0]);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    handleFileSelection(selectedFile);
  };

  const handleFileSelection = (selectedFile) => {
    setError('');
    
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
      // Clear previous results
      setExtractedText('');
      setSummary('');
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
        setExtractedText(response.text);
        console.log('PDF processed successfully');
      } else {
        throw new Error('No text extracted from PDF');
      }
    } catch (err) {
      console.error('Upload error:', err);
      
      // More detailed error handling
      if (err.response) {
        // Server responded with an error
        setError(`Upload Error: ${err.response.data.message || 'Failed to upload PDF'}`);
      } else if (err.request) {
        // Request made but no response received
        setError('No response from server. Please check your network connection.');
      } else {
        // Something else went wrong
        setError(err.message || 'An unexpected error occurred during upload');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleSummarize = async () => {
    if (!extractedText.trim()) {
      setError('No text available to summarize. Please upload and process a PDF first.');
      return;
    }

    setIsSummarizing(true);
    setError('');

    try {
      const response = await summarizeText(extractedText);
      
      // Check for summary in the response
      if (response && response.summary) {
        setSummary(response.summary);
        
        // Optional: Log additional information
        console.log('Text summarized successfully');
        console.log('Used Model:', response.usedModel);
        console.log('Original Word Count:', response.wordCount);
        console.log('Summary Word Count:', response.summaryWordCount);
      } else {
        throw new Error('No summary generated');
      }
    } catch (err) {
      console.error('Summarization error:', err);
      
      // More detailed error handling
      if (err.response) {
        // Server responded with an error
        const errorMessage = err.response.data.message || 
          (err.response.data.availableModels 
            ? `No suitable model found. Available models: ${err.response.data.availableModels.join(', ')}` 
            : 'Failed to summarize text');
        
        setError(`Summarization Error: ${errorMessage}`);
      } else if (err.request) {
        // Request made but no response received
        setError('No response from server. Please check your network connection.');
      } else {
        // Something else went wrong
        setError(err.message || 'An unexpected error occurred during summarization');
      }
    } finally {
      setIsSummarizing(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    onLogout();
  };

  const clearAll = () => {
    setFile(null);
    setExtractedText('');
    setSummary('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="home-page">
      <header className="header">
        <div className="header-content">
          <h1>AI Notes Summarizer</h1>
          <div className="user-section">
            {user && <span>Welcome, {user.username}!</span>}
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main 
        className="main-content"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {error && (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => setError('')} className="close-error">×</button>
          </div>
        )}

        <div className={`upload-section ${isDragOver ? 'drag-over' : ''}`}>
          <h2>Upload PDF Document</h2>
          
          <div className="file-input-container">
            <input
              ref={fileInputRef}
              type="file"
              id="pdf-file"
              accept=".pdf"
              onChange={handleFileChange}
              className="file-input"
            />
            <label htmlFor="pdf-file" className="file-input-label">
              {file ? file.name : 'Select PDF File'}
            </label>
          </div>

          {file && (
            <div className="file-info">
              <p><strong>File:</strong> {file.name}</p>
              <p><strong>Size:</strong> {(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          )}

          <div className="action-buttons">
            <button 
              onClick={handleUpload} 
              disabled={!file || isUploading}
              className="upload-btn primary-btn"
            >
              {isUploading ? 'Processing...' : 'Upload & Extract Text'}
            </button>
            
            {(file || extractedText || summary) && (
              <button onClick={clearAll} className="clear-btn secondary-btn">
                Clear All
              </button>
            )}
          </div>
        </div>

        {extractedText && (
          <div className="text-section">
            <div className="section-header">
              <h2>Extracted Text</h2>
              <div className="text-stats">
                <span className="word-count">
                  {extractedText.split(' ').length} words
                </span>
                <span className="char-count">
                  {extractedText.length} characters
                </span>
              </div>
            </div>
            
            <textarea
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              className="extracted-text"
              rows="10"
              placeholder="Extracted text will appear here..."
            />
            
            <button 
              onClick={handleSummarize}
              disabled={isSummarizing || !extractedText.trim()}
              className="summarize-btn primary-btn"
            >
              {isSummarizing ? 'Generating Summary...' : 'Generate AI Summary'}
            </button>
          </div>
        )}

        {summary && (
          <div className="summary-section">
            <div className="section-header">
              <h2>AI Generated Summary</h2>
              <div className="text-stats">
                <span className="word-count">
                  {summary.split(' ').length} words
                </span>
              </div>
            </div>
            
            <div className="summary-content">
              <div className="summary-text">
                {summary.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
            
            <div className="summary-actions">
              <button 
                onClick={() => navigator.clipboard.writeText(summary)}
                className="copy-btn secondary-btn"
              >
                Copy Summary
              </button>
            </div>
          </div>
        )}

        {!extractedText && !summary && (
          <div className="welcome-message">
            <h3>Welcome to AI Notes Summarizer!</h3>
            <p>Upload a PDF document to get started. Our AI will extract the text and create an intelligent summary for you.</p>
            <div className="features">
              <div className="feature">
                <h4>📄 PDF Processing</h4>
                <p>Upload and extract text from PDF documents</p>
              </div>
              <div className="feature">
                <h4>🤖 AI Summarization</h4>
                <p>Generate intelligent summaries using Google's Gemini AI</p>
              </div>
              <div className="feature">
                <h4>✏️ Editable Text</h4>
                <p>Edit extracted text before summarization</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default HomePage;