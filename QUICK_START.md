# ⚡ Quick Start Guide

## 🎯 In 5 Minutes

### 1. Get Firebase Credentials
- Create account at [firebase.google.com](https://firebase.google.com)
- Create a new project
- Enable: **Authentication (Facebook)**, **Firestore**, **Storage**
- Copy your Firebase config

### 2. Get Facebook App ID
- Create app at [developers.facebook.com](https://developers.facebook.com)
- Go to "My Apps" → Create App → Consumer
- Copy your **App ID**
- Add Facebook Login product
- Add `localhost:5173` to App Domains

### 3. Configure Project
```bash
# Copy and fill with your credentials
cp .env.example .env.local

# Edit .env.local with:
# - Firebase config values
# - Facebook App ID (if setting up auth)
```

### 4. Run It!
```bash
npm install
npm run dev
```

Visit: `http://localhost:5173`

## 🧪 Test the App

### Company Flow
1. Click "Login with Facebook"
2. Choose "Are you a company?"
3. Create a company (name, timings, location)
4. Upload certificates (3 max)
5. Add daily tokens (50 tokens, 10 min each)
6. See bookings appear in real-time

### User Flow
1. Login with different account
2. Choose "Finding tokens?"
3. Search companies
4. Click company to view details
5. Book a token
6. See status update in real-time

## 📊 Key Features Implemented

✅ **Authentication**
- Facebook login only
- Auto save user to Firestore
- Role-based routing

✅ **Company Module**
- Multiple company management
- Daily token system
- Real-time queue tracking
- Certificate uploads (3 max)

✅ **User Module**
- Company search
- Company details view
- Token booking with image upload
- Booking history

✅ **Real-time Updates**
- Live queue updates
- Status tracking
- Token counter updates

✅ **Database**
- Firestore collections for users, companies, tokens, bookings
- Real-time listeners
- Security rules

✅ **UI/UX**
- Responsive design (Tailwind CSS)
- Icons (React Icons)
- Loading states
- Error handling

✅ **File Upload**
- Company certificates to Firebase Storage
- Patient images for bookings
- Secure URLs

## 📁 What's Included

### Pages
- `Login.jsx` - Facebook authentication
- `Home.jsx` - Role selection (company/user)
- `CompanyDashboard.jsx` - Company management
- `UserDashboard.jsx` - Search & my bookings
- `CompanyDetails.jsx` - Company info & token booking

### Components
- `CompanyCreationModal.jsx` - Create company form
- `TokenManagementPanel.jsx` - Token queue management

### Services
- `db.js` - Firestore operations (CRUD)
- `storage.js` - Firebase Storage uploads
- `auth.js` - Facebook authentication
- `notifications.js` - Notification system

### Utilities
- `AuthContext.jsx` - Global auth state
- `ProtectedRoute.jsx` - Route guards
- `helpers.js` - Utility functions

## 🔥 Next Steps

### Ready to Enhance?
- [ ] Add Foursquare API for address search
- [ ] Integrate Google Maps
- [ ] Setup Cloud Functions for daily reset
- [ ] Add payment system
- [ ] Create mobile app

### To Deploy
```bash
npm run build        # Build for production
firebase deploy      # Deploy to Firebase Hosting
```

## 🆘 Quick Fixes

**Facebook popup blocked?**
→ Allow popups in browser settings

**Environment variables not loading?**
→ Restart dev server after creating `.env.local`

**Can't login?**
→ Check Firebase Auth has Facebook enabled

**Images not uploading?**
→ Check Firebase Storage security rules

**Real-time updates not working?**
→ Check Firestore security rules and listeners

## 📚 Documentation

- `PROJECT_DOCUMENTATION.md` - Full documentation
- `SETUP_GUIDE.md` - Detailed setup instructions
- This file - Quick start guide

## 🎓 Learning Resources

- [Firebase Docs](https://firebase.google.com/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)

## 💡 Architecture Overview

```
User (Browser)
    ↓
React App (Vite)
    ├─ Components (UI)
    ├─ Context (State)
    └─ Services (Firebase)
         ├─ Authentication (Facebook)
         ├─ Firestore (Database)
         └─ Storage (Images)
```

## 🎯 Features by Module

### Authentication
- Facebook login
- Auto-save user data
- Role assignment

### Company Owner
- Create/manage companies  
- Set daily tokens
- Manage queue
- View bookings
- Mark tokens as done

### Regular User
- Search companies
- Book tokens
- Upload patient images
- Track bookings
- Get notifications

## 📈 Scalability

Current implementation supports:
- ✅ Multiple companies per owner
- ✅ Unlimited users
- ✅ Real-time updates (100+ concurrent users)
- ✅ Image storage (Firebase Storage)
- ✅ High-frequency read/writes (Firestore)

## 🚀 Performance Tips

- Lazy load routes with React Router
- Use real-time listeners sparingly
- Optimize image sizes before upload
- Add pagination for large lists
- Use Firestore indexes for queries

---

**You're all set! 🎉**

Start the dev server and explore the app. Check the documentation for more details.

Questions? Check Firebase docs or React documentation.

Happy coding! 💻
