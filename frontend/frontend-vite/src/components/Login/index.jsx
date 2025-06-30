import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // New individual state declarations
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    userId: false,
    password: false
  });
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0);

  // Countdown timer for blocked users
  useEffect(() => {
    let interval;
    if (isBlocked && blockTimeRemaining > 0) {
      interval = setInterval(() => {
        setBlockTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsBlocked(false);
            setError("");
            setFieldErrors({ userId: false, password: false });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isBlocked, blockTimeRemaining]);

  const handleLogin = async () => {
    // Reset field errors and general error
    setFieldErrors({ userId: false, password: false });
    setError("");

    try {
      const success = await login(userId, password, "Admin");
      if (success) {
        navigate("/dashboard");
      }
    } catch (error) {
      const errorDisplay = error.response?.data || error.message;
      if (error.code === "ERR_NETWORK") {
        console.log(errorDisplay);
        setError("Unable to connect to server. Please check your connection.");//if wifi fails this
      } else {
        setError("An error occurred during login. Check entered credentials");
        // {
        //     "user_id": [
        //         "User ID not found. Please check your User ID and try again."
        //     ]
        // }

        //OR

        // {
        //   "password": [
        //     "Incorrect password. Please check your password and try again."
        //   ]
        // }
        console.log(errorDisplay); //if wifi works this

        if (error.response?.data) {
          const errorData = error.response.data;

          // Handle field-specific errors and highlight the corresponding inputs
          if (errorData.user_id) {
            const errorMessage = Array.isArray(errorData.user_id) ? errorData.user_id[0] : errorData.user_id;
            setError(errorMessage);
            // Highlight user_id field for rate limiting and user not found errors
            setFieldErrors(prev => ({ ...prev, userId: true }));
            
            // Check if this is a rate limiting error
            if (errorMessage.includes("Too many failed login attempts")) {
              setIsBlocked(true);
              setBlockTimeRemaining(60); // 60 seconds countdown
            }
          }
          else if (errorData.password) {
            const errorMessage = Array.isArray(errorData.password) ? errorData.password[0] : errorData.password;
            setError(errorMessage);
            setFieldErrors(prev => ({ ...prev, password: true }));
          }
          else if (errorData.detail) {
            setError(errorData.detail);
          }
          else {
            setError("An error occurred during login. Please check your credentials.");
          }
        } else {
          setError("An error occurred during login. Please check your credentials.");
        }

      }
    }
  };

  const handleForgotPassword = () => {
    // Add your forgot password logic here
    console.log("Forgot password clicked");
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
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

        <div className={styles.formContainer}>
          {error && (
            <div className={`text-danger small ${isBlocked ? styles.blockedError : ''}`}>
              {isBlocked && blockTimeRemaining > 0 
                ? `${error} (${blockTimeRemaining} seconds remaining)`
                : error
              }
            </div>
          )}

          <div className={styles.formGroup}>
            <label htmlFor="userId" className={styles.formLabel}>
              User ID
            </label>
            <input
              type="text"
              id="userId"
              value={userId}
              onChange={(e) => {
                setUserId(e.target.value);
                // Clear error when user starts typing
                if (fieldErrors.userId) {
                  setFieldErrors(prev => ({ ...prev, userId: false }));
                  setError("");
                }
              }}
              className={`${styles.formInput} ${fieldErrors.userId ? styles.errorInput : ''}`}
              placeholder="Enter user ID"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.formLabel}>
              Password
            </label>
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  // Clear error when user starts typing
                  if (fieldErrors.password) {
                    setFieldErrors(prev => ({ ...prev, password: false }));
                    setError("");
                  }
                }}
                className={`${styles.formInput} ${fieldErrors.password ? styles.errorInput : ''}`}
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
            disabled={!userId || !password || isBlocked}
          >
            {isBlocked ? `Blocked (${blockTimeRemaining}s)` : "Login"}
          </button>

          <div className={styles.forgotPasswordContainer}>
            <div className="text-center">
              <Link to="/forgot-password" className="text-decoration-none small">
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;