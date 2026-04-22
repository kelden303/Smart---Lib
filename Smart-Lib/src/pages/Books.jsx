import { useState } from 'react'
import { FaPlus, FaSearch, FaInfoCircle, FaTimes, FaBook, FaTh, FaList } from 'react-icons/fa'
import './BookModal.css'

// Category colors mapping
const categoryColors = {
  'Fiction': { bg: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' },
  'Science': { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981' },
  'Technology': { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' },
  'History': { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' },
  'Mathematics': { bg: 'rgba(236, 72, 153, 0.15)', color: '#ec4899' },
  'Philosophy': { bg: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' },
  'Biography': { bg: 'rgba(14, 165, 233, 0.15)', color: '#0ea5e9' },
  'default': { bg: 'rgba(100, 116, 139, 0.15)', color: '#64748b' }
}

function getCategoryStyle(category) {
  return categoryColors[category] || categoryColors['default']
}

function Books({ books, addBook, currentUser, borrowBook }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showDescription, setShowDescription] = useState(false)
  const [selectedBook, setSelectedBook] = useState(null)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    quantity: 1,
    description: '',
    publisher: '',
    publishedYear: '',
    imageUrl: ''
  })

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    const bookData = {
      ...newBook,
      available: newBook.quantity,
      publishedYear: newBook.publishedYear ? parseInt(newBook.publishedYear) : null
    }
    addBook(bookData)
    setNewBook({ title: '', author: '', isbn: '', category: '', quantity: 1, description: '', publisher: '', publishedYear: '', imageUrl: '' })
    setShowForm(false)
  }

  const handleShowDescription = (book) => {
    setSelectedBook(book)
    setShowDescription(true)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Books Management</h1>
        <div className="header-actions">
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <FaTh />
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <FaList />
            </button>
          </div>
          {currentUser?.role?.toLowerCase() === 'admin' && (
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              <FaPlus /> Add Book
            </button>
          )}
        </div>
      </div>

      {/* Slide-over Add Book Drawer */}
      <div className={`drawer-overlay ${showForm ? 'show' : ''}`} onClick={() => setShowForm(false)}>
        <div className="drawer-content add-book-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="drawer-header">
            <div className="drawer-title-icon">
              <FaPlus />
            </div>
            <div>
              <h2>Add New Book</h2>
              <p>Register a new title in the library system</p>
            </div>
            <button className="drawer-close" onClick={() => setShowForm(false)}>
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="drawer-form">
            <div className="drawer-section">
              <label>Basic Information</label>
              <div className="drawer-group">
                <span>Title</span>
                <input type="text" value={newBook.title} onChange={(e) => setNewBook({...newBook, title: e.target.value})} required placeholder="e.g. The Great Gatsby" />
              </div>
              <div className="drawer-group">
                <span>Author</span>
                <input type="text" value={newBook.author} onChange={(e) => setNewBook({...newBook, author: e.target.value})} required placeholder="Full name of author" />
              </div>
              <div className="drawer-group-row">
                <div className="drawer-group">
                  <span>ISBN-13</span>
                  <input type="text" value={newBook.isbn} onChange={(e) => setNewBook({...newBook, isbn: e.target.value})} required placeholder="13 digits" />
                </div>
                <div className="drawer-group">
                  <span>Quantity</span>
                  <input type="number" value={newBook.quantity} onChange={(e) => setNewBook({...newBook, quantity: parseInt(e.target.value) || 1})} min="1" required />
                </div>
              </div>
            </div>

            <div className="drawer-section">
              <label>Metadata & Categorization</label>
              <div className="drawer-group">
                <span>Category</span>
                <select value={newBook.category} onChange={(e) => setNewBook({...newBook, category: e.target.value})} required>
                  <option value="">Select Category</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Science">Science</option>
                  <option value="Technology">Technology</option>
                  <option value="Fantasy">Fantasy</option>
                  <option value="Biography">Biography</option>
                  <option value="History">History</option>
                  <option value="Self-Help">Self-Help</option>
                  <option value="Mystery">Mystery</option>
                </select>
              </div>
              <div className="drawer-group-row">
                <div className="drawer-group">
                  <span>Publisher</span>
                  <input type="text" value={newBook.publisher} onChange={(e) => setNewBook({...newBook, publisher: e.target.value})} placeholder="Publishing house" />
                </div>
                <div className="drawer-group">
                  <span>Year</span>
                  <input type="number" value={newBook.publishedYear} onChange={(e) => setNewBook({...newBook, publishedYear: e.target.value})} min="1000" max="2099" placeholder="2024" />
                </div>
              </div>
            </div>

            <div className="drawer-section">
              <label>Appearance & Description</label>
              <div className="drawer-group">
                <span>Cover Image URL</span>
                <input type="url" value={newBook.imageUrl} onChange={(e) => setNewBook({...newBook, imageUrl: e.target.value})} placeholder="https://..." />
                {newBook.imageUrl && (
                  <div className="drawer-image-preview">
                    <img src={newBook.imageUrl} alt="Preview" onError={(e) => e.target.style.display='none'} />
                  </div>
                )}
              </div>
              <div className="drawer-group">
                <span>Summary</span>
                <textarea 
                  value={newBook.description} 
                  onChange={(e) => setNewBook({...newBook, description: e.target.value})}
                  rows="3"
                  placeholder="Brief overview of the book..."
                />
              </div>
            </div>

            <div className="drawer-actions">
              <button type="button" className="drawer-btn-secondary" onClick={() => setShowForm(false)}>Discard</button>
              <button type="submit" className="drawer-btn-primary">Add to Library</button>
            </div>
          </form>
        </div>
      </div>

      {/* Book Description Modal */}
      {showDescription && selectedBook && (
        <div className="modal-overlay" onClick={() => setShowDescription(false)}>
          <div className="modal-content book-modal-premium" onClick={(e) => e.stopPropagation()}>
            <div className="modal-sidebar">
              <div className="modal-book-cover">
                {selectedBook.imageUrl ? (
                  <img 
                    src={selectedBook.imageUrl} 
                    alt={selectedBook.title} 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div 
                  className="placeholder-cover-premium" 
                  style={{ 
                    display: selectedBook.imageUrl ? 'none' : 'flex',
                    background: `linear-gradient(135deg, ${getCategoryStyle(selectedBook.category).color} 0%, #000 100%)` 
                  }}
                >
                  <FaBook />
                  <span>{selectedBook.title.charAt(0)}</span>
                </div>
              </div>
              <div className="modal-sidebar-stats">
                <div className={`modal-status-badge ${selectedBook.available > 0 ? 'available' : 'out'}`}>
                  {selectedBook.available > 0 ? 'In Stock' : 'Out of Stock'}
                </div>
                <div className="modal-availability-bar">
                  <div className="bar-fill" style={{ width: `${(selectedBook.available / selectedBook.quantity) * 100}%` }}></div>
                </div>
                <p>{selectedBook.available} of {selectedBook.quantity} available</p>
              </div>
            </div>

            <div className="modal-main-content">
              <button className="modal-close-btn" onClick={() => setShowDescription(false)}>
                <FaTimes />
              </button>

              <div className="modal-header-info">
                <span className="modal-category" style={{ background: getCategoryStyle(selectedBook.category).bg, color: getCategoryStyle(selectedBook.category).color }}>
                  {selectedBook.category}
                </span>
                <h2>{selectedBook.title}</h2>
                <p className="modal-author">by <span>{selectedBook.author}</span></p>
              </div>

              <div className="modal-details-grid">
                <div className="detail-box">
                  <label>ISBN-13</label>
                  <p>{selectedBook.isbn}</p>
                </div>
                <div className="detail-box">
                  <label>Publisher</label>
                  <p>{selectedBook.publisher || 'N/A'}</p>
                </div>
                <div className="detail-box">
                  <label>Year</label>
                  <p>{selectedBook.publishedYear || 'N/A'}</p>
                </div>
                <div className="detail-box">
                  <label>Added On</label>
                  <p>{new Date(selectedBook.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="modal-description">
                <h3>About this book</h3>
                <p>{selectedBook.description || 'No description available for this book.'}</p>
              </div>

              <div className="modal-footer-actions">
                {currentUser?.role?.toLowerCase() !== 'admin' && selectedBook.available > 0 && (
                  <button 
                    className="modal-borrow-btn" 
                    onClick={() => {
                      borrowBook(currentUser._id, selectedBook._id, 1);
                      setShowDescription(false);
                    }}
                  >
                    <FaBook /> Borrow This Book
                  </button>
                )}
                <button className="modal-secondary-btn" onClick={() => setShowDescription(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Search by title, author, ISBN, or category..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="books-count">
        Showing {filteredBooks.length} of {books.length} books
      </div>

      {filteredBooks.length === 0 ? (
        <div className="no-data">No books found</div>
      ) : viewMode === 'grid' ? (
        <div className="books-grid">
          {filteredBooks.map(book => (
            <div key={book._id} className="book-card" onClick={() => handleShowDescription(book)}>
              <div className="book-card-header">
                <div className="book-cover">
                  {book.imageUrl ? (
                    <img 
                      src={book.imageUrl} 
                      alt={book.title} 
                      className="cover-image" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className="placeholder-cover-grid"
                    style={{ 
                      display: book.imageUrl ? 'none' : 'flex',
                      background: `linear-gradient(45deg, ${getCategoryStyle(book.category).color} 0%, #1e293b 100%)`
                    }}
                  >
                    <span>{book.title.charAt(0)}</span>
                  </div>
                </div>
                <span 
                  className="category-badge-small"
                  style={{ background: getCategoryStyle(book.category).bg, color: getCategoryStyle(book.category).color }}
                >
                  {book.category}
                </span>
              </div>
              <div className="book-card-body">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{book.author}</p>
                <p className="book-isbn">{book.isbn}</p>
              </div>
              <div className="book-card-footer">
                <div className="availability">
                  <span className={`avail-badge ${book.available > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {book.available > 0 ? `${book.available} available` : 'Out of stock'}
                  </span>
                  <span className="total-qty">of {book.quantity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Category</th>
              <th>Available</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map(book => (
              <tr key={book._id}>
                <td>
                  <div className="book-cell">
                    <div className="book-icon" style={{ overflow: 'hidden' }}>
                      {book.imageUrl ? (
                        <img src={book.imageUrl} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <FaBook />
                      )}
                    </div>
                    <span>{book.title}</span>
                  </div>
                </td>
                <td>{book.author}</td>
                <td><code className="isbn-code">{book.isbn}</code></td>
                <td>
                  <span 
                    className="category-badge-table"
                    style={{ background: getCategoryStyle(book.category).bg, color: getCategoryStyle(book.category).color }}
                  >
                    {book.category}
                  </span>
                </td>
                <td><span className={`badge ${book.available > 0 ? 'badge-success' : 'badge-danger'}`}>{book.available}</span></td>
                <td>{book.quantity}</td>
                <td>
                  <button className="btn btn-sm btn-info" onClick={() => handleShowDescription(book)}>
                    <FaInfoCircle /> Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Books

