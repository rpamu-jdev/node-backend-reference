import { useState, useEffect } from 'react'
import { bookAPI } from '../services/api'
import Header from '../components/Header'
import BookList from '../components/BookList'
import AddBookForm from '../components/AddBookForm'
import SearchBar from '../components/SearchBar'
import LoadingScreen from '../components/LoadingScreen'
import './DashboardPage.css'

export default function DashboardPage({ token, onLogout }) {
  const [books, setBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchAuthor, setSearchAuthor] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    loadBooks()
  }, [])

  useEffect(() => {
    if (searchAuthor.trim()) {
      setFilteredBooks(books.filter(book =>
        book.author?.toLowerCase().includes(searchAuthor.toLowerCase())
      ))
    } else {
      setFilteredBooks(books)
    }
  }, [books, searchAuthor])

  const loadBooks = async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await bookAPI.getAll()
      setBooks(data)
    } catch (err) {
      setError('Failed to load books. Please try again.')
      console.error('Error loading books:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddBook = async (bookData) => {
    try {
      await bookAPI.create(bookData)
      await loadBooks()
      setShowAddForm(false)
    } catch (err) {
      setError('Failed to create book. Please try again.')
      console.error('Error creating book:', err)
    }
  }

  const handleDeleteBook = async (id) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        await bookAPI.delete(id)
        await loadBooks()
      } catch (err) {
        setError('Failed to delete book. Please try again.')
        console.error('Error deleting book:', err)
      }
    }
  }

  const handleRefresh = () => {
    loadBooks()
  }

  return (
    <div className="dashboard">
      <Header onLogout={onLogout} />

      <div className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1>📚 My Books Collection</h1>
            <p>Manage and explore your book library</p>
          </div>
          <button
            className="btn-add-book"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? '✕ Cancel' : '+ Add New Book'}
          </button>
        </div>

        {showAddForm && (
          <div className="form-section">
            <AddBookForm onAdd={handleAddBook} onCancel={() => setShowAddForm(false)} />
          </div>
        )}

        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        <div className="controls-section">
          <SearchBar
            searchAuthor={searchAuthor}
            onSearchChange={setSearchAuthor}
            totalBooks={books.length}
            filteredBooks={filteredBooks.length}
          />
          <button
            className={`btn-refresh ${isLoading ? 'loading' : ''}`}
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <span className="refresh-icon">🔄</span> {isLoading ? 'Refreshing...' : 'REFRESH'}
          </button>
        </div>

        {isLoading && <LoadingScreen message="Loading your books..." />}

        {!isLoading && filteredBooks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📖</div>
            <h2>No books found</h2>
            <p>
              {searchAuthor
                ? `No books by "${searchAuthor}" in your collection`
                : 'Your book collection is empty. Add a new book to get started!'}
            </p>
            {!searchAuthor && (
              <button
                className="btn-primary"
                onClick={() => setShowAddForm(true)}
              >
                + Add First Book
              </button>
            )}
          </div>
        ) : (
          <BookList
            books={filteredBooks}
            onDelete={handleDeleteBook}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  )
}
