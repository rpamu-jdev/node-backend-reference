import { useState } from 'react'
import './AddBookForm.css'

export default function AddBookForm({ onAdd, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: new Date().getFullYear(),
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) || 0 : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.title.trim()) {
      setError('Book title is required')
      return
    }

    if (!formData.author.trim()) {
      setError('Author name is required')
      return
    }

    if (formData.year < 1000 || formData.year > new Date().getFullYear() + 10) {
      setError('Please enter a valid year')
      return
    }

    setIsSubmitting(true)
    try {
      await onAdd(formData)
      setFormData({
        title: '',
        author: '',
        year: new Date().getFullYear(),
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add book')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="add-book-form">
      <h2>📕 Add New Book</h2>

      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="title">Book Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter book title"
          disabled={isSubmitting}
          maxLength="200"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="author">Author *</label>
        <input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          placeholder="Enter author name"
          disabled={isSubmitting}
          maxLength="150"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="year">Publication Year</label>
        <input
          type="number"
          id="year"
          name="year"
          value={formData.year}
          onChange={handleChange}
          placeholder="Enter year"
          disabled={isSubmitting}
          min="1000"
          max={new Date().getFullYear() + 10}
        />
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : '✓ Add Book'}
        </button>
        <button
          type="button"
          className="btn-cancel"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
