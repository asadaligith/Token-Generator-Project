import { useNavigate} from 'react-router';
import { provider , auth , db ,signInWithPopup ,  collection, addDoc, query, where, getDocs } from './config.js';
import { FacebookAuthProvider } from 'firebase/auth';



const handleFacebookLogin = async ()=>{
   await signInWithPopup(auth, provider)
  .then(async (result) => {
    // The signed-in user info.
    const user = result.user;

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    const credential = FacebookAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;

    console.log(user);
    console.log(accessToken);
    saveUserDataToFirestore(user);
    
  

    
      

   
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  })
  
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    
    // Handle normal user actions and browser blocking - don't log as errors
    if (errorCode === 'auth/popup-closed-by-user' || 
        errorCode === 'auth/cancelled-popup-request' ||
        errorCode === 'auth/popup-blocked') {
      
      if (errorCode === 'auth/popup-closed-by-user') {
        console.log("User closed the login popup");
      } else if (errorCode === 'auth/cancelled-popup-request') {
        console.log("Login popup was cancelled");
      } else if (errorCode === 'auth/popup-blocked') {
        console.warn("Popup was blocked by browser. Please enable popups and try again.");
        alert("Popup blocked! Please enable popups in your browser settings and try again.");
      }
      return;
    }
    
    // Log actual errors
    console.error("Facebook Login Error:", errorCode, errorMessage);
    
    // Try to extract credential from error if available
    try {
      const credential = FacebookAuthProvider.credentialFromError(error);
      if (credential) {
        console.error("Auth Credential Error:", credential);
      }
    } catch (err) {
      console.error("Could not extract credentials from error");
    }
  });


}

const saveUserDataToFirestore = async (user) => {
  
  try {
    // Check if user already exists by uid
    const userQuery = query(collection(db, "users"), where("uid", "==", user.uid));
    const querySnapshot = await getDocs(userQuery);
    
    // If user already exists, don't save
    if (!querySnapshot.empty) {
      console.log("User already exists in database. Skipping save.");
      return;
    }
    
    // If user doesn't exist, save new user
    const docRef = await addDoc(collection(db, "users"), {
       name: user.displayName,
       email: user.email,
       uid: user.uid,
       createdAt: new Date(),
      });
      console.log("Document written with ID: ", docRef.id);
      

    
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}

export {
 handleFacebookLogin
} 
