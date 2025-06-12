import { useParams } from "react-router-dom";
import { addLabFilesToLaboratory, fetchLab, SearchPatientsApi } from "../../api/axios";
import SearchBar from "../AngAtingSeachBarWIthDropDown";
import { useEffect, useState } from "react";

const AddLaboratory = ({
  mode, //view / edit / create
  patientId,
  setPatientId,


  searchTerm,
  setSearchTerm,

  searchPatientTerm,
  setSearchPatientTerm,


  isDropdownVisible,
  setIsDropdownVisible,


  testType,
  setTestType,


  resultSummary,
  setResultSummary,


  attachments,
  handleAttachmentChange,
  addAttachmentRow,
  removeAttachmentRow,
  handleSubmit,
  handleSelection
}) => {
  const { labId } = useParams();
  const isEditMode = mode === 'edit';
  const isViewMode = mode === 'view';
  const [isEditing, setIsEditing] = useState(isEditMode);
  const [labData, setLabData] = useState(null);




  //MODAL SETTING for adding more group upload
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAttachments, setModalAttachments] = useState([{ file: null, description: '' }]);


  //MODAL CODES for UPLOADING MORE GROUPS (edit mode)
  const handleModalSubmit = async (e) => {
    e.preventDefault();

    const validGroups = modalAttachments.filter(att => att.file && att.file.length > 0);
    if (validGroups.length === 0) {
      alert("No files selected in the modal.");
      return;
    }

    try {
      for (const att of validGroups) {
        const formData = new FormData();
        Array.from(att.file).forEach(file => {
          formData.append("files", file);
        });
        formData.append("description", att.description);
        formData.append("file_count", att.file.length);

        await addLabFilesToLaboratory(labData.id, formData);
      }

      alert("New files uploaded successfully!");
      setIsModalOpen(false);
      setModalAttachments([{ file: null, description: '' }]);

      // Optional: Refetch lab data to show updated file groups
      const updatedLab = await fetchLab(labId);
      setLabData(updatedLab);

    } catch (error) {
      console.error("Failed to upload from modal:", error);
      alert("Failed to upload files. Please try again.");
    }
  };

  const handleModalAttachmentChange = (index, field, value) => {
    setModalAttachments((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addModalAttachmentRow = () => {
    setModalAttachments((prev) => [...prev, { file: null, description: '' }]);
  };

  const removeModalAttachmentRow = (index) => {
    setModalAttachments((prev) => prev.filter((_, idx) => idx !== index));
  };
  //MODAL CODES for UPLOADING MORE GROUPS (edit mode)



  //Toggle edit mode (for view mode only)
  const toggleEditMode = () => setIsEditing(prev => !prev);


  const handleSelectionOfPatientFOrAddingTOLab = (selectedTermPATIENT) => {
    console.log(selectedTermPATIENT)
    setPatientId(selectedTermPATIENT.id)
    setSearchPatientTerm(selectedTermPATIENT.name)
    setIsDropdownVisible(false)



  }
  // Fetch lab data from API
  useEffect(() => {
    const loadLabData = async () => {
      if (!labId) return;
      try {
        const data = await fetchLab(labId);
        console.log(data)
        setLabData(data);
        setTestType(data.test_type);
        setResultSummary(data.result_summary);
        setPatientId(data.patient);
      } catch (error) {
        console.error('Failed to load lab data:', error);
      }
    };
    loadLabData();
  }, [labId]);

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-white rounded shadow">
      <div className="flex justify-between items-center">

        {isViewMode ?
          (<><h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'EDIT Laboratory Result' : 'VIEW Laboratory Result'}
          </h2></>)
          :
          (<>
            <h2 className="text-xl font-semibold mb-4">
              ADD Laboratory Result'
            </h2></>)
        }




        {isViewMode && (
          <button
            type="button"
            onClick={toggleEditMode}
            className="text-blue-500 hover:text-blue-700"
            aria-label="Toggle edit mode"
          >
            ✏️
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} encType="multipart/form-data">

        {/* ONLY SHOW this search bar or who is the current patient to view or edit mode only */}
        {!isViewMode && (
          <div className="mb-4">



            <label htmlFor="patient" className="block text-sm font-medium mb-1">
              Patient
            </label>
            <SearchBar
              placeholder={"Search Patient"}
              searchApi={SearchPatientsApi}
              onSelectSuggestion={(filtered) => handleSelectionOfPatientFOrAddingTOLab(filtered)}
              isIDIncludedInResultSuggestion={false}
              suggestedOutput={['code', 'name']}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isDropdownVisible={isDropdownVisible}
              setIsDropdownVisible={setIsDropdownVisible}
              disabled={isViewMode && !isEditing}
            />
          </div>
        )}

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
            disabled={isViewMode && !isEditing}
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
            disabled={isViewMode && !isEditing}
          />
        </div>

        {/* Date Performed */}
        {labData && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Date Performed</label>
            <p className="text-gray-700">{formatDate(labData.date_performed)}</p>
          </div>
        )}

        {/* Performed By */}
        {labData && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Performed By</label>
            <p className="text-gray-700">Dr. Jane Doe</p>
          </div>
        )}

        {/* Existing Attachments */}
        {labData && labData.attachments && labData.attachments.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Legacy Attachments</label>
            <div className="space-y-3">
              {labData.attachments.map((att) => (
                <div key={att.id} className="border rounded p-3 flex flex-col space-y-1">
                  <a href={att.file} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    {att.file.split('/').pop()}
                  </a>
                  <p className="text-sm text-gray-600">Description: {att.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* NEW File Groups */}
        {labData && labData.file_groups && labData.file_groups.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">File Groups</label>
            <div className="space-y-4">



              {labData.file_groups.map((group) => (
                <div key={group.id} className="border rounded p-3 bg-gray-50">
                  <h4 className="font-semibold text-md mb-2">{group.description || "Untitled Group"}</h4>
                  <ul className="space-y-2">
                    {group.files.map((file) => (
                      <li key={file.id} className="text-sm">
                        <a
                          href={file.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {file.file.split('/').pop()}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>



              ))}
            </div>
          </div>
        )}


        {/* TODO: SEPERATE THIS MODAL SOON */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-4">Upload New File Group</h3>

              {modalAttachments.map((att, idx) => (
                <div key={idx} className="border rounded p-3 mb-3 bg-white shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Group {idx + 1}</span>
                    {modalAttachments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeModalAttachmentRow(idx)}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Remove Group
                      </button>
                    )}
                  </div>

                  <div className="mb-2">
                    <label className="text-xs text-gray-500">Description (shared for all files)</label>
                    <input
                      type="text"
                      placeholder="Group description"
                      value={att.description}
                      onChange={(e) => handleModalAttachmentChange(idx, 'description', e.target.value)}
                      className="w-full border px-3 py-2 rounded text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500">Upload Files</label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleModalAttachmentChange(idx, 'file', e.target.files)}
                      className="w-full text-sm"
                    />
                  </div>
                </div>
              ))}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={addModalAttachmentRow}
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  + Add Group
                </button>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleModalSubmit}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* TODO: SEPERATE THIS MODAL SOON */}


        {/* Upload More Attachments Button */}
        {isViewMode && isEditing && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-purple-600 text-black py-2 rounded hover:bg-purple-700"
            >
              + Upload More Attachments
            </button>
          </div>
        )}



        {/* UPLOAD NEW  Attachments
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Attachments (Grouped Upload)</label>
          {attachments.map((att, idx) => (
            <div key={idx} className="border rounded p-3 mb-3 bg-white shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Group {idx + 1}</span>
                {attachments.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAttachmentRow(idx)}
                    className="text-sm text-red-500 hover:text-red-700"
                    disabled={isViewMode && !isEditing}
                  >
                    Remove Group
                  </button>
                )}
              </div>

              <div className="mb-2">
                <label className="text-xs text-gray-500">Description (shared for all files)</label>
                <input
                  type="text"
                  placeholder="Group description"
                  value={att.description}
                  onChange={(e) => handleAttachmentChange(idx, 'description', e.target.value)}
                  className="w-full border px-3 py-2 rounded text-sm"
                  disabled={isViewMode && !isEditing}
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Upload Files</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleAttachmentChange(idx, 'file', e.target.files)}
                  className="w-full text-sm"
                  disabled={isViewMode && !isEditing}
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addAttachmentRow}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            + Add New Group
          </button>
        </div> */}

        {/* Submit Button */}

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-green-600 text-black py-2 rounded hover:bg-green-700"
            disabled={isViewMode && !isEditing}
          >
            {isViewMode ? 'Save Changes' : 'Update'}
          </button>
        </div>


      </form>
    </div>
  );
};

export default AddLaboratory;