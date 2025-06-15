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



  //all renders use this, some file are image some files actual files,,,,,
  function FilePreview({ url }) {
    const isImage = /\.(jpe?g|png|gif|webp)$/i.test(url);

    return (
      <div className={styles.filePreviewContainer}>
        {isImage ? (
          <a href={`http://localhost:8000${url}`} target="_blank" rel="noopener noreferrer">
            <img
              src={`http://localhost:8000${url}`}
              alt="Preview"
              className={styles.filePreviewImage}
            />
          </a>

        ) : (
          <a
            href={`http://localhost:8000${url}`}
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


        {/* NEW File Groups */}
        {labData?.file_groups?.length > 0 && (
          <section className={styles.fileGroupSection}>
            <h2 className={styles.fileGroupHeader}>File Groups</h2>
            <div className="space-y-6">
              {labData.file_groups.map(group => (
                <div key={group.id} className={styles.fileGroupCard}>
                  <p className={styles.fileGroupDescription}>
                    {group.description || "Untitled Group"}
                  </p>
                  <div className={styles.fileGrid}>
                    {group.files.map(file => (
                      <FilePreview
                        key={file.id}
                        url={file.file}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
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



        

        {/* Submit Button */}
        
        {labId? (<></>): 
        (<div className="mt-6">
          <button
            type="submit"
            className="w-full bg-green-600 text-black py-2 rounded hover:bg-green-700"
            disabled={isViewMode && !isEditing}
          >
            {isViewMode ? 'Save Changes' : 'CREATE LAB'}
          </button>
        </div>)}
        


      </form>
    </div>
  );
};

export default AddLaboratory;