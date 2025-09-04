import React, { useState } from 'react';
import axios from 'axios';

const Uploader = ({ setProcessedData, setFailedFiles }) => {
    const [selectedFiles, setSelectedFiles] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleFileChange = (event) => {
        // Reset state when new files are selected
        setSelectedFiles(event.target.files);
        setProcessedData([]);
        setFailedFiles([]);
        setMessage('');
    };

    const handleUpload = async () => {
        if (!selectedFiles || selectedFiles.length === 0) {
            setMessage('Please select one or more audio files to upload.');
            return;
        }

        const formData = new FormData();
        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append('files', selectedFiles[i]);
        }

        setIsLoading(true);
        setMessage('Uploading and processing... This may take a moment.');

        try {
            const response = await axios.post('http://127.0.0.1:5001/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessage(`Processing complete! Found ${response.data.processed_transactions.length} valid transactions.`);
            setProcessedData(response.data.processed_transactions);
            setFailedFiles(response.data.failed_files);

        } catch (error) {
            console.error('Error uploading files:', error);
            const errorMsg = error.response ? JSON.stringify(error.response.data) : error.message;
            setMessage(`An error occurred during upload: ${errorMsg}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="uploader-container">
            <h2>1. Upload Voice Memos</h2>
            <p>Select one or more audio files (.mp3, .wav, .m4a, etc.) to begin.</p>
            <div className="upload-controls">
                <input type="file" multiple onChange={handleFileChange} />
                <button onClick={handleUpload} disabled={isLoading || !selectedFiles}>
                    {isLoading ? 'Processing...' : 'Upload and Process Files'}
                </button>
            </div>
            {message && <p className="upload-message">{message}</p>}
        </div>
    );
};

export default Uploader;
