import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './UserDetail.module.css';
import axiosInstance from '../../api/axios';
import config from '../../config/config';

const UserDetail = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showSecQModal, setShowSecQModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [secQuestions, setSecQuestions] = useState([
    { question: '', answer: '' },
    { question: '', answer: '' },
    { question: '', answer: '' }
  ]);
  const [modalError, setModalError] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/users/${userId}`);
        console.log(response.data)
        setUser(response.data);
      } catch (err) {
        setError(err.message || 'Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleSecQuestionChange = (idx, field, value) => {
    setSecQuestions(qs => //questions array
      qs.map((q, i) => i === idx ? { ...q, [field]: value } : q)
    );
  };
 // we are building this
// {
//   "current_password": "password",
//   "questions": [
//     {
//       "question": "What is the name of your favorite pet?",
//       "answer": "Spot"
//     },
//     {
//       "question": "What is your mother's maiden name?",
//       "answer": "Smith"
//     },
//     {
//       "question": "In what city were you born?",
//       "answer": "Manila"
//     }
//   ]
// }




  const handleSecQSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setModalLoading(true);
    try {
      if (!currentPassword) throw new Error('Current password is required');
      for (let i = 0; i < 3; i++) {
        if (!secQuestions[i].question || !secQuestions[i].answer) {
          throw new Error('All questions and answers are required');
        }
      }
      
      await axiosInstance.post('/set-security-questions', {
        user_id: userId,
        questions: secQuestions 
      });
      
      setShowSecQModal(false);
      setCurrentPassword('');
      setSecQuestions([
        { question: '', answer: '' },
        { question: '', answer: '' },
        { question: '', answer: '' }
      ]);
      alert('Security questions updated!');
    } catch (err) {
      setModalError(err.response?.data?.error || err.message || 'Failed to update');
    } finally {
      setModalLoading(false);
    }
  };






  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  // Get first image or default avatar
  const userProfileImage = user.images?.[0]?.file || '/default-avatar.png';

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Viewing Employee #{user.user_id}</h1>

      <div className={styles.actions}>
        <button
          className={styles.updateButton}
          style={{ background: '#22c55e', marginLeft: 8 }}
          onClick={() => setShowSecQModal(true)}
        >
          <span className="material-symbols-outlined">lock_reset</span> Set Security Questions
        </button>
      </div>

      <div className={styles.detailCard}>
        <h2 className={styles.detailTitle}>Employee Details</h2>
        <hr className={styles.titleUnderline} />

        <div className={styles.infoGrid}>
          {/* Profile Image */}
          <div className={styles.imageContainer}>
            {user.images?.[0] ?
              (<>
                <img
                  src={config.getMediaURL(user.images?.[0]?.file)}
                  alt={`${user.first_name} ${user.last_name}`}
                  className={styles.profileImage}
                />
              </>) :
              (<>
                <img
                  src={'/default-avatar.png'}
                  alt={`${user.first_name} ${user.last_name}`}
                  className={styles.profileImage}
                />
              </>)}

          </div>

          {/* Basic Information */}
          <div className={styles.infoSection}>
            <div className={styles.field}>
              <strong>Name:</strong> {user.first_name} {user.last_name}
            </div>

            <div className={styles.field}>
              <strong>Employee ID:</strong> {user.user_id}
            </div>

            <div className={styles.field}>
              <strong>Role:</strong> {user.role}
            </div>

            <div className={styles.field}>
              <strong>Contact Number:</strong> {user.phone || 'N/A'}
            </div>

            <div className={styles.field}>
              <strong>Department:</strong> {user.department}
            </div>

            <div className={styles.field}>
              <strong>Status:</strong> {user.is_active ? 'Active' : 'Inactive'}
            </div>

            <div className={styles.field}>
              <strong>Birthdate:</strong> {user.birthdate?.split('-').reverse().join('/') || 'N/A'}
            </div>

            <div className={styles.field}>
              <strong>Address:</strong> {user.address || 'N/A'}
            </div>

            
          </div>
        </div>
      </div>

      {showSecQModal && (
  <div className={styles.modalOverlay}>
    <div className={styles.modal}>
      <h2>Set Security Questions</h2>
      <form onSubmit={handleSecQSubmit}>
        <div className={styles.field}>
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        {[0, 1, 2].map(idx => (
          <div key={idx} className={styles.field}>
            <label>Question {idx + 1}</label>
            <select
              value={secQuestions[idx].question}
              onChange={e => handleSecQuestionChange(idx, 'question', e.target.value)}
              required
            >
              <option value="">Select a question</option>
              {predefinedQuestions.map(q => (
                <option key={q} value={q}>{q}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Answer"
              value={secQuestions[idx].answer}
              onChange={e => handleSecQuestionChange(idx, 'answer', e.target.value)}
              required
            />
          </div>
        ))}
        {modalError && <div className={styles.error}>{modalError}</div>}
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button type="submit" className={styles.updateButton} disabled={modalLoading}>
            {modalLoading ? 'Saving...' : 'Saves'}
          </button>
          <button type="button" className={styles.cancelButton} onClick={() => setShowSecQModal(false)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default UserDetail;