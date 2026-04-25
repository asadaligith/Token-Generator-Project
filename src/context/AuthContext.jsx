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
          const firestoreUrl = `https://console.firebase.google.com/project/${db.app.options.projectId}/firestore/data/~2Fusers~2F${authUser.uid}`;
          
          console.log('--- FIRESTORE DEBUG ---');
          console.log('Project ID:', db.app.options.projectId);
          console.log('👉 CLICK THIS LINK TO SEE YOUR DATA:', firestoreUrl);
          console.log('-----------------------');
          
          // Use onSnapshot for real-time updates
          const unsubscribeSnapshot = onSnapshot(
            userDocRef,
            (userDocSnap) => {
              if (userDocSnap.exists()) {
                console.log('User data found in Firestore:', userDocSnap.data());
                setUserData(userDocSnap.data());
              } else {
                console.log('No Firestore document yet for UID:', authUser.uid);
                setUserData(null);
              }
              setLoading(false);
            },
            (error) => {
              console.error('CRITICAL PERMISSION ERROR:', error.code, error.message);
              console.warn('Check your Firestore Rules at: https://console.firebase.google.com/project/' + db.app.options.projectId + '/firestore/rules');
              
              // CRITICAL FIX: Don't stay in loading state!
              // Provide a dummy userData so the app can at least render
              setUserData({ 
                uid: authUser.uid, 
                name: authUser.displayName || 'User',
                isGuest: true 
              });
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
