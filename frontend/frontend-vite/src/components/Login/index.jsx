import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import hospitalLogo from '../../assets/react.svg';
import styles from './Login.module.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    levelOfAccess: 'Admin'
  });



/*
NOTE:
how the authentication works here

 const handleSubmit = (e) => {
    e.preventDefault();
    const isAuthenticated login(formData.userId); //must return TRUE or FALSE
    if (isAuthenticated){
      navigate('/dashboard');
      other logics for frotnend only... backend logic and web config logic is in AuthContext login WHERE
    }
    
  };


  Inside AuthContextLogin we will call the  LOGINAPi
  try
    if succeed
      set the userId token etc


  catch
    redo process

*/




  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass both userId and role to login function
    login(formData.userId, formData.levelOfAccess);
    navigate('/dashboard');
  };

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData, // Spread previous state
      [e.target.name]: e.target.value // Update the specific field
    }));
  };
  

  return (
    <div className={`${styles.loginContainer} d-flex align-items-center justify-content-center`}>
      <div className="container-fluid p-0">
        <div className="row m-0">
          <div className="col-12 col-md-6 col-lg-5 mx-auto">
            <div className={`card shadow-lg ${styles.loginCard}`}>
              <div className="card-body p-4">
                <div className="text-center mb-3">
                  <img 
                    src={hospitalLogo} 
                    alt="Hospital Logo" 
                    className="mb-2" 
                    style={{ width: '80px', height: '80px' }} 
                  />
                  <h1 className="h5 mb-1">Antipolo Centro De Medikal Hospital</h1>
                  <h2 className="h6 text-muted">Patient Information Management System</h2>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-2">
                    <label className="form-label small">User ID</label>
                    <input
                      type="text"
                      name="userId"
                      value={formData.userId}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label className="form-label small">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small">Level of Access</label>
                    <select
                      name="levelOfAccess"
                      value={formData.levelOfAccess}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Doctor">Doctor</option>
                      <option value="Nurse">Nurse</option>
                      <option value="Staff">Staff</option>
                      <option value="Teller">Teller</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success w-100 mb-2"
                  >
                    Login
                  </button>

                  <div className="text-center">
                    <Link to="/forgot-password" className="text-decoration-none small">
                      Forgot Password?
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 