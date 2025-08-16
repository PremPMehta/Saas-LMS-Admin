import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import FirstTimePasswordModal from './profile/FirstTimePasswordModal';

const FirstTimeLoginWrapper = ({ children }) => {
  const { user, updateUser } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {
    // Check if user needs to change password on first login
    if (user && user.isFirstLogin) {
      setShowPasswordModal(true);
    }
  }, [user]);

  const handlePasswordChanged = (result) => {
    // Update user data to reflect password change
    updateUser({
      isFirstLogin: false,
      lastLoginAt: result.data.lastLoginAt
    });
    
    // Close the modal
    setShowPasswordModal(false);
  };

  return (
    <>
      {children}
      <FirstTimePasswordModal
        open={showPasswordModal}
        onPasswordChanged={handlePasswordChanged}
        userEmail={user?.email || ''}
      />
    </>
  );
};

export default FirstTimeLoginWrapper;
