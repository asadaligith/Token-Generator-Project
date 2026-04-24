# 🧪 TESTING GUIDE - User Role Selection Fix

## Quick Test (2 minutes)

### 1. Start the App
```bash
# Make sure you're in the project directory
npm run dev
```
**Expected:** Dev server starts on http://localhost:5173 or http://localhost:5174

### 2. Open Browser
Go to http://localhost:5174 (or whatever port is shown)

### 3. Open DevTools Console
Press `F12` to open developer tools, then click "Console" tab

### 4. Test Login
- Click "Facebook Login" button
- Authenticate with your Facebook account
- You should be redirected to Home page with your name displayed

**Expected Console Output:**
```
✅ User saved to Firestore successfully
```

### 5. Test Company Role Selection
- Click the "Are you a company?" card
- Watch the console for messages

**Expected Console Output:**
```
✅ Setting role: company for user: [YOUR_UID]
✅ User role updated
✅ Role set successfully, navigating...
```

**Expected Navigation:**
- Page should navigate to `/company/dashboard`
- Company dashboard page should load

### 6. Test User Role Selection
- Go back to Home page (refresh or click back)
- Click "Are you finding tokens?" card

**Expected Console Output:**
```
✅ Setting role: user for user: [YOUR_UID]
✅ User role updated
✅ Role set successfully, navigating...
```

**Expected Navigation:**
- Page should navigate to `/user/dashboard`
- User dashboard page should load with company search

---

## Verification Checklist

### Login Flow
- [ ] Facebook login works
- [ ] User data is saved to Firestore
- [ ] No "connection failed" errors
- [ ] Home page displays user name

### Role Selection - Company
- [ ] Click company card doesn't show error
- [ ] Console shows "User role updated"
- [ ] Navigation to `/company/dashboard` works
- [ ] Company dashboard loads successfully

### Role Selection - User
- [ ] Click user card doesn't show error
- [ ] Console shows "User role updated"
- [ ] Navigation to `/user/dashboard` works
- [ ] User dashboard loads successfully

### Error Prevention
- [ ] No "No document to update" errors
- [ ] No Firestore permission errors
- [ ] No console red errors (warnings are OK)
- [ ] Loading states work properly

---

## Common Test Scenarios

### Scenario 1: Fresh Login
1. Clear browser cache (Ctrl+Shift+Delete)
2. Go to http://localhost:5174
3. Login with Facebook (first time)
4. Select a role
5. **Expected:** Works without errors ✅

### Scenario 2: Already Logged In
1. Refresh page while logged in
2. Click a role card
3. **Expected:** Works instantly without errors ✅

### Scenario 3: Switch Roles
1. Login and select "company" role
2. Go back and clear role (optional)
3. Select "user" role
4. **Expected:** Successfully switches roles ✅

### Scenario 4: Multiple Tabs
1. Open app in two browser tabs
2. Login in tab 1
3. Select role in tab 1
4. Check if tab 2 updates automatically
5. **Expected:** Real-time update visible in tab 2 ✅

---

## Expected vs Actual

### ✅ FIXED - What You Should See Now

| Action | Expected | Status |
|--------|----------|--------|
| Click Company Card | Navigate to company dashboard | ✅ Works |
| Click User Card | Navigate to user dashboard | ✅ Works |
| Console | No red errors | ✅ Works |
| Firestore | User role field updated | ✅ Works |

### ❌ BEFORE FIX - What Was Happening

| Action | Error | Status |
|--------|-------|--------|
| Click Company Card | "No document to update" | ❌ Fixed |
| Click User Card | "No document to update" | ❌ Fixed |
| Console | Red "FirebaseError" | ❌ Fixed |
| Firestore | Role never saved | ❌ Fixed |

---

## Console Messages to Look For

### ✅ Success Messages (Good)
```
✓ User saved to Firestore successfully
✓ Setting role: company for user: xxx
✓ User role updated
✓ Role set successfully, navigating...
✓ User data updated: {uid, name, email, picture, role, createdAt}
```

### ⚠️ Warning Messages (Okay)
```
⚠ Continuing with login despite document creation error
⚠ User document not found, will be created on first role selection
```

### ❌ Error Messages (Bad - Report Issue)
```
❌ FirebaseError: No document to update
❌ FirebaseError: Missing required fields
❌ Error updating user role: ...
❌ Firestore permission denied
```

---

## Troubleshooting

### Issue: Still Getting "No document to update" Error

**Solutions:**
1. **Clear Cache**
   ```bash
   # Press F12, go to Application tab
   # Clear Cookies, Local Storage, and Cache Storage
   ```

2. **Hard Refresh**
   ```
   Ctrl+Shift+R (Windows)
   Cmd+Shift+R (Mac)
   ```

3. **Check Firestore Rules**
   - Go to Firebase Console
   - Check Firestore Security Rules
   - Make sure they allow writes to `/users/{uid}`

4. **Restart Dev Server**
   ```bash
   # Stop: Ctrl+C
   npm run dev
   ```

### Issue: Login Not Working

**Check:**
1. Firebase credentials in `.env.local`
2. Facebook App ID is correct
3. Redirect URIs configured in Facebook App
4. Network connection

### Issue: Real-time Updates Not Working

**Check:**
1. Browser supports WebSockets
2. No firewall blocking Firestore
3. Firestore Security Rules allow reads
4. AuthContext is properly initialized

---

## Performance Check

### Expected Performance
- **Login Time:** < 3 seconds
- **Role Selection:** < 1 second
- **Navigation:** Instant
- **Console Logs:** < 100ms

### Monitor Performance
1. Open DevTools
2. Click "Performance" tab
3. Record while clicking role card
4. Check for long tasks or delays

---

## Mobile Testing

### Test on Mobile Browser
1. Same network as computer
2. Find IP address: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. Open http://[YOUR_IP]:5174 on phone
4. Test login and role selection
5. Check responsiveness

---

## Automated Test Commands

```bash
# Run linter to check for code issues
npm run lint

# Build production version (checks for errors)
npm run build

# Preview production build
npm run preview
```

---

## Success Criteria

✅ **Test Passed When:**
- [ ] Login works with Facebook
- [ ] No "No document to update" errors
- [ ] Role cards both work (company & user)
- [ ] Correct dashboard loads after role selection
- [ ] Page refresh remembers selected role
- [ ] No red console errors
- [ ] Real-time updates work (open two tabs)

---

## Next Steps After Testing

1. ✅ **If All Tests Pass**
   - Deploy to Firebase Hosting
   - Share with team
   - Monitor in production

2. ❌ **If Tests Fail**
   - Check browser console for errors
   - Check Firestore in Firebase Console
   - Review FIX_DOCUMENTATION.md
   - Verify Firebase credentials

---

**Test Date:** _______________  
**Tester Name:** _______________  
**Status:** ☐ Passed ☐ Failed  
**Issues Found:** _______________  

---

**For Questions:** See FIX_DOCUMENTATION.md
