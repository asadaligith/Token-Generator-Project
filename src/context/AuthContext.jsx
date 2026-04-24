import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db, onAuthStateChanged, getDoc, doc, onSnapshot } from '../firebase/config.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        
        // Setup real-time listener for user data
        try {
          const userDocRef = doc(db, 'users', authUser.uid);
          
          // Use onSnapshot for real-time updates
          const unsubscribeSnapshot = onSnapshot(
            userDocRef,
            (userDocSnap) => {
              if (userDocSnap.exists()) {
                console.log('User data updated:', userDocSnap.data());
                setUserData(userDocSnap.data());
              } else {
                console.log('User document not found, will be created on first role selection');
                setUserData(null);
              }
              setLoading(false);
            },
            (error) => {
              console.error('Error listening to user data:', error);
              setLoading(false);
            }
          );

          // Return cleanup function for the listener
          return () => unsubscribeSnapshot();
        } catch (error) {
          console.error('Error setting up user listener:', error);
          setLoading(false);
        }
      } else {
        setUser(null);
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    userData,
    loading,
    isLoggedIn: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
