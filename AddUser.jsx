import React, { useState, useEffect } from "react";
import styles from "./AddUser.module.css";

const AddUser = ({ editMode = false, userData = null, onSave, onCancel }) => {
  // Initialize form data based on edit mode
  const initializeFormData = () => {
    if (editMode && userData) {
      return {
        lastName: userData.lastName || "",
        givenName: userData.givenName || "",
        middleName: userData.middleName || "",
        role: userData.role || "",
        contactNumber: userData.contactNumber || "",
        address: userData.address || "",
        birthDate: userData.birthDate || "",
        password: "", // Always empty for security
        confirmPassword: "", // Always empty for security
        securityQuestion: userData.securityQuestion || "",
        securityAnswer: "", // Always empty for security
      };
    }
    return {
      lastName: "",
      givenName: "",
      middleName: "",
      role: "",
      contactNumber: "",
      address: "",
      birthDate: "",
      password: "",
      confirmPassword: "",
      securityQuestion: "",
      securityAnswer: "",
    };
  };

  const [formData, setFormData] = useState(initializeFormData);

  const [errors, setErrors] = useState({});
  const [isPasswordRequired, setIsPasswordRequired] = useState(!editMode);

  // Update form data when userData prop changes
  useEffect(() => {
    if (editMode && userData) {
      setFormData(initializeFormData());
    }
  }, [editMode, userData]);

  const roles = ["Admin", "Doctor", "Nurse", "Teller", "Receptionist"];

  const securityQuestions = [
    "What was the name of your first pet?",
    "In what city were you born?",
    "What is your mother's maiden name?",
    "What was the name of your elementary school?",
    "What is your favorite book?",
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleRoleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      role: e.target.value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.givenName.trim()) {
      newErrors.givenName = "Given name is required";
    }

    if (!formData.role) {
      newErrors.role = "Role selection is required";
    }

    if (!formData.contactNumber) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\d+$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Contact number must contain only digits";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!formData.birthDate) {
      newErrors.birthDate = "Birth date is required";
    }

    if (!formData.password && isPasswordRequired) {
      newErrors.password = "Password is required";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (
      !formData.confirmPassword &&
      (isPasswordRequired || formData.password)
    ) {
      newErrors.confirmPassword = "Password confirmation is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.securityQuestion) {
      newErrors.securityQuestion = "Security question is required";
    }

    if (
      !formData.securityAnswer.trim() &&
      (!editMode || formData.securityQuestion !== userData?.securityQuestion)
    ) {
      newErrors.securityAnswer = "Security answer is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const submissionData = { ...formData };

      // Remove empty password fields if in edit mode and no new password
      if (editMode && !formData.password) {
        delete submissionData.password;
        delete submissionData.confirmPassword;
      }

      if (onSave) {
        onSave(submissionData);
      } else {
        console.log("Form submitted:", submissionData);
        alert(
          editMode ? "User updated successfully!" : "User added successfully!"
        );
      }
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      // Reset form or navigate back
      setFormData(initializeFormData());
      setErrors({});
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            {editMode ? "Edit User" : "Add New User"}
          </h1>
          <div className={styles.hospitalLogo}>
            <img
              src="/api/placeholder/40/40"
              alt="Hospital Logo"
              className={styles.logoImage}
            />
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Name Section */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Personal Information</h2>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Last Name <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`${styles.input} ${
                      errors.lastName ? styles.inputError : ""
                    }`}
                    placeholder="Enter last name"
                  />
                  {errors.lastName && (
                    <span className={styles.errorText}>{errors.lastName}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Given Name <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="givenName"
                    value={formData.givenName}
                    onChange={handleInputChange}
                    className={`${styles.input} ${
                      errors.givenName ? styles.inputError : ""
                    }`}
                    placeholder="Enter given name"
                  />
                  {errors.givenName && (
                    <span className={styles.errorText}>{errors.givenName}</span>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Middle Name</label>
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter middle name (optional)"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Address <span className={styles.required}>*</span>
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`${styles.textarea} ${
                    errors.address ? styles.inputError : ""
                  }`}
                  placeholder="Enter complete address"
                  rows={3}
                />
                {errors.address && (
                  <span className={styles.errorText}>{errors.address}</span>
                )}
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Contact Number <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className={`${styles.input} ${
                      errors.contactNumber ? styles.inputError : ""
                    }`}
                    placeholder="Enter contact number"
                  />
                  {errors.contactNumber && (
                    <span className={styles.errorText}>
                      {errors.contactNumber}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Birth Date <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className={`${styles.input} ${
                      errors.birthDate ? styles.inputError : ""
                    }`}
                  />
                  {errors.birthDate && (
                    <span className={styles.errorText}>{errors.birthDate}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Role Section */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Role Assignment</h2>
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Select Role <span className={styles.required}>*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleRoleChange}
                  className={`${styles.select} ${
                    errors.role ? styles.inputError : ""
                  }`}
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <span className={styles.errorText}>{errors.role}</span>
                )}
              </div>
            </div>

            {/* Security Section */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Security Information</h2>

              {editMode && (
                <div className={styles.passwordNote}>
                  <p className={styles.noteText}>
                    💡 Leave password fields empty to keep current password
                  </p>
                </div>
              )}

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Password{" "}
                    {!editMode && <span className={styles.required}>*</span>}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`${styles.input} ${
                      errors.password ? styles.inputError : ""
                    }`}
                    placeholder={
                      editMode
                        ? "Enter new password (optional)"
                        : "Enter password"
                    }
                  />
                  {errors.password && (
                    <span className={styles.errorText}>{errors.password}</span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Confirm Password{" "}
                    {(!editMode || formData.password) && (
                      <span className={styles.required}>*</span>
                    )}
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`${styles.input} ${
                      errors.confirmPassword ? styles.inputError : ""
                    }`}
                    placeholder={
                      editMode ? "Confirm new password" : "Confirm password"
                    }
                  />
                  {errors.confirmPassword && (
                    <span className={styles.errorText}>
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Security Question <span className={styles.required}>*</span>
                </label>
                <select
                  name="securityQuestion"
                  value={formData.securityQuestion}
                  onChange={handleInputChange}
                  className={`${styles.select} ${
                    errors.securityQuestion ? styles.inputError : ""
                  }`}
                >
                  <option value="">Select a security question</option>
                  {securityQuestions.map((question, index) => (
                    <option key={index} value={question}>
                      {question}
                    </option>
                  ))}
                </select>
                {errors.securityQuestion && (
                  <span className={styles.errorText}>
                    {errors.securityQuestion}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Answer to Security Question{" "}
                  {(!editMode ||
                    formData.securityQuestion !==
                      (userData?.securityQuestion || "")) && (
                    <span className={styles.required}>*</span>
                  )}
                </label>
                <input
                  type="text"
                  name="securityAnswer"
                  value={formData.securityAnswer}
                  onChange={handleInputChange}
                  className={`${styles.input} ${
                    errors.securityAnswer ? styles.inputError : ""
                  }`}
                  placeholder={
                    editMode
                      ? "Enter new answer (if question changed)"
                      : "Enter your answer"
                  }
                />
                {errors.securityAnswer && (
                  <span className={styles.errorText}>
                    {errors.securityAnswer}
                  </span>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className={styles.formActions}>
              <button
                type="button"
                onClick={handleCancel}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button type="submit" className={styles.submitButton}>
                {editMode ? "Update User" : "Add User"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
