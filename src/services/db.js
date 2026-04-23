import {
  db,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  onSnapshot,
  writeBatch,
  arrayUnion,
  orderBy,
  limit,
  getDoc,
} from '../firebase/config.js';

// ===== USER FUNCTIONS =====
export const updateUserRole = async (uid, role) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { role });
    console.log('User role updated');
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

export const getUserData = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

// ===== COMPANY FUNCTIONS =====
export const createCompany = async (companyData) => {
  try {
    const docRef = await addDoc(collection(db, 'companies'), {
      ...companyData,
      isActive: true,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating company:', error);
    throw error;
  }
};

export const getCompanies = async (ownerId) => {
  try {
    const q = query(
      collection(db, 'companies'),
      where('ownerId', '==', ownerId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching companies:', error);
    throw error;
  }
};

export const getAllCompanies = async () => {
  try {
    const q = query(collection(db, 'companies'), where('isActive', '==', true));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching all companies:', error);
    throw error;
  }
};

export const getCompanyById = async (companyId) => {
  try {
    const companyRef = doc(db, 'companies', companyId);
    const companySnap = await getDoc(companyRef);
    return companySnap.exists() ? { id: companyId, ...companySnap.data() } : null;
  } catch (error) {
    console.error('Error fetching company:', error);
    throw error;
  }
};

export const updateCompany = async (companyId, companyData) => {
  try {
    const companyRef = doc(db, 'companies', companyId);
    await updateDoc(companyRef, companyData);
    console.log('Company updated');
  } catch (error) {
    console.error('Error updating company:', error);
    throw error;
  }
};

export const searchCompanies = async (searchTerm) => {
  try {
    const companies = await getAllCompanies();
    return companies.filter((company) =>
      company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching companies:', error);
    throw error;
  }
};

// ===== TOKEN FUNCTIONS =====
export const createDailyTokens = async (tokenData) => {
  try {
    const docRef = await addDoc(collection(db, 'tokens'), {
      ...tokenData,
      isActive: true,
      currentToken: 0,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating tokens:', error);
    throw error;
  }
};

export const getTodayTokens = async (companyId) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const q = query(
      collection(db, 'tokens'),
      where('companyId', '==', companyId),
      where('date', '==', today)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.length > 0
      ? { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() }
      : null;
  } catch (error) {
    console.error('Error fetching today tokens:', error);
    throw error;
  }
};

export const updateTokenStatus = async (tokenId, updates) => {
  try {
    const tokenRef = doc(db, 'tokens', tokenId);
    await updateDoc(tokenRef, updates);
    console.log('Token updated');
  } catch (error) {
    console.error('Error updating token:', error);
    throw error;
  }
};

export const incrementCurrentToken = async (tokenId) => {
  try {
    const tokenRef = doc(db, 'tokens', tokenId);
    const tokenSnap = await getDoc(tokenRef);
    if (tokenSnap.exists()) {
      const currentToken = tokenSnap.data().currentToken || 0;
      await updateDoc(tokenRef, { currentToken: currentToken + 1 });
    }
  } catch (error) {
    console.error('Error incrementing current token:', error);
    throw error;
  }
};

// ===== BOOKING FUNCTIONS =====
export const createBooking = async (bookingData) => {
  try {
    // Get current token number
    const todayTokens = await getTodayTokens(bookingData.companyId);
    const totalBookings = await getCompanyBookings(bookingData.companyId);
    
    const tokenNumber = totalBookings.filter((b) => b.date === new Date().toISOString().split('T')[0]).length + 1;

    const docRef = await addDoc(collection(db, 'bookings'), {
      ...bookingData,
      tokenNumber,
      status: 'waiting',
      date: new Date().toISOString().split('T')[0],
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, tokenNumber };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const getCompanyBookings = async (companyId) => {
  try {
    const q = query(
      collection(db, 'bookings'),
      where('companyId', '==', companyId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

export const getUserBookings = async (userId) => {
  try {
    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
};

export const updateBookingStatus = async (bookingId, status) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    await updateDoc(bookingRef, { status, updatedAt: serverTimestamp() });
    console.log('Booking status updated');
  } catch (error) {
    console.error('Error updating booking:', error);
    throw error;
  }
};

export const subscribeToCompanyBookings = (companyId, callback) => {
  try {
    const q = query(collection(db, 'bookings'), where('companyId', '==', companyId));
    return onSnapshot(q, (querySnapshot) => {
      const bookings = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(bookings);
    });
  } catch (error) {
    console.error('Error subscribing to bookings:', error);
    throw error;
  }
};

// ===== REAL-TIME LISTENERS =====
export const subscribeToUserData = (uid, callback) => {
  try {
    const userRef = doc(db, 'users', uid);
    return onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      }
    });
  } catch (error) {
    console.error('Error subscribing to user data:', error);
    throw error;
  }
};

export const subscribeToTokens = (companyId, callback) => {
  try {
    const q = query(collection(db, 'tokens'), where('companyId', '==', companyId));
    return onSnapshot(q, (querySnapshot) => {
      const tokens = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(tokens);
    });
  } catch (error) {
    console.error('Error subscribing to tokens:', error);
    throw error;
  }
};
