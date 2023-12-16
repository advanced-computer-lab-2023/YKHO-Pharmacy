// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define the RequestsList component
const RequestsList = () => {
  // State to store the requests and loading state
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch requests from the backend when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make a GET request to fetch requests from the backend
        const response = await axios.get('http://localhost:8000/admin/getRequests', {withCredentials: true});
        console.log('API response:', response.data);

        // Check if 'getRequests' exists in the API response
        if (response.data && response.data.getRequests) {
          setRequests(response.data.getRequests);
        } else {
          console.error('No "getRequests" found in the API response:', response.data);
        }

        // Set loading to false after fetching data
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    // Invoke the fetchData function
    fetchData();
  }, []); // The empty dependency array ensures the effect runs only once on mount

  // Render loading message while data is being fetched
  if (loading) {
    return <p className="loading-text">Loading...</p>;
  }

  // Render the RequestsList component
  return (
    <div className="center-aligned">
      <h1 className="header-text">Requests List</h1>
      <table className="requests-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Date of Birth</th>
            <th>Hourly Rate</th>
            <th>Affiliation</th>
            <th>Educational Background</th>
            <th>ID File</th>
            <th>Medical Degree File</th>
            <th>Working License File</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* Check if there are no requests */}
          {requests.length === 0 ? (
            <tr>
              <td colSpan="12" className="no-requests">No requests found</td>
            </tr>
          ) : (
            // Render table rows using the renderTableRows function
            renderTableRows(requests)
          )}
        </tbody>
      </table>
      <br></br>
      <br></br>
      <br></br>
    </div>
  );
};

const handleAccept = async (e, requestId) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/admin/acceptRequest', {
        requestId: requestId,
      }, {withCredentials: true});

      // Handle the response as needed, e.g., show a success message
      console.log(response.data);

      // Refresh the page after a successful acceptance
    window.location.reload();
    } catch (error) {
      // Handle errors, e.g., show an error message
      console.error('Error accepting request:', error);
    }
  };

  // At the beginning of the component
const handleReject = async (e, requestId) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:8000/admin/rejectRequest', {
        requestId: requestId,
      }, {withCredentials: true});
  
      // Handle the response as needed, e.g., show a success message
      console.log(response.data);

      // Refresh the page after a successful rejection
      window.location.reload();
    } catch (error) {
      // Handle errors, e.g., show an error message
      console.error('Error rejecting request:', error);
    }
  };
  

// Function to render table rows based on requests data
const renderTableRows = (requests) => {
  return requests.map((regRequest) => (
    <tr key={regRequest._id}>
      <td>{regRequest.username}</td>
      <td>{regRequest.name}</td>
      <td>{regRequest.email}</td>
      <td>{regRequest.password}</td>
      <td>{regRequest.dateOfBirth}</td>
      <td>{regRequest.hourlyRate}</td>
      <td>{regRequest.affiliation}</td>
      <td>{regRequest.educationalBackground}</td>
      <td>
        {regRequest.idFileURL && (
            <a href={`http://localhost:8000/fetchFile?id=${regRequest._id}&type=idFile`} target="_blank" rel="noopener noreferrer" className="file-link">
            ID File
            </a>
        )}
        </td>
        <td>
        {regRequest.medicalDegreeFileURL && (
            <a href={`http://localhost:8000/fetchFile?id=${regRequest._id}&type=medicalDegreeFile`} target="_blank" rel="noopener noreferrer" className="file-link">
            Medical Degree File
            </a>
        )}
        </td>
        <td>
        {regRequest.workingLicenseFileURL && (
            <a href={`http://localhost:8000/fetchFile?id=${regRequest._id}&type=workingLicenseFile`} target="_blank" rel="noopener noreferrer" className="file-link">
            Working License File
            </a>
        )}
        </td>
      <td className="action-cell">
        <form
            method="POST"
            action={`http://localhost:8000/admin/acceptRequest`}
            className="action-form"
            onSubmit={(e) => handleAccept(e, regRequest._id)}
            >
            <input type="hidden" name="requestId" value={regRequest._id} />
            <button type="submit" className="accept-button">
                Accept
            </button>
        </form>

        <form
          method="POST"
          action="/admin/rejectRequest"
          className="action-form"
          onSubmit={(e) => handleReject(e, regRequest._id)} 
        >
          <input type="hidden" name="requestId" value={regRequest._id} />
          <button type="submit" className="reject-button">
            Reject
          </button>
        </form>
      </td>
    </tr>
  ));
};

// Export the RequestsList component
export default RequestsList;
