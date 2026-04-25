// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { 
  getFirestore,
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  arrayUnion,
  serverTimestamp,
  orderBy,
  limit,
  Timestamp
} from "firebase/firestore";
import {
  getAuth,
  FacebookAuthProvider,
  signInWithCredential,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  browserLocalPersistence,
  setPersistence,
  getRedirectResult,
} from "firebase/auth";
import { getStorage, ref, uploadBytes, uploadString, getDownloadURL, deleteObject } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if all config values are present
const isConfigValid = Object.values(firebaseConfig).every(value => value !== undefined && value !== '');

if (!isConfigValid) {
  console.error('Firebase configuration is incomplete. Check your environment variables.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set explicit persistence to local storage to handle cross-site storage issues on mobile/Safari
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.error("Auth persistence error:", err);
});
const provider = new FacebookAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);
const messaging = getMessaging(app);

export {
  auth,
  provider,
  FacebookAuthProvider,
  signInWithCredential,
  signInWithPopup,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  db,
  storage,
  messaging,
  getToken,
  onMessage,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  arrayUnion,
  serverTimestamp,
  orderBy,
  limit,
  Timestamp,
  ref,
  uploadBytes,
  uploadString,
  getDownloadURL,
  deleteObject,
};