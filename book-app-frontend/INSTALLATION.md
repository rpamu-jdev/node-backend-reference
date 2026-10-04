# 🔧 Complete Installation Guide

## ⚠️ Important: Run These Commands on YOUR Local Machine

**NOT in this environment** - This is just where the files are stored.

---

## Step 1: Prerequisites Check

Before you start, verify you have Node.js and npm installed:

```bash
node --version    # Should show 16.0.0 or higher
npm --version     # Should show 8.0.0 or higher
```

**Don't have Node.js?**
→ Download from [nodejs.org](https://nodejs.org/) (LTS version recommended)

---

## Step 2: Navigate to Project

```bash
cd /home/rpamu/workspace/metronavix/book-app-frontend
```

---

## Step 3: Install Dependencies (THIS IS REQUIRED!)

```bash
npm install
```

This will:
- Create `node_modules/` folder
- Install all packages from `package.json`
- Create `package-lock.json`

**Take 2-3 minutes to complete**

Expected output:
```
added 300+ packages in 2m
```

---

## Step 4: Start Backend (In First Terminal)

```bash
cd /home/rpamu/workspace/node-backend-reference
npm install  # if you haven't done this yet
npm start
```

You should see:
```
🚀 REST + SOAP running at http://localhost:8443
```

**Leave this running!**

---

## Step 5: Start Frontend (In Second Terminal)

```bash
cd /home/rpamu/workspace/metronavix/book-app-frontend
npm run dev
```

You should see:
```
VITE v5.0.8  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

---

## Step 6: Open in Browser

Visit: **http://localhost:5173**

You should see the login page! ✅

---

## Step 7: Login

Use these credentials:
```
Username: admin
Password: password
```

Click **Login** button.

---

## 🎉 Success!

If you see the dashboard with books, everything is working! 🚀

---

## ❌ If It's Still Blank

### Check 1: Is npm install done?
```bash
ls node_modules  # Should show many folders
```

If empty, run:
```bash
npm install
```

### Check 2: Check for errors in terminal

**Terminal 1 (Frontend):**
```
npm run dev
```

Look for red error messages. If you see any, screenshot and check **TROUBLESHOOTING.md**

### Check 3: Check browser console

Press **F12** → Go to **Console** tab

Look for red error messages.

### Check 4: Verify backend is running

Visit: **http://localhost:8443**

You should see a response. If not, backend isn't running.

### Check 5: Clear cache and reinstall

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📊 What Should Happen

| Step | Status | What You Should See |
|------|--------|---------------------|
| npm install | ⏳ Running | "added XXX packages" |
| npm run dev | ⏳ Running | "ready in XXX ms" |
| http://localhost:5173 | ✅ Open | Login page |
| Login with admin/password | ✅ Click | Dashboard with books |
| Click "Add New Book" | ✅ Click | Form appears |
| Type book details | ✅ Fill | Form with input fields |
| Click "Add Book" | ✅ Click | Book appears in grid |
| Search by author | ✅ Type | List filters in real-time |
| Click delete button | ✅ Click | Confirmation dialog |
| Confirm delete | ✅ Confirm | Book disappears |

---

## 🚨 Common Problems

### Problem: "npm: command not found"
**Solution:** Node.js not installed properly
- Download from nodejs.org
- Restart your terminal after installation

### Problem: "Cannot GET /api/books"
**Solution:** Backend not running
- Make sure first terminal shows "REST + SOAP running at http://localhost:8443"
- Check VITE_API_URL in .env.local is correct

### Problem: "Blank page with white screen"
**Solution:** Likely npm install not completed
1. Check if `node_modules/` folder exists
2. If not, run `npm install`
3. Restart `npm run dev`

### Problem: "Error about missing dependencies"
**Solution:** 
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Problem: Port 5173 already in use
**Solution:**
```bash
npm run dev -- --port 3000
```

Then visit http://localhost:3000

---

## ✅ Checklist Before Declaring Success

- [ ] Node.js 16+ installed
- [ ] npm install completed (node_modules folder exists)
- [ ] Backend running on :8443
- [ ] Frontend running on :5173
- [ ] Can see login page at localhost:5173
- [ ] Can login with admin/password
- [ ] Can see books list on dashboard
- [ ] Can add a new book
- [ ] Can search books by author
- [ ] Can delete a book

Once all items are checked ✅, you're good to go!

---

## 🔄 Development Workflow

After everything is installed and running:

1. **Edit code** in `src/` folder
2. **Save file** - page auto-refreshes
3. **See changes** immediately in browser
4. **No need to restart** `npm run dev`

---

## 📞 Need More Help?

| Issue | File to Read |
|-------|--------------|
| Installation | This file (INSTALLATION.md) |
| Quick start | QUICKSTART.md |
| Setup & config | SETUP.md |
| Understanding code | ARCHITECTURE.md |
| All features | README.md |

---

## 🎯 Next Steps (After Installation Works)

1. ✅ Get app running
2. Explore the UI and features
3. Read ARCHITECTURE.md
4. Look at component code
5. Try modifying CSS colors
6. Try adding a new component

---

**Remember:** This must be done on YOUR local machine where Node.js is installed!

Good luck! 🚀
