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
} from './config.js';
import { FacebookAuthProvider } from 'firebase/auth';

const handleFacebookLogin = async () => {
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
    const result = await getRedirectResult(auth);
    if (result) {
      const user = result.user;
      await saveUserDataToFirestore(user);
      return result;
    }
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
    
    // Check if user document already exists
    const existingUserSnap = await getDocs(query(collection(db, "users"), where("uid", "==", user.uid)));

    // If user already exists, just return
    if (!existingUserSnap.empty) {
      console.log("User already exists in database");
      return;
    }

    // Save new user with merge option to ensure creation
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email || "",
      picture: user.photoURL || "",
      role: null, // To be set in Home page
      createdAt: serverTimestamp(),
    }, { merge: false }); // Don't merge, create fresh

    console.log("User saved to Firestore successfully");
  } catch (error) {
    console.error("Error saving user to Firestore:", error);
    // Don't throw - allow login to proceed even if document creation fails
    // The updateUserRole function will handle creation if needed
    console.warn("Continuing with login despite document creation error");
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
  handleRedirectResult,
  handleLogout,
  saveUserDataToFirestore,
} 
