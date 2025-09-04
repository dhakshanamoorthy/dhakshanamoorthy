import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Uploader from './components/Uploader/Uploader';
import ReviewPage from './components/ReviewPage/ReviewPage';
import ReportPage from './components/ReportPage/ReportPage'; // Import the new component

function App() {
  const [processedData, setProcessedData] = useState([]);
  const [failedFiles, setFailedFiles] = useState([]);
  const [view, setView] = useState('upload'); // 'upload' or 'report'
  const [savedTransactions, setSavedTransactions] = useState([]);

  const handleSaveTransactions = async (finalTransactions) => {
    if (finalTransactions.length === 0) {
      alert("There are no transactions to save.");
      return;
    }
    try {
      const response = await axios.post('http://127.0.0.1:5001/api/save_transactions', {
        transactions: finalTransactions
      });
      alert(response.data.message);
      setSavedTransactions(finalTransactions);
      setView('report');
    } catch (error) {
      const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
      alert(`Failed to save transactions: ${errorMsg}`);
    }
  };

  const startOver = () => {
    setProcessedData([]);
    setFailedFiles([]);
    setSavedTransactions([]);
    setView('upload');
  }

  let mainContent;

  if (view === 'upload') {
    mainContent = (
      <>
        <Uploader setProcessedData={setProcessedData} setFailedFiles={setFailedFiles} />
        <ReviewPage
          processedData={processedData}
          setProcessedData={setProcessedData}
          failedFiles={failedFiles}
          onSave={handleSaveTransactions}
        />
      </>
    );
  } else { // view === 'report'
    mainContent = (
      <ReportPage
        transactions={savedTransactions}
        onStartOver={startOver}
      />
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Household Expense Tracker</h1>
        <p>Record voice memos, upload the files, review the data, and save your monthly report.</p>
      </header>
      <main>
        {mainContent}
      </main>
    </div>
  )
}

export default App;
