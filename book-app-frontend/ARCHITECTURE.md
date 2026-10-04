# 🏗️ Frontend Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    React Frontend                       │
│              (Vite + React 18.2 + Axios)               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │            UI Components (React JSX)             │  │
│  │  ┌─────────────┐  ┌──────────────┐             │  │
│  │  │ LoginPage   │  │ DashboardPage│             │  │
│  │  └─────────────┘  └──────────────┘             │  │
│  │         │                 │                      │  │
│  │  ┌──────┴─────┬───────────┴──────┬────────┐    │  │
│  │  │            │                  │        │    │  │
│  │  ▼            ▼                  ▼        ▼    │  │
│  │ Header    BookList          AddForm   SearchBar  │  │
│  │           │                                 │    │  │
│  │           └──►BookCard──────────────────────┘    │  │
│  └──────────────────────────────────────────────────┘  │
│           │                                            │
│           ▼                                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Application State (React Hooks)         │  │
│  │  - token (authentication)                       │  │
│  │  - books (book list)                            │  │
│  │  - filteredBooks (search results)               │  │
│  │  - isLoading (loading states)                   │  │
│  │  - error (error messages)                       │  │
│  └──────────────────────────────────────────────────┘  │
│           │                                            │
│           ▼                                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │      API Service Layer (Axios)                  │  │
│  │  - authAPI.login()                              │  │
│  │  - bookAPI.getAll(), getById(), create(),       │  │
│  │           delete()                              │  │
│  └──────────────────────────────────────────────────┘  │
│           │                                            │
│           ▼                                            │
├─────────────────────────────────────────────────────────┤
│         HTTP Requests with JWT Authentication         │
│         (Authorization: Bearer <token>)                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│         ┌─────────────────────────────────┐            │
│         │   Node.js Backend API           │            │
│         │   (http://localhost:8443/api)   │            │
│         │                                 │            │
│         │  - POST /auth/login             │            │
│         │  - GET  /books                  │            │
│         │  - GET  /books/:id              │            │
│         │  - POST /books                  │            │
│         │  - DELETE /books/:id            │            │
│         └─────────────────────────────────┘            │
│                      │                                 │
│                      ▼                                 │
│         ┌─────────────────────────────────┐            │
│         │   PostgreSQL Database           │            │
│         └─────────────────────────────────┘            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App
├── LoginPage
│   └── Form (username, password)
└── DashboardPage
    ├── Header
    │   └── Logout button
    ├── Controls
    │   ├── SearchBar
    │   └── Refresh button
    ├── AddBookForm (conditional)
    │   └── Form (title, author, year)
    └── BookList
        └── BookCard[] (map)
            ├── Book info
            └── Delete button
```

## Data Flow

### Authentication Flow
```
1. User enters credentials → LoginPage
2. LoginPage calls authAPI.login(username, password)
3. API sends POST to /api/auth/login
4. Backend returns JWT token
5. Token stored in localStorage
6. App state updates, shows DashboardPage
7. All subsequent requests include token in header
```

### Book Listing Flow
```
1. DashboardPage mounts
2. useEffect calls loadBooks()
3. bookAPI.getAll() sends GET /api/books
4. Backend returns book array
5. Books state updated
6. BookList component renders BookCard for each book
7. User can search, creating filteredBooks
```

### Adding Book Flow
```
1. User clicks "Add New Book"
2. AddBookForm component shown
3. User fills form and submits
4. handleAddBook() validates data
5. bookAPI.create(bookData) sends POST /api/books
6. Backend creates book and returns 201
7. loadBooks() refreshes list
8. UI updates with new book
9. Form hidden, success message shown
```

### Delete Book Flow
```
1. User clicks delete button on BookCard
2. Confirmation dialog appears
3. User confirms
4. bookAPI.delete(id) sends DELETE /api/books/:id
5. Backend returns 204 No Content
6. loadBooks() refreshes list
7. UI updates, book removed
```

### Search Flow
```
1. User types in SearchBar
2. onSearchChange updates searchAuthor state
3. useEffect re-runs
4. filteredBooks computed from books and searchAuthor
5. BookList receives filteredBooks instead of books
6. UI updates in real-time
7. Stats show filtered count
```

## State Management Strategy

### Local Component State (useState)
- Each component manages its own state
- Simple, doesn't need external library
- Examples:
  - LoginPage: username, password, error
  - DashboardPage: books, filteredBooks, searchAuthor
  - AddBookForm: formData, isSubmitting

### Side Effects (useEffect)
- Fetch data when component mounts
- Recompute filtered list when search changes
- Auto-logout on 401 errors

### Derived State
- filteredBooks derived from books + searchAuthor
- No duplicate state, reduces bugs

### Persistent State (localStorage)
- JWT token stored in localStorage
- Survives page reloads
- Checked on app startup

## API Client Design

### Axios Instance Configuration
```javascript
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})
```

### Request Interceptor
```javascript
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### Response Interceptor
```javascript
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, clear and redirect
      localStorage.removeItem('authToken')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)
```

### API Methods Organization
```javascript
export const authAPI = {
  login: async (username, password) => { ... }
}

export const bookAPI = {
  getAll: async (author) => { ... },
  getById: async (id) => { ... },
  create: async (bookData) => { ... },
  delete: async (id) => { ... }
}
```

## Styling Architecture

### CSS Organization
```
index.css          - Global styles and CSS variables
├── App.css        - Root layout
├── pages/
│   ├── LoginPage.css
│   └── DashboardPage.css
└── components/
    ├── Header.css
    ├── BookList.css
    ├── BookCard.css
    ├── AddBookForm.css
    └── SearchBar.css
```

### CSS Variables (Theming)
```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #10b981;
  --danger-color: #ef4444;
  --text-primary: #1f2937;
  --bg-color: #f9fafb;
  /* ... */
}
```

### Responsive Design
- Mobile-first approach
- Breakpoints: 480px, 768px
- CSS Grid for layouts
- Flexbox for components

## Performance Optimizations

### Current
- Code splitting via Vite
- CSS optimization
- Lazy state updates
- Efficient re-renders (components only re-render when state changes)

### Potential
- React.memo() for expensive components
- useCallback() for event handlers
- Pagination for large book lists
- Caching API responses
- Virtual scrolling for long lists

## Security Considerations

### Implemented
- JWT tokens stored securely (httpOnly would be better in production)
- Token automatically added to headers
- Auto-logout on 401
- CORS properly handled
- Input validation in forms
- XSS protection (React escapes by default)

### Recommendations
- Use httpOnly cookies instead of localStorage (requires backend changes)
- Implement CSRF protection
- Validate all user inputs
- Add rate limiting (backend)
- Use HTTPS in production

## Browser Compatibility

### Supported
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS 12+, Android 8+)

### Features Used
- ES6+ JavaScript
- CSS Grid and Flexbox
- LocalStorage API
- Fetch API (via Axios)

## Testing Strategy (Not Implemented, Ready for Addition)

### Unit Tests
- Component rendering
- Event handlers
- API service methods
- Form validation

### Integration Tests
- Login → Dashboard flow
- Add book → See in list
- Search → Filter books
- Delete → Remove from list

### E2E Tests
- Complete user journeys
- Error scenarios
- API failures

**Recommended tools:**
- Vitest (unit/integration)
- React Testing Library
- Cypress (E2E)

## Build and Deployment

### Development
```bash
npm run dev  # Vite dev server with HMR
```

### Production
```bash
npm run build  # Optimized bundle
```

Output:
- index.html
- js/main.*.js (minified)
- css/*.css (minified)
- ~100-150 KB total

### Deployment Targets
1. Vercel (recommended for React)
2. Netlify
3. Docker + K8s
4. AWS S3 + CloudFront
5. GitHub Pages (with routing workaround)

## Common Issues and Solutions

### CORS Errors
**Problem:** Backend not allowing requests
**Solution:** Check backend CORS configuration

### 401 Unauthorized
**Problem:** Token invalid or expired
**Solution:** Login again, check backend JWT_SECRET

### Blank Page
**Problem:** Script not loading
**Solution:** Check browser console, verify Vite config

### Slow Performance
**Problem:** Large book lists
**Solution:** Implement pagination or virtual scrolling

## Future Enhancements

- [ ] Edit books (PUT endpoint)
- [ ] Pagination
- [ ] Book cover images
- [ ] Sorting (by title, author, year)
- [ ] Advanced filtering
- [ ] User management
- [ ] Ratings and reviews
- [ ] Dark mode toggle
- [ ] Offline support (Service Workers)
- [ ] Real-time updates (WebSockets)
- [ ] Admin dashboard
- [ ] Book categories/tags
- [ ] User profiles
- [ ] Social features (share, favorites)

---

## Diagram Key
```
┌─ Container
│
├─ Process
│
└─ Decision/Data Storage
```

This architecture follows React best practices and is scalable for future enhancements.
