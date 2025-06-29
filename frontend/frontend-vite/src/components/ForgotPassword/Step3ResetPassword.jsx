// src/pages/forgot-password/Step3ResetPassword.jsx
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ForgotPasswordContext } from './ForgotPasswordLayout'
import axios from 'axios'
import config from '../../config/config'

export default function Step3ResetPassword() {
  const { userId, resetToken } = useContext(ForgotPasswordContext)
  const [newPwd, setNewPwd]         = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [error, setError]           = useState('')
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    if (newPwd !== confirmPwd) {
      return setError('Passwords do not match')
    }
    try {
      await axios.post(config.getApiEndpoint('/reset-password'), {
        user_id:        userId,
        new_password:   newPwd,
        confirm_password: confirmPwd,
        reset_token:    resetToken
      })
      // show a toast / or redirect to login
      navigate('/login', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label small">New Password</label>
        <input
          type="password"
          className="form-control"
          value={newPwd}
          onChange={e => setNewPwd(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label small">Confirm Password</label>
        <input
          type="password"
          className="form-control"
          value={confirmPwd}
          onChange={e => setConfirmPwd(e.target.value)}
          required
        />
      </div>

      {error && <div className="text-danger small mb-2">{error}</div>}
      <button className="btn btn-success w-100">Reset Password</button>
    </form>
  )
}
