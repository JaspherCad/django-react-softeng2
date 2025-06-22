// src/pages/forgot-password/Step1EnterUserId.jsx
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ForgotPasswordContext } from './ForgotPasswordLayout'
import axios from 'axios'

export default function Step1EnterUserId() {
  const { setUserId, setQuestions } = useContext(ForgotPasswordContext)
  const [localId, setLocalId] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      // 1) Store userId in global context
      setUserId(localId)

      // 2) Call your API to get the security questions
      const { data } = await axios.post(
        'http://127.0.0.1:8000/api/forgot-password',
        { user_id: localId }
      )
      setQuestions(data.questions)

      // 3) Go to step #2
      navigate('../security-question')
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label className="form-label small">User ID</label>
      <input
        className="form-control mb-2"
        value={localId}
        onChange={e => setLocalId(e.target.value)}
        required
      />
      {error && <div className="text-danger small mb-2">{error}</div>}
      <button className="btn btn-success w-100">Next</button>
    </form>
  )
}
