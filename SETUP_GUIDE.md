# Complete Setup Guide

## Step 1: Firebase Project Setup

### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a new project"
3. Name it "TokensManager" (or your preference)
4. Follow the setup wizard

### Enable Firebase Services

#### Authentication - Facebook
1. In Firebase Console, go to **Authentication**
2. Click "Get Started"
3. Go to **Sign-in method** tab
4. Click "Facebook"
5. Enable it
6. Enter Facebook App ID and Secret
7. Add `http://localhost:5173` to your Authorized redirect URLs
8. Copy your Facebook App ID

#### Cloud Firestore
1. Go to **Firestore Database**
2. Click "Create database"
3. Start in **Test mode** (for development)
4. Select a location (e.g., us-central1)
5. Click "Enable"

#### Storage
1. Go to **Storage**
2. Click "Get started"
3. Choose test mode
4. Click "Done"

### Get Firebase Configuration
1. Go to **Project Settings** (gear icon)
2. Copy your Firebase Config:
```
API Key
Auth Domain
Project ID
Storage Bucket
Messaging Sender ID
App ID
```

## Step 2: Facebook App Setup

### Create Facebook App
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Choose app type: "Consumer"
4. Fill app details
5. Go to **Settings → Basic**
6. Copy:
   - App ID
   - App Secret
7. Add your domain to **App Domains**: `localhost:5173`

### Configure Facebook Login
1. In Facebook App, add **Facebook Login** product
2. Go to **Facebook Login → Settings**
3. Add Valid OAuth Redirect URIs:
   - `http://localhost:5173/`
   - `http://localhost:5173/login`
   - Your production domain

## Step 3: Project Configuration

### Install Dependencies
```bash
cd Tokens-Generator
npm install
```

### Environment Variables
Create `.env.local` file:
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTHDOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECTID=your-project
VITE_FIREBASE_STORAGEBUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Step 4: Firestore Security Rules

In Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{uid} {
      allow read: if request.auth.uid == uid;
      allow write: if request.auth.uid == uid;
    }

    // Companies - public read, owner write
    match /companies/{companyId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.ownerId;
    }

    // Tokens - public read, company owner write
    match /tokens/{tokenId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == 
        get(/databases/$(database)/documents/companies/$(resource.data.companyId)).data.ownerId;
    }

    // Bookings
    match /bookings/{bookingId} {
      allow read: if request.auth.uid == resource.data.userId || 
        request.auth.uid == get(/databases/$(database)/documents/companies/$(resource.data.companyId)).data.ownerId;
      allow create: if request.auth.uid == request.resource.data.userId;
      allow update: if request.auth.uid == resource.data.userId || 
        request.auth.uid == get(/databases/$(database)/documents/companies/$(resource.data.companyId)).data.ownerId;
    }
  }
}
```

## Step 5: Storage Security Rules

In Firebase Console → Storage → Rules:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Allow users to upload their own files
    match /companies/{userId}/{allPaths=**} {
      allow write: if request.auth.uid == userId;
      allow read: if true;
    }

    match /bookings/{userId}/{allPaths=**} {
      allow write: if request.auth.uid == userId;
      allow read: if true;
    }
  }
}
```

## Step 6: Run Application

```bash
# Start development server
npm run dev

# The app will open at http://localhost:5173
```

## Step 7: First-Time Testing

### Test Flow
1. **Login**: Click "Login with Facebook"
2. **Role Selection**: Choose "Are you a company?" or "Are you finding tokens?"
3. **Company Flow**:
   - Create a company
   - Add daily tokens
   - See token queue
4. **User Flow**:
   - Search companies
   - View company details
   - Book a token

## 🚨 Common Issues & Solutions

### Issue: Popup Blocked
```
Error: Popup was blocked by browser
```
**Solution**: Allow popups for localhost in browser settings

### Issue: Firebase Config Not Loading
```
Error: Firebase config is undefined
```
**Solution**: 
- Check `.env.local` file exists
- Verify all environment variables are set
- Restart development server: `npm run dev`

### Issue: Facebook Login Fails
```
Error: auth/configuration-not-found or auth/popup-blocked
```
**Solution**:
- Verify Facebook App ID in Firebase Auth
- Check Authorized redirect URIs include localhost
- Ensure Facebook App is in development/live mode

### Issue: Upload Fails
```
Error: Permission denied for uploading to Storage
```
**Solution**:
- Check Storage security rules
- Verify user is authenticated
- Check file size (max 5MB)

### Issue: Real-time Updates Not Working
```
Bookings not updating automatically
```
**Solution**:
- Check Firestore security rules
- Verify listeners are properly initialized
- Check browser console for errors

## 📱 Production Deployment

### Before Production
1. Update Firestore rules (remove test mode)
2. Setup Firebase Hosting
3. Update Facebook App settings with production domain
4. Enable reCAPTCHA if needed
5. Setup Cloud Functions for daily token reset

### Deploy to Firebase Hosting
```bash
# Build
npm run build

# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy
firebase deploy
```

## 🔑 Important Notes

⚠️ **Never commit `.env.local` to Git!**
- Add to `.gitignore`
- Use environment variables on hosting platform

⚠️ **Keep Firebase Keys Secure**
- Restrict API Key in Firebase Console
- Use service accounts for backend operations

⚠️ **Test Security Rules**
- Always test with real user IDs
- Check for data exposure
- Validate all operations

## 📚 Helpful Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login)

## ✅ Setup Checklist

- [ ] Firebase project created
- [ ] Firebase services enabled
- [ ] Facebook app created
- [ ] Environment variables configured
- [ ] Firestore rules updated
- [ ] Storage rules updated
- [ ] Local development running
- [ ] Facebook login working
- [ ] Company creation working
- [ ] Token booking working

---

**Setup Complete!** 🎉

Your Token Management System is ready to use. Start with the user flows above to test all features.
