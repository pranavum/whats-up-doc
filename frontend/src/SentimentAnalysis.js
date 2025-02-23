// src/SentimentAnalysis.js
import React from 'react';
import './SentimentAnalysis.css'; // Create this CSS file

function SentimentAnalysis() {
  const sentimentData = [
    { number: '123-456-7890', sentiment: 'Positive', summary: 'Patient happy with treatment.' },
    { number: '987-654-3210', sentiment: 'Negative', summary: 'Patient complained about long wait times.' },
    // Add more sentiment data as needed
  ];

  return (
    <div className="sentiment-analysis-container">
      <h2>Sentiment Analysis of Calls</h2>
      <table className="sentiment-table">
        <thead>
          <tr>
            <th>Phone Number</th>
            <th>Sentiment</th>
            <th>Summary</th>
          </tr>
        </thead>
        <tbody>
          {sentimentData.map((item, index) => (
            <tr key={index}>
              <td>{item.number}</td>
              <td className={`sentiment ${item.sentiment.toLowerCase()}`}>{item.sentiment}</td>
              <td>{item.summary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SentimentAnalysis;