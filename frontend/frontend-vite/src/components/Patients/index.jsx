import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import PatientList from './PatientList';
import PatientForm from './PatientForm';
import { addPatientAPI, editPatientAPI, listOfPatientAPI } from '../../api/axios';
import OutPatientForm from './OutPatientForm';
import InPatientForm from './InPatientForm';
import PatientHistory from './PatientHistory';
import PatientHistoryCaseCode from './PatientHistoryCaseCode';




const PAGE_SIZE = 2;


const Patients = () => {
  const navigate = useNavigate();


  const [patients, setPatients] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null)
  const [loading, setLoading] = useState(true)
  //handles specific PATIENT.. was triggered on PatientList
  const [selectedPatient, setSelectedPatient] = useState(null);

  // PPAGINATION PROPS props
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [selectedMedicalHistory, setSelectedMedicalHistory] = useState();

  //FETCH (READ) the patient data
  const fetchPatient = async () => {
    try {
      setLoading(true);
      const response = await listOfPatientAPI(currentPage);

      setPatients(response.data.results || []);
      setTotalItems(response.data.count || 0);
      setTotalPages(Math.ceil(response.data.count / PAGE_SIZE));
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatient();
  }, [currentPage]);


  // //FUTURE
  //  //when search/filter changes
  // useEffect(() => {
  //   setCurrentPage(1);
  // }, [/* add filter/search dependencies here */]);



  //POST patient data
  const handleAddPatient = async (newPatientData) => {
    try {
      //call the api then recall fetch patient await
      console.log(newPatientData)
      const response = await addPatientAPI(newPatientData);

      //fetch patient
      await fetchPatient()
      return response
    } catch (error) {
      console.error('Error adding patient:', error)
      
      // Re-throw the error so the form component can handle it
      throw error;
    }

  }

  const handleEditPatient = async (id, updatedFOrmData) => {
    try {
      console.log(id)
      const response = await editPatientAPI(id, updatedFOrmData)
      //fetch patient
      await fetchPatient()
    } catch (error) {
      console.error('Error editing patient:', error)
      
      // Re-throw the error so the form component can handle it
      throw error;
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
      <Route index element={
        <PatientList
          patients={patients}
          loading={loading}
          errorMsg={errorMsg}
          setSelectedPatient={setSelectedPatient}
          selectedPatient={selectedPatient}
          // PPAGINATION PROPS props
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            PAGE_SIZE={PAGE_SIZE}

        />} />


      {/* SEPERATE THE TWO FORM AS PER REQUEST BY DESGINER idk */}
      <Route path="outpatient/add" element={<OutPatientForm onSubmit={handleAddPatient} loading={loading} errorMsg={errorMsg} />} />
      <Route path="inpatient/add" element={<InPatientForm onSubmit={handleAddPatient} loading={loading} errorMsg={errorMsg} />} />

      {/* to avoid data staleness(being outdated) dont use selectedPatient, for consistency DO call another ApI */}
      <Route path="outpatient/edit/:id" element={<OutPatientForm onSubmit={handleEditPatient} loading={loading} errorMsg={errorMsg} />} />
      <Route path="inpatient/edit/:id" element={<InPatientForm onSubmit={handleEditPatient} loading={loading} errorMsg={errorMsg} />} />
      <Route path="history/:id" element={<PatientHistory setSelectedMedicalHistory={setSelectedMedicalHistory}  />} />
      <Route path="history/:id/reports" element={<PatientHistory setSelectedMedicalHistory={setSelectedMedicalHistory}  />} />

      <Route path="history/:patientid/casecode/:caseCode/historyId/:historyid" element={<PatientHistoryCaseCode setSelectedMedicalHistory={setSelectedMedicalHistory}  />} />
      


    </Routes>
  );
};
export default Patients; 