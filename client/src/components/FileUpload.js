import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleFileUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('http://localhost:8000/patient/presMed', formData, {withCredentials: true});
      const { searchResults } = await response.data;

      // Handle the response as needed
      navigate(`/patient/resultsMed`, { state: { searchResults } });

      // Reset the file state after successful upload
      setFile(null);
    } catch (error) {
        if (error.response && error.response.status === 400) {
            setMessage('Outdated file. Date is not within a week before today.');
    } else {
      console.error('Error uploading file:', error.message);
      // Handle the error as needed
    }}
  };

  return (
    <div className="center-aligned">
      <h1 className="header-text">File Upload</h1>
      <form encType="multipart/form-data">
        <label htmlFor="txtFile">Upload TXT File:</label>
        <input type="file" name="file" id="txtFile" accept=".txt" onChange={handleFileChange} required />
        <button type="button" onClick={handleFileUpload} disabled={!file} className='center-aligned'>
          Upload
        </button>
        <p id="message" className='center-aligned' style={{ color: 'red' }}>{message}</p>
      </form>
    </div>
  );
};

export default FileUpload;
