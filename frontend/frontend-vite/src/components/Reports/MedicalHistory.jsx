// MedicalHistory.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MedicalHistory = ({ match }) => {
  const [history, setHistory] = useState([]);
  const patientId = match.params.id;

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/patients/${patientId}/history`)
      .then(response => setHistory(response.data))
      .catch(error => console.error(error));
  }, [patientId]);

  return (
    <div>
      <h2 className="text-2xl mb-4">Medical History for Patients #{patientId}</h2>
      <button>ADD RECORD</button>
      <div className="bg-white shadow-md rounded overflow-x-auto">
        <table className="min-w-max divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Changed By
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Changes
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {history.map((entry) => (
              <tr key={entry.history_id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(entry.history_date).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {entry.changed_by.role}: {entry.changed_by.user_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <ul>
                    {Object.entries(entry.changes).map(([field, change]) => (
                      <li key={field}>
                        <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> 
                        {change.old !== undefined ? `Old: ${change.old} → New: ${change.new}` : 'No changes'}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MedicalHistory;