// src/App.js
import React, { useState } from 'react';
import PromptInput from './PromptInput';
import DrugInfoDisplay from './DrugInfoDisplay';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import SentimentAnalysis from './SentimentAnalysis';
import NavBar from './NavBar';
import './App.css';
import './fonts.css';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const [drugInfo, setDrugInfo] = useState(null);

  const handlePromptSubmit = async (promptText, patientFile) => {
    const formData = new FormData();
    formData.append('promptText', promptText);
    if (patientFile) {
      formData.append('patientFile', patientFile);
    }

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/drug-info', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setDrugInfo(response.data);
    } catch (error) {
      console.error("Error fetching drug information:", error);
      setDrugInfo({ error: "Failed to fetch drug information. Please try again." });
    }
  };

  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      <NavBar />
      {isHomePage ? (
        <div className="home-container">
          <h1>Welcome to What's Up Doc</h1>
          <p>Your AI-powered drug prescription aid and sentiment analysis tool.</p>
          <p>To get started, navigate to the Drug Prescription Aid or Sentiment Analysis pages using the navigation bar.</p>
        </div>
      ) : (
        <>
          <h1>What's Up Doc - Drug Prescription Aid</h1>
          <Routes>
            <Route path="/druginfo" element={
              <div className="app-container">
                <PromptInput onPromptSubmit={handlePromptSubmit} />
                <DrugInfoDisplay drugInfo={drugInfo} />
              </div>
            } />
            <Route path="/sentiment" element={<SentimentAnalysis />} />
          </Routes>
        </>
      )}
    </>
  );
}

export default App;