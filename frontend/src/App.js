import './App.css';
import './fonts.css'; // Import your fonts.css
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SentAnalysis from './SentAnalysis'; // import the Sent Analysis page
import Navigation from './Navigation'
import DPA from './DPA';

function App() {

    return (
        <div className="app-container">
            <Router>
                <Routes>
                    <Route path="/DPA" element={<DPA/>} />
                    <Route path="/SentAnalysis" element={<SentAnalysis/>} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;