import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import PatientList from './PatientList';
import PatientForm from './PatientForm';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const navigate = useNavigate();

  const handleAddPatient = (newPatient) => {
    setPatients([...patients, newPatient]);
    navigate('/patients'); // Navigate back to list view after adding
  };
//test comment
  return (
    <Routes>
      <Route index element={<PatientList patients={patients} />} />
      <Route path="add" element={<PatientForm onSubmit={handleAddPatient} />} />
    </Routes>
  );
};
//JASPHER BRANCH TEST
export default Patients; 