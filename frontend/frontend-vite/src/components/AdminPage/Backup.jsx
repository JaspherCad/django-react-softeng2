import React, { useState, useEffect } from 'react';
import { createBackupAPI, getBackupHistoryAPI, restoreBackupAPI } from '../../api/axios';
import styles from './Backup.module.css';

// heres the flow on how did i make it work

// 1: http://172.30.8.74:8000/api/backup/
// to create backup

// 2: http://172.30.8.74:8000/api/backup/history/ to choose among those id

// 3:
// http://172.30.8.74:8000/api/backup/restore/6/

// to restore, then TERMINAL says "CONFIRM?" i have to type CONFIRM

// 4: after that, I had to 1: http://172.30.8.74:8000/api/backup/
// to create backup again because there's a bug, that's ok dont fix it anymore.



const Backup = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'warning'
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [restoringId, setRestoringId] = useState(null);

  // Fetch backup history
  const fetchBackups = async () => {
    try {
      setLoading(true);
      const response = await getBackupHistoryAPI();
      setBackups(response.data);
    } catch (error) {
      console.error('Error fetching backups:', error);
      showMessage('Failed to fetch backup history', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Create new backup
  const createBackup = async () => {
    try {
      setIsCreatingBackup(true);
      showMessage('Creating backup... This may take a few minutes.', 'warning');
      
      const response = await createBackupAPI();
      showMessage('Backup created successfully!', 'success');
      
      // Refresh backup list
      await fetchBackups();
    } catch (error) {
      console.error('Error creating backup:', error);
      showMessage('Failed to create backup: ' + (error.response?.data?.error || error.message), 'error');
    } finally {
      setIsCreatingBackup(false);
    }
  };

  // Restore backup
  const restoreBackup = async (backupId) => {
    const confirmed = window.confirm(
      `⚠️ WARNING: This will COMPLETELY REPLACE your current database and media files!\n\n` +
      `Are you sure you want to restore backup ID ${backupId}?\n\n` +
      `This action cannot be undone. A safety backup will be created automatically.`
    );

    if (!confirmed) return;

    try {
      setRestoringId(backupId);
      showMessage('Starting restore process... Please wait.', 'warning');
      
      // Step 1: Restore the backup
      const response = await restoreBackupAPI(backupId);
      showMessage('Restore completed! Creating post-restore backup...', 'warning');
      
      // Step 2: Create post-restore backup to update registry (fixes the bug)
      try {
        await createBackupAPI();
        showMessage('✅ Restore completed successfully! Registry updated with post-restore backup.', 'success');
      } catch (backupError) {
        console.error('Post-restore backup failed:', backupError);
        showMessage('⚠️ Restore completed but post-restore backup failed. Please create a backup manually.', 'warning');
      }
      
      // Refresh backup list after restore
      setTimeout(() => {
        fetchBackups();
      }, 2000);
      
    } catch (error) {
      console.error('Error restoring backup:', error);
      showMessage('Failed to restore backup: ' + (error.response?.data?.error || error.message), 'error');
    } finally {
      setRestoringId(null);
    }
  };

  // Show message helper
  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Format file size (if available)
  const getBackupSource = (backup) => {
    return backup.source === 'registry' ? '📄 Registry' : '💾 Database';
  };

  useEffect(() => {
    fetchBackups();
  }, []);

  return (
    <div className={styles.backupContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Backup Management</h1>
        <button 
          className={`${styles.createButton} ${isCreatingBackup ? styles.disabled : ''}`}
          onClick={createBackup}
          disabled={isCreatingBackup}
        >
          {isCreatingBackup ? (
            <>
              <span className={styles.spinner}></span>
              Creating Backup...
            </>
          ) : (
            '📦 Create New Backup'
          )}
        </button>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`${styles.message} ${styles[messageType]}`}>
          <span className={styles.messageIcon}>
            {messageType === 'success' && '✅'}
            {messageType === 'error' && '❌'}
            {messageType === 'warning' && '⚠️'}
          </span>
          {message}
        </div>
      )}

      {/* Instructions */}
      <div className={styles.instructions}>
        <h3>📋 How to use:</h3>
        <ol>
          <li><strong>Create Backup:</strong> Click "Create New Backup" to save current state</li>
          <li><strong>View History:</strong> Browse all available backups below</li>
          <li><strong>Restore:</strong> Click "Restore" on any backup to revert to that state</li>
          <li><strong>Safety:</strong> A safety backup is automatically created before restore</li>
        </ol>
      </div>

      {/* Backup List */}
      <div className={styles.backupList}>
        <h2 className={styles.listTitle}>
          📜 Backup History ({backups.length} backups)
        </h2>
        
        {loading ? (
          <div className={styles.loading}>
            <span className={styles.spinner}></span>
            Loading backups...
          </div>
        ) : backups.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📁</span>
            <p>No backups found. Create your first backup!</p>
          </div>
        ) : (
          <div className={styles.backupGrid}>
            {backups.map((backup) => (
              <div key={backup.id} className={styles.backupCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.backupId}>ID: {backup.id}</span>
                  <span className={styles.backupSource}>
                    {getBackupSource(backup)}
                  </span>
                </div>
                
                <div className={styles.cardBody}>
                  <div className={styles.backupInfo}>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Database:</span>
                      <span className={styles.value}>{backup.db_file}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Media:</span>
                      <span className={styles.value}>{backup.media_file}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Created:</span>
                      <span className={styles.value}>{formatTimestamp(backup.timestamp)}</span>
                    </div>
                    <div className={styles.infoRow}>
                      <span className={styles.label}>By:</span>
                      <span className={styles.value}>{backup.performed_by}</span>
                    </div>
                  </div>
                </div>
                
                <div className={styles.cardFooter}>
                  <button
                    className={`${styles.restoreButton} ${restoringId === backup.id ? styles.restoring : ''}`}
                    onClick={() => restoreBackup(backup.id)}
                    disabled={restoringId !== null}
                  >
                    {restoringId === backup.id ? (
                      <>
                        <span className={styles.spinner}></span>
                        Restoring...
                      </>
                    ) : (
                      '🔄 Restore'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className={styles.footer}>
        <div className={styles.footerInfo}>
          <p><strong>⚠️ Important Notes:</strong></p>
          <ul>
            <li>Restoring will replace ALL current data with the selected backup</li>
            <li>A safety backup is created automatically before each restore</li>
            <li>The restore process requires confirmation in the terminal</li>
            <li>A post-restore backup is automatically created to update the registry</li>
            <li>If post-restore backup fails, please create a backup manually</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Backup;