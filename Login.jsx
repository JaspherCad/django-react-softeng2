import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import "./Global.css";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  //Log in user
  const handleLogin = () => {
    console.log("Login attempt:", { userId, password });
    // Your login logic here
  };

  //Navigate to Forgot password
  const handleForgotPassword = () => {
    // Navigate to forgot password page instead of alert
    navigate("/ForgotPassword");
  };

  return (
    //Container for the entire Login Page
    <div className={styles.loginContainer}>
      {/* Container for the login card*/}
      <div className={styles.loginCard}>
        {/* Logo image */}
        <div className={styles.logoSection}>
          <div className={styles.logoImageContainer}>
            <img
              src="./hospital_logo.png"
              alt="Antipolo Centro De Medikal Hospital Logo"
              className={styles.hospitalLogo}
            />
          </div>
          <div className={styles.hospitalNameSmall}>
            Antipolo Centro De Medikal Hospital
          </div>
          <h2 className={styles.systemTitle}>
            Patient Information Management System
          </h2>
        </div>

        {/* Login Form */}
        <div className={styles.formContainer}>
          {/* User ID field */}
          <div className={styles.formGroup}>
            <label htmlFor="userId" className={styles.formLabel}>
              User ID
            </label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              className={styles.formInput}
              placeholder="Enter user ID"
              required
            />
          </div>

          {/* Password field */}
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              Password
            </label>
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.formInput}
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.passwordToggle}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <img
                    src="./eye2.png"
                    alt="Show password"
                    style={{ width: "20px" }}
                  />
                ) : (
                  <img
                    src="./eye.png"
                    alt="Hide password"
                    style={{ width: "20px" }}
                  />
                )}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className={styles.loginButton}
            disabled={!userId || !password}
          >
            Login
          </button>

          <div className={styles.forgotPasswordContainer}>
            <button
              className={styles.forgotPasswordLink}
              onClick={handleForgotPassword}
            >
              Forgot Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
