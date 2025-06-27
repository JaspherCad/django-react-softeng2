import React, { useEffect } from 'react'
import styles from './BillingItemsOfThatBill.module.css';
import SearchBar from '../AngAtingSeachBarWIthDropDown';
import { addBillingItemApi, editBillingItemApi, SearchPatientsApi, SearchServicesApi } from '../../api/axios';
import { useState } from 'react';

//REMEMBER THIS IS HIGHLY DEPENDENT ON BILLINGITEMS MODAL
//REMEMBER THIS IS HIGHLY DEPENDENT ON BILLINGITEMS MODAL
//REMEMBER THIS IS HIGHLY DEPENDENT ON BILLINGITEMS MODAL
//REMEMBER THIS IS HIGHLY DEPENDENT ON BILLINGITEMS MODAL


//billingItem == the selected item from the parent component 
const BillingItemsModal = ({ closeModal, billingItem, loading, error, billId, billCode,setReloadCount }) => {
  const [searchTerm, setSearchTerm] = useState(''); //required for SearchBar
  const [selectedTerm, setSelectedItem] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false)  //required for SearchBar

  // now if (billingItem) is present, then the mode is "EDIT" 
  // else meaning there is no billingItem passsed then that's "ADD" mode
  const isEditMode = Boolean(billingItem);

  //data of the billing_item
  const [service, setService] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [costAtTime, setCostAtTime] = useState(0)



  const handleSelectedItem = (selectedItem) => {
    console.log(selectedItem)
    setSearchTerm(selectedItem.name) //autocompletes the searchTerm
    setCostAtTime(parseFloat(selectedItem.current_cost));
    setSelectedItem(selectedItem)
    setIsDropdownVisible(false)
  }

  const handleCreateOrUpdate = async () => {
    console.log(selectedTerm)
    console.log("Creating billing with values:", {
      service: selectedTerm.id,
      costAtTime,
      quantity,
    });

    const payload = {
      service: selectedTerm.id,
      quantity,
      cost_at_time: costAtTime,
      //billId: is thru url...
    };

    const payloadForEdit = {
      service: selectedTerm.service_id,
      quantity,
      cost_at_time: costAtTime,
      //billId: is thru url...
    };

    try {
      //OK..  we are changing the SERVICE itself not SERVICE PATIENT bRUHHH took me 5 hrs
      if (isEditMode) {
        console.log('🤫EDITING billing:', payload);
        
        const response = await editBillingItemApi(billCode, billingItem.id, payloadForEdit);
        if (response.status === 200 || response.status === 201) {
          setReloadCount((prev) => prev + 1);
        }

      } else {
        console.log('🤫ADDING billing:', payload);
        const response = await addBillingItemApi(payload, billId);

        if (response.status === 200 || response.status === 201) {
          setReloadCount((prev) => prev + 1);
        }
      }
      closeModal();
    } catch (err) {
      console.error('Error submitting billing item:', err);
    }

  };


  useEffect(() => {
    if (isEditMode) {

      console.log('billingItem inside useEffect:', billingItem);
      console.log('quantity:', billingItem.quantity);
      console.log('subtotal:', billingItem.subtotal);




      setSearchTerm(billingItem.service_name) //autocompletes the searchTerm
      setSelectedItem(billingItem)
      setIsDropdownVisible(false) //if bug remove this
      setQuantity(billingItem.quantity);
      setCostAtTime(parseFloat(billingItem.subtotal));

    } else {
      // Reset fields for add
      setSearchTerm('');
      setSelectedItem(null);
      setIsDropdownVisible(false);
      setQuantity(1);
      setCostAtTime(0);
    }
    // console.log(billingItem)
  }, [billingItem, isEditMode])


  return (
    <div className={styles.modalOverlay} onClick={() => console.log('TWO')}>
      {/* JUST CLOSE BUTTON */}
      <div
        className={styles.modalContent}
        onClick={(e) => {
          e.stopPropagation() //to avoid ONCLICKING the parent tooo... stay at CHILD lang yung click event....
          console.log("WAH")
        }}
      >
        <button className={styles.closeButton} onClick={closeModal}>
          &times;
        </button>

        {/* Title based on mode */}
        <h3 className={styles.modalTitle}>
          {isEditMode ? 'Edit Billing Item' : 'Add Billing Item'}
        </h3>


        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
          <div style={{ flex: 3 }}>


            <div className={styles.inputGroup}>
              <label htmlFor="service-search">Service</label>

              <SearchBar
                placeholder={"IDKss"}
                searchApi={SearchServicesApi}

                onSelectSuggestion={(filtered) => handleSelectedItem(filtered)}
                isIDIncludedInResultSuggestion={true}
                suggestedOutput={['name', 'current_cost']}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                isDropdownVisible={isDropdownVisible}
                setIsDropdownVisible={setIsDropdownVisible}
              />
            </div>


          </div>




          {/* COST AT TIME */}
          <div style={{ flex: 2 }}>
            <div className={styles.inputGroup}>
              <label htmlFor="cost-at-time">Cost at Time</label>
              <input
                id="cost-at-time"
                type="number"
                value={costAtTime}
                onChange={(e) => setCostAtTime(Number(e.target.value))}
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* QUANTITY */}
          <div style={{ flex: 1 }}>
            <div className={styles.inputGroup}>
              <label htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                type="number"
                value={quantity}                     // ← controlled here
                min={1}
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
          </div>





        </div>
        {/* CREATE BILLING Button */}
        <div className={styles.buttonContainer}>
          <button
            className={styles.createBillingButton}
            onClick={handleCreateOrUpdate}

          >
            {isEditMode ? 'UPDATE ITEM' : 'CREATE ITEM'}
          </button>
        </div>






      </div>
    </div>
  )
}

export default BillingItemsModal

{/* <SearchBar
          placeholder={"IDKss"}
          searchApi={SearchPatientsApi}
          // accept the argument passed by the SearchBar component (item) when onSelectSuggestion is trigered
          //to accept throw temp function 
          onSelectSuggestion={(filtered) => handleSubmit(filtered)}
          isIDIncludedInResultSuggestion={false}
          suggestedOutput={['code', 'name']}

        /> */}