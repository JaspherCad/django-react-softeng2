import React, { useEffect, useState } from 'react';
import styles from './Patients.module.css';
import { useParams } from 'react-router-dom';
import { patientDetailsAPI } from '../../api/axios';

const PatientForm = ({ onSubmit }) => {
  const { id } = useParams();
  


  //FOR UPDATING
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true)
  //call the api (latest user by id)
  //fill the form with formData



  useEffect(() => {
    const fetchPatient = async ()=> {
      try{
        //only do if has id
        if (id){
          const response = await patientDetailsAPI(id);
          console.log(response.data)
          setFormData(response.data)
        }else{
        //If no ID, initialize with default values for adding a new patient
          setFormData({
            name: '',
            date_of_birth: '',
            address: '',
            admission_date: '',
            discharge_date: '',
            status: 'Admitted',
            current_condition: '',
            phone: '',
            email: '',
            emergency_contact_name: '',
            emergency_contact_phone: '',
            is_active: 'Active'
          });
        }
        

      }catch(error){
        console.error('Failed to load patient data.');
      }finally{
        setLoading(false);
      }
    };
    fetchPatient()
  }, [id])




 

  const handleInputChange = (e) => {
    // const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [e.target.name]: e.target.value }));
    }
    

  const handleSubmit = (e) => {
    //toggles depending on url
    e.preventDefault();
    if (id){
      console.log(formData)
      onSubmit(id, formData);
    }else{
      onSubmit(formData);
    }
    // Reset form
    setFormData({
      name: '',
      date_of_birth: '',
      address: '',
      admission_date: '',
      discharge_date: '',
      status: 'Admitted',
      current_condition: '',
      phone: '',
      email: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      is_active: 'Active'
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.patientManagement}>
    
      <h1>{id ? "EDIT PATIENT DETAILS":"ADD NEW PATIENT"}</h1>
      <form onSubmit={handleSubmit} className={styles.patientForm}>
        <label>
          Name:
          <input type="text" name="name" value={formData?.name || ''} onChange={handleInputChange} required />
        </label>
        <label>
          Date of Birth:
          <input type="date" name="date_of_birth" value={formData?.date_of_birth || ''} onChange={handleInputChange} required />
        </label>
        <label>
          Address:
          <input type="text" name="address" value={formData?.address || ''} onChange={handleInputChange} required />
        </label>
        <label>
          Admission Date:
          <input type="date" name="admission_date" value={formData?.admission_date || ''} onChange={handleInputChange} required />
        </label>
        <label>
          Discharge Date:
          <input type="date" name="discharge_date" value={formData?.discharge_date || ''} onChange={handleInputChange} required />
        </label>
        <label>
          Current Condition:
          <input type="text" name="current_condition" value={formData?.current_condition || ''} onChange={handleInputChange} required />

        </label>
        <label>
          Phone:
          <input type="text" name="phone" value={formData?.phone || ''} onChange={handleInputChange} required />
        </label>
        <label>
          Email:
          <input type="email" name="email" value={formData?.email || ''} onChange={handleInputChange} required />
        </label>
        <label>
          Emergency Contact Name:
          <input type="text" name="emergency_contact_name" value={formData?.emergency_contact_name || ''} onChange={handleInputChange} required />
        </label>
        <label>
          Emergency Contact Phone:
          <input type="text" name="emergency_contact_phone" value={formData?.emergency_contact_phone || ''} onChange={handleInputChange} required />
        </label>
        {id ? 
        (<button type="submit">EDIT Patient</button>)
        :
        (<button type="submit">Add Patient</button>)}
        
      </form>
    </div>
  );
};

export default PatientForm; 