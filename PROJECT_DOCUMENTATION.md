# Token Management System Web App

A modern React + Firebase web application for managing tokens in companies with real-time updates, user booking system, and notifications.

## 🎯 Features

### ✅ Authentication
- **Facebook Login** only (no signup required)
- Automatic user data synchronization with Firestore
- Role-based access control (Company/User)

### 🏢 Company Module
- Create and manage multiple companies
- Daily token management system
- Real-time queue management
- Certificate uploads (max 3 images)
- Company location/address tracking
- Token status tracking (waiting/done/cancelled)

### 👥 User Module  
- Search companies by name
- View company details, timings, and certificates
- Book tokens with optional patient images
- Real-time token status tracking
- Estimated wait time calculation
- View booking history

### 📊 Real-Time Features
- Live token queue updates
- Real-time booking notifications
- Current token progress tracking
- Automatic queue management

### 🔔 Notifications
- Local browser notifications
- Token turn notifications (10 minutes before)
- Booking confirmation notifications
- Queue update notifications

## 🛠️ Tech Stack

### Frontend
- **React 19** with Vite
- **React Router** v7 for navigation
- **Context API** for state management
- **Formik + Yup** for form handling
- **Tailwind CSS** for styling
- **React Icons** for icons
- **Leaflet + React-Leaflet** for maps

### Backend
- **Firebase Authentication** (Facebook)
- **Firestore** (Real-time Database)
- **Firebase Storage** (Image uploads)
- **Firebase Cloud Messaging** (FCM) - Optional

## 📦 Installation

### 1. Clone and Install
```bash
cd Tokens-Generator
npm install
```

### 2. Setup Firebase

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable these services:
   - Authentication (Facebook)
   - Cloud Firestore
   - Storage
   - Cloud Messaging (Optional)

3. Get your Firebase config from Firebase Console

### 3. Environment Setup

```bash
# Copy the example file
cp .env.example .env.local

# Update .env.local with your Firebase credentials
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTHDOMAIN=xxx
VITE_FIREBASE_PROJECTID=xxx
VITE_FIREBASE_STORAGEBUCKET=xxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxx
VITE_FIREBASE_APP_ID=xxx
```

### 4. Setup Facebook App

1. Create a Facebook App at [developers.facebook.com](https://developers.facebook.com)
2. Add Facebook Login as a product
3. Configure your app domain
4. Update Firebase Auth with your Facebook App ID

### 5. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── Company/
│   │   ├── CompanyCreationModal.jsx
│   │   └── TokenManagementPanel.jsx
│   └── User/
├── pages/
│   ├── Home/
│   │   └── Home.jsx
│   ├── Company/
│   │   └── CompanyDashboard.jsx
│   └── User/
│       ├── UserDashboard.jsx
│       └── CompanyDetails.jsx
├── context/
│   └── AuthContext.jsx
├── services/
│   ├── db.js (Firestore operations)
│   ├── storage.js (Firebase Storage)
│   └── notifications.js (Notifications)
├── routes/
│   └── ProtectedRoute.jsx
├── utils/
│   └── helpers.js
└── firebase/
    ├── config.js
    └── auth.js
```

## 🗂️ Firestore Database Structure

```
users/
  {uid}
    - name
    - email
    - picture
    - role: "company" | "user" | null
    - createdAt

companies/
  {companyId}
    - ownerId
    - name
    - since
    - timings
    - address: { name, lat, lng }
    - certificates: [url]
    - isActive
    - createdAt

tokens/
  {tokenId}
    - companyId
    - totalTokens
    - currentToken
    - estimatedTimePerToken
    - isActive
    - date: "YYYY-MM-DD"
    - createdAt

bookings/
  {bookingId}
    - companyId
    - userId
    - tokenNumber
    - patientImage (URL)
    - status: "waiting" | "done" | "cancelled"
    - date: "YYYY-MM-DD"
    - createdAt
```

## 🔐 Security Rules

### Firestore Rules
```javascript
// Users can only read/write their own data
match /users/{uid} {
  allow read, write: if request.auth.uid == uid;
}

// Companies - owner can write, everyone can read
match /companies/{document=**} {
  allow read: if true;
  allow write: if request.auth.uid == resource.data.ownerId;
}

// Tokens - same as companies
match /tokens/{document=**} {
  allow read: if true;
  allow write: if request.auth.uid == get(/databases/$(database)/documents/companies/$(resource.data.companyId)).data.ownerId;
}

// Bookings
match /bookings/{document=**} {
  allow read: if request.auth.uid == resource.data.userId || request.auth.uid == get(/databases/$(database)/documents/companies/$(resource.data.companyId)).data.ownerId;
  allow create: if request.auth.uid == request.resource.data.userId;
}
```

## 🔄 Real-Time Updates

The app uses Firestore real-time listeners to:
- Update token queue automatically
- Notify users of their turn
- Show real-time company status
- Update booking status

## 📝 Usage

### For Companies

1. **Login** with Facebook
2. **Choose "Are you a company?"** on Home page
3. **Create a company** with name, timings, location, certificates
4. **Add daily tokens** - Set total tokens and estimated time per token
5. **Manage queue** - View waiting bookings and mark as done
6. **Track earnings** - Real-time booking tracking

### For Users

1. **Login** with Facebook
2. **Choose "Finding tokens?"** on Home page
3. **Search companies** by name
4. **View company details** - See timings, certificates, wait time
5. **Book a token** - Upload patient image and get token number
6. **Receive notifications** - 10 minutes before your turn
7. **Track status** - See all your bookings

## 🚀 Future Enhancements

- [ ] Foursquare API integration for address search
- [ ] Google Maps integration for company location display
- [ ] Firebase Cloud Functions for automatic daily reset
- [ ] Payment/Subscription system
- [ ] Company analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Video call integration for services
- [ ] Rating and review system
- [ ] SMS/Email notifications
- [ ] Multi-language support

## 🐛 Troubleshooting

### Popup Blocked
- Enable popups in your browser settings for localhost

### Firebase Errors
- Check environment variables are correct
- Verify Firebase rules allow your operations
- Check network tab in browser console

### Images Not Uploading
- Verify Firebase Storage bucket is created
- Check file size (max 5MB recommended)
- Ensure CORS is configured if needed

## 📄 License

This project is created for educational purposes.

## 📧 Support

For issues or questions, please check:
1. Firebase documentation: https://firebase.google.com/docs
2. React documentation: https://react.dev
3. Tailwind CSS: https://tailwindcss.com

---

**Made with ❤️ using React + Firebase**
