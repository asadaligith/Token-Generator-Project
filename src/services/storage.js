import {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from '../firebase/config.js';

export const uploadCertificate = async (file, companyId) => {
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `companies/${companyId}/certificates/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    
    return url;
  } catch (error) {
    console.error('Error uploading certificate:', error);
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
