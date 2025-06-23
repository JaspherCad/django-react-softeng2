import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userId, setUserId] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  //Check is the UserID exist before proceeding
  const checkUserExists = async (userIdToCheck) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const validUserIds = ["AID-1", "AID-2", "DOC-1", "NURSE-1"];
    return validUserIds.includes(userIdToCheck) || userIdToCheck.length >= 3;
  };

  //Check the answer to the security question
  const checkSecurityAnswer = async (answer) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Simple validation - in real app, this would verify against stored answer
    return answer.trim().length > 0;
  };

  //Check the input for Step 1
  const handleStep1Submit = async () => {
    if (!userId.trim()) {
      setError("Please enter a User ID");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const userExists = await checkUserExists(userId);

      if (userExists) {
        setSuccess("User found! Please answer the security question.");
        setCurrentStep(2);
      } else {
        setError("User ID not found. Please check and try again.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //Check the inputs for Step 2
  const handleStep2Submit = async () => {
    if (!securityAnswer.trim()) {
      setError("Please answer the security question");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const isAnswerValid = await checkSecurityAnswer(securityAnswer);

      if (isAnswerValid) {
        setSuccess(
          "Security question answered correctly! Please set your new password."
        );
        setCurrentStep(3);
      } else {
        setError("Incorrect answer. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  //Check the inputs for Step 3
  const handleStep3Submit = () => {
    setError("");
    setSuccess("");

    if (!newPassword) {
      setError("Please enter a new password");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSuccess(
      "Password has been reset successfully! You can now login with your new password."
    );
  };

  //Instruction text for each step
  const getSubtitleText = () => {
    switch (currentStep) {
      case 1:
        return "Enter your User ID to begin the password reset process";
      case 2:
        return "Answer the security question";
      case 3:
        return "Set your new password";
      default:
        return "";
    }
  };

  //User Interface
  return (
    <div className={styles.forgotPasswordContainer}>
      <div className={styles.forgotPasswordCard}>
        {/* Header Section */}
        <div className={styles.headerSection}>
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
          <h1 className={styles.pageTitle}>Reset Password</h1>
          <p className={styles.pageSubtitle}>{getSubtitleText()}</p>
        </div>

        {/* Step Indicator */}
        <div className={styles.stepIndicator}>
          <div
            className={`${styles.stepCircle} ${
              currentStep === 1
                ? styles.stepCircleActive
                : currentStep > 1
                ? styles.stepCircleCompleted
                : styles.stepCircleInactive
            }`}
          >
            1
          </div>
          <div
            className={`${styles.stepLine} ${
              currentStep > 1 ? styles.stepLineCompleted : ""
            }`}
          ></div>
          <div
            className={`${styles.stepCircle} ${
              currentStep === 2
                ? styles.stepCircleActive
                : currentStep > 2
                ? styles.stepCircleCompleted
                : styles.stepCircleInactive
            }`}
          >
            2
          </div>
          <div
            className={`${styles.stepLine} ${
              currentStep > 2 ? styles.stepLineCompleted : ""
            }`}
          ></div>
          <div
            className={`${styles.stepCircle} ${
              currentStep === 3
                ? styles.stepCircleActive
                : styles.stepCircleInactive
            }`}
          >
            3
          </div>
        </div>

        {/* Error Message */}
        {error && <div className={styles.errorMessage}>{error}</div>}

        {/* Success Message */}
        {success && <div className={styles.successMessage}>{success}</div>}

        {/* Step 1: User ID */}
        {currentStep === 1 && (
          <div className={styles.formContainer}>
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
                placeholder="Enter your User ID"
                disabled={loading}
              />
            </div>

            <button
              onClick={handleStep1Submit}
              className={`${styles.primaryButton} ${
                loading || !userId.trim() ? styles.primaryButtonDisabled : ""
              }`}
              disabled={loading || !userId.trim()}
            >
              {loading ? "Checking..." : "Check User ID"}
            </button>
          </div>
        )}

        {/* Step 2: Security Question */}
        {currentStep === 2 && (
          <div className={styles.formContainer}>
            {/* Security Question */}
            <div className={styles.securityQuestion}>
              <div className={styles.securityQuestionLabel}>
                Security Question:
              </div>
              <div className={styles.securityQuestionText}>
                What is the name of your favorite pet?
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="securityAnswer" className={styles.formLabel}>
                Your Answer
              </label>
              <input
                type="text"
                id="securityAnswer"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                className={styles.formInput}
                placeholder="Enter your answer"
                disabled={loading}
              />
            </div>

            <div className={styles.buttonGroup}>
              <button
                onClick={handleStep2Submit}
                className={`${styles.primaryButton} ${
                  loading || !securityAnswer.trim()
                    ? styles.primaryButtonDisabled
                    : ""
                }`}
                disabled={loading || !securityAnswer.trim()}
              >
                {loading ? "Verifying..." : "Verify Answer"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: New Password */}
        {currentStep === 3 && (
          <div className={styles.formContainer}>
            <div className={styles.formGroup}>
              <label htmlFor="newPassword" className={styles.formLabel}>
                New Password
              </label>
              <div className={styles.passwordContainer}>
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={styles.formInput}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className={styles.passwordToggle}
                  aria-label={
                    showNewPassword ? "Hide password" : "Show password"
                  }
                >
                  {showNewPassword ? (
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

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.formLabel}>
                Confirm Password
              </label>
              <div className={styles.passwordContainer}>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={styles.formInput}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={styles.passwordToggle}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
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

            <div className={styles.buttonGroup}>
              <button
                onClick={handleStep3Submit}
                className={`${styles.primaryButton} ${
                  !newPassword || !confirmPassword
                    ? styles.primaryButtonDisabled
                    : ""
                }`}
                disabled={!newPassword || !confirmPassword}
              >
                Reset Password
              </button>
            </div>
          </div>
        )}

        {/* Back to Login */}
        <div className={styles.backLink}>
          <button
            onClick={() => navigate("/login")}
            className={styles.backLinkButton}
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
