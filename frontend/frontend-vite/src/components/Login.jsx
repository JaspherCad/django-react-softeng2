import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import hospitalLogo from '../assets/react.svg';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    levelOfAccess: 'Admin'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simple login implementation save state asd a a user object and navigate to dashboard ads dsa
    login(formData.userId);
    navigate('/dashboard');
  };

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData, // Spread previous state
      [e.target.name]: e.target.value // Update the specific field
    }));
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a7a9c] p-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img src={hospitalLogo} alt="Hospital Logo" className="w-24 h-24 mb-4" />
          <h1 className="text-2xl font-semibold text-gray-800">Antipolo Centro De Medikal Hospital</h1>
          <h2 className="text-xl text-gray-700">Patient Information Management System</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">User ID</label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-200 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-200 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Level of Access</label>
            <select
              name="levelOfAccess"
              value={formData.levelOfAccess}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-200 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Admin">Admin</option>
              <option value="Doctor">Doctor</option>
              <option value="Nurse">Nurse</option>
              <option value="Staff">Staff</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition duration-200"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-blue-500 hover:text-blue-600">
            Forgot Password
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login; 