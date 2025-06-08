import React, { useState } from 'react';

const Laboratory = () => {
  // --- Dummy data (replace with axios calls later) ---
  const dummyPatients = [
    { id: 1, name: 'Juan Dela Cruz' },
    { id: 2, name: 'Maria Clara' },
    { id: 3, name: 'Jose Rizal' },
  ];

  const dummyUsers = [
    { id: 10, username: 'dr_santos' },
    { id: 11, username: 'nurse_luna' },
    { id: 12, username: 'labtech_rios' },
  ];

  // --- Form state ---
  const [patientId, setPatientId] = useState('');
  const [testType, setTestType] = useState('');
  const [resultSummary, setResultSummary] = useState('');
  const [performedBy, setPerformedBy] = useState('');

  // attachments: array of { file: File | null, description: string }
  const [attachments, setAttachments] = useState([{ file: null, description: '' }]);

  // --- Handlers for attachments array ---
  const handleAttachmentChange = (index, field, value) => {
    setAttachments((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addAttachmentRow = () => {
    setAttachments((prev) => [...prev, { file: null, description: '' }]);
  };

  const removeAttachmentRow = (index) => {
    setAttachments((prev) => prev.filter((_, idx) => idx !== index));
  };

  // --- Form submit (for now, just log everything) ---
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!patientId || !testType || !resultSummary || !performedBy) {
      alert('Please fill in all required fields.');
      return;
    }

    // Construct a “dummy” payload to inspect in console
    const formPayload = {
      patient: patientId,
      test_type: testType,
      result_summary: resultSummary,
      performed_by: performedBy,
      attachments: attachments.map((att, idx) => ({
        fileName: att.file ? att.file.name : null,
        description: att.description,
      })),
    };

    console.log('Form payload (dummy):', formPayload);
    alert('Check console for form payload (dummy data).');

    // Reset form
    setPatientId('');
    setTestType('');
    setResultSummary('');
    setPerformedBy('');
    setAttachments([{ file: null, description: '' }]);
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">New Laboratory Result (Dummy Data)</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Patient Select */}
        <div className="mb-4">
          <label htmlFor="patient" className="block text-sm font-medium mb-1">
            Patient
          </label>
          <select
            id="patient"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">-- Select a patient --</option>
            {dummyPatients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Test Type */}
        <div className="mb-4">
          <label htmlFor="testType" className="block text-sm font-medium mb-1">
            Test Type
          </label>
          <input
            id="testType"
            type="text"
            value={testType}
            onChange={(e) => setTestType(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="e.g. Complete Blood Count"
            required
          />
        </div>

        {/* Result Summary */}
        <div className="mb-4">
          <label htmlFor="resultSummary" className="block text-sm font-medium mb-1">
            Result Summary
          </label>
          <textarea
            id="resultSummary"
            value={resultSummary}
            onChange={(e) => setResultSummary(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Write a brief summary of the results..."
            rows={4}
            required
          />
        </div>

        {/* Performed By */}
        <div className="mb-4">
          <label htmlFor="performedBy" className="block text-sm font-medium mb-1">
            Performed By
          </label>
          <select
            id="performedBy"
            value={performedBy}
            onChange={(e) => setPerformedBy(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">-- Select a user --</option>
            {dummyUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username}
              </option>
            ))}
          </select>
        </div>

        {/* Attachments Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Attachments</label>
          {attachments.map((att, idx) => (
            <div
              key={idx}
              className="border rounded p-3 mb-3 flex flex-col space-y-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">File #{idx + 1}</span>
                {attachments.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAttachmentRow(idx)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>

              <input
                type="file"
                onChange={(e) =>
                  handleAttachmentChange(idx, 'file', e.target.files[0])
                }
                className="w-full"
              />

              <input
                type="text"
                placeholder="Description (optional)"
                value={att.description}
                onChange={(e) =>
                  handleAttachmentChange(idx, 'description', e.target.value)
                }
                className="w-full border px-3 py-2 rounded"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addAttachmentRow}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            + Add Another File
          </button>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Submit (Dummy)
          </button>
        </div>
      </form>
    </div>
  );
};

export default Laboratory;
