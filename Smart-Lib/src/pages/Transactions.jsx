import { useState } from 'react'
import { FaExchangeAlt, FaPlus, FaUndo, FaInfoCircle, FaBook, FaUser, FaCalendar, FaClock, FaSearch, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa'

function Transactions({ transactions, users, books, borrowBook, returnBook, currentUser }) {
  const [showBorrowForm, setShowBorrowForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState('')
  const [selectedBook, setSelectedBook] = useState('')
  const [borrowQuantity, setBorrowQuantity] = useState(1)
  const [selectedBookDetails, setSelectedBookDetails] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const availableBooks = books.filter(b => b.available > 0)

  const getUserName = (userData) => {
    if (typeof userData === 'object' && userData !== null && userData.name) {
      return userData.name
    }
    const user = users.find(u => u._id === userData)
    return user ? user.name : 'Unknown'
  }

  const getBookTitle = (bookData) => {
    if (typeof bookData === 'object' && bookData !== null && bookData.title) {
      return bookData.title
    }
    const book = books.find(b => b._id === bookData)
    return book ? book.title : 'Unknown'
  }

  const filteredTransactions = transactions
    .filter(t => {
      // Filter by current user if not admin
      if (currentUser?.role?.toLowerCase() !== 'admin') {
        const userId = typeof t.user === 'object' ? t.user?._id : t.user;
        if (userId !== currentUser?._id) return false;
      }
      
      const userName = getUserName(t.user).toLowerCase()
      const bookTitle = getBookTitle(t.book).toLowerCase()
      return userName.includes(searchTerm.toLowerCase()) || bookTitle.includes(searchTerm.toLowerCase())
    })
    .reverse() // Show latest first

  const getDueStatus = (t) => {
    if (t.status === 'returned') return { text: 'Up to Date', subtext: 'Returned', type: 'success' };
    if (!t.dueDate) return { text: 'Unknown', subtext: '', type: 'neutral' };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(t.dueDate);
    due.setHours(0, 0, 0, 0);
    const daysUntilDue = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue < 0) {
      return { text: 'Not Up to Date', subtext: `${Math.abs(daysUntilDue)} days overdue`, type: 'danger' };
    }
    if (daysUntilDue === 0) {
      return { text: 'Up to Date', subtext: 'Due today', type: 'warning' };
    }
    return { text: 'Up to Date', subtext: `${daysUntilDue} days left`, type: 'success' };
  };

  const handleBorrow = (e) => {
    e.preventDefault()
    if (selectedUser && selectedBook) {
      borrowBook(selectedUser, selectedBook, borrowQuantity)
      setSelectedUser('')
      setSelectedBook('')
      setBorrowQuantity(1)
      setSelectedBookDetails(null)
      setShowBorrowForm(false)
    }
  }

  const handleBookSelect = (bookId) => {
    setSelectedBook(bookId)
    const book = books.find(b => b._id === bookId)
    setSelectedBookDetails(book)
    setBorrowQuantity(1)
  }

  const handleReturn = (transactionId) => {
    returnBook(transactionId)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Transactions</h1>
        {currentUser?.role?.toLowerCase() === 'admin' && (
          <button className="btn btn-primary" onClick={() => setShowBorrowForm(!showBorrowForm)}>
            <FaPlus /> Borrow Book
          </button>
        )}
      </div>

      {showBorrowForm && (
        <div className="form-card">
          <h2>Borrow Book</h2>
          <form onSubmit={handleBorrow}>
            <div className="form-grid">
              <div className="form-group">
                <label>Select User *</label>
                <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required>
                  <option value="">Choose a user...</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>{user.name} ({user.role})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Select Book *</label>
                <select value={selectedBook} onChange={(e) => handleBookSelect(e.target.value)} required>
                  <option value="">Choose a book...</option>
                  {availableBooks.map(book => (
                    <option key={book._id} value={book._id}>{book.title} ({book.available} available)</option>
                  ))}
                </select>
              </div>
              {selectedBookDetails && (
                <div className="form-group">
                  <label>Quantity (Max: {selectedBookDetails.available})</label>
                  <input 
                    type="number" 
                    value={borrowQuantity} 
                    onChange={(e) => setBorrowQuantity(Math.min(Math.max(1, parseInt(e.target.value) || 1), selectedBookDetails.available))}
                    min="1" 
                    max={selectedBookDetails.available}
                    required 
                  />
                </div>
              )}
            </div>
            
            {selectedBookDetails && (
              <div className="book-details-panel">
                <h3><FaInfoCircle /> Book Details</h3>
                <div className="details-grid">
                  <div className="detail-item">
                    <strong>Title</strong>
                    <span>{selectedBookDetails.title}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Author</strong>
                    <span>{selectedBookDetails.author}</span>
                  </div>
                  <div className="detail-item">
                    <strong>ISBN</strong>
                    <span>{selectedBookDetails.isbn}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Category</strong>
                    <span>{selectedBookDetails.category}</span>
                  </div>
                  <div className="detail-item">
                    <strong>Available</strong>
                    <span>{selectedBookDetails.available} copies</span>
                  </div>
                </div>
                {selectedBookDetails.description && (
                  <div className="description-full">
                    <strong>Description</strong>
                    <p>{selectedBookDetails.description}</p>
                  </div>
                )}
              </div>
            )}
            
            <button type="submit" className="btn btn-primary">Confirm Borrow</button>
          </form>
        </div>
      )}

      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Search transactions by user or book..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="books-count">
        Showing {filteredTransactions.length} of {transactions.length} transactions
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="no-data">No transactions yet</div>
      ) : (
        <div className="transactions-list">
          {filteredTransactions.map(t => (
            <div key={t._id} className="transaction-card">
              <div className="transaction-header">
                <div className="transaction-info">
                  <div className="transaction-user">
                    <FaUser className="trans-icon" />
                    <span>{getUserName(t.user)}</span>
                  </div>
                  <div className="transaction-book">
                    <FaBook className="trans-icon" />
                    <span>{getBookTitle(t.book)}</span>
                  </div>
                </div>
                <span className={`status-badge-large ${t.status}`}>
                  {t.status}
                </span>
              </div>
              <div className="transaction-details">
                <div className="trans-detail">
                  <FaCalendar className="detail-icon" />
                  <div>
                    <span className="detail-label">Borrowed</span>
                    <span className="detail-value">{t.borrowDate ? new Date(t.borrowDate).toLocaleDateString() : '-'}</span>
                  </div>
                </div>
                <div className="trans-detail">
                  <FaClock className="detail-icon" />
                  <div>
                    <span className="detail-label">Due Date</span>
                    <span className="detail-value">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '-'}</span>
                  </div>
                </div>
                {(() => {
                  const statusInfo = getDueStatus(t);
                  if (statusInfo.type === 'neutral') return null;
                  return (
                    <div className="trans-detail" style={{ 
                      backgroundColor: statusInfo.type === 'danger' ? 'rgba(231, 76, 60, 0.1)' : statusInfo.type === 'warning' ? 'rgba(243, 156, 18, 0.1)' : 'rgba(46, 204, 113, 0.1)',
                      padding: '8px',
                      borderRadius: '8px',
                      border: `1px solid ${statusInfo.type === 'danger' ? '#e74c3c' : statusInfo.type === 'warning' ? '#f39c12' : '#2ecc71'}`
                    }}>
                      {statusInfo.type === 'danger' ? (
                        <FaExclamationTriangle className="detail-icon" style={{ color: '#e74c3c' }} />
                      ) : statusInfo.type === 'warning' ? (
                        <FaExclamationTriangle className="detail-icon" style={{ color: '#f39c12' }} />
                      ) : (
                        <FaCheckCircle className="detail-icon" style={{ color: '#2ecc71' }} />
                      )}
                      <div>
                        <span className="detail-label" style={{ 
                          color: statusInfo.type === 'danger' ? '#e74c3c' : statusInfo.type === 'warning' ? '#f39c12' : '#2ecc71',
                          fontWeight: 'bold',
                          marginBottom: '2px'
                        }}>
                          {statusInfo.text}
                        </span>
                        <span className="detail-value" style={{ fontSize: '0.85rem' }}>{statusInfo.subtext}</span>
                      </div>
                    </div>
                  );
                })()}
                {t.returnDate && (
                  <div className="trans-detail">
                    <FaUndo className="detail-icon" />
                    <div>
                      <span className="detail-label">Returned</span>
                      <span className="detail-value">{new Date(t.returnDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>
              {t.status === 'borrowed' && (
                <div className="transaction-actions">
                  <button className="btn btn-success btn-sm" onClick={() => handleReturn(t._id)}>
                    <FaUndo /> Return Book
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Transactions

