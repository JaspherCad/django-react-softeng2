// Get the API base URL from environment variables
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

import { useParams } from "react-router-dom";
import { addLabFilesToLaboratory, fetchLab, SearchPatientsApi } from "../../api/axios";
import SearchBar from "../AngAtingSeachBarWIthDropDown";
import { useEffect, useState } from "react";
import styles from './AddLaboratory.module.css';

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
  handleSelection,
  patientIdFRomOutsideSOurce
}) => {
  //patientIdFRomOutsideSOurce
  const { labId: labIdFromUrl } = useParams();
  // if the prop is present, use that; otherwise use the URL
  const labId = patientIdFRomOutsideSOurce ?? labIdFromUrl;

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



  //all renders use this, some file are image some files actual files,,,,,
  function FilePreview({ url }) {
    const isImage = /\.(jpe?g|png|gif|webp)$/i.test(url);
    const fullUrl = `${API_BASE}:8000${url}`;

    return (
      <div className={styles.filePreviewContainer}>
        {isImage ? (
          <a href={fullUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={fullUrl}
              alt="Preview"
              className={styles.filePreviewImage}
            />
          </a>
        ) : (
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.fileLink}
          >
            {url.split("/").pop()}
          </a>
        )}
      </div>
    );
  }




  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        {isViewMode ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isEditing ? 'Edit Laboratory Result' : 'Laboratory Result Details'}
            </h2>
            {labData && (
              <p className="text-sm text-gray-600">
                Lab Code: <span className="font-mono font-semibold">{labData.code}</span>
              </p>
            )}
          </div>
        ) : (
          <h2 className="text-2xl font-bold text-gray-800">
            Create New Laboratory Result
          </h2>
        )}

        {isViewMode && (
          <button
            type="button"
            onClick={toggleEditMode}
            className="flex items-center px-4 py-2 bg-blue-500 text-black rounded-lg hover:bg-blue-600 transition-colors"
            aria-label="Toggle edit mode"
          >
            ✏️ {isEditing ? 'Cancel Edit' : 'Edit'}
          </button>
        )}
      </div>

      {/* Patient Information Card - View Mode Only */}
      {isViewMode && labData?.patientInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Patient Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Patient Name</p>
              <p className="font-semibold text-gray-800">{labData.patientInfo.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Patient Code</p>
              <p className="font-mono font-semibold text-gray-800">{labData.patientInfo.code}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Patient ID</p>
              <p className="font-mono font-semibold text-gray-800">#{labData.patientInfo.id}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Patient Search - Create Mode Only */}
        {!isViewMode && (
          <div className="mb-6 p-4 border border-gray-200 rounded-lg">
            <label htmlFor="patient" className="block text-sm font-medium text-gray-700 mb-2">
              Select Patient
            </label>
            <SearchBar
              placeholder={"Search Patient by name or code..."}
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

        {/* Lab Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Test Type */}
          <div>
            <label htmlFor="testType" className="block text-sm font-medium text-gray-700 mb-2">
              Test Type
            </label>
            <input
              id="testType"
              type="text"
              value={testType}
              onChange={(e) => setTestType(e.target.value)}
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g. Complete Blood Count, Chest X-ray"
              required
              disabled={isViewMode && !isEditing}
            />
          </div>

          {/* Date Performed - View Mode */}
          {labData && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Performed</label>
              <div className="w-full border border-gray-300 px-4 py-3 rounded-lg bg-gray-50">
                <p className="text-gray-800">{formatDate(labData.date_performed)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Result Summary */}
        <div className="mb-6">
          <label htmlFor="resultSummary" className="block text-sm font-medium text-gray-700 mb-2">
            Result Summary
          </label>
          <textarea
            id="resultSummary"
            value={resultSummary}
            onChange={(e) => setResultSummary(e.target.value)}
            className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Write a detailed summary of the test results..."
            rows={4}
            required
            disabled={isViewMode && !isEditing}
          />
        </div>

        {/* Performed By Information - View Mode Only */}
        {labData?.performed_by_info && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-green-800 mb-3">Performed By</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Doctor Name</p>
                <p className="font-semibold text-gray-800">{labData.performed_by_info.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">User ID</p>
                <p className="font-mono font-semibold text-gray-800">{labData.performed_by_info.user_id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Staff ID</p>
                <p className="font-mono font-semibold text-gray-800">#{labData.performed_by_info.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">First Name</p>
                <p className="font-semibold text-gray-800">{labData.performed_by_info.first_name}</p>
              </div>
            </div>
          </div>
        )}

        {/* Existing Attachments */}
        {/* {labData && labData.attachments && labData.attachments.length > 0 && (
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
        )} */}


        {/* File Groups Section */}
        {labData?.file_groups?.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Laboratory Files & Results</h3>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {labData.file_groups.length} Group{labData.file_groups.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="space-y-6">
              {labData.file_groups.map((group, index) => (
                <div key={group.id} className={styles.fileGroupCard}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-800 mb-2">
                        Group #{index + 1}: {group.description || "Untitled Group"}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Uploaded by:</span> {group.uploaded_by?.first_name} {group.uploaded_by?.last_name}
                        </div>
                        <div>
                          <span className="font-medium">Role:</span> {group.uploaded_by?.role}
                        </div>
                        <div>
                          <span className="font-medium">Date:</span> {formatDate(group.uploaded_at)}
                        </div>
                      </div>
                    </div>
                    <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded">
                      {group.files.length} file{group.files.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className={styles.fileGrid}>
                    {group.files.map((file, fileIndex) => (
                      <div key={file.id} className="relative">
                        <FilePreview url={file.file} />
                        <div className="mt-2 text-center">
                          <span className="text-xs text-gray-500">
                            File #{fileIndex + 1}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Files Message */}
        {labData && (!labData.file_groups || labData.file_groups.length === 0) && (
          <div className="mb-6 p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg text-center">
            <div className="text-gray-400 text-4xl mb-2">📄</div>
            <p className="text-gray-600 font-medium">No files uploaded yet</p>
            <p className="text-gray-500 text-sm">Laboratory results and documents will appear here</p>
          </div>
        )}

        {/* Attachments Upload Section - Create Mode Only */}
        {!isViewMode && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Files & Documents</h3>
            {attachments.map((att, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-gray-700">File Group #{idx + 1}</span>
                  {attachments.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeAttachmentRow(idx)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Remove Group
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Files
                    </label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleAttachmentChange(idx, 'file', e.target.files)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Blood test results, X-ray images..."
                      value={att.description}
                      onChange={(e) => handleAttachmentChange(idx, 'description', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addAttachmentRow}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 px-4 text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
            >
              + Add Another File Group
            </button>
          </div>
        )}


        {/* TODO: SEPERATE THIS MODAL SOON */}
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3 className={styles.modalHeader}>Upload New File Group</h3>

              {modalAttachments.map((att, idx) => (
                <div key={idx} className={styles.modalGroup}>
                  <div className={styles.modalGroupHeader}>
                    <span className={styles.modalGroupTitle}>Group {idx + 1}</span>
                    {modalAttachments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeModalAttachmentRow(idx)}
                        className={styles.removeGroupButton}
                      >
                        Remove Group
                      </button>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="text-xs text-gray-500 mb-1 block">Description</label>
                    <input
                      type="text"
                      placeholder="Group description"
                      value={att.description}
                      onChange={(e) => handleModalAttachmentChange(idx, 'description', e.target.value)}
                      className={styles.modalInput}
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Upload Files</label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => handleModalAttachmentChange(idx, 'file', e.target.files)}
                      className={styles.modalFileInput}
                    />
                  </div>
                </div>
              ))}

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={addModalAttachmentRow}
                  className={`${styles.modalButton} ${styles.addButton}`}
                >
                  + Add Group
                </button>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className={`${styles.modalButton} ${styles.cancelButton}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleModalSubmit}
                    className={`${styles.modalButton} ${styles.uploadButton}`}
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* TODO: SEPERATE THIS MODAL SOON */}


        {/* Upload More Attachments Button - Edit Mode */}
        {isViewMode && isEditing && (
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-purple-600 text-black py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-md"
            >
              Upload More Files & Documents
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          {!labId ? (
            <button
              type="submit"
              className="flex-1 bg-green-600 text-black py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isViewMode && !isEditing}
            >
              {isViewMode ? '💾 Save Changes' : '🧪 Create Laboratory Result'}
            </button>
          ) : (
            <div className="flex-1 text-center py-3 text-gray-500">
              <p className="text-sm">Laboratory result saved successfully</p>
            </div>
          )}
          
          {isViewMode && isEditing && (
            <button
              type="button"
              onClick={toggleEditMode}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          )}
        </div>



      </form>
    </div>
  );
};

export default AddLaboratory;