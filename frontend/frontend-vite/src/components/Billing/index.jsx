import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import { getBillingByID, SearchBillingsApi, SearchBillingsApiExcludingDischarged } from '../../api/axios';
import SearchBar from '../AngAtingSeachBarWIthDropDown/index'
import styles from './Billing.module.css';
import BillingFormModal from './BillingFormModal';
// import AddBillingModal from './AddBillingModal';
import AddBillingModalV2 from './AddBillingModalV2.jsx';
import BillingItems from './BillingItems.jsx';
import BillingItemsOfThatBill from './BillingItems.jsx';
import TransactionsList from './TransactionsList.jsx';
import PatientBillings from './PatientBillings.jsx';
const Billing = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true); // To manage loading state
  const [error, setError] = useState(null); // To handle errors gracefully
  const [selectedItem, setSelectedItem] = useState()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddBillingModalOpen, setIsAddBillingModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); //required for SearchBar
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)  //required for SearchBar


  //for patients fetch
  const [patients, setPatients] = useState([]);
  const [billings, setBillings] = useState([]);//billings of patient
  const [listOfBillings, setListOfBillings] = useState([]); // billing lists inside billing class

  const navigate = useNavigate();


  //pseudo
  //call api
  //copy the item name from dummy data to actual data for example
  //in backend we have 'name' instead of 'patient_id' so patient_id:data.name ????
  // { SAMPLE BACKEND DATA
  //     "id": 1,
  //     "code": "R9PKN",
  //     "name": "Filmor Sarmiento",
  //     "status": "Admitted",
  //     "admission_date": "2025-04-29",
  //     "current_condition": "FUCKED UP",
  //     "date_of_birth": "1977-04-29",
  //     "address": "block 1 lot 38, Hinapao Street",
  //     "discharge_date": "2025-04-30",
  //     "phone": "09357773518",
  //     "email": "cadelinafilmor1971@gmail.com",
  //     "emergency_contact_name": "Filmor Sarmiento",
  //     "emergency_contact_phone": "09357773518",
  //     "is_active": "Active"
  // },

  //api function is 









  const dummyBillingData = [
    {
      patient_id: "John Doe",
      patient_services: [],
      date_created: "2025-03-10T08:45:30Z",
      status: "Unpaid",
      total_due: "150.00"
    },
    {
      patient_id: "Jane Smith",
      patient_services: [],
      date_created: "2025-03-12T10:20:15Z",
      status: "Paid",
      total_due: "200.00"
    },
    {
      patient_id: "Alex Johnson",
      patient_services: [],
      date_created: "2025-03-15T14:05:30Z",
      status: "Partial",
      total_due: "75.00"
    }
  ];



  const handleSelectedItem = async (filteredId) => {
    console.log(filteredId.code)

    //call the api thru id here
    try {
      setLoading(true)
      const response = await getBillingByID(filteredId.code);

      setSelectedItem(response.data);
      setLoading(false);


    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
    // after await callAPi, setSelectedItem on that including its list of BillingItem billings/id/<int:pk> (Django)

    //set selectedItem... then if item is selected here we can submit this down to other Billing/* components including CRUD ones and showing the selectedItem in the box statement
  }




  const handleConfirm = (billingItemId) => {
    // setIsModalOpen(true);
    //redirect to new link nalang
    navigate(`/billing/billing_items_of_billing/${selectedItem?.code}`);


  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCloseAddBillingModal = () => {
    setIsAddBillingModalOpen(false);
  };


  const handleAddBilling = () => {
    //add edit of BILLING CLASS is completely different to each other
    setIsAddBillingModalOpen(true)



  }

  const handleAddBillingItem = () => {
    //url ** ADD ** different URL same COMPONENT... if data? edit mode else ADD Mode


  }


  const handleEditBilling = (selectedBillings) => {
    //url ** EDIT ** different URL same COMPONENT... if has Id in parameter? edit mode else ADD Mode

    //if edit, submit the specific billing id here
    //send to backend
    //prefill the forms with the info from backend (EXCEPT PATIENT INFO)
  }

  const MainContent = () => (
    <>

      <div className={styles.billingContainer}>

        <div className={styles.leftPanel}>
          <button onClick={handleAddBilling}>
            Add+
          </button>
          <div className={styles.searchBarContainer}>
            <SearchBar
              data={dummyBillingData}
              placeholder={"IDKsssss"}
              searchApi={SearchBillingsApiExcludingDischarged}
              // accept the argument passed by the SearchBar component (item) when onSelectSuggestion is invoked
              //to accept *-*
              onSelectSuggestion={(filtered) => handleSelectedItem(filtered)}
              suggestedOutput={['code', 'patient']}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              isDropdownVisible={isDropdownVisible}
              setIsDropdownVisible={setIsDropdownVisible}
              maxDropdownHeight="500px"

            />
          </div>
        </div>

        {/*BOX COMPONENT TO CHECK IF THIS IS CORRECT USER 
            Then if clicked show the modal of CRUD process*/}
        <div className={styles.rightPanel}>
          <h2>Patient and Billing Information</h2>
          {selectedItem ? (
            <div className={styles.patientBox}>
              <h3>Patient Details</h3>
              <p><strong>Name:</strong> {selectedItem.patient.name}</p>
              <p><strong>Status:</strong> {selectedItem.patient.status}</p>
              <p><strong>Admission Date:</strong> {selectedItem.patient.admission_date}</p>
              <p><strong>Phone:</strong> {selectedItem.patient.phone}</p>
              <p><strong>Email:</strong> {selectedItem.patient.email}</p>

              <h3>Billing Details</h3>
              <p><strong>Billing ID:</strong> {selectedItem.id}</p>
              <p><strong>Status:</strong> {selectedItem.status}</p>
              <p><strong>Total Due:</strong> ${selectedItem.total_due}</p>
              <p><strong>Created On:</strong> {new Date(selectedItem.date_created).toLocaleDateString()}</p>

              <h3>Billing Items</h3>
              <ul>
                {selectedItem.billing_items.map(item => (
                  <li key={item.id}>
                    Service Availed: {item.service_availed} | Quantity: {item.quantity} | Subtotal: ${item.subtotal}
                  </li>
                ))}
              </ul>

              <button className={styles.confirmButton} onClick={() => handleConfirm()}>
                Confirm Billing
              </button>

              {/* Modal for CRUD actions could go here */}
            </div>
          ) : (
            <p className={styles.noSelection}>Select a billing item to view details</p>
          )}
        </div>











      </div>

      <BillingFormModal show={isModalOpen} onClose={handleCloseModal} />
      <AddBillingModalV2 show={isAddBillingModalOpen} onClose={handleCloseAddBillingModal} setModalOpen={setIsAddBillingModalOpen} />

    </>
  )



  return (
    <>









      <Routes>
        <Route index element={<MainContent />} />
        {/* <Route path="add" element={<AddBillingModalV2 />} /> */}
        {/* <Route path="edit/:id" element={<EditBillingForm />} /> */}
        <Route path="billing_items_of_billing/:billId" element={<BillingItemsOfThatBill />} />
        <Route path="lists_transactions" element={<TransactionsList />} />
        <Route path="patient/:patientId" element={<PatientBillings />} />
      </Routes>
    </>


  )
};
export default Billing;


{/* <Routes>
          <Route path="billing_items_of_billing/:id" element={<BillingItems/>} />
          {/* <Route path="edit/:id" element={<PatientForm onSubmit={handleEditPatienst} loading={loading} errorMsg={errorMsg} />} /> 
          
          </Routes>
          */}


{/*ROUTES LOGIC : refer to patient module... send the selectedBillings in here or maybe we willl use modal. */ }


