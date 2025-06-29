import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  patientDetailsAPI,
  getPatientImagesAPI,
  SearchBillingsApi,
  SearchHospitalUserApi,
  uploadPatientImageAPI,
} from "../../api/axios";
import SearchBar from "../AngAtingSeachBarWIthDropDown";
import validationStyles from "./ValidationStyles.module.css";
import styles from "./BothPatientForm.module.css";

// Get the API base URL from environment variables
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

//----------------------------------------date format fix--------------------------------------
//pseudo: when edit, we have to get the FORMATTED String 00:z from backend to frontend BUT we have to convert that into input format (YYYY-MM-DDTHH:MM)

// Helper: Convert ISO date to datetime-local input format (YYYY-MM-DDTHH:MM)
//recieves string from backend then convert this into INPUT FIELDS para readable sa INPUT DATES
const isoToInputDateTime = (isoStr) => {
  if (!isoStr) return "";
  const date = new Date(isoStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

//helper 2: since the input is in form of input format (YYYY-MM-DDTHH:MM) -> convert into roper zzz something idk
const inputDateTimeToISO = (dateTimeString) => {
  if (!dateTimeString) return null;
  const date = new Date(dateTimeString);
  return isNaN(date.getTime()) ? null : date.toISOString();
};

const formatDateToLocal = (dateTimeString) => {
  if (!dateTimeString) return null;
  const date = new Date(dateTimeString);
  return date.toISOString();
};


const InPatientForm = ({ onSubmit }) => {
  //onSubmit yung function pano sinend sa backend.
  const { id } = useParams();
  const location = useLocation();
  
  // Determine if this is an "existing" patient route (generates new case number)
  const isExistingPatientRoute = location.pathname.includes('/existing/');
  
  const [searchTerm, setSearchTerm] = useState(""); //required for SearchBar
  const [searchTermDiagnosedBy, setSearchTermDiagnosedBy] = useState(""); //required for SearchBar

  const [isDropdownVisible, setIsDropdownVisible] = useState(false); //required for SearchBar

  //--- patient image
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  // Track field-level validation errors
  const [fieldErrors, setFieldErrors] = useState({});

  //All the information collected from the patient
  const [formData, setFormData] = useState({
    // Case Information
    has_philhealth: false,
    case_number: "",
    hospital_case_number: "",
    hmo: "",

    // Patient Details
    name: "",
    ward_service: "",
    bed_number: "",
    address: "",
    phone: "",
    date_of_birth: "",
    birth_place: "",
    age: 1,
    nationality: "",
    religion: "",
    occupation: "",
    gender: "",
    civil_status: "",
    medical_history: "",

    // Family Information
    father_name: "",
    father_address: "",
    father_contact: "",
    mother_name: "",
    mother_address: "",
    mother_contact: "",
    spouse_name: "",
    spouse_address: "",
    spouse_contact: "",

    // Admission Information
    status: "Admitted",
    type_of_admission: "",
    admission_date: "",
    discharge_date: "",
    discharge_time: "",
    total_days: "",
    attending_physician: "",
    visit_type: "New",
    consultation_datetime: "",
    next_consultation_date: "",
    referred_by: "",

    // Emergency Contact
    emergency_contact_name: "",
    emergency_contact_phone: "",

    // Medical Information
    current_condition: "",
    notes: "",
    diagnosed_by: "",
    height: "",
    weight: "",
    blood_pressure: "",
    pulse_rate: "",
    respiratory_rate: "",
    temperature: "",
    physical_examination: "",
    main_complaint: "",
    present_illness: "",
    clinical_findings: "",
    icd_code: "",
    diagnosis: "",
    treatment: "",

    // Additional Fields (if needed)
    membership: "",
    principal_diagnosis: "",
    other_diagnosis: "",
    principal_operation: "",
    other_operation: "",
    disposition: "",
    result: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (formData.note_type !== "Nurse") {
      setFormData((prev) => ({
        ...prev,
        data: "",
        action: "",
        response: "",
      }));
    }
  }, [formData.note_type]);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        if (id) {
          const { data } = await patientDetailsAPI(id);
          console.log(data)
          setFormData({
            // Insurance & Case Info
            has_philhealth: data.has_philhealth,
            case_number: data.case_number || "",
            hospital_case_number: data.hospital_case_number || "",
            has_hmo: data.has_hmo,
            hmo: data.hmo || "",

            // Basic Info
            name: data.name,
            status: data.status,
            type_of_admission: data.type_of_admission || "",
            admission_date: isoToInputDateTime(data.admission_date),
            current_condition: data.current_condition || "",

            // Demographics
            date_of_birth: data.date_of_birth?.split('T')[0] || "",
            birth_place: data.birth_place || "",
            gender: data.gender || "",
            age: data.age || "",
            address: data.address || "",
            occupation: data.occupation || "",
            civil_status: data.civil_status || "",
            nationality: data.nationality || "",
            religion: data.religion || "",

            // Ward & Bed
            ward_service: data.ward_service || "",
            bed_number: data.bed_number || "",

            // Consultation Info
            attending_physician: data.attending_physician || "",
            visit_type: data.visit_type || "",
            consultation_datetime: isoToInputDateTime(data.consultation_datetime),
            referred_by: data.referred_by || "",
            next_consultation_date: isoToInputDateTime(data.next_consultation_date),

            // Discharge
            discharge_date: isoToInputDateTime(data.discharge_date),
            total_days: data.total_days || "",

            // Contact
            phone: data.phone || "",
            emergency_contact_name: data.emergency_contact_name || "",
            emergency_contact_phone: data.emergency_contact_phone || "",

            // Medical History
            notes: data.notes || "",
            diagnosed_by: data.diagnosed_by || "",
            height: data.height || "",
            weight: data.weight || "",
            blood_pressure: data.blood_pressure || "",
            pulse_rate: data.pulse_rate || "",
            respiratory_rate: data.respiratory_rate || "",
            temperature: data.temperature || "",
            physical_examination: data.physical_examination || "",
            main_complaint: data.main_complaint || "",
            present_illness: data.present_illness || "",
            clinical_findings: data.clinical_findings || "",
            icd_code: data.icd_code || "",
            diagnosis: data.diagnosis || "",
            treatment: data.treatment || "",

            // Procedures / Diagnoses
            principal_diagnosis: data.principal_diagnosis || "",
            other_diagnosis: data.other_diagnosis || "",
            principal_operation: data.principal_operation || "",
            other_operation: data.other_operation || "",

            // Disposition & Result
            disposition: data.disposition || "",
            result: data.result || "",
            membership: data.membership || "",

            // Family Info
            father_name: data.father_name || "",
            father_address: data.father_address || "",
            father_contact: data.father_contact || "",
            mother_name: data.mother_name || "",
            mother_address: data.mother_address || "",
            mother_contact: data.mother_contact || "",
            spouse_name: data.spouse_name || "",
            spouse_address: data.spouse_address || "",
            spouse_contact: data.spouse_contact || "",
          });

          const imageResponse = await getPatientImagesAPI(id);
          setExistingImages(imageResponse.data || []);
        }
      } catch (err) {
        console.error("Failed to load patient data.", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  const formatNumber = (value) => {
    if (!value) return "";
    const num = parseFloat(value);
    return isNaN(num) ? "" : num.toFixed(2);
  };

  // Function to calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "";
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    
    // Check if birthDate is valid
    if (isNaN(birthDate.getTime())) return "";
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 0 ? age : "";
  };

  //cant use onChange, try useEffect
  useEffect(() => {
    if (formData.date_of_birth) {
      const calculatedAge = calculateAge(formData.date_of_birth);
      setFormData(prev => ({
        ...prev,
        age: calculatedAge
      }));
    }
  }, [formData.date_of_birth]);

  //"""When you use URL.createObjectURL() to preview images, the browser creates a temporary reference to the file in memory. If you don’t clean this up, those references remain in memory even after the component unmounts"""
  //-chatG
  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview.preview));
    };
  }, [imagePreviews]);

  const handleSelected = (filteredItem) => {
    console.log(filteredItem.id);
    setIsDropdownVisible(false);
    // setSearchTerm(filteredItem.code)
    setSearchTerm(String(filteredItem.id));
    setFormData((prev) => ({ ...prev, attending_physician: filteredItem.id }));
  };
  //handleSelectedDiagnosedBy
  const handleSelectedDiagnosedBy = (filteredItem) => {
    console.log(filteredItem.id);
    setIsDropdownVisible(false);
    // setSearchTerm(filteredItem.code)
    setSearchTermDiagnosedBy(String(filteredItem.id));
    setFormData((prev) => ({ ...prev, diagnosed_by: filteredItem.id }));
  };
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      [name]: type === "number" ? formatNumber(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let payload = { ...formData };

    // Always remove case numbers since they are auto-generated by the backend
    delete payload.case_number;
    delete payload.hospital_case_number;

    // // Validate ICD code
    // if (payload.icd_code && !isValidICDCode(payload.icd_code)) {
    //   alert('Please enter a valid ICD-10 code (e.g., J45.9).');
    //   return;
    // }

    // Format datetime fields
    payload.admission_date = inputDateTimeToISO(payload.admission_date);
    payload.discharge_date = inputDateTimeToISO(payload.discharge_date);
    payload.consultation_datetime = inputDateTimeToISO(
      payload.consultation_datetime
    );
    payload.next_consultation_date = inputDateTimeToISO(
      payload.next_consultation_date
    );

    // Format numeric fields
    const numericFields = [
      "height",
      "weight",
      "pulse_rate",
      "respiratory_rate",
      "temperature",
    ];
    numericFields.forEach((field) => {
      if (payload[field] === "" || payload[field] === null || payload[field] === undefined) {
        payload[field] = null;
      } else {
        payload[field] = formatNumber(payload[field]);
      }
    });

    // Handle foreign key fields - convert to integer or null
    if (payload.attending_physician === "" || payload.attending_physician === null || payload.attending_physician === undefined) {
      payload.attending_physician = null;
    } else if (payload.attending_physician) {
      payload.attending_physician = parseInt(payload.attending_physician);
    }

    // Replace empty strings with null for nullable fields
    [
      "admission_date",
      "discharge_date",
      "consultation_datetime",
      "next_consultation_date",
    ].forEach((key) => {
      if (!payload[key]) payload[key] = null;
    });

    // Handle required fields - set defaults if empty
    if (!payload.current_condition) {
      payload.current_condition = "Not specified";
    }
    if (!payload.notes) {
      payload.notes = "";
    }

    // Remove fields that don't exist in the Django model
    delete payload.medical_history;
    delete payload.data;
    delete payload.action;
    delete payload.response;
    delete payload.notes;

    delete payload.discharge_time; // This field doesn't exist in Django model
    
    // Remove diagnosed_by if it doesn't exist in your Django model
    // If you have this field in your model, remove this line
    delete payload.diagnosed_by;

    try {
      let patientId;
      if (id) {
        console.log(payload)
        await onSubmit(id, payload);
        console.log(payload);
        patientId = id;
      } else {
        const response = await onSubmit(payload);
        console.log(payload);
        patientId = response.data.id;
      }

      //then upload images if any
      if (selectedImages.length > 0 && patientId) {
        const formData = new FormData();

        // Append each file to FormData
        selectedImages.forEach((file) => {
          formData.append("file", file);
        });

        // Include patient ID
        formData.append("patient", patientId);

        // Upload images
        await uploadPatientImageAPI(formData);

        // Reset image selection
        setSelectedImages([]);
        setImagePreviews([]);
        navigate("/patients");
      }
        navigate("/patients");

    } catch (error) {
      console.error("Error submitting form:", error);
      
      // Check for validation errors from the API
      if (error.validationErrors) {
        // Set field-specific errors to display in the form
        setFieldErrors(error.validationErrors);
        
        // Create a summary message for the alert
        let errorMessage = "Please fix the highlighted fields with errors:\n\n";
        Object.keys(error.validationErrors).forEach(field => {
          if (Array.isArray(error.validationErrors[field])) {
            errorMessage += `• ${field}: ${error.validationErrors[field].join(', ')}\n`;
          } else {
            errorMessage += `• ${field}: ${error.validationErrors[field]}\n`;
          }
        });
        
      }


      else if (error.message && error.message.includes('Please fix the following errors:')) {
        alert(error.message);
      } 
      else if (error.response?.data?.error) {
        alert(`Error: `);
      } 
      
      

      //NEW ERROR HANDLING LOGIC! 
        //leverage backend throwing mechanism
      else if (error.response?.data) {
        const errorData = error.response.data;
        // Set these as field errors
        setFieldErrors(errorData);
        
        let errorMessage = "Please fix the following errors:\n\n";
        Object.keys(errorData).forEach(field => {
          if (Array.isArray(errorData[field])) {
            errorMessage += `• ${field}: ${errorData[field].join(', ')}\n`;
          } else {
            errorMessage += `• ${field}: ${errorData[field]}\n`;
          }
        });
        
        alert(errorMessage);
      } 
      // Fallback error
      else {
        alert("Failed to save patient or upload images. Please check the console for details.");
      }
    }
  };

  //all renders use this, some file are image some files actual files,,,,,
  function FilePreview({ url }) {
    const isImage = /\.(jpe?g|png|gif|webp)$/i.test(url);
    const fullUrl = `${API_BASE}:8000${url}`;

    return (
      <div className={styles.filePreviewContainer}>
        {isImage ? (
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
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

  // Calculate total days when admission and discharge dates change
  useEffect(() => {
    if (formData.admission_date && formData.discharge_date) {
      const admission = new Date(formData.admission_date);
      const discharge = new Date(formData.discharge_date);
      const diffTime = Math.abs(discharge - admission);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setFormData((prev) => ({ ...prev, totalDays: diffDays.toString() }));
    }
  }, [formData.admission_date, formData.discharge_date]);



  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    const previews = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImagePreviews(previews);
  };




  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    // Clear error for this field when the user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "radio"
          ? value === "true"
            ? true
            : value === "false"
              ? false
              : value // if it's a string radio value
          : value,
    }));
  };

  // Helper component for field errors
  const FieldError = ({ fieldName }) => {
    if (!fieldErrors[fieldName]) return null;
    
    const errors = Array.isArray(fieldErrors[fieldName]) 
      ? fieldErrors[fieldName].join(', ') 
      : fieldErrors[fieldName];
      
    return (
      <div className={validationStyles.errorText}>
        {errors}
      </div>
    );
  };

  if (loading) return <div>Loading…</div>;

  const handleSSubmit = (e) => {
    e.preventDefault();
    // Validate required fields
    const requiredFields = [
      "case_number",
      "hospital_case_number",
      "name",
      "bed_number",
      "visit_status",
      "admission_date",
      "attending_physician",
    ];

    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }

    console.log("Form submitted:", formData);
    alert("Patient record added successfully!");
  };

  return (
    <div className={styles.mainContent}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Add New Inpatient Record</h1>
          <div className={styles.headerActions}>
            <div className={styles.hospitalLogo}>
              <img
                src="/hospital_logo.png"
                alt="Antipolo Centro De Medikal Hospital Logo"
                className={styles.logoImage}
              />
            </div>
          </div>
        </div>
      </header>

      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.patientForm}>

          {/* Case Information */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Case Information</h3>

            {/* Image Upload Section */}
            <div className={styles.imageUploadSection}>
              <label className={styles.label}>
                Upload Patient Images
                <input
                  type="file"
                  name="patientImages"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleImageChange}
                />
              </label>

              {/* New Image Previews */}
              {imagePreviews.length > 0 && (
                <div className={styles.imagePreviewContainer}>
                  <h3>New Images to Upload:</h3>
                  <div className={styles.imagePreviewGrid}>
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className={styles.imagePreview}>
                        {preview.file.type.startsWith('image/') ? (
                          <img src={preview.preview} alt={`Preview ${index}`} />
                        ) : (
                          <div className={styles.fileIcon}>
                            {preview.file.name.split('.').pop().toUpperCase()} File
                          </div>
                        )}
                        <p>{preview.file.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Existing Images (Edit Mode Only) */}
              {id && existingImages.length > 0 && (
                <div
                  className={styles.firstImageContainer}
                  onClick={() => setModalOpen(true)}
                >
                  <img
                    src={
                      existingImages[0].file.startsWith('http')
                        ? existingImages[0].file
                        : `${API_BASE}:8000${existingImages[0].file}`
                    }
                    alt="Patient"
                    className={styles.firstImage}
                  />
                  <div className={styles.viewAllIconContainer}>
                    VIEW
                  </div>
                </div>
              )}
            </div>

            {/* Modal for all images */}
            {modalOpen && (
              <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
                <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                  <button
                    className={styles.closeButton}
                    onClick={() => setModalOpen(false)}
                  >
                    ×
                  </button>
                  <div className={styles.imageGrid}>
                    {existingImages.map(img => (
                      <img
                        key={img.id}
                        src={
                          img.file.startsWith('http')
                            ? img.file
                            : `${API_BASE}:8000${img.file}`
                        }
                        alt="Patient"
                        className={styles.gridImage}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}




            {/* -- Case Number, Hospital Case Number, HMO*/}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Case Number
                  <span className={styles.autoGeneratedNote}> (Auto-generated)</span>
                </label>
                <input
                  type="text"
                  name="case_number"
                  value={formData.case_number}
                  readOnly // Always readonly since it's auto-generated
                  disabled // Always disabled since it's auto-generated
                  className={`${styles.formInput} ${styles.disabledInput}`}
                  placeholder="Will be auto-generated on save"
                />
                <small className={styles.helpText}>
                  Case number is automatically generated by the system.
                </small>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Hospital Case Number
                  <span className={styles.permanentIdNote}> (Auto-generated)</span>
                </label>
                <input
                  type="text"
                  name="hospital_case_number"
                  value={formData.hospital_case_number}
                  readOnly // Always readonly since it's auto-generated
                  disabled // Always disabled since it's auto-generated
                  className={`${styles.formInput} ${styles.disabledInput}`}
                  placeholder="Will be auto-generated on save"
                />
                <small className={styles.helpText}>
                  Hospital case number is automatically generated by the system.
                </small>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>HMO</label>
                <input
                  type="text"
                  name="hmo"
                  value={formData.hmo}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
            </div>

            {/* -- PhilHealth */}
            <div className={styles.checkboxGroup}>
              <label className={styles.formLabel}>PhilHealth</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="has_philhealth"
                    value="true"
                    checked={formData.has_philhealth === true}
                    onChange={handleInputChange}
                  />
                  With
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="has_philhealth"
                    value="false"
                    checked={formData.has_philhealth === false}
                    onChange={handleInputChange}
                  />
                  Without
                </label>
              </div>
            </div>
          </div>

          {/* Patient Details */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Patient Detailss</h3>

            {/* -- Patient Name */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`${styles.formInput} ${fieldErrors.name ? validationStyles.errorInput : ''}`}
                  required
                />
                <FieldError fieldName="name" />
              </div>
            </div>

            {/* -- Ward/Service & Bed Number */}
            <div className={styles.formGrid}>
              <div className={styles.checkboxGroup}>
                <label className={styles.formLabel}>Ward/Service</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="ward_service"
                      value="private"
                      checked={formData.ward_service === "private"}
                      onChange={handleInputChange}
                    />
                    Private Case
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="ward_service"
                      value="house"
                      checked={formData.ward_service === "house"}
                      onChange={handleInputChange}
                    />
                    House Case
                  </label>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Bed Number</label>
                <input
                  type="text"
                  name="bed_number"
                  value={formData.bed_number}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  readOnly
                />
              </div>
            </div>

            {/* -- Patient Adress & Contact Number*/}
            <div className={styles.formGrid}>
              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label className={styles.formLabel}>Patient Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  rows="3"
                />
              </div>
              {/* -- Contact Number */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Contact Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
            </div>

            {/* -- Birth date, Birth place, age*/}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Birth Date</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleInputChange}
                  className={`${styles.formInput} ${fieldErrors.date_of_birth ? validationStyles.errorInput : ''}`}
                />
                <FieldError fieldName="date_of_birth" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Birth Place</label>
                <input
                  type="text"
                  name="birth_place"
                  value={formData.birth_place}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Age
                  <span className={styles.autoGeneratedNote}> (Auto-calculated)</span>
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  readOnly
                  disabled
                  className={`${styles.formInput} ${styles.disabledInput}`}
                  step={1}
                  min={0}
                  max={200}
                  placeholder="Calculated from birth date"
                />
                <small className={styles.helpText}>
                  Age is automatically calculated from the birth date.
                </small>
              </div>
            </div>

            {/* -- Natioinality, Religion, Occupation*/}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Religion</label>
                <input
                  type="text"
                  name="religion"
                  value={formData.religion}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
            </div>

            {/* -- Gender */}
            <div className={styles.checkboxGroup}>
              <label className={styles.formLabel}>Gender</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === "Male"}
                    onChange={handleInputChange}
                  />
                  Male
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === "Female"}
                    onChange={handleInputChange}
                  />
                  Female
                </label>
              </div>
            </div>

            {/* -- Civil Status */}
            <div className={styles.checkboxGroup}>
              <label className={styles.formLabel}>Civil Status</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="civil_status"
                    value="Single"
                    checked={formData.civil_status === "Single"}
                    onChange={handleInputChange}
                  />
                  Single
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="civil_status"
                    value="Married"
                    checked={formData.civil_status === "Married"}
                    onChange={handleInputChange}
                  />
                  Married
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="civil_status"
                    value="Widowed"
                    checked={formData.civil_status === "Widowed"}
                    onChange={handleInputChange}
                  />
                  Widow
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="civil_status"
                    value="Divorced"
                    checked={formData.civil_status === "Divorced"}
                    onChange={handleInputChange}
                  />
                  Divorced
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="civil_status"
                    value="Separated"
                    checked={formData.civil_status === "Separated"}
                    onChange={handleInputChange}
                  />
                  Separated
                </label>
              </div>
            </div>
          </div>

          {/* Family Information */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Family Information</h3>

            {/* -- Father's Information */}
            <div className={styles.familySubsection}>
              <h4 className={styles.subsectionTitle}>Father's Information</h4>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Father's Name</label>
                  <input
                    type="text"
                    name="father_name"
                    value={formData.father_name}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Father's Address</label>
                  <input
                    type="text"
                    name="father_address"
                    value={formData.father_address}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Father's Contact Number
                  </label>
                  <input
                    type="tel"
                    name="father_contact"
                    value={formData.father_contact}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
              </div>
            </div>

            {/* -- Mother's Information */}
            <div className={styles.familySubsection}>
              <h4 className={styles.subsectionTitle}>Mother's Information</h4>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Mother's Name</label>
                  <input
                    type="text"
                    name="mother_name"
                    value={formData.mother_name}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Mother's Address</label>
                  <input
                    type="text"
                    name="mother_address"
                    value={formData.mother_address}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Mother's Contact Number
                  </label>
                  <input
                    type="tel"
                    name="mother_contact"
                    value={formData.mother_contact}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
              </div>
            </div>

            {/* -- Spouse Information */}
            <div className={styles.familySubsection}>
              <h4 className={styles.subsectionTitle}>Spouse's Information</h4>
              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Spouse's Name</label>
                  <input
                    type="text"
                    name="spouse_name"
                    value={formData.spouse_name}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Spouse's Address</label>
                  <input
                    type="text"
                    name="spouse_address"
                    value={formData.spouse_address}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Spouse's Contact Number
                  </label>
                  <input
                    type="tel"
                    name="spouse_contact"
                    value={formData.spouse_contact}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Admission Information */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Admission Information</h3>

            {/* -- Visit Status */}
            <div className={styles.checkboxGroup}>
              <label className={styles.formLabel}>Visit Status</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="status"
                    value="Admitted"
                    checked={formData.status === "Admitted"}
                    onChange={handleInputChange}
                    required
                  />
                  Admitted
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="status"
                    value="Discharged"
                    checked={formData.status === "Discharged"}
                    onChange={handleInputChange}
                    required
                  />
                  Discharged
                </label>
              </div>
            </div>

            {/* -- Admission date & time, Discharge date & time, Total number of days */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Admission Dates</label>
                <input
                  type="datetime-local"
                  name="admission_date"
                  value={formData.admission_date}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>

            </div>

            {/* -- Discharge date & time, Total number of days */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Discharge Date</label>
                <input
                  type="datetime-local"
                  name="discharge_date"
                  value={formData.discharge_date}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Total Days</label>
                <input
                  type="text"
                  name="totalDays"
                  value={formData.totalDays}
                  className={styles.formInput}
                  readOnly
                />
              </div>
            </div>

            {/* -- Attending Physician */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Attending Physician</label>
                <SearchBar
                  // data={dummyBillingData}
                  placeholder={"Search hospital User"}
                  searchApi={SearchHospitalUserApi}
                  // accept the argument passed by the SearchBar component (item) when onSelectSuggestion is invoked
                  //to accept *-*
                  onSelectSuggestion={(filtered) => {
                    handleSelected(filtered)
                    setSearchTerm(filtered.first_name + " " + filtered.last_name);
                  } }
                  suggestedOutput={['user_id', 'last_name', 'first_name']}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  isDropdownVisible={isDropdownVisible}
                  setIsDropdownVisible={setIsDropdownVisible}
                  maxDropdownHeight="500px"

                />
                {/* <input
                  type="text"
                  name="attending_physician"
                  value={formData.attending_physician}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                /> */}
              </div>
            </div>

            {/* -- Type of admission */}
            <div className={styles.checkboxGroup}>
              <label className={styles.formLabel}>Type of Admission</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="type_of_admission"
                    value="New"
                    checked={formData.type_of_admission === "New"}
                    onChange={handleInputChange}
                  />
                  New
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="type_of_admission"
                    value="Old/Former"
                    checked={formData.type_of_admission === "Old/Former"}
                    onChange={handleInputChange}
                  />
                  Old/Former
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="type_of_admission"
                    value="OPD"
                    checked={formData.type_of_admission === "OPD"}
                    onChange={handleInputChange}
                  />
                  OPD
                </label>
              </div>
            </div>

            {/* -- Referred by (Physician/Agency) */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Referred by (Physician/Agency)
              </label>
              <input
                type="text"
                name="referred_by"
                value={formData.referred_by}
                onChange={handleInputChange}
                className={styles.formInput}
              />
            </div>
          </div>

          {/* Medical Information */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Medical Information</h3>

            {/* Admission Diagnosis */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Admission Diagnosis</label>
                <textarea
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  rows="3"
                />
              </div>
            </div>

            {/* Membership */}
            <div className={styles.checkboxGroup}>
              <label className={styles.formLabel}>Membership</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="membership"
                    value="SSS"
                    checked={formData.membership === "SSS"}
                    onChange={handleInputChange}
                  />
                  SSS
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="membership"
                    value="GSIS"
                    checked={formData.membership === "GSIS"}
                    onChange={handleInputChange}
                  />
                  GSIS
                </label>
              </div>
            </div>

            {/* Principal Diagnosis, Other Diagnosis */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Principal Diagnosis</label>
                <textarea
                  name="principal_diagnosis"
                  value={formData.principal_diagnosis}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  rows="3"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Other Diagnosis</label>
                <textarea
                  name="other_diagnosis"
                  value={formData.other_diagnosis}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  rows="3"
                />
              </div>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>ICD Code Number</label>
                <input
                  type="text"
                  name="icd_code"
                  value={formData.icd_code}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Principal Operation/Procedure
                </label>
                <input
                  type="text"
                  name="principal_operation"
                  value={formData.principal_operation}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Other Operation/Procedure
                </label>
                <input
                  type="text"
                  name="other_operation"
                  value={formData.other_operation}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
            </div>

            <div className={styles.checkboxGroup}>
              <label className={styles.formLabel}>Disposition</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="disposition"
                    value="Discharged"
                    checked={formData.disposition === "Discharged"}
                    onChange={handleInputChange}
                  />
                  Discharged
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="disposition"
                    value="Transferred"
                    checked={formData.disposition === "Transferred"}
                    onChange={handleInputChange}
                  />
                  Transferred
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="disposition"
                    value="HAMA"
                    checked={formData.disposition === "HAMA"}
                    onChange={handleInputChange}
                  />
                  HAMA
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="disposition"
                    value="Absconded"
                    checked={formData.disposition === "Absconded"}
                    onChange={handleInputChange}
                  />
                  Absconded
                </label>
              </div>
            </div>

            <div className={styles.checkboxGroup}>
              <label className={styles.formLabel}>Result</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="result"
                    value="Recovered"
                    checked={formData.result === "Recovered"}
                    onChange={handleInputChange}
                  />
                  Recovered
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="result"
                    value="Died"
                    checked={formData.result === "Died"}
                    onChange={handleInputChange}
                  />
                  Died
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="result"
                    value="48h_minus"
                    checked={formData.result === "48h_minus"}
                    onChange={handleInputChange}
                  />
                  (-) 48 Hours
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="result"
                    value="48h_plus"
                    checked={formData.result === "48h_plus"}
                    onChange={handleInputChange}
                  />
                  (+) 48 Hours
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="result"
                    value="Improved"
                    checked={formData.result === "Improved"}
                    onChange={handleInputChange}
                  />
                  Improved
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="result"
                    value="Unimproved"
                    checked={formData.result === "Unimproved"}
                    onChange={handleInputChange}
                  />
                  Unimproved
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="result"
                    value="Autopsy"
                    checked={formData.result === "Autopsy"}
                    onChange={handleInputChange}
                  />
                  Autopsy
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="result"
                    value="No_autopsy"
                    checked={formData.result === "No_autopsy"}
                    onChange={handleInputChange}
                  />
                  No Autopsy
                </label>











              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton}>
              Add Patient Record
            </button>
            <button type="button" className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

};

export default InPatientForm;


//----------------------------------------date format fix--------------------------------------

//note THIS IS WHAT WE SEND TO BACKEND.. ai prompt nio nalang. you have to match the  formData doon... formData lang naman. values
// const [formData, setFormData] = useState({
//   has_philhealth: false,
//   case_number: '',
//   hospital_case_number: '',
//   has_hmo: false,
//   hmo: '',

//


// {
//     "has_philhealth": true,
//     "case_number": "CN-20250617-jaak",
//     "hospital_case_number": "HCN-20250617-001",
//     "hmo": "Acme Health Plan",
//     "name": "Cong Velasquez",
//     "ward_service": "private",
//     "bed_number": "2",
//     "address": "Somewhere around city",
//     "phone": "09357773518",
//     "date_of_birth": "2025-06-27",
//     "birth_place": "Taytay Rizal",
//     "age": "45",
//     "nationality": "Filipino",
//     "religion": "Catholic",
//     "occupation": "Vlogger",
//     "gender": "Male",
//     "civil_status": "Married",
//     "father_name": "Cong Velasquez Sr",
//     "father_address": "block 1 lot 38, Hinapao Street",
//     "father_contact": "",
//     "mother_name": "Cong Velasquez Sis",
//     "mother_address": "block 1 lot 38, Hinapao Street",
//     "mother_contact": "",
//     "spouse_name": "",
//     "spouse_address": "",
//     "spouse_contact": "",
//     "status": "Admitted",
//     "type_of_admission": "New",
//     "admission_date": "2025-06-26T17:11:00.000Z",
//     "discharge_date": null,
//     "total_days": "",
//     "attending_physician": 2,
//     "visit_type": "New",
//     "consultation_datetime": null,
//     "next_consultation_date": null,
//     "referred_by": "Dr. Santos",
//     "emergency_contact_name": "",
//     "emergency_contact_phone": "",
//     "current_condition": "Not specified",
//     "height": null,
//     "weight": null,
//     "blood_pressure": "",
//     "pulse_rate": null,
//     "respiratory_rate": null,
//     "temperature": null,
//     "physical_examination": "",
//     "main_complaint": "",
//     "present_illness": "",
//     "clinical_findings": "",
//     "icd_code": "na",
//     "diagnosis": "High BP",
//     "treatment": "",
//     "membership": "SSS",
//     "principal_diagnosis": "na",
//     "other_diagnosis": "na",
//     "principal_operation": "na",
//     "other_operation": "na",
//     "disposition": "Discharged",
//     "result": "48h_plus",
//     "totalDays": "1"
// }