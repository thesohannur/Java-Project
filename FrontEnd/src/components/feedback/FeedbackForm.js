import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API } from '../../services/api';
import './FeedbackForm.css';

const FeedbackForm = ({ isOpen, onClose, targetEntity = null }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    feedbackType: 'GENERAL',
    category: 'PLATFORM',
    priority: 'MEDIUM',
    targetEntityType: targetEntity?.type || '',
    targetEntityId: targetEntity?.id || '',
    targetEntityName: targetEntity?.name || '',
    browserInfo: '',
    deviceInfo: '',
    pageUrl: window.location.href,
    isPublic: false,
    allowPublicResponse: true
  });

  const [attachments, setAttachments] = useState([]);
  const [screenshots, setScreenshots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [step, setStep] = useState(1);

  const feedbackTypes = [
    { value: 'GENERAL', label: '💬 General Feedback', description: 'General comments or suggestions' },
    { value: 'BUG', label: '🐛 Bug Report', description: 'Report a technical issue or error' },
    { value: 'FEATURE_REQUEST', label: '✨ Feature Request', description: 'Suggest a new feature or improvement' },
    { value: 'COMPLAINT', label: '⚠️ Complaint', description: 'Report a problem or concern' },
    { value: 'SUGGESTION', label: '💡 Suggestion', description: 'Share ideas for improvement' },
    { value: 'COMPLIMENT', label: '👏 Compliment', description: 'Share positive feedback' }
  ];

  const categories = [
    { value: 'PLATFORM', label: '🌐 Platform', description: 'General platform functionality' },
    { value: 'NGO_RELATED', label: '🏢 NGO Related', description: 'Issues related to NGO services' },
    { value: 'DONATION_PROCESS', label: '💰 Donation Process', description: 'Problems with donations' },
    { value: 'TECHNICAL', label: '⚙️ Technical', description: 'Technical issues or bugs' },
    { value: 'UI_UX', label: '🎨 User Interface', description: 'Design and usability issues' },
    { value: 'PERFORMANCE', label: '⚡ Performance', description: 'Speed and performance issues' }
  ];

  const priorities = [
    { value: 'LOW', label: '🟢 Low', description: 'Minor issue, can wait' },
    { value: 'MEDIUM', label: '🟡 Medium', description: 'Moderate issue, should be addressed' },
    { value: 'HIGH', label: '🟠 High', description: 'Important issue, needs attention' },
    { value: 'CRITICAL', label: '🔴 Critical', description: 'Urgent issue, immediate attention needed' }
  ];

  useEffect(() => {
    if (isOpen) {
      // Collect browser and device information safely
      const screenWidth = window.screen?.width || window.innerWidth || 0;
      const screenHeight = window.screen?.height || window.innerHeight || 0;
      const platform = navigator.platform || 'Unknown';
      
      setFormData(prev => ({
        ...prev,
        browserInfo: navigator.userAgent,
        deviceInfo: `${platform} - ${screenWidth}x${screenHeight}`,
        pageUrl: window.location.href
      }));
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleFileUpload = (e, type) => {
    const files = Array.from(e.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = type === 'screenshot' 
      ? ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      : ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'text/plain', 'application/msword'];

    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        setError(`File ${file.name} is too large. Maximum size is 5MB.`);
        return false;
      }
      if (!allowedTypes.includes(file.type)) {
        setError(`File ${file.name} has an unsupported format.`);
        return false;
      }
      return true;
    });

    if (type === 'screenshot') {
      setScreenshots(prev => [...prev, ...validFiles]);
    } else {
      setAttachments(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index, type) => {
    if (type === 'screenshot') {
      setScreenshots(prev => prev.filter((_, i) => i !== index));
    } else {
      setAttachments(prev => prev.filter((_, i) => i !== index));
    }
  };

  const takeScreenshot = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { mediaSource: 'screen' }
        });
        
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        
        video.addEventListener('loadedmetadata', () => {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0);
          
          canvas.toBlob(blob => {
            const file = new File([blob], `screenshot-${Date.now()}.png`, { type: 'image/png' });
            setScreenshots(prev => [...prev, file]);
            stream.getTracks().forEach(track => track.stop());
          });
        });
      } else {
        setError('Screenshot capture is not supported in your browser.');
      }
    } catch (error) {
      setError('Failed to capture screenshot. Please upload manually.');
    }
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Please provide a title for your feedback.');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Please provide a description of your feedback.');
      return false;
    }
    if (formData.description.length < 10) {
      setError('Please provide a more detailed description (at least 10 characters).');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError('');

    try {
      // Submit feedback
      const feedbackResponse = await API.utils.retryRequest(
        () => fetch('/api/feedback/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            ...formData,
            submitterName: user?.name || user?.fullName,
            submitterEmail: user?.email,
            submitterType: user?.userType || 'DONOR'
          })
        })
      );

      if (!feedbackResponse.ok) {
        throw new Error('Failed to submit feedback');
      }

      const feedbackResult = await feedbackResponse.json();
      const feedbackId = feedbackResult.data.feedbackId;

      // Upload attachments if any
      if (attachments.length > 0 || screenshots.length > 0) {
        const formDataFiles = new FormData();
        
        attachments.forEach(file => {
          formDataFiles.append('files', file);
        });
        
        screenshots.forEach(file => {
          formDataFiles.append('files', file);
        });

        await fetch(`/api/feedback/${feedbackId}/attachments`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formDataFiles
        });
      }

      setSuccess('Thank you! Your feedback has been submitted successfully. We will review it and get back to you soon.');
      
      // Reset form
      const screenWidth = window.screen?.width || window.innerWidth || 0;
      const screenHeight = window.screen?.height || window.innerHeight || 0;
      const platform = navigator.platform || 'Unknown';
      
      setFormData({
        title: '',
        description: '',
        feedbackType: 'GENERAL',
        category: 'PLATFORM',
        priority: 'MEDIUM',
        targetEntityType: targetEntity?.type || '',
        targetEntityId: targetEntity?.id || '',
        targetEntityName: targetEntity?.name || '',
        browserInfo: navigator.userAgent,
        deviceInfo: `${platform} - ${screenWidth}x${screenHeight}`,
        pageUrl: window.location.href,
        isPublic: false,
        allowPublicResponse: true
      });
      setAttachments([]);
      setScreenshots([]);
      setStep(1);
      
      // Close form after 3 seconds
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 3000);

    } catch (error) {
      setError('Failed to submit feedback. Please try again.');
      console.error('Feedback submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (step === 1 && (!formData.title.trim() || !formData.description.trim())) {
      setError('Please fill in the title and description before proceeding.');
      return;
    }
    setStep(step + 1);
    setError('');
  };

  const prevStep = () => {
    setStep(step - 1);
    setError('');
  };

  if (!isOpen) return null;

  // Get screen dimensions safely
  const getScreenDimensions = () => {
    const width = window.screen?.width || window.innerWidth || 0;
    const height = window.screen?.height || window.innerHeight || 0;
    return `${width}x${height}`;
  };

  return (
    <div className="feedback-overlay">
      <div className="feedback-modal">
        <div className="feedback-header">
          <h2>💬 Share Your Feedback</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {success ? (
          <div className="success-message">
            <div className="success-icon">✅</div>
            <h3>Feedback Submitted Successfully!</h3>
            <p>{success}</p>
          </div>
        ) : (
          <>
            {/* Progress Indicator */}
            <div className="progress-indicator">
              <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                <span>1</span>
                <label>Details</label>
              </div>
              <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                <span>2</span>
                <label>Category</label>
              </div>
              <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                <span>3</span>
                <label>Attachments</label>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="feedback-form">
              {/* Step 1: Basic Details */}
              {step === 1 && (
                <div className="form-step">
                  <h3>📝 Tell us about your feedback</h3>
                  
                  <div className="form-group">
                    <label>Title *</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Brief summary of your feedback"
                      maxLength="100"
                      required
                    />
                    <small>{formData.title.length}/100 characters</small>
                  </div>

                  <div className="form-group">
                    <label>Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Please provide detailed information about your feedback..."
                      rows="6"
                      maxLength="1000"
                      required
                    />
                    <small>{formData.description.length}/1000 characters</small>
                  </div>

                  {targetEntity && (
                    <div className="target-entity-info">
                      <h4>📍 Related to:</h4>
                      <p><strong>{targetEntity.type}:</strong> {targetEntity.name}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Category and Priority */}
              {step === 2 && (
                <div className="form-step">
                  <h3>🏷️ Categorize your feedback</h3>
                  
                  <div className="form-group">
                    <label>Feedback Type *</label>
                    <div className="radio-group">
                      {feedbackTypes.map(type => (
                        <label key={type.value} className="radio-option">
                          <input
                            type="radio"
                            name="feedbackType"
                            value={type.value}
                            checked={formData.feedbackType === type.value}
                            onChange={handleInputChange}
                          />
                          <div className="radio-content">
                            <span className="radio-title">{type.label}</span>
                            <span className="radio-description">{type.description}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Priority Level *</label>
                    <div className="priority-buttons">
                      {priorities.map(priority => (
                        <button
                          key={priority.value}
                          type="button"
                          className={`priority-btn ${formData.priority === priority.value ? 'active' : ''} ${priority.value.toLowerCase()}`}
                          onClick={() => setFormData(prev => ({ ...prev, priority: priority.value }))}
                        >
                          <span className="priority-label">{priority.label}</span>
                          <span className="priority-description">{priority.description}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Attachments and Settings */}
              {step === 3 && (
                <div className="form-step">
                  <h3>📎 Attachments & Settings</h3>
                  
                  <div className="form-group">
                    <label>Screenshots</label>
                    <div className="file-upload-section">
                      <div className="upload-buttons">
                        <button type="button" className="screenshot-btn" onClick={takeScreenshot}>
                          📷 Take Screenshot
                        </button>
                        <label className="file-upload-btn">
                          📁 Upload Images
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'screenshot')}
                            hidden
                          />
                        </label>
                      </div>
                      
                      {screenshots.length > 0 && (
                        <div className="file-list">
                          {screenshots.map((file, index) => (
                            <div key={index} className="file-item">
                              <span>🖼️ {file.name}</span>
                              <button type="button" onClick={() => removeFile(index, 'screenshot')}>×</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Additional Files</label>
                    <div className="file-upload-section">
                      <label className="file-upload-btn">
                        📄 Upload Files
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                          onChange={(e) => handleFileUpload(e, 'attachment')}
                          hidden
                        />
                      </label>
                      
                      {attachments.length > 0 && (
                        <div className="file-list">
                          {attachments.map((file, index) => (
                            <div key={index} className="file-item">
                              <span>📄 {file.name}</span>
                              <button type="button" onClick={() => removeFile(index, 'attachment')}>×</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="isPublic"
                          checked={formData.isPublic}
                          onChange={handleInputChange}
                        />
                        <span>Make this feedback public (helps other users)</span>
                      </label>
                      
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          name="allowPublicResponse"
                          checked={formData.allowPublicResponse}
                          onChange={handleInputChange}
                        />
                        <span>Allow public responses to this feedback</span>
                      </label>
                    </div>
                  </div>

                  <div className="system-info">
                    <h4>📊 System Information (automatically collected)</h4>
                    <div className="info-grid">
                      <div className="info-item">
                        <strong>Page:</strong> {formData.pageUrl}
                      </div>
                      <div className="info-item">
                        <strong>Browser:</strong> {navigator.userAgent.split(' ')[0]}
                      </div>
                      <div className="info-item">
                        <strong>Screen:</strong> {getScreenDimensions()}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="error-message">
                  <span>⚠️ {error}</span>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="form-navigation">
                {step > 1 && (
                  <button type="button" className="nav-btn secondary" onClick={prevStep}>
                    ← Previous
                  </button>
                )}
                
                {step < 3 ? (
                  <button type="button" className="nav-btn primary" onClick={nextStep}>
                    Next →
                  </button>
                ) : (
                  <button type="submit" className="submit-btn" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <span className="spinner"></span>
                        Submitting...
                      </>
                    ) : (
                      '🚀 Submit Feedback'
                    )}
                  </button>
                )}
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;
