import React, { useEffect, useState } from 'react';

function MedicineTable() {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    // Fetch medicine data from your server's API endpoint
    fetch('/api/medicines')
      .then((response) => response.json())
      .then((data) => setMedicines(data))
      .catch((error) => console.error('Error fetching medicines:', error));
  }, []);

  // Render medicines data in a table here...

  return (
    <div>
      <table>
        <thead>
            <tr>
            <th>Name</th>
            <th>Dosage</th>
            <th>Description</th>
            {/* Add more table headers as needed */}
            </tr>
        </thead>
        <tbody>
            {medicines.map((medicine) => (
            <tr key={medicine._id}>
                <td>{medicine.name}</td>
                <td>{medicine.dosage}</td>
                <td>{medicine.description}</td>
                {/* Add more table cells for other fields */}
            </tr>
            ))}
        </tbody>
    </table>
    </div>
  );
}

export default MedicineTable;
