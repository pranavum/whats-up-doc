// src/DrugInfoDisplay.js
import React from 'react';

function DrugInfoDisplay({ drugInfo }) {
    if (!drugInfo) { // Check if drugInfo is null or undefined
        return <p>No drug information available yet.</p>;
    }

    if (drugInfo.error) { // Check if there's an error from the backend
        return <p className="error-message">Error: {drugInfo.error}</p>;
    }

    if (drugInfo.llm_response) { // Display the raw LLM response
        return (
            <div className="llm-response-container">
                <h3>Gemini Response:</h3>
                <p>{drugInfo.llm_response}</p>
            </div>
        );
    }

    return <p>Waiting for drug information...</p>; // Loading state

}

export default DrugInfoDisplay;