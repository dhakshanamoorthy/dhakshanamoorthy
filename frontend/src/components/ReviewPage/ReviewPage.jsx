import React, { useState, useEffect } from 'react';

const ReviewPage = ({ processedData, failedFiles, onSave, setProcessedData }) => {
    const [editableData, setEditableData] = useState([]);

    useEffect(() => {
        // Create a deep copy of the processed data to make it editable
        setEditableData(JSON.parse(JSON.stringify(processedData)));
    }, [processedData]);

    const handleInputChange = (index, field, value) => {
        const updatedData = [...editableData];
        updatedData[index][field] = value;
        setEditableData(updatedData);
    };

    const handleDelete = (index) => {
        const updatedData = editableData.filter((_, i) => i !== index);
        setEditableData(updatedData);
        // Also update the parent state so the UI reflects the deletion immediately
        // if the component were to re-render.
        setProcessedData(updatedData);
    };

    const handleSaveClick = () => {
        // Here, you could add validation before saving
        onSave(editableData);
    };

    if (processedData.length === 0 && failedFiles.length === 0) {
        return null; // Don't render anything if there's no data to review
    }

    return (
        <div className="review-container">
            <h2>2. Review and Correct Transactions</h2>
            <p>Review the data extracted from your voice memos. You can edit or delete any transaction before saving.</p>

            <div className="transactions-table">
                <div className="table-header">
                    <div>Date</div>
                    <div>Amount ($)</div>
                    <div>Category</div>
                    <div className="description-cell">Description</div>
                    <div>Action</div>
                </div>
                {editableData.map((item, index) => (
                    <div key={item.original_filename || index} className="table-row">
                        <div>
                            <input
                                type="date"
                                value={item.date ? item.date.split('T')[0] : ''}
                                onChange={(e) => handleInputChange(index, 'date', e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="number"
                                step="0.01"
                                value={item.amount || ''}
                                onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                value={item.category || ''}
                                onChange={(e) => handleInputChange(index, 'category', e.target.value)}
                            />
                        </div>
                        <div className="description-cell">
                            <p>{item.description}</p>
                            <small>Original file: {item.original_filename}</small>
                        </div>
                        <div>
                            <button onClick={() => handleDelete(index)} className="delete-btn">Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {failedFiles.length > 0 && (
                <div className="failed-files-section">
                    <h3>Files That Failed Processing</h3>
                    <p>The following files could not be read by the system. Manual entry for these is not yet supported.</p>
                    <ul>
                        {failedFiles.map((file, index) => (
                            <li key={index}>{file.file_path || 'Unknown file'} - Error: {file.error}</li>
                        ))}
                    </ul>
                </div>
            )}

            {editableData.length > 0 && (
                 <div className="save-button-container">
                    <button onClick={handleSaveClick} className="save-btn">
                        Save All Corrected Transactions
                    </button>
                </div>
            )}
        </div>
    );
};

export default ReviewPage;
