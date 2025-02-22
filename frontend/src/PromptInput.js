// src/PromptInput.js
import React, { useState, useRef } from 'react';

function PromptInput({ onPromptSubmit }) {
  const [promptText, setPromptText] = useState('');
  const [patientFile, setPatientFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleTextChange = (event) => {
    setPromptText(event.target.value);
  };

  const handleFileChange = (event) => {
    setPatientFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onPromptSubmit(promptText, patientFile);
    setPromptText('');
    setPatientFile(null);
  };

  const handlePlusClick = () => {
    fileInputRef.current.click();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="prompt-input-container">
        {patientFile && (
          <div className="file-name-bubble">
            {patientFile.name}
          </div>
        )}
        <div className="prompt-textarea-wrapper">
          <div className="input-actions-left">
            <button type="button" className="file-upload-button" onClick={handlePlusClick}>
              +
            </button>
            <input
              type="file"
              className="file-upload-input"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </div>
          <textarea
            className="prompt-textarea"
            placeholder="Enter your medical query here (e.g., 'Proprietary names for acetaminophen')"
            value={promptText}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
          />
          <div className="input-actions-right">
            <button type="submit" className="submit-button"></button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default PromptInput;