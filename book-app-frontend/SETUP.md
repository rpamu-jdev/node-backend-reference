# 📚 Book Manager Frontend - Setup Guide

## Prerequisites

Before you start, ensure you have:
- **Node.js** 16.x or higher (download from [nodejs.org](https://nodejs.org))
- **npm** (comes with Node.js)
- **Git** (for version control)
- The **Book API Backend** running on `http://localhost:8443`

Verify installations:
```bash
node --version
npm --version
```

## 1️⃣ Backend Setup (If Not Already Done)

First, ensure the backend is running:

```bash
cd ../node-backend-reference
npm install
npm start
```

You should see:
```
🚀 REST + SOAP running at http://localhost:8443
```

**Default Credentials:**
- Username: `admin`
- Password: `password`

## 2️⃣ Frontend Installation

Navigate to the frontend directory and install dependencies:

```bash
cd ../book-app-frontend
npm install
```

This installs:
- **React 18.2** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API calls

## 3️⃣ Configuration

The app is pre-configured to connect to `http://localhost:8443/api`.

If your backend runs on a different URL, update `.env.local`:

```bash
# .env.local
VITE_API_URL=http://your-backend-url/api
```

## 4️⃣ Start Development Server

```bash
npm run dev
```

You'll see:
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Open **http://localhost:5173** in your browser.

## 5️⃣ Login

Use the default credentials:
- **Username:** admin
- **Password:** password

Or set up your own by modifying the backend's auth controller.

## 🎯 Features to Try

### Add a Book
1. Click **"+ Add New Book"** button
2. Fill in Title, Author, and Publication Year
3. Click **"✓ Add Book"**

### Search Books
1. Use the search bar to filter by author name
2. Results update in real-time

### Delete a Book
1. Click the **🗑️** icon on any book card
2. Confirm deletion

### Refresh List
1. Click the **🔄 Refresh** button to reload books
2. Useful after external changes

## 🏗️ Project Structure

```
book-app-frontend/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   ├── Header.jsx       # Top navigation bar
│   │   ├── BookList.jsx     # Grid layout of books
│   │   ├── BookCard.jsx     # Individual book card
│   │   ├── AddBookForm.jsx  # Form to create books
│   │   └── SearchBar.jsx    # Search and filter
│   ├── pages/
│   │   ├── LoginPage.jsx    # Login/auth page
│   │   └── DashboardPage.jsx # Main dashboard
│   ├── services/
│   │   └── api.js           # Axios API client
│   ├── App.jsx              # Root component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
└── .env.local               # Environment variables
```

## 🔑 API Integration

All API calls are handled by the `api.js` service:

```javascript
// Login
authAPI.login(username, password)

// Get all books (with optional author filter)
bookAPI.getAll(authorName)

// Get single book
bookAPI.getById(bookId)

// Create book
bookAPI.create({ title, author, year })

// Delete book
bookAPI.delete(bookId)
```

Authentication is automatic - the JWT token is stored in localStorage and injected into all API requests.

## 🧪 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run linter
npm run lint
```

## 🚀 Build for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized files ready for deployment.

### Deploy Options

**Vercel (Recommended)**
```bash
npm install -g vercel
vercel
```

**Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

**Docker**
```bash
# Create Dockerfile
cat > Dockerfile << 'EOF'
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

# Build and run
docker build -t book-app-frontend .
docker run -p 3000:80 book-app-frontend
```

## 🐛 Troubleshooting

### "Cannot GET /api/books"
- Ensure backend is running on port 8443
- Check `VITE_API_URL` in `.env.local`

### "CORS Error"
- Backend needs CORS enabled
- Check backend's `app.js` for CORS configuration

### "401 Unauthorized"
- Token may be expired
- Clear localStorage and login again
- Check backend JWT_SECRET matches

### Port 5173 Already in Use
```bash
npm run dev -- --port 3000
```

### Module not found errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Axios Documentation](https://axios-http.com)
- [REST API Concepts](https://restfulapi.net)

## 🤝 Contributing

Want to enhance the frontend?

**Ideas:**
- Add pagination for large book lists
- Implement book editing (PUT endpoint)
- Add book cover images
- Create admin dashboard
- Add book ratings/reviews
- Implement dark mode toggle
- Add unit tests with Vitest
- Create Storybook for components

## 📝 Notes

- Application state is stored in React component state
- Authentication token is stored in browser localStorage
- No external backend database needed (backend handles that)
- All styling is vanilla CSS with CSS variables for theming

## 🆘 Support

If you encounter issues:

1. Check browser console (F12) for errors
2. Check network tab for API failures
3. Verify backend is running
4. Review error messages carefully
5. Check `.env.local` configuration

## ✅ Checklist

Before considering setup complete:

- [ ] Node.js and npm installed
- [ ] Backend running on localhost:8443
- [ ] `npm install` completed
- [ ] Development server started with `npm run dev`
- [ ] App accessible at http://localhost:5173
- [ ] Can login with admin/password
- [ ] Can view books from database
- [ ] Can add new book successfully
- [ ] Can search books by author
- [ ] Can delete books

Once all items are checked, you're ready to develop! 🎉

---

For backend documentation, see `../node-backend-reference/README.md`
