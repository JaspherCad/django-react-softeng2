import React from 'react'
import styles from './BillingItemsOfThatBill.module.css';

const BillingItemsModal = ({closeModal}) => {
  return (
   <div className={styles.modalOverlay} onClick={() => console.log('TWO')}>
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
               {/* Modalsssssssssssssssssssss */}
   
   
             </div>
           </div>
  )
}

export default BillingItemsModal