import React, { useEffect, useState } from "react";
import styles from "./BothPatientForm.module.css";
import validationStyles from "./ValidationStyles.module.css";
import { useParams } from "react-router-dom";
import {
  patientDetailsAPI,
  getPatientImagesAPI,
  SearchBillingsApi,
  SearchHospitalUserApi,
  uploadPatientImageAPI,
} from "../../api/axios";
import SearchBar from "../AngAtingSeachBarWIthDropDown";

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


const OutPatientForm = ({ onSubmit }) => {
  //onSubmit yung function pano sinend sa backend.
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState(""); //required for SearchBar
  const [searchTermDiagnosedBy, setSearchTermDiagnosedBy] = useState(""); //required for SearchBar

  const [isDropdownVisible, setIsDropdownVisible] = useState(false); //required for SearchBar

  //--- patient image
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [otherFiles, setOtherFiles] = useState([]);
  
  // Track field-level validation errors
  const [fieldErrors, setFieldErrors] = useState({});

  const handleOtherFilesChange = (e) => {
    const files = Array.from(e.target.files);

    setOtherFiles((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const [formData, setFormData] = useState({
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
    age: "",
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
    admission_time: "",
    discharge_date: "",
    discharge_time: "",
    total_days: "",
    attending_physician: "",
    visit_type: "New",
    consultation_datetime: "",
    consultation_date: "",
    consultation_time: "",
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
            has_philhealth: data.has_philhealth,
            case_number: data.case_number || "",
            hospital_case_number: data.hospital_case_number || "",
            has_hmo: data.has_hmo,
            hmo: data.hmo || "",
            name: data.name,
            status: data.status,
            admission_date: isoToInputDateTime(data.admission_date),
            current_condition: data.current_condition,
            date_of_birth: data.date_of_birth?.split("T")[0] || "",
            address: data.address || "",
            occupation: data.occupation || "",
            civil_status: data.civil_status || "",
            nationality: data.nationality || "",
            religion: data.religion || "",
            attending_physician: data.attending_physician || "",
            visit_type: data.visit_type || "New",
            consultation_datetime: isoToInputDateTime(
              data.consultation_datetime
            ),
            referred_by: data.referred_by || "",
            next_consultation_date: isoToInputDateTime(
              data.next_consultation_date
            ),
            discharge_date: isoToInputDateTime(data.discharge_date),
            phone: data.phone || "",
            emergency_contact_name: data.emergency_contact_name || "",
            emergency_contact_phone: data.emergency_contact_phone || "",
            is_active: data.is_active,
            notes: data.notes || "",
            age: data.age || 0,
            gender: data.gender || "",
            diagnosed_by: data.diagnosed_by_id || "",
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImagePreviews(previews);
  };

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

    // Validate hospital_case_number
    if (!payload.hospital_case_number) {
      alert("Hospital Case Number is required.");
      return;
    }

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
      payload[field] = formatNumber(payload[field]);
    });

    // Replace empty strings with null for nullable fields
    [
      "admission_date",
      "discharge_date",
      "consultation_datetime",
      "next_consultation_date",
    ].forEach((key) => {
      if (!payload[key]) payload[key] = null;
    });

    try {
      // Clear any previous field errors
      setFieldErrors({});
      
      let patientId;
      if (id) {
        await onSubmit(id, payload);

        console.log(payload);
        patientId = id;
      } else {
        const response = await onSubmit(payload);
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
      }
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
        
        alert(errorMessage);
      }
      // Handle legacy error format
      else if (error.message && error.message.includes('Please fix the following errors:')) {
        alert(error.message);
      } 
      // Handle general error message
      else if (error.response?.data?.error) {
        alert(`Error: ${error.response.data.error}`);
      } 
      // Handle direct data error format from Django
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
    const fullUrl = `${API_BASE}${url}`;

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


  return (
    <div className={styles.mainContent}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Add New Outpatient Record</h1>
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

            {/* -- Case Number, Hospital Case Number, HMO*/}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Case Number</label>
                <input
                  type="text"
                  name="case_number"
                  value={formData.case_number}
                  onChange={handleInputChange}
                  className={`${styles.formInput} ${fieldErrors.case_number ? validationStyles.errorInput : ''}`}
                  required
                />
                <FieldError fieldName="case_number" />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Hospital Case Number</label>
                <input
                  type="text"
                  name="hospital_case_number"
                  value={formData.hospital_case_number}
                  onChange={handleInputChange}
                  className={`${styles.formInput} ${fieldErrors.hospital_case_number ? validationStyles.errorInput : ''}`}
                  required
                />
                <FieldError fieldName="hospital_case_number" />
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

            {/* Patient Details */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Patient Details</h3>

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
                  />
                  <FieldError fieldName="name" />
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
                    className={`${styles.formTextarea} ${fieldErrors.address ? validationStyles.errorInput : ''}`}
                    rows="3"
                    required
                  />
                  <FieldError fieldName="address" />
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
                    required
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
                    required
                  />
                  <FieldError fieldName="date_of_birth" />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Age</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className={`${styles.formInput} ${fieldErrors.age ? validationStyles.errorInput : ''}`}
                    step={1}
                    min={0}
                    max={200}
                  />
                  <FieldError fieldName="age" />
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

            {/* -- Medical History */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.formLabel}>Medical History</label>
              <textarea
                name="medical_history"
                value={formData.medical_history}
                onChange={handleInputChange}
                className={styles.formTextarea}
                rows="3"
              />
            </div>
          </div>

          {/* Admission Information */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Consultation Information</h3>

            <div className={styles.checkboxGroup}>
              <label className={styles.formLabel}>Visit Status</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="status"
                    value="Outpatient"
                    checked={formData.status === "Outpatient"}
                    onChange={handleInputChange}
                    required
                  />
                  Outpatient
                </label>
              </div>
            </div>

            {/* -- Visit Type */}
            <div className={styles.checkboxGroup}>
              <label className={styles.formLabel}>Visit Type</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="visit_type"
                    value="New"
                    checked={formData.visit_type === "New"}
                    onChange={handleInputChange}
                    required
                  />
                  New
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="visit_type"
                    value="followUp"
                    checked={formData.visit_type === "Follow-Up"}
                    onChange={handleInputChange}
                    required
                  />
                  Follow-Up
                </label>
              </div>
            </div>

            {/* -- Consultation Date & Time */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Consultation Date & Time
              </label>
              <input
                type="datetime-local"
                name="consultation_datetime"
                value={formData.consultation_datetime}
                onChange={handleInputChange}
                className={`${styles.formInput} ${fieldErrors.consultation_datetime ? validationStyles.errorInput : ''}`}
                required
              />
              <FieldError fieldName="consultation_datetime" />
            </div>

            {/* -- Next Consultation date */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Next Consultation</label>
                <input
                  type="datetime-local"
                  name="next_consultation_date"
                  value={formData.next_consultation_date}
                  onChange={handleInputChange}
                  className={styles.formInput}
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
                  onSelectSuggestion={(filtered) => handleSelected(filtered)}
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

            {/* -- Height, weight, BP, PR, RR, Temp*/}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Height</label>
                <input
                  type="text"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Weight</label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Blood Pressure</label>
                <input
                  type="text"
                  name="blood_pressure"
                  value={formData.blood_pressure}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Pulse Rate</label>
                <input
                  type="text"
                  name="pulse_rate"
                  value={formData.pulse_rate}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Respiratory Rate</label>
                <input
                  type="text"
                  name="respiratory_rate"
                  value={formData.respiratory_rate}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Temperature</label>
                <input
                  type="text"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
            </div>

            {/* Physical Examination */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Physical Examination</label>
                <textarea
                  name="physical_examination"
                  value={formData.physical_examination}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  rows="3"
                  required
                />
              </div>
            </div>

            {/* Main Complaint */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Main Complaint</label>
                <textarea
                  name="main_complaint"
                  value={formData.main_complaint}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  rows="3"
                  required
                />
              </div>
            </div>

            {/* Present Illness */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Present Illness</label>
                <textarea
                  name="present_illness"
                  value={formData.present_illness}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  rows="3"
                  required
                />
              </div>
            </div>
          </div>

          {/* Clinical Findings */}
          <div className={styles.formSection}>
            <h3 className={styles.sectionTitle}>Clinical Findings</h3>

            {/* ICD Code */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>ICD Code</label>
                <input
                  type="text"
                  name="icd_code"
                  value={formData.icd_code}
                  onChange={handleInputChange}
                  className={styles.formInput}
                />
              </div>
            </div>








            {/* Diagnosis */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Diagnosis</label>
                <textarea
                  name="current_condition"
                  value={formData.current_condition}
                  onChange={handleInputChange}
                  className={`${styles.formTextarea} ${fieldErrors.current_condition ? validationStyles.errorInput : ''}`}
                  rows="3"
                  required
                />
                <FieldError fieldName="current_condition" />
              </div>
            </div>

            {/* Treatment */}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Treatment</label>
                <textarea
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleInputChange}
                  className={styles.formTextarea}
                  rows="3"
                  required
                />
              </div>
            </div>




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
                        : `${API_BASE}${existingImages[0].file}`
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
                            : `${API_BASE}${img.file}`
                        }
                        alt="Patient"
                        className={styles.gridImage}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
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

export default OutPatientForm;





