// import React, { useState } from 'react';
// import { ChevronDown, ChevronUp } from 'lucide-react';
// import './SentAnalysis.css';

// const initialData = [
//   {
//     name: "Jane Cooper",
//     email: "jane.cooper@example.com",
//     status: "ACTIVE",
//     age: 27,
//     role: "Admin"
//   },
//   {
//     name: "Cody Fisher",
//     email: "cody.fisher@example.com",
//     status: "INACTIVE",
//     age: 43,
//     role: "Owner"
//   }
// ];

// const SentAnalysis = () => {
//   const [expandedRows, setExpandedRows] = useState(new Set());
//   const [summaries, setSummaries] = useState({});

//   const toggleRowExpansion = async (index) => {
//     const newExpandedRows = new Set(expandedRows);
//     if (newExpandedRows.has(index)) {
//       newExpandedRows.delete(index);
//     } else {
//       newExpandedRows.add(index);
//       if (!summaries[index]) {
//         try {
//           const response = await fetch("http://localhost:5000/api/sent-analysis");
//           const data = await response.text();
//           setSummaries(prevSummaries => ({ ...prevSummaries, [index]: data }));
//         } catch (error) {
//           console.error("Error fetching summary:", error);
//           setSummaries(prevSummaries => ({ ...prevSummaries, [index]: "Failed to load summary." }));
//         }
//       }
//     }
//     setExpandedRows(newExpandedRows);
//   };

//   return (
//     <div className="table-container">
//       <table className="table">
//         <thead>
//           <tr>
//             <th>Person</th>
//             <th>Status</th>
//             <th>Priority</th>
//             <th>Expand</th>
//           </tr>
//         </thead>
//         <tbody>
//           {initialData.map((entry, index) => (
//             <React.Fragment key={index}>
//               <tr className="row" onClick={() => toggleRowExpansion(index)}>
//                 <td>{entry.name} <br /><span className="email">{entry.email}</span></td>
//                 <td className={`status ${entry.status.toLowerCase()}`}>{entry.status}</td>
//                 <td>{entry.age}</td>
//                 <td className="expand-icon">
//                   {expandedRows.has(index) ? <ChevronUp /> : <ChevronDown />}
//                 </td>
//               </tr>
//               {expandedRows.has(index) && (
//                 <tr className="expanded-row">
//                   <td colSpan="4">
//                     <div className="summary-container">
//                       <h4>Patient Call Summary</h4>
//                       <p>{summaries[index] || "Loading..."}</p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </React.Fragment>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default SentAnalysis;
// import React, { useState } from 'react';
// import { ChevronDown, ChevronUp } from 'lucide-react';
// import './SentAnalysis.css';

// const SentAnalysis = () => {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedRole, setSelectedRole] = useState("All");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);
//   const [expandedRows, setExpandedRows] = useState(new Set());
//   const [summaries, setSummaries] = useState({});  // Store fetched summaries

//   const initialData = [
//     {
//       name: "Jane Cooper",
//       email: "jane.cooper@example.com",
//       title: "Regional Paradigm Technician",
//       status: "ACTIVE",
//       age: 27,
//       role: "Admin"
//     },
//     {
//       name: "Cody Fisher",
//       email: "cody.fisher@example.com",
//       title: "Product Directives Officer",
//       status: "INACTIVE",
//       age: 43,
//       role: "Owner"
//     }
//   ];

//   const toggleRowExpansion = async (index) => {
//     const newExpandedRows = new Set(expandedRows);
    
//     if (newExpandedRows.has(index)) {
//       newExpandedRows.delete(index);
//     } else {
//       newExpandedRows.add(index);

//       // Fetch sentiment summary only if not already fetched
//       if (!summaries[index]) {
//         try {
//           const response = await fetch("http://127.0.0.1:5000/api/sent-analysis");
//           const summary = await response.text();  // Get raw text response
//           setSummaries(prev => ({ ...prev, [index]: summary }));
//         } catch (error) {
//           console.error("Error fetching sentiment analysis:", error);
//           setSummaries(prev => ({ ...prev, [index]: "Failed to fetch summary." }));
//         }
//       }
//     }

//     setExpandedRows(newExpandedRows);
//   };

//   const filteredData = initialData.filter(item => {
//     return (
//       (item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
//       item.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
//       item.title.toLowerCase().includes(searchQuery.toLowerCase())) &&
//       (selectedRole === "All" || item.role === selectedRole)
//     );
//   });

//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

//   return (
//     <div className="container">
//       <h1 className="title">Sentiment Analysis Dashboard</h1>

//       <div className="filters">
//         <input
//           type="text"
//           placeholder="Search entries..."
//           className="search-input"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//         <select className="select" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
//           <option value="All">All Categories</option>
//           <option value="Admin">Priority</option>
//           <option value="Owner">Urgent</option>
//           <option value="Member">Standard</option>
//         </select>
//       </div>

//       <div className="table-container">
//         <table className="table">
//           <thead>
//             <tr>
//               <th>Person</th>
//               <th>Status</th>
//               <th>Priority</th>
//               <th>Expand</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentData.map((entry, index) => (
//               <React.Fragment key={index}>
//                 <tr className={`row ${expandedRows.has(index) ? 'expanded' : ''}`} onClick={() => toggleRowExpansion(index)}>
//                   <td>{entry.name} <br /><span className="email">{entry.email}</span></td>
//                   <td className={`status ${entry.status.toLowerCase()}`}>{entry.status}</td>
//                   <td>{entry.age}</td>
//                   <td className="expand-icon">
//                     {expandedRows.has(index) ? <ChevronUp /> : <ChevronDown />}
//                   </td>
//                 </tr>
//                 {expandedRows.has(index) && (
//                   <tr className="expanded-row">
//                     <td colSpan="4">
//                       <div className="summary-container">
//                         <h4>Call Summary</h4>
//                         <p>{summaries[index] || "Loading..."}</p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="pagination">
//         <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>«</button>
//         <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>‹</button>
//         <span>Page {currentPage} of {totalPages}</span>
//         <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>›</button>
//         <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>»</button>
//       </div>
//     </div>
//   );
// };

// export default SentAnalysis;
import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import "./SentAnalysis.css";

const initialData = [
  {
    name: "Jane Cooper",
    email: "jane.cooper@example.com",
    status: "ACTIVE",
    age: 27,
    role: "Admin",
  },
  {
    name: "Cody Fisher",
    email: "cody.fisher@example.com",
    status: "INACTIVE",
    age: 43,
    role: "Owner",
  },
];

const SentAnalysis = () => {
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [summaries, setSummaries] = useState({});
  const [loading, setLoading] = useState({});

  const toggleRowExpansion = async (index) => {
    const newExpandedRows = new Set(expandedRows);

    if (newExpandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);

      if (!summaries[index]) {
        setLoading((prev) => ({ ...prev, [index]: true }));

        try {
          console.log(`Fetching summary for row ${index}...`);

          const response = await fetch("http://127.0.0.1:5000/api/sent-analysis");

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.text();
          console.log(`Fetched summary for row ${index}:`, data);

          setSummaries((prev) => ({ ...prev, [index]: data }));
        } catch (error) {
          console.error(`Error fetching summary for row ${index}:`, error);
          setSummaries((prev) => ({
            ...prev,
            [index]: "Failed to load summary.",
          }));
        } finally {
          setLoading((prev) => ({ ...prev, [index]: false }));
        }
      }
    }

    setExpandedRows(newExpandedRows);
  };

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Person</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Expand</th>
          </tr>
        </thead>
        <tbody>
          {initialData.map((entry, index) => (
            <React.Fragment key={index}>
              <tr className="row" onClick={() => toggleRowExpansion(index)}>
                <td>
                  {entry.name} <br />
                  <span className="email">{entry.email}</span>
                </td>
                <td className={`status ${entry.status.toLowerCase()}`}>
                  {entry.status}
                </td>
                <td>{entry.age}</td>
                <td className="expand-icon">
                  {expandedRows.has(index) ? <ChevronUp /> : <ChevronDown />}
                </td>
              </tr>
              {expandedRows.has(index) && (
                <tr className="expanded-row">
                  <td colSpan="4">
                    <div className="summary-container">
                      <h4>Patient Call Summary</h4>
                      <p>
                        {loading[index]
                          ? "Loading..."
                          : summaries[index] || "No summary available."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SentAnalysis;
