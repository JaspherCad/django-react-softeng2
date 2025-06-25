// import React, { useEffect, useState } from 'react';
// import styles from './Patients.module.css';
// import { useNavigate, useParams } from 'react-router-dom';
// import { patientDetailsAPI, getPatientImagesAPI, SearchBillingsApi, SearchHospitalUserApi, uploadPatientImageAPI } from '../../api/axios';
// import SearchBar from '../AngAtingSeachBarWIthDropDown';







// //----------------------------------------date format fix--------------------------------------
// //pseudo: when edit, we have to get the FORMATTED String 00:z from backend to frontend BUT we have to convert that into input format (YYYY-MM-DDTHH:MM)

// // Helper: Convert ISO date to datetime-local input format (YYYY-MM-DDTHH:MM)
// //recieves string from backend then convert this into INPUT FIELDS para readable sa INPUT DATES
// const isoToInputDateTime = (isoStr) => {
//   if (!isoStr) return '';
//   const date = new Date(isoStr);
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   const hours = String(date.getHours()).padStart(2, '0');
//   const minutes = String(date.getMinutes()).padStart(2, '0');
//   return `${year}-${month}-${day}T${hours}:${minutes}`;
// };

// //helper 2: since the input is in form of input format (YYYY-MM-DDTHH:MM) -> convert into Proper zzz something ISO
// const inputDateTimeToISO = (dateTimeString) => {
//   if (!dateTimeString) return null;
//   const date = new Date(dateTimeString);
//   return isNaN(date.getTime()) ? null : date.toISOString();
// };

// //deprecated
// const formatDateToLocal = (dateTimeString) => {
//   if (!dateTimeString) return null;
//   const date = new Date(dateTimeString);
//   return date.toISOString();
// };





// //----------------------------------------date format fix--------------------------------------









// //note THIS IS WHAT WE SEND TO BACKEND.. ai prompt nio nalang. you have to match the  formData doon... formData lang naman. values
// // const [formData, setFormData] = useState({
// //   has_philhealth: false,
// //   case_number: '',
// //   hospital_case_number: '',
// //   has_hmo: false,
// //   hmo: '',

// //

// // {
// //     "id": 4,
// //     "has_philhealth": true,
// //     "case_number": "CN-20250617-001",
// //     "hospital_case_number": "HCN-20250617-001",
// //     "has_hmo": true,
// //     "hmo": "Acme Health Plan",
// //     "code": "K8XA4",
// //     "name": "Juan Dela Cruz",
// //     "status": "Admitted",
// //     "admission_date": "2025-06-17T09:30:00Z",
// //     "current_condition": "Stable but requires monitoring for possible complications.",
// //     "date_of_birth": "1985-04-23",
// //     "address": "123 Mabini St., Manila, Philippines",
// //     "occupation": "Software Engineer",
// //     "civil_status": "Married",
// //     "nationality": "Filipino",
// //     "religion": "Roman Catholic",
// //     "visit_type": "New",
// //     "consultation_datetime": "2025-06-17T10:15:00Z",
// //     "referred_by": "Dr. Santos",
// //     "next_consultation_date": "2025-06-24T10:00:00Z",
// //     "discharge_date": null,
// //     "phone": "+639171234567",
// //     "emergency_contact_name": "Maria Cruz",
// //     "emergency_contact_phone": "+639189876543",
// //     "is_active": "Active",
// //     "entry_date": "2025-06-17T09:36:39.131806Z",
// //     "notes": "Patient allergic to penicillin. Family history of hypertension.",
// //     "height": "170.00",
// //     "weight": "68.50",
// //     "blood_pressure": "120/80",
// //     "pulse_rate": "72.00",
// //     "respiratory_rate": "16.00",
// //     "temperature": "36.80",
// //     "physical_examination": "Lungs clear, heart sounds normal.",
// //     "main_complaint": "Shortness of breath on exertion.",
// //     "present_illness": "Developed mild dyspnea over the past 2 days.",
// //     "clinical_findings": "No cyanosis, no chest pain.",
// //     "icd_code": "J45.9",
// //     "diagnosis": "Mild asthma exacerbation",
// //     "treatment": "Nebulized salbutamol every 4 hours; continue maintenance inhaler.",
// //     "attending_physician": 1,
// //     "diagnosed_by": 1
// // }

// const InPatientForm = ({ onSubmit }) => { //onSubmit yung function pano sinend sa backend.
//   const { id } = useParams();
//   const [searchTerm, setSearchTerm] = useState(''); //required for SearchBar
//   const [searchTermDiagnosedBy, setSearchTermDiagnosedBy] = useState(''); //required for SearchBar

//   const [isDropdownVisible, setIsDropdownVisible] = useState(false)  //required for SearchBar

//   //--- patient image

//   //for uploadd
//   const [selectedImages, setSelectedImages] = useState([]);
//   const [imagePreviews, setImagePreviews] = useState([]);


//   //for fetching existing ofc...
//   const [existingImages, setExistingImages] = useState([]);
//   const [modalOpen, setModalOpen] = useState(false);
//   const navigate = useNavigate();


//   const [formData, setFormData] = useState({
//     has_philhealth: false,
//     case_number: '',
//     hospital_case_number: '',
//     has_hmo: false,
//     hmo: '',
//     name: '',
//     status: 'Admitted',
//     admission_date: '',
//     current_condition: '',
//     date_of_birth: '',
//     address: '',
//     occupation: '',
//     civil_status: '',
//     nationality: '',
//     religion: '',
//     attending_physician: '',
//     visit_type: 'New',
//     consultation_datetime: '',
//     referred_by: '',
//     next_consultation_date: '',
//     discharge_date: '',
//     phone: '',
//     emergency_contact_name: '',
//     emergency_contact_phone: '',
//     is_active: 'Active',
//     notes: '',
//     diagnosed_by: '',
//     height: '',
//     weight: '',
//     blood_pressure: '',
//     pulse_rate: '',
//     respiratory_rate: '',
//     temperature: '',
//     physical_examination: '',
//     main_complaint: '',
//     present_illness: '',
//     clinical_findings: '',
//     icd_code: '',
//     diagnosis: '',
//     treatment: '',
//   });
//   const [loading, setLoading] = useState(true);


//   useEffect(() => {
//     if (formData.note_type !== "Nurse") {
//       setFormData((prev) => ({
//         ...prev,
//         data: "",
//         action: "",
//         response: ""
//       }));
//     }
//   }, [formData.note_type]);


//   useEffect(() => {
//     const fetchPatient = async () => {
//       try {
//         if (id) {
//           const { data } = await patientDetailsAPI(id);
//           console.log(data)
//           setFormData({
//             has_philhealth: data.has_philhealth,
//             case_number: data.case_number || '',
//             hospital_case_number: data.hospital_case_number || '',
//             has_hmo: data.has_hmo,
//             hmo: data.hmo || '',
//             name: data.name,
//             status: data.status,
//             admission_date: isoToInputDateTime(data.admission_date),
//             current_condition: data.current_condition,
//             date_of_birth: data.date_of_birth?.split('T')[0] || '',
//             address: data.address || '',
//             occupation: data.occupation || '',
//             civil_status: data.civil_status || '',
//             nationality: data.nationality || '',
//             religion: data.religion || '',
//             attending_physician: data.attending_physician_id || '',
//             visit_type: data.visit_type || 'New',
//             consultation_datetime: isoToInputDateTime(data.consultation_datetime),
//             referred_by: data.referred_by || '',
//             next_consultation_date: isoToInputDateTime(data.next_consultation_date),
//             discharge_date: isoToInputDateTime(data.discharge_date),
//             phone: data.phone || '',
//             emergency_contact_name: data.emergency_contact_name || '',
//             emergency_contact_phone: data.emergency_contact_phone || '',
//             is_active: data.is_active,
//             notes: data.notes || '',
//             diagnosed_by: data.diagnosed_by_id || '',
//             height: data.height || '',
//             weight: data.weight || '',
//             blood_pressure: data.blood_pressure || '',
//             pulse_rate: data.pulse_rate || '',
//             respiratory_rate: data.respiratory_rate || '',
//             temperature: data.temperature || '',
//             physical_examination: data.physical_examination || '',
//             main_complaint: data.main_complaint || '',
//             present_illness: data.present_illness || '',
//             clinical_findings: data.clinical_findings || '',
//             icd_code: data.icd_code || '',
//             diagnosis: data.diagnosis || '',
//             treatment: data.treatment || '',
//           });

//           const imageResponse = await getPatientImagesAPI(id);
//           setExistingImages(imageResponse.data || []);
//         }
//       } catch (err) {
//         console.error('Failed to load patient data.', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPatient();
//   }, [id]);

//   const formatNumber = (value) => {
//     if (!value) return '';
//     const num = parseFloat(value);
//     return isNaN(num) ? '' : num.toFixed(2);
//   };


// const handleImageChange = (e) => {
//   const files = Array.from(e.target.files);
//   setSelectedImages(files);

//   const previews = files.map(file => ({
//     file,
//     preview: URL.createObjectURL(file)
//   }));
//   setImagePreviews(previews);
// };

//   //"""When you use URL.createObjectURL() to preview images, the browser creates a temporary reference to the file in memory. If you don’t clean this up, those references remain in memory even after the component unmounts"""
//   //-chatG
//   useEffect(() => {
//     return () => {
//       imagePreviews.forEach(preview => URL.revokeObjectURL(preview.preview));
//     };
//   }, [imagePreviews]);


//   const handleSelected = (filteredItem) => {
//     console.log(filteredItem.id)
//     setIsDropdownVisible(false)
//     // setSearchTerm(filteredItem.code)
//     setSearchTerm(String(filteredItem.id));
//     setFormData(prev => ({ ...prev, attending_physician: filteredItem.id }));

//   }
//   //handleSelectedDiagnosedBy
//   const handleSelectedDiagnosedBy = (filteredItem) => {
//     console.log(filteredItem.id)
//     setIsDropdownVisible(false)
//     // setSearchTerm(filteredItem.code)
//     setSearchTermDiagnosedBy(String(filteredItem.id));
//     setFormData(prev => ({ ...prev, diagnosed_by: filteredItem.id }));

//   }
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//       [name]: type === 'number' ? formatNumber(value) : value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let payload = { ...formData };

//     // Validate hospital_case_number
//     if (!payload.hospital_case_number) {
//       alert("Hospital Case Number is required.");
//       return;
//     }



//     // // Validate ICD code
//     // if (payload.icd_code && !isValidICDCode(payload.icd_code)) {
//     //   alert('Please enter a valid ICD-10 code (e.g., J45.9).');
//     //   return;
//     // }

//     // Format datetime fields
//     payload.admission_date = inputDateTimeToISO(payload.admission_date);
//     payload.discharge_date = inputDateTimeToISO(payload.discharge_date);
//     payload.consultation_datetime = inputDateTimeToISO(payload.consultation_datetime);
//     payload.next_consultation_date = inputDateTimeToISO(payload.next_consultation_date);

//     // Format numeric fields
//     const numericFields = ["height", "weight", "pulse_rate", "respiratory_rate", "temperature"];
//     numericFields.forEach((field) => {
//       payload[field] = formatNumber(payload[field]);
//     });

//     // Replace empty strings with null for nullable fields
//     ['admission_date', 'discharge_date', 'consultation_datetime', 'next_consultation_date']
//       .forEach(key => {
//         if (!payload[key]) payload[key] = null;
//       });


//     try {
//       let patientId;
//       if (id) {
//         await onSubmit(id, payload);
//         console.log(payload)
//         patientId = id;
//       } else {
//         const response = await onSubmit(payload);
//         patientId = response.data.id
//       }


//       //then upload images if any
//       if (selectedImages.length > 0 && patientId) {
//         const formData = new FormData();

//         // Append each file to FormData
//         selectedImages.forEach((file) => {
//           formData.append('file', file);
//         });

//         // Include patient ID
//         formData.append('patient', patientId);

//         // Upload images
//         await uploadPatientImageAPI(formData);

//         // Reset image selection
//         setSelectedImages([]);
//         setImagePreviews([]);
//         navigate('/patients');

//       }
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       alert('Failed to save patient or upload images');
//     }


//   };



//   //all renders use this, some file are image some files actual files,,,,,
//   function FilePreview({ url }) {
//     const isImage = /\.(jpe?g|png|gif|webp)$/i.test(url);

//     return (
//       <div className={styles.filePreviewContainer}>
//         {isImage ? (
//           <a href={`http://localhost:8000${url}`} target="_blank" rel="noopener noreferrer">
//             <img
//               src={`http://localhost:8000${url}`}
//               alt="Preview"
//               className={styles.filePreviewImage}
//             />
//           </a>

//         ) : (
//           <a
//             href={`http://localhost:8000${url}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className={styles.fileLink}
//           >
//             {url.split("/").pop()}
//           </a>
//         )}
//       </div>
//     );
//   }

//   if (loading) return <div>Loading…</div>;

//   return (
//     <div className={styles.patientManagement}>
//       <h1>{id ? 'EXISTING PATIENT DETAILS' : 'ADD NEW PATIENT'}</h1>
//       <h1>IN PATIENT FORM</h1>
//       <form onSubmit={handleSubmit} className={styles.patientForm}>
//         {/* Insurance & Case Info */}
//         <label className={styles.label}>
//           PhilHealth?
//           <input
//             type="checkbox"
//             name="has_philhealth"
//             checked={formData.has_philhealth}
//             onChange={handleChange}
//           />
//         </label>
//         <label className={styles.label}>
//           Case Number
//           <input
//             type="text"
//             name="case_number"
//             value={formData.case_number}
//             onChange={handleChange}
//           />
//         </label>
//         <label className={styles.label}>
//           HMO?
//           <input
//             type="checkbox"
//             name="has_hmo"
//             checked={formData.has_hmo}
//             onChange={handleChange}
//           />
//         </label>
//         <label className={styles.label}>
//           HMO Name
//           <input
//             type="text"
//             name="hmo"
//             value={formData.hmo}
//             onChange={handleChange}
//           />
//         </label>
//         <label className={styles.label}>
//           Hospital Case Number
//           <input
//             type="text"
//             name="hospital_case_number"
//             value={formData.hospital_case_number}
//             onChange={handleChange}
//             required
//           />
//         </label>

//         {/* Personal & Admission */}
//         <label className={styles.label}>
//           Name
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//         </label>
//         <label className={styles.label}>
//           Status
//           <select name="status" value={formData.status} onChange={handleChange}>
//             <option>Admitted</option>
//             <option>Discharged</option>
//             <option>Outpatient</option>
//           </select>
//         </label>
//         <label className={styles.label}>
//           Admission Date
//           <input
//             type="datetime-local"
//             name="admission_date"
//             value={formData.admission_date}
//             onChange={handleChange}
//           />
//         </label>
//         <label className={styles.label}>
//           Current Condition
//           <textarea
//             name="current_condition"
//             value={formData.current_condition}
//             onChange={handleChange}
//             required
//           />
//         </label>

//         {/* Demographics */}
//         <label className={styles.label}>
//           Date of Birth
//           <input
//             type="date"
//             name="date_of_birth"
//             value={formData.date_of_birth}
//             onChange={handleChange}
//           />
//         </label>
//         <label className={styles.label}>
//           Address
//           <input
//             type="text"
//             name="address"
//             value={formData.address}
//             onChange={handleChange}
//           />
//         </label>
//         <label className={styles.label}>
//           Occupation
//           <input
//             type="text"
//             name="occupation"
//             value={formData.occupation}
//             onChange={handleChange}
//           />
//         </label>
//         <label className={styles.label}>
//           Civil Status
//           <select
//             name="civil_status"
//             value={formData.civil_status}
//             onChange={handleChange}
//           >
//             <option value="">–</option>
//             <option>Single</option>
//             <option>Married</option>
//             <option>Widowed</option>
//             <option>Divorced</option>
//             <option>Separated</option>
//           </select>
//         </label>
//         <label className={styles.label}>
//           Nationality
//           <input
//             type="text"
//             name="nationality"
//             value={formData.nationality}
//             onChange={handleChange}
//           />
//         </label>
//         <label className={styles.label}>
//           Religion
//           <input
//             type="text"
//             name="religion"
//             value={formData.religion}
//             onChange={handleChange}
//           />
//         </label>

//         {/* Consultation */}
//         <label className={styles.label}>
//           Attending Physician ID
//           {/* <input
//             type="text"
//             name="attending_physician_id"
//             value={formData.attending_physician_id}
//             onChange={handleChange}
//           /> */}
//           <SearchBar
//             // data={dummyBillingData}
//             placeholder={"IDKsss"}
//             searchApi={SearchHospitalUserApi}
//             // accept the argument passed by the SearchBar component (item) when onSelectSuggestion is invoked
//             //to accept *-*
//             onSelectSuggestion={(filtered) => handleSelected(filtered)}
//             suggestedOutput={['user_id', 'last_name', 'first_name']}
//             searchTerm={searchTerm}
//             setSearchTerm={setSearchTerm}
//             isDropdownVisible={isDropdownVisible}
//             setIsDropdownVisible={setIsDropdownVisible}
//             maxDropdownHeight="500px"

//           />
//         </label>
//         <label className={styles.label}>
//           Visit Type
//           <select
//             name="visit_type"
//             value={formData.visit_type}
//             onChange={handleChange}
//           >
//             <option>New</option>
//             <option>Follow-up</option>
//           </select>
//         </label>
//         <label className={styles.label}>
//           Consultation Date
//           <input
//             type="datetime-local"
//             name="consultation_datetime"
//             value={formData.consultation_datetime}
//             onChange={handleChange}
//           />
//         </label>
//         <label className={styles.label}>
//           Referred By
//           <input
//             type="text"
//             name="referred_by"
//             value={formData.referred_by}
//             onChange={handleChange}
//           />
//         </label>
//         <label className={styles.label}>
//           Next Consultation
//           <input
//             type="datetime-local"
//             name="next_consultation_date"
//             value={formData.next_consultation_date}
//             onChange={handleChange}
//           />
//         </label>

//         {/* Discharge & Contacts */}
//         <label className={styles.label}>
//           Discharge Date
//           <input
//             type="datetime-local"
//             name="discharge_date"
//             value={formData.discharge_date}
//             onChange={handleChange}
//           />
//         </label>
//         <label className={styles.label}>
//           Phone
//           <input
//             type="text"
//             name="phone"
//             value={formData.phone}
//             onChange={handleChange}
//           />
//         </label>
//         <label className={styles.label}>
//           Emergency Contact Name
//           <input
//             type="text"
//             name="emergency_contact_name"
//             value={formData.emergency_contact_name}
//             onChange={handleChange}
//           />
//         </label>
//         <label className={styles.label}>
//           Emergency Contact Phone
//           <input
//             type="text"
//             name="emergency_contact_phone"
//             value={formData.emergency_contact_phone}
//             onChange={handleChange}
//           />
//         </label>
//         <label className={styles.label}>
//           Is Active
//           <select name="is_active" value={formData.is_active} onChange={handleChange}>
//             <option>Active</option>
//             <option>Inactive</option>
//             <option>Deleted</option>
//           </select>
//         </label>

//         {/* Medical Details */}
//         <label className={styles.label}>
//           Notes
//           <textarea
//             name="notes"
//             value={formData.notes}
//             onChange={handleChange}
//           />
//         </label>
//         <label className={styles.label}>
//           Diagnosed By ID
//           <SearchBar
//             // data={dummyBillingData}
//             placeholder={"IDKsss"}
//             searchApi={SearchHospitalUserApi}
//             // accept the argument passed by the SearchBar component (item) when onSelectSuggestion is invoked
//             //to accept *-*
//             onSelectSuggestion={(filtered) => handleSelectedDiagnosedBy(filtered)}
//             suggestedOutput={['user_id', 'last_name', 'first_name']}
//             searchTerm={searchTermDiagnosedBy}
//             setSearchTerm={setSearchTermDiagnosedBy}
//             isDropdownVisible={isDropdownVisible}
//             setIsDropdownVisible={setIsDropdownVisible}
//             maxDropdownHeight="500px"

//           />
//         </label>
//         <label className={styles.label}>
//           Height
//           <input
//             type="number"
//             step="0.01"
//             name="height"
//             value={formData.height}
//             onChange={handleChange}
//           />
//         </label>
//         <label className={styles.label}>
//           Weight
//           <input
//             type="number"
//             step="0.01"
//             name="weight"
//             value={formData.weight}
//             onChange={handleChange}
//           />
//         </label>
//         <label className={styles.label}>
//           Blood Pressure
//           <input
//             type="text"
//             name="blood_pressure"
//             value={formData.blood_pressure}
//             onChange={handleChange}
//             placeholder="input 120/80"
//           />
//         </label>
//         <label className={styles.label}>
//           Pulse Rate
//           <input
//             type="number"
//             step="0.01"
//             name="pulse_rate"
//             value={formData.pulse_rate}
//             onChange={handleChange}
//           />
//         </label>
//         <label className={styles.label}>
//           Respiratory Rate
//           <input
//             type="number"
//             step="0.01"
//             name="respiratory_rate"
//             value={formData.respiratory_rate}
//             onChange={handleChange}
//           />
//         </label>
//         <label className={styles.label}>
//           Temperature
//           <input
//             type="number"
//             step="0.01"
//             name="temperature"
//             value={formData.temperature}
//             onChange={handleChange}
//           />
//         </label>
//         <label className={styles.label}>
//           Physical Examination
//           <textarea
//             name="physical_examination"
//             value={formData.physical_examination}
//             onChange={handleChange}
//           />
//         </label>
//         <label className={styles.label}>
//           Main Complaint
//           <textarea
//             name="main_complaint"
//             value={formData.main_complaint}
//             onChange={handleChange}
//           />
//         </label>
//         <label className={styles.label}>
//           Present Illness
//           <textarea
//             name="present_illness"
//             value={formData.present_illness}
//             onChange={handleChange}
//           />
//         </label>
//         <label className={styles.label}>
//           Clinical Findings
//           <textarea
//             name="clinical_findings"
//             value={formData.clinical_findings}
//             onChange={handleChange}
//           />
//         </label>
//         <label className={styles.label}>
//           ICD Code
//           <input
//             type="text"
//             name="icd_code"
//             value={formData.icd_code}
//             onChange={handleChange}
//           />
//         </label>
//         <label className={styles.label}>
//           Diagnosis
//           <textarea
//             name="diagnosis"
//             value={formData.diagnosis}
//             onChange={handleChange}
//           />
//         </label>
//         <label className={styles.label}>
//           Treatment
//           <textarea
//             name="treatment"
//             value={formData.treatment}
//             onChange={handleChange}
//           />
//         </label>





// {/* Image Upload Section */}
// <div className={styles.imageUploadSection}>
//   <label className={styles.label}>
//     Upload Patient Images
//     <input
//       type="file"
//       name="patientImages"
//       multiple
//       accept="image/*,.pdf"
//       onChange={handleImageChange}
//     />
//   </label>

//   {/* New Image Previews */}
//   {imagePreviews.length > 0 && (
//     <div className={styles.imagePreviewContainer}>
//       <h3>New Images to Upload:</h3>
//       <div className={styles.imagePreviewGrid}>
//         {imagePreviews.map((preview, index) => (
//           <div key={index} className={styles.imagePreview}>
//             {preview.file.type.startsWith('image/') ? (
//               <img src={preview.preview} alt={`Preview ${index}`} />
//             ) : (
//               <div className={styles.fileIcon}>
//                 {preview.file.name.split('.').pop().toUpperCase()} File
//               </div>
//             )}
//             <p>{preview.file.name}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   )}

//   {/* Existing Images (Edit Mode Only) */}
//   {id && existingImages.length > 0 && (
//     <div
//       className={styles.firstImageContainer}
//       onClick={() => setModalOpen(true)}
//     >
//       <img
//         src={
//           existingImages[0].file.startsWith('http')
//             ? existingImages[0].file
//             : `http://localhost:8000${existingImages[0].file}`
//         }
//         alt="Patient"
//         className={styles.firstImage}
//       />
//       <div className={styles.viewAllIconContainer}>
//         VIEW
//       </div>
//     </div>
//   )}
// </div>

// {/* Modal for all images */}
// {modalOpen && (
//   <div className={styles.modalOverlay} onClick={() => setModalOpen(false)}>
//     <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
//       <button
//         className={styles.closeButton}
//         onClick={() => setModalOpen(false)}
//       >
//         ×
//       </button>
//       <div className={styles.imageGrid}>
//         {existingImages.map(img => (
//           <img
//             key={img.id}
//             src={
//               img.file.startsWith('http')
//                 ? img.file
//                 : `http://localhost:8000${img.file}`
//             }
//             alt="Patient"
//             className={styles.gridImage}
//           />
//         ))}
//       </div>
//     </div>
//   </div>
// )}



//         <button type="submit" className={styles.submitButton}>
//           {id ? 'Save Changes' : 'Add Patient'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default InPatientForm;














import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  patientDetailsAPI,
  getPatientImagesAPI,
  SearchBillingsApi,
  SearchHospitalUserApi,
  uploadPatientImageAPI,
} from "../../api/axios";
import SearchBar from "../AngAtingSeachBarWIthDropDown";
import styles from "./BothPatientForm.module.css";

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
//     "id": 4,
//     "has_philhealth": true,
//     "case_number": "CN-20250617-001",
//     "hospital_case_number": "HCN-20250617-001",
//     "has_hmo": true,
//     "hmo": "Acme Health Plan",
//     "code": "K8XA4",
//     "name": "Juan Dela Cruz",
//     "status": "Admitted",
//     "admission_date": "2025-06-17T09:30:00Z",
//     "current_condition": "Stable but requires monitoring for possible complications.",
//     "date_of_birth": "1985-04-23",
//     "address": "123 Mabini St., Manila, Philippines",
//     "occupation": "Software Engineer",
//     "civil_status": "Married",
//     "nationality": "Filipino",
//     "religion": "Roman Catholic",
//     "visit_type": "New",
//     "consultation_datetime": "2025-06-17T10:15:00Z",
//     "referred_by": "Dr. Santos",
//     "next_consultation_date": "2025-06-24T10:00:00Z",
//     "discharge_date": null,
//     "phone": "+639171234567",
//     "emergency_contact_name": "Maria Cruz",
//     "emergency_contact_phone": "+639189876543",
//     "is_active": "Active",
//     "entry_date": "2025-06-17T09:36:39.131806Z",
//     "notes": "Patient allergic to penicillin. Family history of hypertension.",
//     "height": "170.00",
//     "weight": "68.50",
//     "blood_pressure": "120/80",
//     "pulse_rate": "72.00",
//     "respiratory_rate": "16.00",
//     "temperature": "36.80",
//     "physical_examination": "Lungs clear, heart sounds normal.",
//     "main_complaint": "Shortness of breath on exertion.",
//     "present_illness": "Developed mild dyspnea over the past 2 days.",
//     "clinical_findings": "No cyanosis, no chest pain.",
//     "icd_code": "J45.9",
//     "diagnosis": "Mild asthma exacerbation",
//     "treatment": "Nebulized salbutamol every 4 hours; continue maintenance inhaler.",
//     "attending_physician": 1,
//     "diagnosed_by": 1
// }

const InPatientForm = ({ onSubmit }) => {
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
  const navigate = useNavigate();

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
      let patientId;
      if (id) {
        console.log(payload)
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
        navigate("/patients");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to save patient or upload images");
    }
  };

  //all renders use this, some file are image some files actual files,,,,,
  function FilePreview({ url }) {
    const isImage = /\.(jpe?g|png|gif|webp)$/i.test(url);

    return (
      <div className={styles.filePreviewContainer}>
        {isImage ? (
          <a
            href={`http://localhost:8000${url}`}
            target="_blank"
            rel="noopener noreferrer"
          >
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
                        : `http://localhost:8000${existingImages[0].file}`
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
                            : `http://localhost:8000${img.file}`
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
                <label className={styles.formLabel}>Case Number</label>
                <input
                  type="text"
                  name="case_number"
                  value={formData.case_number}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Hospital Case Number</label>
                <input
                  type="text"
                  name="hospital_case_number"
                  value={formData.hospital_case_number}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
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
                  className={styles.formInput}
                  required
                />
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
                  required
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
                  className={styles.formInput}
                />
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
                <label className={styles.formLabel}>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  step={1}
                  min={0}
                  max={200}
                />
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
                    value="single"
                    checked={formData.civil_status === "Single"}
                    onChange={handleInputChange}
                  />
                  Single
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="civil_status"
                    value="married"
                    checked={formData.civil_status === "Married"}
                    onChange={handleInputChange}
                  />
                  Married
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="civil_status"
                    value="widow"
                    checked={formData.civil_status === "Widowed"}
                    onChange={handleInputChange}
                  />
                  Widow
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="civil_status"
                    value="divorced"
                    checked={formData.civil_status === "Divorced"}
                    onChange={handleInputChange}
                  />
                  Divorced
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="civil_status"
                    value="separated"
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
                    value="discharged"
                    checked={formData.status === "discharged"}
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

  // return (
  //   <div className={styles.patientManagement}>
  //     <h1>{id ? "EXISTING PATIENT DETAILS" : "ADD NEW PATIENT"}</h1>
  //     <h1>IN PATIENT FORM</h1>
  //     <form onSubmit={handleSubmit} className={styles.patientForm}>
  //       {/* Insurance & Case Info */}
  //       <label className={styles.label}>
  //         PhilHealth?
  //         <input
  //           type="checkbox"
  //           name="has_philhealth"
  //           checked={formData.has_philhealth}
  //           onChange={handleChange}
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         Case Number
  //         <input
  //           type="text"
  //           name="case_number"
  //           value={formData.case_number}
  //           onChange={handleChange}
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         HMO?
  //         <input
  //           type="checkbox"
  //           name="has_hmo"
  //           checked={formData.has_hmo}
  //           onChange={handleChange}
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         HMO Name
  //         <input
  //           type="text"
  //           name="hmo"
  //           value={formData.hmo}
  //           onChange={handleChange}
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         Hospital Case Number
  //         <input
  //           type="text"
  //           name="hospital_case_number"
  //           value={formData.hospital_case_number}
  //           onChange={handleChange}
  //           required
  //         />
  //       </label>

  //       {/* Personal & Admission */}
  //       <label className={styles.label}>
  //         Name
  //         <input
  //           type="text"
  //           name="name"
  //           value={formData.name}
  //           onChange={handleChange}
  //           required
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         Status
  //         <select name="status" value={formData.status} onChange={handleChange}>
  //           <option>Admitted</option>
  //           <option>Discharged</option>
  //           <option>Outpatient</option>
  //         </select>
  //       </label>
  //       <label className={styles.label}>
  //         Admission Date
  //         <input
  //           type="datetime-local"
  //           name="admission_date"
  //           value={formData.admission_date}
  //           onChange={handleChange}
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         Current Condition
  //         <textarea
  //           name="current_condition"
  //           value={formData.current_condition}
  //           onChange={handleChange}
  //           required
  //         />
  //       </label>

  //       {/* Demographics */}
  //       <label className={styles.label}>
  //         Date of Birth
  //         <input
  //           type="date"
  //           name="date_of_birth"
  //           value={formData.date_of_birth}
  //           onChange={handleChange}
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         Address
  //         <input
  //           type="text"
  //           name="address"
  //           value={formData.address}
  //           onChange={handleChange}
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         Occupation
  //         <input
  //           type="text"
  //           name="occupation"
  //           value={formData.occupation}
  //           onChange={handleChange}
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         Civil Status
  //         <select
  //           name="civil_status"
  //           value={formData.civil_status}
  //           onChange={handleChange}
  //         >
  //           <option value="">–</option>
  //           <option>Single</option>
  //           <option>Married</option>
  //           <option>Widowed</option>
  //           <option>Divorced</option>
  //           <option>Separated</option>
  //         </select>
  //       </label>
  //       <label className={styles.label}>
  //         Nationality
  //         <input
  //           type="text"
  //           name="nationality"
  //           value={formData.nationality}
  //           onChange={handleChange}
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         Religion
  //         <input
  //           type="text"
  //           name="religion"
  //           value={formData.religion}
  //           onChange={handleChange}
  //         />
  //       </label>

  //       {/* Consultation */}
  //       <label className={styles.label}>
  //         Attending Physician ID
  //         {/* <input
  //           type="text"
  //           name="attending_physician_id"
  //           value={formData.attending_physician_id}
  //           onChange={handleChange}
  //         /> */}
  //         <SearchBar
  //           // data={dummyBillingData}
  //           placeholder={"IDKsss"}
  //           searchApi={SearchHospitalUserApi}
  //           // accept the argument passed by the SearchBar component (item) when onSelectSuggestion is invoked
  //           //to accept *-*
  //           onSelectSuggestion={(filtered) => handleSelected(filtered)}
  //           suggestedOutput={["user_id", "last_name", "first_name"]}
  //           searchTerm={searchTerm}
  //           setSearchTerm={setSearchTerm}
  //           isDropdownVisible={isDropdownVisible}
  //           setIsDropdownVisible={setIsDropdownVisible}
  //           maxDropdownHeight="500px"
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         Visit Type
  //         <select
  //           name="visit_type"
  //           value={formData.visit_type}
  //           onChange={handleChange}
  //         >
  //           <option>New</option>
  //           <option>Follow-up</option>
  //         </select>
  //       </label>
  //       <label className={styles.label}>
  //         Consultation Date
  //         <input
  //           type="datetime-local"
  //           name="consultation_datetime"
  //           value={formData.consultation_datetime}
  //           onChange={handleChange}
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         Referred By
  //         <input
  //           type="text"
  //           name="referred_by"
  //           value={formData.referred_by}
  //           onChange={handleChange}
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         Next Consultation
  //         <input
  //           type="datetime-local"
  //           name="next_consultation_date"
  //           value={formData.next_consultation_date}
  //           onChange={handleChange}
  //         />
  //       </label>

  //       {/* Discharge & Contacts */}
  //       <label className={styles.label}>
  //         Discharge Date
  //         <input
  //           type="datetime-local"
  //           name="discharge_date"
  //           value={formData.discharge_date}
  //           onChange={handleChange}
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         Phone
  //         <input
  //           type="text"
  //           name="phone"
  //           value={formData.phone}
  //           onChange={handleChange}
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         Emergency Contact Name
  //         <input
  //           type="text"
  //           name="emergency_contact_name"
  //           value={formData.emergency_contact_name}
  //           onChange={handleChange}
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         Emergency Contact Phone
  //         <input
  //           type="text"
  //           name="emergency_contact_phone"
  //           value={formData.emergency_contact_phone}
  //           onChange={handleChange}
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         Is Active
  //         <select
  //           name="is_active"
  //           value={formData.is_active}
  //           onChange={handleChange}
  //         >
  //           <option>Active</option>
  //           <option>Inactive</option>
  //           <option>Deleted</option>
  //         </select>
  //       </label>

  //       {/* Medical Details */}
  //       <label className={styles.label}>
  //         Notes
  //         <textarea
  //           name="notes"
  //           value={formData.notes}
  //           onChange={handleChange}
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         Diagnosed By ID
  //         <SearchBar
  //           // data={dummyBillingData}
  //           placeholder={"IDKsss"}
  //           searchApi={SearchHospitalUserApi}
  //           // accept the argument passed by the SearchBar component (item) when onSelectSuggestion is invoked
  //           //to accept *-*
  //           onSelectSuggestion={(filtered) =>
  //             handleSelectedDiagnosedBy(filtered)
  //           }
  //           suggestedOutput={["user_id", "last_name", "first_name"]}
  //           searchTerm={searchTermDiagnosedBy}
  //           setSearchTerm={setSearchTermDiagnosedBy}
  //           isDropdownVisible={isDropdownVisible}
  //           setIsDropdownVisible={setIsDropdownVisible}
  //           maxDropdownHeight="500px"
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         Height
  //         <input
  //           type="number"
  //           step="0.01"
  //           name="height"
  //           value={formData.height}
  //           onChange={handleChange}
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         Weight
  //         <input
  //           type="number"
  //           step="0.01"
  //           name="weight"
  //           value={formData.weight}
  //           onChange={handleChange}
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         Blood Pressure
  //         <input
  //           type="text"
  //           name="blood_pressure"
  //           value={formData.blood_pressure}
  //           onChange={handleChange}
  //           placeholder="input 120/80"
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         Pulse Rate
  //         <input
  //           type="number"
  //           step="0.01"
  //           name="pulse_rate"
  //           value={formData.pulse_rate}
  //           onChange={handleChange}
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         Respiratory Rate
  //         <input
  //           type="number"
  //           step="0.01"
  //           name="respiratory_rate"
  //           value={formData.respiratory_rate}
  //           onChange={handleChange}
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         Temperature
  //         <input
  //           type="number"
  //           step="0.01"
  //           name="temperature"
  //           value={formData.temperature}
  //           onChange={handleChange}
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         Physical Examination
  //         <textarea
  //           name="physical_examination"
  //           value={formData.physical_examination}
  //           onChange={handleChange}
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         Main Complaint
  //         <textarea
  //           name="main_complaint"
  //           value={formData.main_complaint}
  //           onChange={handleChange}
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         Present Illness
  //         <textarea
  //           name="present_illness"
  //           value={formData.present_illness}
  //           onChange={handleChange}
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         Clinical Findings
  //         <textarea
  //           name="clinical_findings"
  //           value={formData.clinical_findings}
  //           onChange={handleChange}
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         ICD Code
  //         <input
  //           type="text"
  //           name="icd_code"
  //           value={formData.icd_code}
  //           onChange={handleChange}
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         Diagnosis
  //         <textarea
  //           name="diagnosis"
  //           value={formData.diagnosis}
  //           onChange={handleChange}
  //         />
  //       </label>
  //       <label className={styles.label}>
  //         Treatment
  //         <textarea
  //           name="treatment"
  //           value={formData.treatment}
  //           onChange={handleChange}
  //         />
  //       </label>

  {
    /* Image Upload Section */
  }
  {
    /* <div className={styles.imageUploadSection}>
          <label className={styles.label}>
            Upload Patient Images
            <input
              type="file"
              name="patientImages"
              multiple
              accept="image/*,.pdf"
              onChange={handleImageChange}
            />
          </label> */
  }

  {
    /* New Image Previews */
  }
  {
    /* {imagePreviews.length > 0 && (
            <div className={styles.imagePreviewContainer}>
              <h3>New Images to Upload:</h3>
              <div className={styles.imagePreviewGrid}>
                {imagePreviews.map((preview, index) => (
                  <div key={index} className={styles.imagePreview}>
                    {preview.file.type.startsWith("image/") ? (
                      <img src={preview.preview} alt={`Preview ${index}`} />
                    ) : (
                      <div className={styles.fileIcon}>
                        {preview.file.name.split(".").pop().toUpperCase()} File
                      </div>
                    )}
                    <p>{preview.file.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )} */
  }

  {
    /* Existing Images (Edit Mode Only) */
  }
  {
    /* {id && existingImages.length > 0 && (
            <div
              className={styles.firstImageContainer}
              onClick={() => setModalOpen(true)}
            >
              <img
                src={
                  existingImages[0].file.startsWith("http")
                    ? existingImages[0].file
                    : `http://localhost:8000${existingImages[0].file}`
                }
                alt="Patient"
                className={styles.firstImage}
              />
              <div className={styles.viewAllIconContainer}>VIEW</div>
            </div>
          )}
        </div> */
  }

  {
    /* Modal for all images */
  }
  {
    /* {modalOpen && (
          <div
            className={styles.modalOverlay}
            onClick={() => setModalOpen(false)}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.closeButton}
                onClick={() => setModalOpen(false)}
              >
                ×
              </button>
              <div className={styles.imageGrid}>
                {existingImages.map((img) => (
                  <img
                    key={img.id}
                    src={
                      img.file.startsWith("http")
                        ? img.file
                        : `http://localhost:8000${img.file}`
                    }
                    alt="Patient"
                    className={styles.gridImage}
                  />
                ))}
              </div>
            </div>
          </div>
        )} */
  }

  //       <button type="submit" className={styles.submitButton}>
  //         {id ? "Save Changes" : "Add Patient"}
  //       </button>
  //     </form>
  //   </div>
  // );
};

export default InPatientForm;

