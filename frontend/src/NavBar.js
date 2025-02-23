// src/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css'; // Create this CSS file

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">What's Up Doc</Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/DPA" className="nav-links">Drug Prescription Aid</Link>
          </li>
          <li className="nav-item">
            <Link to="/sentiment" className="nav-links">Sentiment Analysis</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;