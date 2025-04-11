import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import PatientList from './PatientList';
import PatientForm from './PatientForm';
import { addPatientAPI, editPatientAPI, listOfPatientAPI } from '../../api/axios';

const Patients = () => {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null)
  const [loading, setLoading] = useState(true)
  //handles specific PATIENT.. was triggered on PatientList
  const [selectedPatient, setSelectedPatient] = useState(null);


  //FETCH (READ) the patient data
  const fetchPatient = async () =>{
    try{
      const response = await listOfPatientAPI();
      setPatients(response.data)
    }catch (error){
      console.error("Failed to fetch patients:", error);
      setErrorMsg(error)
    }finally{
      setLoading(false)
    }
  };
  useEffect(() => {
    fetchPatient()
  }, [])



  //POST patient data
  const handleAddPatient = async (newPatientData) =>{
    try{
      //call the api then recall fetch patient await
      const response = await addPatientAPI(newPatientData); 

      //fetch patient
      await fetchPatient()
      navigate('/patients');
    }catch(error){
      console.error(error)
    }

  }

  const handleEditPatient = async (id, updatedFOrmData) => {
    try{
      console.log(id)
      const response = await editPatientAPI(id, updatedFOrmData)
    //fetch patient
    await fetchPatient()
    navigate('/patients');
    }catch(error){
    console.error(error)
}

}



  //i need a function we can trigger which will do EDIT..
    //i can see... if we click a certain PATIENT (setActivePatient) on patientList we can trigger over there the EDIT functionality
      //1: PREFILL ALL THE FORMTEXT using the info of selectedPatient (onCLicked ok na to)
      //2: change some info
      //3: if clicked, handleEdit() send it as props to Route Index i believe
  
//test comment
  return (
    <Routes>
      <Route index element={<PatientList patients={patients } loading={loading } errorMsg={errorMsg} setSelectedPatient={setSelectedPatient} selectedPatient={selectedPatient}/>} />
      <Route path="add" element={<PatientForm onSubmit={handleAddPatient} loading={loading } errorMsg={errorMsg}/>} />
      {/* to avoid data staleness(being outdated) dont use selectedPatient, for consistency DO call another ApI */}
      <Route path="edit/:id" element={<PatientForm onSubmit={handleEditPatient} loading={loading } errorMsg={errorMsg}/>} />

    </Routes>
  );
};
export default Patients; 