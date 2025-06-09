import React, { useEffect, useState } from 'react';
import SearchBar from '../AngAtingSeachBarWIthDropDown';
import { addLabFilesToLaboratory, addLabRecordsToPatient, SearchPatientsApi } from '../../api/axios';
import { Route, Routes } from 'react-router-dom';

const Laboratory = () => {
  const [patientId, setPatientId] = useState('');
  const [testType, setTestType] = useState('');
  const [resultSummary, setResultSummary] = useState('');
  const [performedBy, setPerformedBy] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)  //required for SearchBar



  //array of { file: File | null, description: string }
  const [attachments, setAttachments] = useState([{ file: null, description: '' }]);

  const handleAttachmentChange = (index, field, value) => {
    setAttachments((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSelection = (selectedTerm) => {
    console.log(selectedTerm)
    setSearchTerm(selectedTerm.name)
    setPatientId(selectedTerm.id)
    setIsDropdownVisible(false)
  }


  useEffect(() => {
    console.log(attachments)
  }, [attachments])

  const addAttachmentRow = () => {
    setAttachments((prev) => [...prev, { file: null, description: '' }]);
  };

  const removeAttachmentRow = (index) => {
    setAttachments((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!testType || !resultSummary) {
      alert('Please fill in all required fields.');
      return;
    }

    const formPayload = {
      patient: patientId,
      test_type: testType,
      result_summary: resultSummary,
      attachments: attachments.map((att, idx) => ({
        file: att.file ? att.file : "HAS NO FILES",
        description: att.description,
      })),
    };

    const labDataPayLoad = {
      test_type: testType,
      result_summary: resultSummary,
    };

    console.log('PAYLOAD LABORATORY:', formPayload);
    alert('CHECK GOOD.');

    // try{
    //   //call this api 
    //   // laboratory = await addLabRecordsToPatient(patientId, labDataPayLoad)

    //   //if attachments is filled too, then call another api addLabFilesToLaboratory(laboratory.id, attachments) since backend allows multiple upload like this 
    //   // formData() (file: 3 files && description: 1 for those 3 files)
            //use loop then append att.file to formdata('file')
    // }catch(error){

    // }

    try {
      const { data: laboratory } = await addLabRecordsToPatient(patientId, labDataPayLoad);
      console.log('lab record:', laboratory);

      const hasFiles = attachments.some(att => att.file && att.file.length > 0);
      if (hasFiles) {
        const formData = new FormData();
        
        attachments.forEach((att, idx) => {


          if (att.file && att.file.length > 0) {

            Array.from(att.file).forEach(file => {
                //ERROR uploading all files to 'file' need isa isa
              formData.append('file', file);
              formData.append('description', att.description);
            });
          }
        });

        await addLabFilesToLaboratory(laboratory.id, formData);
        console.log('Uploaded attachments');
      }

      alert('Laboratory record and attachments successfully submitted!');
    } catch (error) {
      console.error('Error saving lab data:', error);
      alert('There was a problem submitting. Please try again.');
    }//finally clear states

  };





  const MainContent = () => (
    <div className="max-w-lg mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">New Laboratory Result (Dummy Data)</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">



        {/* Patient Select */}
        <div className="mb-4">
          <label htmlFor="patient" className="block text-sm font-medium mb-1">
            Patient
          </label>
          <SearchBar
            placeholder={"Search Patient"}
            searchApi={SearchPatientsApi}
            // accept the argument passed by the SearchBar component (item) when onSelectSuggestion is trigered
            //to accept throw temp function 
            onSelectSuggestion={(filtered) => handleSelection(filtered)}
            isIDIncludedInResultSuggestion={false}
            suggestedOutput={['code', 'name']}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isDropdownVisible={isDropdownVisible}
            setIsDropdownVisible={setIsDropdownVisible}
          />

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
                multiple
                onChange={(e) =>
                  handleAttachmentChange(idx, 'file', e.target.files)
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



  return (
    <>









      <Routes>
        <Route index element={<MainContent />} /> 
        {/* <Route path="add" element={<AddBillingModalV2 />} /> */}
        {/* <Route path="edit/:id" element={<EditBillingForm />} /> */}


        {/* <Route path="/:laboratoryId" element={<BillingItemsOfThatBill />} /> */}
      </Routes>
    </>


  )
};

export default Laboratory;
