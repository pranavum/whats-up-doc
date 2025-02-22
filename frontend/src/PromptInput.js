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
    if (event.key === 'Enter' && !event.shiftKey) { // Check for Enter key without Shift
      event.preventDefault(); // Prevent newline in textarea
      handleSubmit(event); // Submit the form
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="prompt-input-container">
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
            onKeyDown={handleKeyDown} // Add keydown event listener
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