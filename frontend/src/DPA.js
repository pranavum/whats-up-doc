import React from "react";

import './DPA.css';
import './fonts.css'; // Import your fonts.css
import { useState } from "react";
import axios from "axios";
import PromptInput from './PromptInput'
import DrugInfoDisplay from './DrugInfoDisplay'

function DPA() {
    const [drugInfo, setDrugInfo] = useState(null);

    const handlePromptSubmit = async (promptText, patientFile) => {
        const formData = new FormData(); // To send files and text
        formData.append('promptText', promptText);
        if (patientFile) {
            formData.append('patientFile', patientFile);
        }

        try {
            const response = await axios.post('http://127.0.0.1:5000/api/drug-info', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data' // Important for file uploads
                }
            });
            setDrugInfo(response.data); // Update state with drug info from backend
        } catch (error) {
            console.error("Error fetching drug information:", error);
            // Handle error states in UI (e.g., display an error message)
            setDrugInfo({ error: "Failed to fetch drug information. Please try again." });
        }
    };

    return (
        <div className="app-container">
            <h1>What's Up Doc - Drug Prescription Aid</h1>
            <PromptInput onPromptSubmit={handlePromptSubmit} />
            <DrugInfoDisplay drugInfo={drugInfo} />
        </div>
    );
}

export default DPA;