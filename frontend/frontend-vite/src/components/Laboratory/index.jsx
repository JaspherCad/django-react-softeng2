import React, { useEffect, useState } from 'react';
import SearchBar from '../AngAtingSeachBarWIthDropDown';
import { addLabFilesToLaboratory, addLabRecordsToPatient, SearchLaboratoryApi, SearchPatientsApi } from '../../api/axios';
import { Route, Routes, Outlet, useNavigate, useLocation } from 'react-router-dom';
import AddLaboratory from './AddLaboratory';




//apply layout 
//  <SearchBar> 
//      <OUTLET> </OUTLET> => which are under the routings
// </SearchBar>

const LaboratoryLayout = ({
  searchTerm,
  setSearchTerm,
  isDropdownVisible,
  setIsDropdownVisible,
  handleSelection,
  navigate,
  children
}) => (
  <>
    <div className="p-4 bg-gray-50">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <label htmlFor="patient" className="text-lg font-semibold text-gray-800">
            Laboratory Management
          </label>
          <button 
            onClick={() => navigate('/laboratory')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors flex items-center"
          >
            <i className="fas fa-plus mr-2"></i>
            Create New Lab
          </button>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border border-black-200">
          <h3 className="text-md font-medium text-black-700 mb-3">Search Existing Labs</h3>
          <SearchBar
            placeholder={"Search by lab code, patient name, or test type..."}
            searchApi={SearchLaboratoryApi}
            onSelectSuggestion={(filtered) => handleSelection(filtered)}
            isIDIncludedInResultSuggestion={false}
            suggestedOutput={['code', 'patientInfo', 'result_summary']}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isDropdownVisible={isDropdownVisible}
            setIsDropdownVisible={setIsDropdownVisible}
          />
        </div>
      </div>
    </div>
    {children || <Outlet />}
  </>
);



const Laboratory = () => {
  const [patientId, setPatientId] = useState('');
  const [testType, setTestType] = useState('');
  const [resultSummary, setResultSummary] = useState('');
  const [performedBy, setPerformedBy] = useState('');

  const [searchTerm, setSearchTerm] = useState(''); //ng lab
  const [searchPatientTerm, setSearchPatientTerm] = useState('');

  const [isDropdownVisible, setIsDropdownVisible] = useState(false)  //required for SearchBar

  const navigate = useNavigate();
  const location = useLocation();

  //array of { file: File | null, description: string }
  const [attachments, setAttachments] = useState([{ file: null, description: '' }]);

  // Handle URL query parameter for prefilling search
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const queryParam = urlParams.get('q');
    if (queryParam) {
      setSearchPatientTerm(queryParam);
    }
  }, [location.search]);

  const handleAttachmentChange = (index, field, value) => {
    setAttachments((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSelection = (selectedTerm) => {
    console.log(selectedTerm)
    setSearchTerm(selectedTerm.code);
    navigate(`/laboratory/labId/${selectedTerm.id}`);
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!testType || !resultSummary) {
  //     alert('Please fill in all required fields.');
  //     return;
  //   }

  //   const formPayload = {
  //     patient: patientId,
  //     test_type: testType,
  //     result_summary: resultSummary,
  //     attachments: attachments.map((att, idx) => ({
  //       file: att.file ? att.file : "HAS NO FILES",
  //       description: att.description,
  //     })),
  //   };

  //   const labDataPayLoad = {
  //     test_type: testType,
  //     result_summary: resultSummary,
  //   };

  //   console.log('PAYLOAD LABORATORY:', formPayload);
  //   alert('CHECK GOOD.');

  //   // try{
  //   //   //call this api 
  //   //   // laboratory = await addLabRecordsToPatient(patientId, labDataPayLoad)

  //   //   //if attachments is filled too, then call another api addLabFilesToLaboratory(laboratory.id, attachments) since backend allows multiple upload like this 
  //   //   // formData() (file: 3 files && description: 1 for those 3 files)
  //   //use loop then append att.file to formdata('file')
  //   // }catch(error){

  //   // }

  //   // try {
  //   //   const { data: laboratory } = await addLabRecordsToPatient(patientId, labDataPayLoad);
  //   //   console.log('lab record:', laboratory);

  //   //   const hasFiles = attachments.some(att => att.file && att.file.length > 0);
  //   //   if (hasFiles) {
  //   //     const formData = new FormData();

  //   //     attachments.forEach((att, idx) => {


  //   //       if (att.file && att.file.length > 0) {

  //   //         Array.from(att.file).forEach(file => {
  //   //             //ERROR uploading all files to 'file' need isa isa
  //   //           formData.append('file', file);
  //   //           formData.append('description', att.description);
  //   //         });
  //   //       }
  //   //     });

  //   //     await addLabFilesToLaboratory(laboratory.id, formData);
  //   //     console.log('Uploaded attachments');
  //   //   }

  //   //   alert('Laboratory record and attachments successfully submitted!');
  //   // } catch (error) {
  //   //   console.error('Error saving lab data:', error);
  //   //   alert('There was a problem submitting. Please try again.');
  //   // }//finally clear states

  //   let returnedLaboratory; ///keep track of the same lab
  //   try {
  //     const { data: laboratory } = await addLabRecordsToPatient(patientId, labDataPayLoad);
  //     returnedLaboratory = laboratory;


  //     console.log("Lab record created:", laboratory);
  //   } catch (error) {
  //     console.error("Failed to create lab record:", error);
  //     alert("Could not save lab record. Please try again.");
  //     return;
  //   } finally {
  //     alert(`NEW LAB RECORD: ${returnedLaboratory.id}`)
  //   }




  //   for (const atx of attachments) {
  //     console.log(atx)
  //     //base case
  //     const files = atx.file;
  //     if (!files || files.length === 0) continue;



  //     const formData = new FormData();

  //     Array.from(files).forEach(f => {
  //       formData.append("file", f);
  //       formData.append("description", atx.description);

  //     });








  //     //send api
  //     try {
  //       await addLabFilesToLaboratory(returnedLaboratory.id, formData);
  //       console.log("Uploaded batch:", files.length, "files with desc:", atx.description);
  //     } catch (error) {
  //       console.error("Failed to upload batch:", error);
  //     }


  //   }



  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!testType || !resultSummary) {
      alert('Please fill in all required fields.');
      return;
    }

    let returnedLaboratory;

    try {
      const { data: laboratory } = await addLabRecordsToPatient(patientId, {
        test_type: testType,
        result_summary: resultSummary,
      });
      returnedLaboratory = laboratory;
      alert(`NEW LAB RECORD: ${returnedLaboratory.id}`);
      navigate(`/laboratory/labId/${returnedLaboratory.id}`);

    } catch (error) {
      console.error("Failed to create lab record:", error);
      alert("Could not save lab record. Please try again.");
      return;
    }

    //FILE GROUP UPLOAD FILE IF USER DECIDE TO UPLOAD FILE ATX

    //send each attachment as a file group
    for (const atx of attachments) {
      const files = atx.file;
      if (!files || files.length === 0) continue;

      const formData = new FormData();
      formData.append("description", atx.description);
      formData.append("file_count", files.length);

      Array.from(files).forEach(file => {
        formData.append("files", file);
      });

      try {
        await addLabFilesToLaboratory(returnedLaboratory.id, formData);
        console.log("Uploaded file group:", files.length, "files");
      } catch (error) {
        console.error("Failed to upload file group:", error);
      }
    }
  };







  // const MainContent = () => (
  //   <div className="max-w-lg mx-auto p-4 bg-white rounded shadow">
  //     <h2 className="text-xl font-semibold mb-4">New Laboratory Result (Dummy Data)</h2>

  //     <form onSubmit={handleSubmit} encType="multipart/form-data">



  //       {/* Patient Select */}
  //       <div className="mb-4">
  //         <label htmlFor="patient" className="block text-sm font-medium mb-1">
  //           Patient
  //         </label>
  //         <SearchBar
  //           placeholder={"Search Patient"}
  //           searchApi={SearchPatientsApi}
  //           // accept the argument passed by the SearchBar component (item) when onSelectSuggestion is trigered
  //           //to accept throw temp function 
  //           onSelectSuggestion={(filtered) => handleSelection(filtered)}
  //           isIDIncludedInResultSuggestion={false}
  //           suggestedOutput={['code', 'name']}
  //           searchTerm={searchTerm}
  //           setSearchTerm={setSearchTerm}
  //           isDropdownVisible={isDropdownVisible}
  //           setIsDropdownVisible={setIsDropdownVisible}
  //         />

  //       </div>

  //       {/* Test Type */}
  //       <div className="mb-4">
  //         <label htmlFor="testType" className="block text-sm font-medium mb-1">
  //           Test Type
  //         </label>
  //         <input
  //           id="testType"
  //           type="text"
  //           value={testType}
  //           onChange={(e) => setTestType(e.target.value)}
  //           className="w-full border px-3 py-2 rounded"
  //           placeholder="e.g. Complete Blood Count"
  //           required
  //         />
  //       </div>







  //       {/* Result Summary */}
  //       <div className="mb-4">
  //         <label htmlFor="resultSummary" className="block text-sm font-medium mb-1">
  //           Result Summary
  //         </label>
  //         <textarea
  //           id="resultSummary"
  //           value={resultSummary}
  //           onChange={(e) => setResultSummary(e.target.value)}
  //           className="w-full border px-3 py-2 rounded"
  //           placeholder="Write a brief summary of the results..."
  //           rows={4}
  //           required
  //         />
  //       </div>
















  //       {/* Attachments Section */}
  //       <div className="mb-4">
  //         <label className="block text-sm font-medium mb-1">Attachments</label>
  //         {attachments.map((att, idx) => (
  //           <div
  //             key={idx}
  //             className="border rounded p-3 mb-3 flex flex-col space-y-2"
  //           >
  //             <div className="flex justify-between items-center">
  //               <span className="font-medium">File #{idx + 1}</span>
  //               {attachments.length > 1 && (
  //                 <button
  //                   type="button"
  //                   onClick={() => removeAttachmentRow(idx)}
  //                   className="text-sm text-red-500 hover:underline"
  //                 >
  //                   Remove
  //                 </button>
  //               )}
  //             </div>

  //             <input
  //               type="file"
  //               multiple
  //               onChange={(e) =>
  //                 handleAttachmentChange(idx, 'file', e.target.files)
  //               }
  //               className="w-full"
  //             />

  //             <input
  //               type="text"
  //               placeholder="Description (optional)"
  //               value={att.description}
  //               onChange={(e) =>
  //                 handleAttachmentChange(idx, 'description', e.target.value)
  //               }
  //               className="w-full border px-3 py-2 rounded"
  //             />
  //           </div>
  //         ))}

  //         <button
  //           type="button"
  //           onClick={addAttachmentRow}
  //           className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
  //         >
  //           + Add Another File
  //         </button>
  //       </div>

  //       {/* Submit Button */}
  //       <div className="mt-6">
  //         <button
  //           type="submit"
  //           className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
  //         >
  //           Submit (Dummy)
  //         </button>
  //       </div>
  //     </form>
  //   </div>
  // );



  return (
    <>









      <Routes>
        {/* The index route displays either the "create new" form or a landing page with options */}
        <Route index element={
          <div>
            <div className="p-4 bg-gray-50 mb-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Create New Laboratory Record</h2>
                <button
                  onClick={() => navigate('/laboratory/search')}
                  className="px-4 py-2 bg-blue-600 text-black rounded-lg shadow hover:bg-blue-700 transition-colors flex items-center"
                >
                  <i className="fas fa-search mr-2 text-black"></i>
                  Search Existing Labs
                </button>
              </div>
            </div>
            
            <AddLaboratory
              mode="create"
              patientId={patientId}
              setPatientId={setPatientId}
              searchTerm={searchPatientTerm}
              searchPatientTerm={searchPatientTerm}
              setSearchPatientTerm={setSearchPatientTerm}
              setSearchTerm={setSearchPatientTerm}
              isDropdownVisible={isDropdownVisible}
              setIsDropdownVisible={setIsDropdownVisible}
              testType={testType}
              setTestType={setTestType}
              resultSummary={resultSummary}
              setResultSummary={setResultSummary}
              attachments={attachments}
              handleAttachmentChange={handleAttachmentChange}
              addAttachmentRow={addAttachmentRow}
              removeAttachmentRow={removeAttachmentRow}
              handleSubmit={handleSubmit}
              handleSelection={handleSelection}
            />
          </div>
        } />


        <Route element={<LaboratoryLayout
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isDropdownVisible={isDropdownVisible}
          setIsDropdownVisible={setIsDropdownVisible}
          handleSelection={handleSelection}
          navigate={navigate}
        />}>
          {/* This is a placeholder route to show search UI when no lab is selected */}
          <Route path="" element={
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
              <div className="text-center py-8">
                <div className="text-5xl text-gray-300 mb-4">🔬</div>
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Laboratory Module</h2>
                <p className="text-gray-600 mb-6">Search for an existing laboratory record or create a new one</p>
                
                <div className="flex flex-col md:flex-row justify-center gap-4 max-w-md mx-auto">
                  <button 
                    onClick={() => navigate('/laboratory')}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-colors"
                  >
                    Create New Record
                  </button>
                  <button 
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
                    onClick={() => document.querySelector('input[placeholder*="Search"]').focus()}
                  >
                    Search Records
                  </button>
                </div>
              </div>
            </div>
          } />
          
          <Route path="labId/:labId" element={
            <AddLaboratory
              mode="view"
              patientId={patientId}
              setPatientId={setPatientId}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isDropdownVisible={isDropdownVisible}
              setIsDropdownVisible={setIsDropdownVisible}
              testType={testType}
              setTestType={setTestType}
              resultSummary={resultSummary}
              setResultSummary={setResultSummary}
              attachments={attachments}
              handleAttachmentChange={handleAttachmentChange}
              addAttachmentRow={addAttachmentRow}
              removeAttachmentRow={removeAttachmentRow}
              handleSubmit={handleSubmit}
              handleSelection={handleSelection}
            />} />


          {/* <Route path="add" element={<AddBillingModalV2 />} /> */}
          {/* <Route path="edit/:id" element={<EditBillingForm />} /> */}


          {/* <Route path="/:laboratoryId" element={<BillingItemsOfThatBill />} /> */}

        </Route>

        {/* Dedicated search page */}
        <Route path="search" element={
          <LaboratoryLayout
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isDropdownVisible={isDropdownVisible}
            setIsDropdownVisible={setIsDropdownVisible}
            handleSelection={handleSelection}
            navigate={navigate}
          >
            <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
              <div className="text-center py-8">
                <div className="text-5xl text-gray-300 mb-4">🔍</div>
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Search Laboratory Records</h2>
                <p className="text-gray-600 mb-6">Enter a lab code, patient name, or test type in the search field above</p>
              </div>
            </div>
          </LaboratoryLayout>
        } />
        
      </Routes>
    </>


  )
};

export default Laboratory;
