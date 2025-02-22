// src/DrugInfoDisplay.js
import React from 'react';

function DrugInfoDisplay({ drugInfo }) {
    if (!drugInfo || !drugInfo.drugs) {
        return <p>No drug information available yet.</p>;
    }

    return (
        <div className="drug-info-display-container">
            {drugInfo.drugs.map((drug, index) => (
                <div key={index} className="drug-info-box">
                    <div className="info-column">
                        <h3>Generic Name</h3>
                        <p>{drug.generic_name}</p>
                    </div>
                    <div className="info-column">
                        <h3>Proprietary Names</h3>
                        <ul>
                            {drug.proprietary_names.map((name, nameIndex) => (
                                <li key={nameIndex}>{name}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default DrugInfoDisplay;