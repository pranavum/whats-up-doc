// // import React from "react";
// // import "./SentAnalysis.css"; // Import the styles for this component

// // function SentAnalysis() {
// //   const data = [
// //     { voice_memo_id: 1, reviewed: "Yes", summary: "This is a short summary of the memo." },
// //     { voice_memo_id: 2, reviewed: "No", summary: "This is another memo summary with some detail." },
// //     { voice_memo_id: 3, reviewed: "Yes", summary: "A third memo with a brief summary." },
// //     { voice_memo_id: 4, reviewed: "No", summary: "Semen Analysis"}
// //     // Add more rows as needed
// //   ];

// //   return (
// //     <div className="sent-analysis">
// //       <h1>Voice Memos Review</h1>
// //       <div className="memo-cards-container">
// //         {data.map((memo) => (
// //           <div className="memo-card" key={memo.voice_memo_id}>
// //             <div className="memo-header">
// //               <h2>Memo ID: {memo.voice_memo_id}</h2>
// //               <span
// //                 className={`reviewed-badge ${memo.reviewed === "Yes" ? "reviewed" : "not-reviewed"}`}
// //               >
// //                 {memo.reviewed}
// //               </span>
// //             </div>
// //             <p className="memo-summary">{memo.summary}</p>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// // export default SentAnalysis;
// import React, { useState } from 'react';
// import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown, ChevronUp } from 'lucide-react';

// // Sample data structure for sentiment analysis
// const initialData = [
//   {
//     name: "Jane Cooper",
//     email: "jane.cooper@example.com",
//     title: "Regional Paradigm Technician",
//     status: "ACTIVE",
//     age: 27,
//     role: "Admin",
//     summary: {
//       sentiments: ["Positive", "Neutral"],
//       lastAnalysis: "Sentiment trending positive",
//       lastUpdated: "2 hours ago",
//       confidence: "98% confidence score"
//     }
//   },
//   {
//     name: "Cody Fisher",
//     email: "cody.fisher@example.com",
//     title: "Product Directives Officer",
//     status: "INACTIVE",
//     age: 43,
//     role: "Owner",
//     summary: {
//       sentiments: ["Negative", "Urgent"],
//       lastAnalysis: "Customer satisfaction declining",
//       lastUpdated: "3 days ago",
//       confidence: "92% confidence score"
//     }
//   },
//   // ... rest of the data remains the same structure
// ];

// const SentAnalysis = () => {
//   // State management remains the same
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedRole, setSelectedRole] = useState("All");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(5);
//   const [expandedRows, setExpandedRows] = useState(new Set());

//   // Toggle row expansion functionality remains the same
//   const toggleRowExpansion = (index) => {
//     const newExpandedRows = new Set(expandedRows);
//     if (newExpandedRows.has(index)) {
//       newExpandedRows.delete(index);
//     } else {
//       newExpandedRows.add(index);
//     }
//     setExpandedRows(newExpandedRows);
//   };

//   // Filter functionality remains the same
//   const filteredData = initialData.filter(item => {
//     const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                          item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//                          item.title.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchesRole = selectedRole === "All" || item.role === selectedRole;
//     return matchesSearch && matchesRole;
//   });

//   // Pagination calculation remains the same
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentData = filteredData.slice(startIndex, endIndex);

//   // Status styles remain the same
//   const getStatusStyles = (status) => {
//     switch (status) {
//       case 'ACTIVE':
//         return 'bg-green-100 text-green-800';
//       case 'INACTIVE':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'OFFLINE':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   // Get sentiment tag styles
//   const getSentimentStyles = (sentiment) => {
//     switch (sentiment.toLowerCase()) {
//       case 'positive':
//         return 'bg-green-100 text-green-800';
//       case 'negative':
//         return 'bg-red-100 text-red-800';
//       case 'neutral':
//         return 'bg-blue-100 text-blue-800';
//       case 'urgent':
//         return 'bg-yellow-100 text-yellow-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   return (
//     <div className="p-4 max-w-6xl mx-auto">
//       <h1 className="text-2xl font-semibold mb-6">Sentiment Analysis Dashboard</h1>
      
//       {/* Search and Filter Section */}
//       <div className="flex gap-4 mb-6">
//         <div className="flex-1">
//           <input
//             type="text"
//             placeholder="Search entries..."
//             className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//         </div>
//         <div className="relative">
//           <select
//             className="appearance-none w-48 px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             value={selectedRole}
//             onChange={(e) => setSelectedRole(e.target.value)}
//           >
//             <option value="All">All Categories</option>
//             <option value="Admin">Priority</option>
//             <option value="Owner">Urgent</option>
//             <option value="Member">Standard</option>
//           </select>
//           <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
//         </div>
//       </div>

//       {/* Table structure remains similar but with updated headers */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {currentData.map((entry, index) => (
//               <React.Fragment key={index}>
//                 <tr 
//                   className={`hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${
//                     expandedRows.has(index) ? 'bg-gray-50' : ''
//                   }`}
//                   onClick={() => toggleRowExpansion(index)}
//                 >
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <img
//                         className="h-10 w-10 rounded-full"
//                         src="/api/placeholder/40/40"
//                         alt=""
//                       />
//                       <div className="ml-4">
//                         <div className="text-sm font-medium text-gray-900">{entry.name}</div>
//                         <div className="text-sm text-gray-500">{entry.email}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-900">{entry.title}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(entry.status)}`}>
//                       {entry.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {entry.age}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <div className="flex items-center justify-between">
//                       <span>{entry.role}</span>
//                       {expandedRows.has(index) ? (
//                         <ChevronUp className="w-4 h-4 text-gray-400" />
//                       ) : (
//                         <ChevronDown className="w-4 h-4 text-gray-400" />
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//                 {/* Expanded row content updated for sentiment analysis */}
//                 <tr className={`transition-all duration-300 ease-in-out ${
//                   expandedRows.has(index) ? 'table-row' : 'hidden'
//                 }`}>
//                   <td colSpan="5" className="px-6 py-4 bg-gray-50">
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <h4 className="text-sm font-semibold text-gray-900 mb-2">Sentiment Categories</h4>
//                         <div className="flex flex-wrap gap-2">
//                           {entry.summary.sentiments.map((sentiment, i) => (
//                             <span key={i} className={`px-2 py-1 rounded-full text-xs ${getSentimentStyles(sentiment)}`}>
//                               {sentiment}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                       <div>
//                         <h4 className="text-sm font-semibold text-gray-900 mb-2">Analysis Summary</h4>
//                         <p className="text-sm text-gray-600">{entry.summary.lastAnalysis}</p>
//                         <p className="text-sm text-gray-500 mt-1">Last updated: {entry.summary.lastUpdated}</p>
//                       </div>
//                       <div className="col-span-2">
//                         <h4 className="text-sm font-semibold text-gray-900 mb-2">Confidence Metrics</h4>
//                         <p className="text-sm text-gray-600">{entry.summary.confidence}</p>
//                       </div>
//                     </div>
//                   </td>
//                 </tr>
//               </React.Fragment>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination section remains the same */}
//       <div className="flex items-center justify-between mt-4">
//         <div className="flex items-center gap-2">
//           <span className="text-sm text-gray-700">Page {currentPage} of {totalPages}</span>
//           <select
//             className="border rounded-md px-2 py-1"
//             value={itemsPerPage}
//             onChange={(e) => setItemsPerPage(Number(e.target.value))}
//           >
//             <option value="5">Show 5</option>
//             <option value="10">Show 10</option>
//             <option value="20">Show 20</option>
//           </select>
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={() => setCurrentPage(1)}
//             disabled={currentPage === 1}
//             className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
//           >
//             <ChevronsLeft className="w-4 h-4" />
//           </button>
//           <button
//             onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
//           >
//             <ChevronLeft className="w-4 h-4" />
//           </button>
//           <button
//             onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//             disabled={currentPage === totalPages}
//             className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
//           >
//             <ChevronRight className="w-4 h-4" />
//           </button>
//           <button
//             onClick={() => setCurrentPage(totalPages)}
//             disabled={currentPage === totalPages}
//             className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
//           >
//             <ChevronsRight className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SentAnalysis;
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDown, ChevronUp } from 'lucide-react';
import './SentAnalysis.css'; // Import the new CSS file

const initialData = [
  {
    name: "Jane Cooper",
    email: "jane.cooper@example.com",
    title: "Regional Paradigm Technician",
    status: "ACTIVE",
    age: 27,
    role: "Admin",
    summary: {
      sentiments: ["Positive", "Neutral"],
      lastAnalysis: "Sentiment trending positive",
      lastUpdated: "2 hours ago",
      confidence: "98% confidence score"
    }
  },
  {
    name: "Cody Fisher",
    email: "cody.fisher@example.com",
    title: "Product Directives Officer",
    status: "INACTIVE",
    age: 43,
    role: "Owner",
    summary: {
      sentiments: ["Negative", "Urgent"],
      lastAnalysis: "Customer satisfaction declining",
      lastUpdated: "3 days ago",
      confidence: "92% confidence score"
    }
  }
];

const SentAnalysis = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRowExpansion = (index) => {
    const newExpandedRows = new Set(expandedRows);
    newExpandedRows.has(index) ? newExpandedRows.delete(index) : newExpandedRows.add(index);
    setExpandedRows(newExpandedRows);
  };

  const filteredData = initialData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && (selectedRole === "All" || item.role === selectedRole);
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="container">
      <h1 className="title">Sentiment Analysis Dashboard</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search entries..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select className="select" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="Admin">Priority</option>
          <option value="Owner">Urgent</option>
          <option value="Member">Standard</option>
        </select>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Entity</th>
              <th>Category</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((entry, index) => (
              <React.Fragment key={index}>
                <tr className={`row ${expandedRows.has(index) ? 'expanded' : ''}`} onClick={() => toggleRowExpansion(index)}>
                  <td>{entry.name} <br /><span className="email">{entry.email}</span></td>
                  <td>{entry.title}</td>
                  <td className={`status ${entry.status.toLowerCase()}`}>{entry.status}</td>
                  <td>{entry.age}</td>
                  <td className="expand-icon">
                    {expandedRows.has(index) ? <ChevronUp /> : <ChevronDown />}
                  </td>
                </tr>
                {expandedRows.has(index) && (
                  <tr className="expanded-row">
                    <td colSpan="5">
                      <div className="sentiment-container">
                        <div>
                          <h4>Sentiment Categories</h4>
                          {entry.summary.sentiments.map((sentiment, i) => (
                            <span key={i} className={`sentiment ${sentiment.toLowerCase()}`}>{sentiment}</span>
                          ))}
                        </div>
                        <div>
                          <h4>Analysis Summary</h4>
                          <p>{entry.summary.lastAnalysis}</p>
                          <p className="last-updated">Last updated: {entry.summary.lastUpdated}</p>
                        </div>
                        <div>
                          <h4>Confidence Metrics</h4>
                          <p>{entry.summary.confidence}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><ChevronsLeft /></button>
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}><ChevronLeft /></button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}><ChevronRight /></button>
        <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}><ChevronsRight /></button>
      </div>
    </div>
  );
};

export default SentAnalysis;

