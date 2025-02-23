import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import DPA from './DPA';
import SentimentAnalysis from './SentAnalysis';
import './App.css';
import './fonts.css';

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to What's Up Doc</h1>
      <p>Your AI-powered drug prescription aid and sentiment analysis tool.</p>
      <p>To get started, navigate to the Drug Prescription Aid or Sentiment Analysis pages using the navigation bar.</p>
    </div>
  );
}

function App() {
  return (
    <div className="app-container">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/DPA" element={<DPA />} />
          <Route path="/sentiment" element={<SentimentAnalysis />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
