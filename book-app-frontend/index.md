# 📚 Book Manager Frontend - Complete Index

Welcome to the Book Manager frontend application! This file serves as your starting point for understanding and using the project.

## 📖 Documentation Guide

### For Quick Start (5-10 minutes)
→ **[QUICKSTART.md](../QUICKSTART.md)** - Get up and running immediately

### For Setup & Installation (15 minutes)
→ **[SETUP.md](./SETUP.md)** - Detailed installation and configuration guide

### For Understanding the Project (10 minutes)
→ **[README.md](./README.md)** - Project features, structure, and overview

### For Technical Deep Dive (20+ minutes)
→ **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System design and component architecture

### For Complete Overview (from parent directory)
→ **[FRONTEND_SUMMARY.md](../FRONTEND_SUMMARY.md)** - Comprehensive project summary

---

## 🎯 What Is This?

A **React 18 + Vite** frontend application that:
- 🔐 Provides secure JWT-based authentication
- 📚 Manages a book library (CRUD operations)
- 🔍 Offers real-time search by author
- 📱 Works on desktop, tablet, and mobile
- 🎨 Features modern, responsive design

## 🚀 Quick Commands

```bash
# Install dependencies (do this first!)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Key Files You'll Work With

| File | Purpose |
|------|---------|
| `src/App.jsx` | Root component, authentication logic |
| `src/pages/LoginPage.jsx` | Login interface |
| `src/pages/DashboardPage.jsx` | Main dashboard with book management |
| `src/components/BookCard.jsx` | Individual book display |
| `src/components/AddBookForm.jsx` | Create new books |
| `src/services/api.js` | API client configuration |
| `src/index.css` | Global styles and theme |

## 🔗 Backend Connection

This frontend connects to the **Book API Backend** at:
```
http://localhost:8443/api
```

**Location**: `/home/rpamu/workspace/node-backend-reference`

Ensure the backend is running before starting the frontend!

## 🎮 Features at a Glance

### 🔐 Authentication
- Secure login with JWT tokens
- Token stored in localStorage
- Auto-logout on 401 errors
- Demo account: admin / password

### 📖 Book Management
| Feature | Status |
|---------|--------|
| View all books | ✅ Ready |
| Search by author | ✅ Ready |
| Add new books | ✅ Ready |
| Delete books | ✅ Ready |
| Edit books | ⏳ Coming |
| Pagination | ⏳ Coming |

### 🎨 User Interface
- Modern gradient design
- Responsive grid layout
- Smooth animations
- Loading states
- Error handling
- Empty states

## 📊 Project Structure

```
src/
├── pages/              # Full page components
│   ├── LoginPage.jsx
│   └── DashboardPage.jsx
├── components/         # Reusable components
│   ├── Header.jsx
│   ├── BookList.jsx
│   ├── BookCard.jsx
│   ├── AddBookForm.jsx
│   └── SearchBar.jsx
├── services/
│   └── api.js          # API client
├── App.jsx             # Root component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## 🔧 Configuration

### API URL
Edit `.env.local`:
```
VITE_API_URL=http://localhost:8443/api
```

### Port
The app runs on `http://localhost:5173` by default.

To change:
```bash
npm run dev -- --port 3000
```

## 📚 Technology Stack

| Tech | Version | Purpose |
|------|---------|---------|
| React | 18.2.0 | UI framework |
| Vite | 5.0.8 | Build tool |
| Axios | 1.6.0 | HTTP client |
| CSS | Vanilla | Styling |
| Node | 16+ | Runtime |

## 🎓 Learning Outcomes

By exploring this project, you'll learn:
- React hooks (useState, useEffect)
- Component composition
- REST API consumption
- JWT authentication
- Form handling
- Responsive CSS design
- Build tools (Vite)
- Modern development practices

## 🐛 Troubleshooting Quick Links

Common issues and solutions:

1. **"npm: command not found"**
   → Install Node.js from nodejs.org

2. **"Cannot GET /api/books"**
   → Backend not running on :8443

3. **"CORS Error"**
   → Check backend CORS configuration

4. **"401 Unauthorized"**
   → Login again, token expired

5. **Port already in use**
   → `npm run dev -- --port 3000`

For more solutions, see SETUP.md → Troubleshooting

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Ensure Backend is Running
```bash
# In another terminal
cd ../node-backend-reference
npm start
```

### Step 3: Start Frontend
```bash
npm run dev
```

Visit `http://localhost:5173` and login!

## 🎯 Common Tasks

### Modify Styling
Edit files in `src/`:
- `index.css` - Global styles
- `pages/*.css` - Page-specific styles  
- `components/*.css` - Component styles

### Change API URL
Edit `.env.local`:
```
VITE_API_URL=http://new-url/api
```

### Add New Component
1. Create `src/components/MyComponent.jsx`
2. Create `src/components/MyComponent.css`
3. Import in parent component
4. Add to JSX

### Debug Issues
1. Open DevTools (F12)
2. Check Console tab
3. Check Network tab
4. Install React DevTools extension

## 📞 Where to Find Things

| What | Where |
|------|-------|
| Features overview | README.md |
| Installation steps | SETUP.md |
| System design | ARCHITECTURE.md |
| API details | services/api.js |
| Components | components/ folder |
| Styling | All .css files |
| Configuration | vite.config.js |
| Dependencies | package.json |

## ✨ Tips & Tricks

### Hot Reload
Save any file and the browser auto-refreshes. Component state is preserved!

### CSS Variables
Change colors and styles globally:
```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #10b981;
  /* More... */
}
```

### Developer Tools
- React DevTools extension
- Browser DevTools (F12)
- Network inspection
- Console logging

## 🔗 Useful Links

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Axios Docs](https://axios-http.com)
- [REST API Guide](https://restfulapi.net)
- [Backend Repository](../node-backend-reference)

## 📈 Next Steps

1. **Immediate**: Get the app running (QUICKSTART.md)
2. **Short Term**: Explore the codebase (README.md)
3. **Medium Term**: Understand architecture (ARCHITECTURE.md)
4. **Long Term**: Add features and deploy

## 🎉 You're All Set!

Everything is ready. Just run:
```bash
npm install
npm run dev
```

Then visit `http://localhost:5173` and start exploring! 🚀

---

**Need Help?** Check the documentation files in order:
1. QUICKSTART.md (fastest)
2. SETUP.md (most detailed)
3. ARCHITECTURE.md (most technical)
4. README.md (comprehensive)
5. FRONTEND_SUMMARY.md (complete overview)

Happy coding! 📚✨
