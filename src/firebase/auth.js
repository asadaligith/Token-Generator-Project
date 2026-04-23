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

const saveUserDataToFirestore = async (user) => {
  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDocs(query(collection(db, "users"), where("uid", "==", user.uid)));

    // If user already exists, don't overwrite
    if (!userSnap.empty) {
      console.log("User already exists in database");
      return;
    }

    // Save new user
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName || "",
      email: user.email || "",
      picture: user.photoURL || "",
      role: null, // To be set in Home page
      createdAt: serverTimestamp(),
    });

    console.log("User saved to Firestore");
  } catch (error) {
    console.error("Error saving user:", error);
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
  handleLogout,
  saveUserDataToFirestore,
} 
