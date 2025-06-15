import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import SelectBilling from './SelectBilling'
import SelectBed from './SelectBed.jsx'
// import Confirmation from './Confirmation'
import BedRentalLayout from './BedRentalLayout'
import BedAssignmentList from './BedAssignmentList'

export default function BedRentalPage() {


  const [selectedBilling, setSelectedBilling] = useState()
  const [selectedBed, setSelectedBed] = useState()
  const [selectedRoom, setSelectedRoom] = useState()




  return (
    <Routes>



      <Route index element={<BedAssignmentList
      />} />
      {/* /search billing --> pick room and bed --> lists? or redirect to that specific id idk */}

      <Route element={<BedRentalLayout />}>






        <Route path="add-bed/" element={<SelectBilling
          selectedBilling={selectedBilling}
          setSelectedBilling={setSelectedBilling}


        />} />

        <Route path="add-bed/choose-bed/:billingId" element={<SelectBed
          selectedBed={selectedBed}
          setSelectedBed={setSelectedBed}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
          selectedBilling={selectedBilling} //just for confirmation part...
          setSelectedBilling={setSelectedBilling}

        />} />

        {/* <Route path="confirmation/:assignmentId" element={<Confirmation />} /> */}

        <Route path="*" element={<Navigate to="." replace />} />

      </Route>

    </Routes>
  )
}
