import {
  storage,
  ref,
  uploadBytes,
  uploadString,
  getDownloadURL,
  deleteObject,
} from '../firebase/config.js';

export const uploadCertificate = async (file, companyId) => {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `companies/${companyId}/certificates/${fileName}`);
    
    console.log('Attempting upload to:', storageRef.fullPath);
    
    // We'll use a Promise to handle the file reading and upload
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64String = e.target.result;
          // uploadString can sometimes bypass preflight issues better than uploadBytes
          const snapshot = await uploadString(storageRef, base64String, 'data_url');
          const url = await getDownloadURL(snapshot.ref);
          console.log('Upload successful:', url);
          resolve(url);
        } catch (err) {
          console.error('Firebase uploadString error:', err);
          reject(err);
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  } catch (error) {
    console.error('Error in uploadCertificate:', error);
    throw error;
  }
};

export const uploadPatientImage = async (file, bookingId) => {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `bookings/${bookingId}/patient/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    
    return url;
  } catch (error) {
    console.error('Error uploading patient image:', error);
    throw error;
  }
};

export const deleteCertificate = async (companyId, fileName) => {
  try {
    const storageRef = ref(storage, `companies/${companyId}/certificates/${fileName}`);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting certificate:', error);
    throw error;
  }
};

export const deletePatientImage = async (bookingId, fileName) => {
  try {
    const storageRef = ref(storage, `bookings/${bookingId}/patient/${fileName}`);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting patient image:', error);
    throw error;
  }
};
