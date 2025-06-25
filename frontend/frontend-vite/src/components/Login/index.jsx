import React, { useState, useContext } from "react";
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

  const handleLogin = async () => {
    try {
      const success = await login(userId, password, "Admin");
      if (success) {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error details:", error);
      if (error.code === "ERR_NETWORK") {
        setError("Unable to connect to server. Please check your connection.");
      } else {
        setError("An error occurred during login. Check entered credentials");
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
          {error && <div className="text-danger small">{error}</div>}

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