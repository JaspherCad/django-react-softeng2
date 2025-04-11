import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import PatientList from './PatientList';
import PatientForm from './PatientForm';
import { listOfBillingsAPI } from '../../api/axios';

const Billing = () => {
  // State for services and billings
  const [services, setServices] = useState([]);
  const [listOfBillings, setListOfBillings] = useState([]);
  const [loading, setLoading] = useState(true); // To manage loading state
  const [error, setError] = useState(null); // To handle errors gracefully

  useEffect(() => {
    // Function to fetch API data
    const fetchData = async () => {
      try {
        const response = await listOfBillingsAPI();

        // Update states with the API response data
        setServices(response.data.services); // Assuming the API response includes "services"
        setListOfBillings(response.data.listOfBillings); // Assuming the API response includes "listOfBillings"
        setLoading(false); // Stop loading once the data is fetched
      } catch (error) {
        // Handle errors and set an error message
        setError("Unable to load data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData(); // Call the fetch function
  }, []); // Empty dependency array ensures this runs once on component mount


  return(

    <h1>BILLING</h1>
  )
};
export default Billing; 