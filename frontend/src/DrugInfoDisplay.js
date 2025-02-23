// src/DrugInfoDisplay.js
import React from 'react';
import './DrugInfoDisplay.css'; // Import the CSS file we'll create

function DrugInfoDisplay({ drugInfo }) {
    if (!drugInfo) {
        return <p>No drug information available yet.</p>;
    }

    if (drugInfo.error) {
        return <p className="error-message">Error: {drugInfo.error}</p>;
    }

    const responseText = drugInfo.llm_response || ""; // Ensure responseText is not null/undefined

    // Function to format the response text with HTML
    const formatResponse = (text) => {
        // Basic bolding for **text**
        let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Crude section headings (can be improved with more robust regex or markdown parsing)
        formattedText = formattedText.replace(/\*\*(Common Brand Names.*?)\*\*/g, '<h3>$1</h3>');
        formattedText = formattedText.replace(/\*\*(Important Considerations.*?)\*\*/g, '<h3>$1</h3>');
        formattedText = formattedText.replace(/\*\*(Important Safety Information.*?)\*\*/g, '<h3>$1</h3>');
        formattedText = formattedText.replace(/\*\*(Disclaimer.*?)\*\*/g, '<h3>$1</h3>');
        formattedText = formattedText.replace(/^(It seems.*?)\n/m, '<p class="intro-paragraph">$1</p><hr/>'); // Intro paragraph and horizontal rule

        // Basic paragraph spacing using <br><br> for newlines
        formattedText = formattedText.replace(/\n/g, '<br /><br />');

        return <div dangerouslySetInnerHTML={{ __html: formattedText }} />;
    };

    if (drugInfo.llm_response) {
        return (
            <div className="drug-info-display"> {/* Apply a class for styling */}
                <h3>Gemini Response:</h3>
                <div className="response-content">
                    {formatResponse(responseText)}
                </div>
            </div>
        );
    }

    return <p>Waiting for drug information...</p>;
}

export default DrugInfoDisplay;