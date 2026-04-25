import { 
  provider, 
  auth, 
  db, 
  signInWithPopup, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  setDoc,
  doc,
  serverTimestamp,
  signOut,
  getRedirectResult,
  signInWithCredential,
  FacebookAuthProvider,
} from './config.js';
import { facebookLogin, initFacebookSDK } from '../utils/facebookSDK.js';

const handleFacebookLogin = async () => {
  try {
    return await handleFacebookLoginWithSDK();
  } catch (error) {
    // If it's a permission error, don't fallback/retry, it will just fail again
    if (error.code === 'permission-denied' || error.message?.includes('permissions')) {
      console.error("Critical Permission Error during login. Stopping loop.");
      throw error;
    }
    
    console.warn("SDK login failed, falling back to Firebase Popup:", error);
    return await handleFacebookLoginFirebase();
  }
};

const handleFacebookLoginWithSDK = async () => {
  try {
    console.log("Initializing Facebook SDK...");
    // Fallback for localhost (Facebook SDK blocks HTTP)
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    if (isLocalhost) {
      console.log('Localhost detected, using Firebase Popup fallback...');
      const result = await signInWithPopup(auth, provider);
      await saveUserDataToFirestore(result.user);
      return result;
    }

    // Production flow (Facebook SDK + Manual Credential)
    await initFacebookSDK();
    
    return new Promise((resolve, reject) => {
      window.FB.login(async (response) => {
        if (response.authResponse) {
          try {
            const { accessToken } = response.authResponse;
            const credential = FacebookAuthProvider.credential(accessToken);
            const result = await signInWithCredential(auth, credential);
            
            // CRITICAL: Save to Firestore BEFORE resolving
            await saveUserDataToFirestore(result.user);
            
            resolve(result);
          } catch (error) {
            console.error('Firebase exchange error:', error);
            reject(error);
          }
        } else {
          reject(new Error('User cancelled login or did not fully authorize.'));
        }
      }, { scope: 'email,public_profile' });
    });
  } catch (error) {
    console.error("Facebook SDK Login Error:", error);
    throw error;
  }
};

const handleFacebookLoginFirebase = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Save user data to Firestore
    await saveUserDataToFirestore(user);

    return result;
  } catch (error) {
    const errorCode = error.code;

    // Handle normal user actions and browser blocking
    if (errorCode === 'auth/popup-closed-by-user' ||
      errorCode === 'auth/cancelled-popup-request' ||
      errorCode === 'auth/popup-blocked') {

      if (errorCode === 'auth/popup-blocked') {
        alert("Popup blocked! Please enable popups in your browser settings and try again.");
      }
      return null;
    }

    console.error("Facebook Login Error:", errorCode, error.message);
    throw error;
  }
};

const handleRedirectResult = async () => {
  try {
    console.log("Checking for Firebase redirect result...");
    const result = await getRedirectResult(auth);
    if (result) {
      console.log("Found redirect result:", result.user.uid);
      const user = result.user;
      await saveUserDataToFirestore(user);
      return result;
    }
    console.log("No redirect result found.");
    return null;
  } catch (error) {
    console.error("Error processing redirect result:", error);
    // Specifically catch 'auth/missing-initial-state' and explain it
    if (error.code === 'auth/missing-initial-state') {
      console.warn("Missing initial state detected. This often happens due to third-party cookie blocking.");
    }
    return null;
  }
};

const saveUserDataToFirestore = async (user) => {
  try {
    const userRef = doc(db, "users", user.uid);
    
    const userData = {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email || "",
      picture: user.photoURL || "",
      createdAt: serverTimestamp(),
    };

    // Add a small retry/delay to ensure auth state is fully propagated
    await setDoc(userRef, userData, { merge: true });
    console.log('User document successfully saved/updated in Firestore');
  } catch (error) {
    if (error.code === 'permission-denied') {
      console.warn('PERMISSION DENIED: Could not save user data, but continuing login...', error.message);
      // We don't throw here so the user can still log in
      return;
    }
    console.error('Error saving user to Firestore:', error);
    throw error;
  }
};

const handleLogout = async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export {
  handleFacebookLogin,
  handleFacebookLoginWithSDK,
  handleRedirectResult,
  handleLogout,
  saveUserDataToFirestore,
} 
