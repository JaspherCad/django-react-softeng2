import React, { useState } from 'react';
import styles from './AddUserModal.module.css';
import axiosInstance, { uploadUSERSADMINImageAPI } from '../../api/axios';

export default function AddUserModal({ onClose, onUserAdded }) {
    const [formData, setFormData] = useState({
        user_id: '',
        password: '',
        role: '',
        department: '',
        first_name: '',
        last_name: '',
        email: '',
        address: '',
        phone: '',
        birthdate: ''
    });

    // Security questions state
    const [securityQuestions, setSecurityQuestions] = useState([
        { question: '', answer: '' },
        { question: '', answer: '' },
        { question: '', answer: '' }
    ]);

    // Predefined security questions
    const predefinedQuestions = [
        "What was the name of your first pet?",
        "What is your mother's maiden name?",
        "What city were you born in?",
        "What was the name of your elementary school?",
        "What is your favorite food?",
        "What was your childhood nickname?",
        "What is the name of the street you grew up on?",
        "What was your first car?",
        "What is your favorite movie?",
        "What was the name of your first boss?"
    ];

    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSecurityQuestionChange = (index, field, value) => {
        setSecurityQuestions(prev => {
            const updated = [...prev];
            if (field === 'question' && value !== 'CUSTOM') {
                // If selecting a predefined question, set it directly
                updated[index] = { ...updated[index], question: value };
            } else if (field === 'question' && value === 'CUSTOM') {
                // If selecting custom, reset to empty for custom input
                updated[index] = { ...updated[index], question: '' };
            } else {
                // For answer or custom question text
                updated[index] = { ...updated[index], [field]: value };
            }
            return updated;
        });

        // Clear error when field is edited
        if (errors[`security_${index}_${field}`]) {
            setErrors(prev => ({ ...prev, [`security_${index}_${field}`]: null }));
        }
    };

    const handleImageChange = e => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            if (!validTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, image: 'Please select a valid image file (JPEG, PNG, GIF)' }));
                return;
            }
            
            // Validate file size (5MB max)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
                return;
            }
            
            // Clear image error if valid
            if (errors.image) {
                setErrors(prev => ({ ...prev, image: null }));
            }
            
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Required fields validation
        ['user_id', 'password', 'role', 'department', 'first_name', 'last_name', 'address', 'phone', 'birthdate'].forEach(field => {
            if (!formData[field]) {
                const fieldName = field.replace('_', ' ').toUpperCase();
                newErrors[field] = `${fieldName} is required`;
            }
        });
        // Email format validation
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        // Contact number validation (Philippines format)
        if (formData.phone && !/^(\+63|0)\d{10}$/.test(formData.phone)) {
            newErrors.phone = 'Contact number must be in +63 or 0 format (e.g., +639123456789)';
        }

        if (formData.birthdate) {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(formData.birthdate)) {
                newErrors.birthdate = 'Birthdate must be in YYYY-MM-DD format';
            }
        }

        // Validate security questions
        securityQuestions.forEach((sq, index) => {
            if (!sq.question.trim()) {
                newErrors[`security_${index}_question`] = `Security question ${index + 1} is required`;
            }
            if (!sq.answer.trim()) {
                newErrors[`security_${index}_answer`] = `Security answer ${index + 1} is required`;
            }
            if (sq.answer.trim().length < 3) {
                newErrors[`security_${index}_answer`] = `Security answer ${index + 1} must be at least 3 characters`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async e => {
        e.preventDefault();
        console.log('Form submission started');
        
        if (!validateForm()) return;

        setIsSubmitting(true);
        setErrors({}); // Clear previous errors

        try {
            // 1) Create user
            console.log('Creating user with data:', formData);
            const { data } = await axiosInstance.post('/user/register', formData);
            const newUser = data;
            console.log('User created successfully:', newUser);
            console.log('New user ID:', newUser.id, 'Type:', typeof newUser.id);
            
            // 2) If image selected, upload
            if (imageFile) {
                console.log('Attempting to upload image for user ID:', newUser.id);
                console.log('Image file details:', {
                    name: imageFile.name,
                    size: imageFile.size,
                    type: imageFile.type
                });
                
                // Validate userId is a valid number
                const userId = Number(newUser.id);
                if (!userId || isNaN(userId)) {
                    console.error('Invalid user ID for image upload:', newUser.id);
                    setErrors({ apiError: 'User created but image upload failed: Invalid user ID.' });
                } else {
                    const imageFormData = new FormData();
                    imageFormData.append('file', imageFile);
                    imageFormData.append('description', 'User profile image');
                    
                    // Debug: Log FormData contents
                    console.log('FormData contents:');
                    for (let pair of imageFormData.entries()) {
                        console.log(`${pair[0]}:`, pair[1]);
                    }
                    
                    try {
                        const uploadResponse = await uploadUSERSADMINImageAPI(userId, imageFormData);
                        console.log('Image upload successful:', uploadResponse.data);
                    } catch (imageError) {
                        console.error('Image upload failed:', imageError);
                        console.error('Image upload error details:', {
                            status: imageError.response?.status,
                            statusText: imageError.response?.statusText,
                            data: imageError.response?.data,
                            message: imageError.message,
                            url: imageError.config?.url
                        });
                        // Don't fail the entire operation if just image upload fails
                        setErrors({ apiError: 'User created but image upload failed. You can upload it later.' });
                    }
                }
            }

            // 3) Set security questions
            try {
                const securityQuestionsData = {
                    user_id: newUser.id,
                    questions: securityQuestions.map(sq => ({
                        question: sq.question.trim(),
                        answer: sq.answer.trim()
                    }))
                };
                
                await axiosInstance.post('/set-security-questions', securityQuestionsData);
                console.log('Security questions set successfully');
            } catch (securityError) {
                console.error('Security questions setup failed:', securityError);
                setErrors({ apiError: 'User created but security questions setup failed. Please set them manually.' });
            }

            // 4) Notify parent and close
            onUserAdded(newUser);
            //   onClose();
        } catch (err) {
            console.error('User creation failed:', err);
            setErrors({ apiError: err.response?.data?.message || 'Failed to add user' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                <h4>Add New User</h4>

                <form onSubmit={handleSubmit} className={styles.form} encType="multipart/form-data">
                    {/* Personal Information Section */}
                    {/* Personal Information Section */}
                    <div className={styles.section}>
                        <h5 className={styles.sectionHeader}>Personal Information</h5>
                        <hr />

                        {/* Last Name */}
                        <div className={styles.field}>
                            <label className={styles.label}>Last Name <span className={styles.required}>*</span></label>
                            <input
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className={`${styles.input} ${errors.last_name ? styles.errorInput : ''}`}
                                required
                            />
                            {errors.last_name && <div className={styles.error}>{errors.last_name}</div>}
                        </div>

                        {/* Given Name */}
                        <div className={styles.field}>
                            <label className={styles.label}>Given Name <span className={styles.required}>*</span></label>
                            <input
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className={`${styles.input} ${errors.first_name ? styles.errorInput : ''}`}
                                required
                            />
                            {errors.first_name && <div className={styles.error}>{errors.first_name}</div>}
                        </div>

                        

                        {/* Address */}
                        <div className={styles.field}>
                            <label className={styles.label}>Address <span className={styles.required}>*</span></label>
                            <input
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className={`${styles.input} ${errors.address ? styles.errorInput : ''}`}
                                required
                            />
                            {errors.address && <div className={styles.error}>{errors.address}</div>}
                        </div>

                        {/* Phone & Birth Date */}
                        <div className={styles.splitFields}>
                            {/* Contact Number */}
                            <div className={styles.field}>
                                <label className={styles.label}>Contact Number <span className={styles.required}>*</span></label>
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`${styles.input} ${errors.phone ? styles.errorInput : ''}`}
                                    placeholder="+639123456789"
                                    required
                                />
                                {errors.phone && <div className={styles.error}>{errors.phone}</div>}
                            </div>

                            {/* Birth Date */}
                            <div className={styles.field}>
                                <label className={styles.label}>Birth Date <span className={styles.required}>*</span></label>
                                <input
                                    type="date"
                                    name="birthdate"
                                    value={formData.birthdate}
                                    onChange={handleChange}
                                    className={`${styles.input} ${errors.birthdate ? styles.errorInput : ''}`}
                                    required
                                />
                                {errors.birthdate && <div className={styles.error}>{errors.birthdate}</div>}
                            </div>
                        </div>
                    </div>

                    {/* Account Information Section */}
                    <div className={styles.section}>
                        <h5 className={styles.sectionHeader}>Account Information</h5>
                        <hr />

                        {/* User ID */}
                        <div className={styles.field}>
                            <label className={styles.label}>User ID <span className={styles.required}>*</span></label>
                            <input
                                name="user_id"
                                value={formData.user_id}
                                onChange={handleChange}
                                className={`${styles.input} ${errors.user_id ? styles.errorInput : ''}`}
                                required
                            />
                            {errors.user_id && <div className={styles.error}>{errors.user_id}</div>}
                        </div>

                        {/* Password */}
                        <div className={styles.field}>
                            <label className={styles.label}>Password <span className={styles.required}>*</span></label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`${styles.input} ${errors.password ? styles.errorInput : ''}`}
                                required
                            />
                            {errors.password && <div className={styles.error}>{errors.password}</div>}
                        </div>

                        {/* Role & Department */}
                        <div className={styles.splitFields}>
                            <div className={styles.field}>
                                <label className={styles.label}>Role <span className={styles.required}>*</span></label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className={`${styles.input} ${errors.role ? styles.errorInput : ''}`}
                                    required
                                >
                                    <option value="">Select Role</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Doctor">Doctor</option>
                                    <option value="Nurse">Nurse</option>
                                    <option value="Teller">Teller</option>
                                    <option value="Receptionist">Receptionist</option>
                                </select>
                                {errors.role && <div className={styles.error}>{errors.role}</div>}
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Department <span className={styles.required}>*</span></label>
                                <input
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className={`${styles.input} ${errors.department ? styles.errorInput : ''}`}
                                    required
                                />
                                {errors.department && <div className={styles.error}>{errors.department}</div>}
                            </div>
                        </div>
                    </div>

                    {/* Security Questions Section */}
                    <div className={styles.section}>
                        <h5 className={styles.sectionHeader}>Security Questions</h5>
                        <hr />
                        <p className={styles.sectionDescription}>
                            Set up 3 security questions for password recovery. These will be used if the user forgets their password.
                        </p>
                        
                        {securityQuestions.map((sq, index) => (
                            <div key={index} className={styles.securityQuestionGroup}>
                                <h6 className={styles.questionNumber}>Question {index + 1}</h6>
                                
                                <div className={styles.field}>
                                    <label className={styles.label}>
                                        Security Question <span className={styles.required}>*</span>
                                    </label>
                                    <select
                                        value={sq.question && predefinedQuestions.includes(sq.question) ? sq.question : sq.question ? 'CUSTOM' : ''}
                                        onChange={e => {
                                            if (e.target.value === 'CUSTOM') {
                                                handleSecurityQuestionChange(index, 'question', '');
                                            } else {
                                                handleSecurityQuestionChange(index, 'question', e.target.value);
                                            }
                                        }}
                                        className={`${styles.input} ${errors[`security_${index}_question`] ? styles.errorInput : ''}`}
                                        required
                                    >
                                        <option value="">Select a question or choose custom</option>
                                        {predefinedQuestions.map((question, qIndex) => (
                                            <option key={qIndex} value={question}>{question}</option>
                                        ))}
                                        <option value="CUSTOM">Custom Question</option>
                                    </select>
                                    {errors[`security_${index}_question`] && (
                                        <div className={styles.error}>{errors[`security_${index}_question`]}</div>
                                    )}
                                </div>

                                {(sq.question && !predefinedQuestions.includes(sq.question)) && (
                                    <div className={styles.field}>
                                        <label className={styles.label}>
                                            Custom Question <span className={styles.required}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter your custom security question"
                                            value={sq.question}
                                            onChange={e => handleSecurityQuestionChange(index, 'question', e.target.value)}
                                            className={`${styles.input} ${errors[`security_${index}_question`] ? styles.errorInput : ''}`}
                                            required
                                        />
                                    </div>
                                )}

                                <div className={styles.field}>
                                    <label className={styles.label}>
                                        Answer <span className={styles.required}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter the answer"
                                        value={sq.answer}
                                        onChange={e => handleSecurityQuestionChange(index, 'answer', e.target.value)}
                                        className={`${styles.input} ${errors[`security_${index}_answer`] ? styles.errorInput : ''}`}
                                        required
                                    />
                                    {errors[`security_${index}_answer`] && (
                                        <div className={styles.error}>{errors[`security_${index}_answer`]}</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Profile Image */}
                    <div className={styles.field}>
                        <label className={styles.label}>Profile Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className={styles.input}
                        />
                        {errors.image && <div className={styles.error}>{errors.image}</div>}
                    </div>

                    {previewUrl && (
                        <div className={styles.previewWrapper}>
                            <img src={previewUrl} alt="Preview" className={styles.previewImage} />
                        </div>
                    )}

                    {errors.apiError && <div className={styles.error}>{errors.apiError}</div>}

                    <div className={styles.buttons}>
                        <button type="button" onClick={onClose} className={styles.cancel}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.submit} disabled={isSubmitting}>
                            {isSubmitting ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}