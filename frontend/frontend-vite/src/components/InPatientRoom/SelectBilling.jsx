// src/pages/BedRental/BillingSearchStep.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './SelectBilling.module.css'
import SearchBar from "../AngAtingSeachBarWIthDropDown";
import { SearchBillingsApi } from '../../api/axios';

export default function SelectBilling({selectedBilling, setSelectedBilling}) {
  const [billing, setBilling] = useState(null)
  const [loading, setLoading] = useState(false)

  //REQUIRED STATES FOR SEARCHBAR
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)  //required for SearchBar



  const navigate = useNavigate()

  const onSelect = async (selectedItem) => {
    setLoading(true)
    try {
      setBilling(selectedItem)
      setSelectedBilling(selectedItem)
      console.log(selectedItem)
      setIsDropdownVisible(false)
      setSearchTerm(selectedItem.code)
    } finally {
      setLoading(false)
    }
  }


  const proceed = () => {
    navigate(`choose-bed/${billing.id}`)
  }

  return (
    <div className={styles.page}>
      <h2>1. Search Existing Billing</h2>

      <SearchBar
        placeholder={"Search Billings"}
        searchApi={SearchBillingsApi}
        // accept the argument passed by the SearchBar component (item) when onSelectSuggestion is trigered
        //to accept throw temp function 
        onSelectSuggestion={(filtered) => onSelect(filtered)}
        isIDIncludedInResultSuggestion={false}
        suggestedOutput={['code', 'patient', 'status']}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isDropdownVisible={isDropdownVisible}
        setIsDropdownVisible={setIsDropdownVisible}
      />



      {loading && <p className={styles.loading}>Loading...</p>}
      {billing && (
        <div className={styles.card}>
          <p><strong>Billing #:</strong> {billing.id}</p>
          <p><strong>Patient:</strong> {billing.patient.name}</p>
          <p><strong>Status:</strong> {billing.status}</p>
          <p><strong>Total Due:</strong> ₱{billing.total_due}</p>
          <button className={styles.button} onClick={proceed}>
            Next → Choose Bed
          </button>
        </div>
      )}
    </div>
  )
}
