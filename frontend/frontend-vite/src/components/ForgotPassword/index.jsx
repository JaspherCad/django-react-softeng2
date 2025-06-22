// src/pages/forgot-password/index.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ForgotPasswordLayout from './ForgotPasswordLayout'
import Step1EnterUserId from './Step1EnterUserId'
import Step2SecurityQuestion from './Step2SecurityQuestion'
import Step3ResetPassword from './Step3ResetPassword'

export default function ForgotPasswordRoutes() {

   


  return (
    <Routes>
      <Route path="/" element={<ForgotPasswordLayout />}>
        {/* default to Step 1 */}
        <Route index element={<Navigate to="enter-id" replace />} />
        <Route path="enter-id" element={<Step1EnterUserId />} />
        <Route path="security-question" element={<Step2SecurityQuestion />} />
        <Route path="reset" element={<Step3ResetPassword />} />
      </Route>
    </Routes>
  )
}
