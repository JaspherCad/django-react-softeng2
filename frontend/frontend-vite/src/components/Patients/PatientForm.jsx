import React, { useEffect, useState } from 'react';
import styles from './Patients.module.css';
import { useParams } from 'react-router-dom';
import { patientDetailsAPI, SearchBillingsApi, SearchHospitalUserApi } from '../../api/axios';
import SearchBar from '../AngAtingSeachBarWIthDropDown';

const formatDateToLocal = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};


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

const PatientForm = ({ onSubmit }) => { //onSubmit yung function pano sinend sa backend.
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState(''); //required for SearchBar
  const [searchTermDiagnosedBy, setSearchTermDiagnosedBy] = useState(''); //required for SearchBar

  const [isDropdownVisible, setIsDropdownVisible] = useState(false)  //required for SearchBar

  const [formData, setFormData] = useState({
    has_philhealth: false,
    case_number: '',
    hospital_case_number: '',
    has_hmo: false,
    hmo: '',
    name: '',
    status: 'Admitted',
    admission_date: '',
    current_condition: '',
    date_of_birth: '',
    address: '',
    occupation: '',
    civil_status: '',
    nationality: '',
    religion: '',
    attending_physician_id: '',
    visit_type: 'New',
    consultation_datetime: '',
    referred_by: '',
    next_consultation_date: '',
    discharge_date: '',
    phone: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    is_active: 'Active',
    // entry_date is auto, code is auto
    notes: '',
    diagnosed_by_id: '',
    height: '',
    weight: '',
    blood_pressure: '',
    pulse_rate: '',
    respiratory_rate: '',
    temperature: '',
    physical_examination: '',
    main_complaint: '',
    present_illness: '',
    clinical_findings: '',
    icd_code: '',
    diagnosis: '',
    treatment: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        if (id) {
          const { data } = await patientDetailsAPI(id);
          setFormData({
            has_philhealth: data.has_philhealth,
            case_number: data.case_number || '',
            hospital_case_number: data.hospital_case_number || '',
            has_hmo: data.has_hmo,
            hmo: data.hmo || '',
            name: data.name,
            status: data.status,
            admission_date: formatDateToLocal(data.admission_date),
            current_condition: data.current_condition,
            date_of_birth: data.date_of_birth?.split('T')[0] || '',
            address: data.address || '',
            occupation: data.occupation || '',
            civil_status: data.civil_status || '',
            nationality: data.nationality || '',
            religion: data.religion || '',
            attending_physician_id: data.attending_physician_id || '',
            visit_type: data.visit_type || 'New',
            consultation_datetime: formatDateToLocal(data.consultation_datetime),
            referred_by: data.referred_by || '',
            next_consultation_date: formatDateToLocal(data.next_consultation_date),
            discharge_date: formatDateToLocal(data.discharge_date),
            phone: data.phone || '',
            emergency_contact_name: data.emergency_contact_name || '',
            emergency_contact_phone: data.emergency_contact_phone || '',
            is_active: data.is_active,
            notes: data.notes || '',
            diagnosed_by_id: data.diagnosed_by_id || '',
            height: data.height || '',
            weight: data.weight || '',
            blood_pressure: data.blood_pressure || '',
            pulse_rate: data.pulse_rate || '',
            respiratory_rate: data.respiratory_rate || '',
            temperature: data.temperature || '',
            physical_examination: data.physical_examination || '',
            main_complaint: data.main_complaint || '',
            present_illness: data.present_illness || '',
            clinical_findings: data.clinical_findings || '',
            icd_code: data.icd_code || '',
            diagnosis: data.diagnosis || '',
            treatment: data.treatment || '',
          });
        }
      } catch (err) {
        console.error('Failed to load patient data.', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [id]);

  const handleSelected = (filteredItem) => {
    console.log(filteredItem.id)
    setIsDropdownVisible(false)
    // setSearchTerm(filteredItem.code)
    setSearchTerm(String(filteredItem.id));   
    setFormData(prev => ({ ...prev, attending_physician_id: item.id }));

  }
  //handleSelectedDiagnosedBy
  const handleSelectedDiagnosedBy = (filteredItem) => {
    console.log(filteredItem.id)
    setIsDropdownVisible(false)
    // setSearchTerm(filteredItem.code)
    setSearchTermDiagnosedBy(String(filteredItem.id));   
    setFormData(prev => ({ ...prev, diagnosed_by_id: item.id }));

  }
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(id, formData);
  };

  if (loading) return <div>Loading…</div>;

  return (
    <div className={styles.patientManagement}>
      <h1>{id ? 'EDIT PATIENT DETAILS' : 'ADD NEW PATIENT'}</h1>
      <form onSubmit={handleSubmit} className={styles.patientForm}>
        {/* Insurance & Case Info */}
        <label className={styles.label}>
          PhilHealth?
          <input
            type="checkbox"
            name="has_philhealth"
            checked={formData.has_philhealth}
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          Case Number
          <input
            type="text"
            name="case_number"
            value={formData.case_number}
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          HMO?
          <input
            type="checkbox"
            name="has_hmo"
            checked={formData.has_hmo}
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          HMO Name
          <input
            type="text"
            name="hmo"
            value={formData.hmo}
            onChange={handleChange}
          />
        </label>

        {/* Personal & Admission */}
        <label className={styles.label}>
          Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label className={styles.label}>
          Status
          <select name="status" value={formData.status} onChange={handleChange}>
            <option>Admitted</option>
            <option>Discharged</option>
            <option>Outpatient</option>
          </select>
        </label>
        <label className={styles.label}>
          Admission Date
          <input
            type="datetime-local"
            name="admission_date"
            value={formData.admission_date}
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          Current Condition
          <textarea
            name="current_condition"
            value={formData.current_condition}
            onChange={handleChange}
            required
          />
        </label>

        {/* Demographics */}
        <label className={styles.label}>
          Date of Birth
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          Address
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          Occupation
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          Civil Status
          <select
            name="civil_status"
            value={formData.civil_status}
            onChange={handleChange}
          >
            <option value="">–</option>
            <option>Single</option>
            <option>Married</option>
            <option>Widowed</option>
            <option>Divorced</option>
            <option>Separated</option>
          </select>
        </label>
        <label className={styles.label}>
          Nationality
          <input
            type="text"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          Religion
          <input
            type="text"
            name="religion"
            value={formData.religion}
            onChange={handleChange}
          />
        </label>

        {/* Consultation */}
        <label className={styles.label}>
          Attending Physician ID
          {/* <input
            type="text"
            name="attending_physician_id"
            value={formData.attending_physician_id}
            onChange={handleChange}
          /> */}
          <SearchBar
            // data={dummyBillingData}
            placeholder={"IDKsss"}
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
        </label>
        <label className={styles.label}>
          Visit Type
          <select
            name="visit_type"
            value={formData.visit_type}
            onChange={handleChange}
          >
            <option>New</option>
            <option>Follow-up</option>
          </select>
        </label>
        <label className={styles.label}>
          Consultation Date
          <input
            type="datetime-local"
            name="consultation_datetime"
            value={formData.consultation_datetime}
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          Referred By
          <input
            type="text"
            name="referred_by"
            value={formData.referred_by}
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          Next Consultation
          <input
            type="datetime-local"
            name="next_consultation_date"
            value={formData.next_consultation_date}
            onChange={handleChange}
          />
        </label>

        {/* Discharge & Contacts */}
        <label className={styles.label}>
          Discharge Date
          <input
            type="datetime-local"
            name="discharge_date"
            value={formData.discharge_date}
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          Phone
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          Emergency Contact Name
          <input
            type="text"
            name="emergency_contact_name"
            value={formData.emergency_contact_name}
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          Emergency Contact Phone
          <input
            type="text"
            name="emergency_contact_phone"
            value={formData.emergency_contact_phone}
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          Is Active
          <select name="is_active" value={formData.is_active} onChange={handleChange}>
            <option>Active</option>
            <option>Inactive</option>
            <option>Deleted</option>
          </select>
        </label>

        {/* Medical Details */}
        <label className={styles.label}>
          Notes
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          Diagnosed By ID
          <SearchBar
            // data={dummyBillingData}
            placeholder={"IDKsss"}
            searchApi={SearchHospitalUserApi}
            // accept the argument passed by the SearchBar component (item) when onSelectSuggestion is invoked
            //to accept *-*
            onSelectSuggestion={(filtered) => handleSelectedDiagnosedBy(filtered)}
            suggestedOutput={['user_id', 'last_name', 'first_name']}
            searchTerm={searchTermDiagnosedBy}
            setSearchTerm={setSearchTermDiagnosedBy}
            isDropdownVisible={isDropdownVisible}
            setIsDropdownVisible={setIsDropdownVisible}
            maxDropdownHeight="500px"

          />
        </label>
        <label className={styles.label}>
          Height
          <input
            type="number"
            step="0.01"
            name="height"
            value={formData.height}
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          Weight
          <input
            type="number"
            step="0.01"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          Blood Pressure
          <input
            type="text"
            name="blood_pressure"
            value={formData.blood_pressure}
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          Pulse Rate
          <input
            type="number"
            step="0.01"
            name="pulse_rate"
            value={formData.pulse_rate}
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          Respiratory Rate
          <input
            type="number"
            step="0.01"
            name="respiratory_rate"
            value={formData.respiratory_rate}
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          Temperature
          <input
            type="number"
            step="0.01"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          Physical Examination
          <textarea
            name="physical_examination"
            value={formData.physical_examination}
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          Main Complaint
          <textarea
            name="main_complaint"
            value={formData.main_complaint}
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          Present Illness
          <textarea
            name="present_illness"
            value={formData.present_illness}
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          Clinical Findings
          <textarea
            name="clinical_findings"
            value={formData.clinical_findings}
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          ICD Code
          <input
            type="text"
            name="icd_code"
            value={formData.icd_code}
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          Diagnosis
          <textarea
            name="diagnosis"
            value={formData.diagnosis}
            onChange={handleChange}
          />
        </label>
        <label className={styles.label}>
          Treatment
          <textarea
            name="treatment"
            value={formData.treatment}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className={styles.submitButton}>
          {id ? 'Save Changes' : 'Add Patient'}
        </button>
      </form>
    </div>
  );
};

export default PatientForm;

