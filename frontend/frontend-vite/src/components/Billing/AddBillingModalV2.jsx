import React from "react";
import styles from "./BillingFormModal.module.css";
import { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import { addBillingsApi, SearchPatientsApi } from "../../api/axios";
import SearchBar from "../AngAtingSeachBarWIthDropDown/index";

//this creates BILLING class of that user (NOT the billing_item)

//not just confirmation modal but the one who selects "WHO'S THE PATIENT"???
//to recieve new billing?

const AddBillingModalV2 = ({ show, onClose, setModalOpen }) => {
  //these are props remember

  const [patient, setPatient] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); //required for SearchBar
  const [error, setError] = useState();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); //required for SearchBar
  //confirmaton modal section
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  //confirmaton modal section

  if (!show) return null;

  const handleSubmit = (filtered) => {
    setPatient(filtered || "");
    console.log(filtered?.code);

    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    console.log(patient);
    const data = {
      patient: parseInt(patient.id), //requires ID not CODE!
      status: "Unpaid",
    };

    console.log(data);
    try {
      console.log(data);
      const response = await addBillingsApi(data);

      if (response?.status === 200 || response?.status === 201) {
        console.log("Billing successfully added");
        setError("");
        setShowConfirmModal(false);
        setModalOpen(false);
      } else {
        console.log("Failed to add billing:", response);
      }
    } catch (error) {
      console.log(error.response.data);
      const errormsg = error?.response?.data?.patient;
      alert(errormsg);

      //DESIGNER PLEASE DESIGN THIS HAHA!
      //set error msg
      setError(errormsg);
    }
  };

  return (
    <div
      className={styles.modalOverlay}
      onClick={() => console.log("modal triggered")}
    >
      <div
        className={styles.modalContent}
        onClick={(e) => {
          e.stopPropagation();
          console.log("just content because ofstopPropagation ");
        }}
      >
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
        {/* on submit triggers the confirmation button.. SO goal is to trigger the ONSUBMIT */}
        <h1>Search by patient_code or patient name</h1>
        <SearchBar
          placeholder={"Search patient"}
          searchApi={SearchPatientsApi}
          // accept the argument passed by the SearchBar component (item) when onSelectSuggestion is trigered
          //to accept throw temp function
          onSelectSuggestion={(filtered) => handleSubmit(filtered)}
          isIDIncludedInResultSuggestion={false}
          suggestedOutput={["code", "name"]}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isDropdownVisible={isDropdownVisible}
          setIsDropdownVisible={setIsDropdownVisible}
        />

        {/* Confirmation Modal */}
        <ConfirmationModal
          show={showConfirmModal}
          title="Add New Billing?"
          message={`patientId: ${patient?.code}`}
          onConfirm={handleConfirm}
          onCancel={() => {
            setShowConfirmModal(false);
            setError("");
          }}
          errorMsg={error}
        />
      </div>
    </div>
  );
};

export default AddBillingModalV2;
