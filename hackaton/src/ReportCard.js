import React, { useState, useRef } from 'react';
import './ReportCard.css';

function ReportCard({ onSubmit, onCancel }) {
  const [issueType, setIssueType] = useState('');
  const [comment, setComment] = useState('');
  const [picture, setPicture] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ issueType, comment, picture });
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    setPicture(e.target.files[0]);
  };

  return (
    <div className="container">
      <div className="report-card">
        <h2>Report Issue</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Click to select issue:
            <select
              className="input"
              required
              value={issueType}
              onChange={e => setIssueType(e.target.value)}
            >
              <option>Select</option>
              <option>Improperly Parked</option>
              <option>No Available Place</option>
              <option>Other</option>
            </select>
          </label>

          <label>
            Comment:
            <textarea
              className="input"
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
          </label>

          <label>
            Insert Picture:
            <div className="upload-box" onClick={handleImageClick}>
              <span className="plus-icon">+</span>
            </div>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            {picture && <p style={{ fontSize: '12px' }}>Selected: {picture.name}</p>}
          </label>

          <div className="buttons">
            <button type="button" className="cancel" onClick={onCancel}>Cancel</button>
            <button type="submit" className="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportCard;
