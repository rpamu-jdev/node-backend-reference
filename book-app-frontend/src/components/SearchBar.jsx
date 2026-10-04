import './SearchBar.css'

export default function SearchBar({ searchAuthor, onSearchChange, totalBooks, filteredBooks }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="🔍 Search by author name..."
        value={searchAuthor}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      <div className="search-stats">
        {searchAuthor && (
          <span className="stats-text">
            Showing {filteredBooks} of {totalBooks} books
          </span>
        )}
        {!searchAuthor && (
          <span className="stats-text">
            Total books: {totalBooks}
          </span>
        )}
      </div>
    </div>
  )
}
