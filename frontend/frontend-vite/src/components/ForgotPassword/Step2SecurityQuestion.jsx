// src/pages/forgot-password/Step2SecurityQuestion.jsx
import React, { useContext, useState } from 'react'
import { useNavigate }         from 'react-router-dom'
import { ForgotPasswordContext } from './ForgotPasswordLayout'
import axios from 'axios'
import config from '../../config/config'

export default function Step2SecurityQuestion() {
  const {
    userId,
    questions,
    answers,  setAnswers,
    setResetToken
  } = useContext(ForgotPasswordContext)

  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const { data } = await axios.post(
        config.getApiEndpoint('/verify-answers'),
        { user_id: userId, answers }
      )
      setResetToken(data.token)
      navigate('../reset')
    } catch (err) {

      setError(err.response?.data?.error || 'Verification failed')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {questions.map(q => (
        <div key={q.id} className="mb-3">
          <label className="form-label small">{q.question}</label>
          <input
            className="form-control"
            value={answers[q.id] || ''}
            onChange={e => handleChange(q.id, e.target.value)}
            required
          />
        </div>
      ))}
      {error && <div className="text-danger small mb-2">{error}</div>}
      <button className="btn btn-success w-100">Next</button>
    </form>
  )
}
