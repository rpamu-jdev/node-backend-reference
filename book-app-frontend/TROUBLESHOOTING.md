# 🐛 Troubleshooting Guide

## Issue: Blank Page / Nothing Shows Up

### Most Common Cause: npm install Not Run

**Solution:**
```bash
cd /home/rpamu/workspace/metronavix/book-app-frontend
npm install
npm run dev
```

Then refresh browser: **Ctrl+R** or **Cmd+R**

---

## Issue: "Cannot GET /api/books"

### Problem
You can see the login page but after login, books don't load.

### Causes

**1. Backend not running**
```bash
# Check if backend is running on port 8443
curl http://localhost:8443/api/books
# Should see an error, but confirms backend is accessible
```

**Solution:** Start backend in another terminal:
```bash
cd /home/rpamu/workspace/node-backend-reference
npm start
```

**2. Wrong API URL**
Check `.env.local`:
```
VITE_API_URL=http://localhost:8443/api
```

If backend is on different port, update it.

**3. CORS Error**
Check browser console (F12 → Console tab)

If you see CORS error, backend CORS isn't enabled.

---

## Issue: "401 Unauthorized"

### Problem
Login succeeds but immediately logs out.

### Causes

**1. Token not stored**
```javascript
// In browser console:
localStorage.getItem('authToken')
// Should return a token string
```

If empty, token storage failed.

**2. Backend JWT_SECRET mismatch**
Make sure backend is using the same JWT_SECRET when generating tokens.

**3. Token expired**
Simply login again.

### Solution
1. Clear localStorage: F12 → Application → Local Storage → Clear
2. Login again
3. Check console for token

---

## Issue: "CORS Error" in Console

### Message
```
Access to XMLHttpRequest at 'http://localhost:8443/api/books' from origin
'http://localhost:5173' has been blocked by CORS policy
```

### Solution

**Backend needs CORS enabled:**

Check backend's `src/app.js` has CORS configuration.

If not, add:
```javascript
import cors from 'cors';
app.use(cors());
```

Then restart backend.

---

## Issue: Port Already in Use

### Message
```
Port 5173 is in use. Try another one? (y/n)
```

### Solution

**Option 1:** Use different port
```bash
npm run dev -- --port 3000
```

Then visit: http://localhost:3000

**Option 2:** Kill process using port
```bash
# Windows
netstat -ano | findstr :5173

# Mac/Linux
lsof -i :5173
kill -9 <PID>
```

---

## Issue: Module Not Found Errors

### Message
```
Error: Cannot find module 'react'
```

### Causes
- npm install not completed
- Dependencies corrupted

### Solution

```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## Issue: "Cannot read property 'map' of undefined"

### Likely in
`BookList.jsx` when `books` is undefined

### Causes
- API response format unexpected
- Data not loading before render

### Solution
Check browser Network tab (F12 → Network):
1. Click on `/api/books` request
2. Check Response tab
3. Verify it returns an array

---

## Issue: CSS Not Applying / Styling Broken

### Causes
- CSS file not imported
- CSS variables not defined
- Build cache issue

### Solution

**1. Check import exists:**
In component file, should have:
```jsx
import './ComponentName.css'
```

**2. Clear Vite cache:**
```bash
rm -rf dist .vite
npm run dev
```

**3. Check CSS variables:**
In `src/index.css`, should have:
```css
:root {
  --primary-color: #3b82f6;
  /* ... more variables */
}
```

---

## Issue: Form Not Submitting / Add Book Doesn't Work

### Solution Steps

**1. Check console for errors:**
F12 → Console tab → Look for red errors

**2. Verify form validation:**
All fields must be filled (Title, Author, Year)

**3. Check network request:**
F12 → Network tab → Look for POST /api/books

If request shows red X, check response for error.

**4. Verify backend is running:**
```bash
curl -X POST http://localhost:8443/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

Should return a token.

---

## Issue: Search/Filter Not Working

### Likely Cause
Search filters on client-side - should work instantly

### Solution

**1. Type in search bar** - should see real-time filtering

**2. If not filtering:**
F12 → Console → Look for errors

**3. Check logic in SearchBar.jsx:**
Should have:
```jsx
onSearchChange={(e) => setSearchAuthor(e.target.value)}
```

---

## Issue: Delete Button Not Working

### Solution

**1. Check confirmation dialog appears**
- Click delete button
- Should see browser confirmation
- Click "OK"

**2. Check network request:**
F12 → Network → Look for DELETE request

**3. If request fails:**
Check response in Network tab for error

**4. Verify token is set:**
```javascript
// In console:
localStorage.getItem('authToken')
```

Should not be empty.

---

## Issue: Page Keeps Logging Out / Can't Stay Logged In

### Causes

**1. Token not persisted**
```javascript
// Check in browser console:
localStorage.getItem('authToken')
```

If empty, token isn't being saved.

**2. Backend restarted**
Restart frontend to clear stale token:
```bash
npm run dev
```

**3. Session expired**
Simply login again.

---

## Issue: Slow Performance / App Freezes

### Solution

**1. Check Network tab (F12)**
Look for slow API requests

**2. Check browser memory usage**
Open DevTools → Performance tab → record

**3. Restart dev server:**
```bash
# Stop: Ctrl+C
npm run dev
```

---

## Issue: Can't Login At All

### Steps to Debug

**1. Check backend is running:**
```bash
curl http://localhost:8443
# Should get a response
```

**2. Test login manually:**
```bash
curl -X POST http://localhost:8443/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

Should return a token.

**3. Check network request in browser:**
F12 → Network → Click login → Look for `/api/auth/login` request
- Should be POST
- Status should be 200
- Response should have "token"

**4. If status is 401:**
Wrong credentials or backend auth issue.

**5. If status is 404:**
Backend might not have auth endpoint.

---

## Issue: "Vite is not defined" or "Vue is not defined"

### Cause
Wrong template or import issue

### Solution
Make sure you're in correct folder:
```bash
cd /home/rpamu/workspace/metronavix/book-app-frontend
```

Check files exist:
```bash
ls src/main.jsx
ls src/App.jsx
ls index.html
```

---

## Issue: Blank Page But No Errors

### Solution Steps

**1. Check if app is actually running:**
Look for this in terminal:
```
VITE v5.0.8  ready in XXX ms
```

**2. Open DevTools (F12):**
- Go to Console tab
- Go to Network tab
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

**3. Look for failed requests:**
Red X on network requests

**4. Check Application tab:**
- Local Storage → Check if token exists
- Check cookies

**5. Check index.html loads:**
Network tab → Click on main request → check 200 status

---

## Issue: Getting "TypeError: Cannot read property..."

### Generic Solution

**1. Find the error line in console**

**2. Open that file:**
```
src/components/BookCard.jsx line 42
```

**3. Check that value exists before using:**
```jsx
// Bad:
<div>{book.title}</div>

// Good:
<div>{book?.title || 'No title'}</div>
```

**4. Add console.log to debug:**
```jsx
console.log('book:', book)
```

---

## Quick Diagnosis Checklist

Run this checklist when something breaks:

- [ ] Is backend running? (curl http://localhost:8443)
- [ ] Is frontend running? (See "ready in XXX ms")
- [ ] Are there errors in console? (F12 → Console)
- [ ] Are there network errors? (F12 → Network)
- [ ] Is token stored? (Check localStorage)
- [ ] Is .env.local correct? (Check VITE_API_URL)
- [ ] Are all dependencies installed? (ls node_modules)
- [ ] Have you tried hard refresh? (Ctrl+Shift+R)

---

## Nuclear Option: Total Reset

If nothing works:

```bash
# Stop dev server (Ctrl+C)

# Clean everything
rm -rf node_modules package-lock.json dist .vite

# Reinstall
npm install

# Run again
npm run dev
```

Then:
1. Visit http://localhost:5173
2. Hard refresh: Ctrl+Shift+R
3. Open F12 console
4. Try to login

---

## Still Stuck?

Check these files in order:
1. **INSTALLATION.md** - Make sure npm install completed
2. **SETUP.md** - Configuration issues
3. **README.md** - Feature documentation
4. **ARCHITECTURE.md** - How everything works

---

## Report an Issue

When asking for help, provide:

```
1. What you did:
   - What command did you run?

2. What you expected:
   - What should happen?

3. What happened:
   - What actually happened?
   - Include error message

4. Debugging info:
   - Console errors (F12)
   - Network requests (F12 → Network)
   - Terminal output
   - Browser version
```

This helps solve issues faster! 🚀

---

**Last Resort:** Delete entire folder and reclone from scratch:
```bash
rm -rf /home/rpamu/workspace/metronavix/book-app-frontend
# Reclone or recreate
```

Good luck! 🐛→✅
