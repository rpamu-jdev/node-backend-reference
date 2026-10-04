import './BookCard.css'

export default function BookCard({ book, onDelete, isLoading }) {
  return (
    <div className="book-card">
      <div className="book-content">
        <div className="book-icon">📖</div>
        <h3 className="book-title" title={book.title}>{book.title}</h3>
        <p className="book-author">by {book.author || 'Unknown Author'}</p>
        {book.year && <p className="book-year">{book.year}</p>}
      </div>

      <div className="book-footer">
        <span className="book-id">ID: {book.id}</span>
        <button
          className="btn-delete"
          onClick={() => onDelete(book.id)}
          disabled={isLoading}
          title="Delete this book"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}
