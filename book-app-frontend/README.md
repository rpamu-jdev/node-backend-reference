# 📚 Book Manager Frontend

A modern React frontend application for managing a book library, built with Vite and Axios. This application consumes the Book API Learning Lab REST API.

## 🎯 Features

- **JWT Authentication**: Secure login with token-based authentication
- **Book Management**: Create, read, and delete books
- **Search & Filter**: Search books by author name
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Real-time Updates**: Instant book list refresh after operations
- **Error Handling**: User-friendly error messages and notifications
- **Modern UI**: Clean, intuitive interface with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone and navigate to the project:
```bash
cd book-app-frontend
npm install
```

2. Create a `.env` file (optional - defaults to localhost:8443):
```bash
cp .env.example .env
```

Edit `.env` if your backend runs on a different URL:
```
VITE_API_URL=http://localhost:8443/api
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## 📖 API Documentation

The frontend communicates with the Book API backend:

### Authentication
- **POST** `/api/auth/login` - Login with credentials
  - Body: `{ "username": "admin", "password": "password" }`
  - Response: JWT token

### Books
All endpoints require `Authorization: Bearer <token>` header

- **GET** `/api/books` - Get all books
  - Query params: `?author=name` (optional)
- **GET** `/api/books/:id` - Get book by ID
- **POST** `/api/books` - Create new book
  - Body: `{ "title": "...", "author": "...", "year": 2025 }`
- **DELETE** `/api/books/:id` - Delete book

## 🏗️ Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Header.jsx      # App header with logout
│   ├── BookList.jsx    # Book grid display
│   ├── BookCard.jsx    # Individual book card
│   ├── AddBookForm.jsx # Create book form
│   └── SearchBar.jsx   # Search and filter
├── pages/              # Full page components
│   ├── LoginPage.jsx   # Authentication page
│   └── DashboardPage.jsx # Main dashboard
├── services/
│   └── api.js          # Axios API client setup
├── App.jsx             # Root component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## 🎨 Features Detail

### Login Page
- Secure JWT-based authentication
- Demo credentials: admin / password
- Error handling and loading states

### Dashboard
- View all books in a responsive grid layout
- Add new books with title, author, and publication year
- Search books by author name
- Delete books with confirmation
- Real-time list updates
- Empty state messaging

### Styling
- CSS Grid for responsive layouts
- CSS Variables for theming
- Smooth transitions and animations
- Dark mode ready (CSS variables)

## 🔌 API Integration

The app uses Axios with interceptors for:
- Automatic token injection in headers
- Request/response error handling
- Auto-logout on 401 (unauthorized)

## 🌐 Deployment

### Vercel
```bash
npm run build
# Deploy the dist/ folder
```

### Docker
```bash
docker build -t book-app-frontend .
docker run -p 3000:80 book-app-frontend
```

## 🧪 Testing

The app includes Postman collection (`BookAPI_LearningLab.postman_collection.json`) in the backend repo for API testing.

## 📱 Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Mobile

## 🤝 Contributing

This is a learning project. Feel free to:
- Add more features (edit books, pagination, filtering)
- Improve styling and animations
- Add unit tests
- Optimize performance

## 📝 License

MIT - See the backend repo for details

## 🔗 Related

- [Backend Repository](https://github.com/rpamu-jdev/node-backend-reference)
- Book API Learning Lab

## 🎓 Learning Objectives

- Build a complete React application with Vite
- Implement JWT authentication in a frontend
- Create responsive, accessible components
- Manage application state and side effects
- Integrate with REST APIs using Axios
- Design modern, user-friendly interfaces

---

**Author**: Created as a companion to the Book API Learning Lab

For backend setup instructions, see the backend repository README.
