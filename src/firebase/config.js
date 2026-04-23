// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore ,  collection, addDoc, query, where, getDocs  } from "firebase/firestore";
import {
     getAuth ,
     FacebookAuthProvider,
     signInWithPopup,
        } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
 apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket:import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new FacebookAuthProvider();
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { 
  auth,
  provider,
  signInWithPopup,
  db,
  collection, addDoc, query, where, getDocs,
};