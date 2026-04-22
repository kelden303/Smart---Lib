import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { FaHome, FaBook, FaUsers, FaExchangeAlt, FaSignOutAlt, FaPlus, FaSearch, FaArrowRight, FaStar, FaClock, FaBolt, FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa'
import Books from './pages/Books'
import Users from './pages/Users'
import Transactions from './pages/Transactions'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import Landing from './pages/Landing'
import { bookApi, userApi, transactionApi } from './services/mockData'
import './App.css'

function App() {
  const [books, setBooks] = useState([])
  const [users, setUsers] = useState([])
  const [transactions, setTransactions] = useState([
    { _id: '1', user: { name: 'John Doe' }, book: { title: 'The Great Gatsby' }, status: 'borrowed', borrowDate: new Date().toISOString(), dueDate: new Date(Date.now() + 7*24*60*60*1000).toISOString() },
    { _id: '2', user: { name: 'Jane Smith' }, book: { title: '1984' }, status: 'returned', borrowDate: new Date(Date.now() - 10*24*60*60*1000).toISOString(), returnDate: new Date(Date.now() - 5*24*60*60*1000).toISOString() }
  ])
  const [loading, setLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [notification, setNotification] = useState({ show: false, message: '', type: 'info' })
  const [confirmModal, setConfirmModal] = useState({ show: false, title: '', message: '', onConfirm: null })

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type })
    setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 4000)
  }

  const confirm = (title, message, onConfirm) => {
    setConfirmModal({ show: true, title, message, onConfirm })
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('smartLibUser')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setIsLoggedIn(true)
      setCurrentUser(parsedUser)
      
      // Fetch fresh user data to ensure department/details are up-to-date
      userApi.getAll().then(users => {
        const freshUser = users.find(u => u._id === parsedUser._id);
        if (freshUser) {
          setCurrentUser(freshUser);
          localStorage.setItem('smartLibUser', JSON.stringify(freshUser));
        }
      });
    }
    fetchData()
  }, [])

  const handleLogin = (user) => {
    setCurrentUser(user)
    setIsLoggedIn(true)
    localStorage.setItem('smartLibUser', JSON.stringify(user))
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setIsLoggedIn(false)
    setShowLanding(true)
    localStorage.removeItem('smartLibUser')
  }

  const fetchData = async () => {
    try {
      console.log('Fetching all library data from 127.0.0.1:5000...');
      const allBooks = await bookApi.getAll()
      const allUsers = await userApi.getAll()
      const allTransactions = await transactionApi.getAll()
      
      console.log(`[DATA_SYNC] Books: ${allBooks.length}, Users: ${allUsers.length}, Transactions: ${allTransactions.length}`);
      
      setBooks(allBooks)
      setUsers(allUsers)
      setTransactions(allTransactions)
    } catch (error) {
      console.error('Fetch Error:', error)
      showNotification('Failed to sync library data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const addBook = async (book) => {
    try {
      const newBook = await bookApi.create(book)
      setBooks([...books, newBook])
    } catch (error) {
      console.error('Error adding book:', error)
    }
  }

  const addUser = async (user) => {
    try {
      const newUser = await userApi.create(user)
      setUsers([...users, newUser])
    } catch (error) {
      console.error('Error adding user:', error)
      alert(error.message)
    }
  }

  const borrowBook = async (userId, bookId, quantity = 1) => {
    try {
      const newTrans = await transactionApi.borrow(userId, bookId, quantity)
      setTransactions([...transactions, newTrans])
      const updatedBooks = books.map(b => {
        if (b._id === bookId) {
          return { ...b, available: b.available - quantity }
        }
        return b
      })
      setBooks(updatedBooks)
    } catch (error) {
      console.error('Error borrowing book:', error)
      alert(error.message)
    }
  }

  const returnBook = async (transactionId) => {
    try {
      const updated = await transactionApi.return(transactionId)
      setTransactions(transactions.map(t => t._id === transactionId ? updated : t))
      fetchData()
    } catch (error) {
      console.error('Error returning book:', error)
      alert(error.message)
    }
  }

  const updateUserRole = async (userId, newRole) => {
    try {
      const updatedUser = await userApi.updateRole(userId, newRole)
      setUsers(users.map(u => u._id === userId ? updatedUser : u))
    } catch (error) {
      console.error('Error updating user role:', error)
      alert(error.message)
    }
  }

  const removeUser = async (userId) => {
    console.log('removeUser called with ID:', userId);
    if (!userId) {
      showNotification('Error: User ID is missing', 'error');
      return;
    }
    
    confirm(
      'Remove User',
      'Are you sure you want to remove this user? This action cannot be undone and will delete all their data.',
      async () => {
        try {
          console.log('Sending delete request for ID:', userId);
          await userApi.delete(userId)
          setUsers(users.filter(u => u._id !== userId))
          showNotification('User removed successfully', 'success')
        } catch (error) {
          console.error('Full delete error object:', error);
          const errorMsg = error.response?.data?.message || error.message || 'Failed to remove user';
          showNotification(errorMsg, 'error')
        }
      }
    )
  }

  if (loading) {
    return <div className="loading">Loading Smart-Lib...</div>
  }

  if (!isLoggedIn) {
    if (showForgotPassword) {
      return <ForgotPassword onBackToLogin={() => setShowForgotPassword(false)} />
    }
    if (showSignup) {
      return <Signup onSwitchToLogin={() => setShowSignup(false)} onBackToLanding={() => { setShowLanding(true); setShowSignup(false); }} />
    }
    if (showLanding) {
      return <Landing 
        onGetStarted={() => { setShowLanding(false); setShowSignup(true); }} 
        onLogin={() => { setShowLanding(false); setShowSignup(false); }} 
      />
    }
    return <Login 
      onLogin={handleLogin} 
      onSwitchToSignup={() => setShowSignup(true)} 
      onForgotPassword={() => setShowForgotPassword(true)} 
      onBackToLanding={() => setShowLanding(true)}
    />
  }

  const CustomNotification = () => {
    if (!notification.show) return null;
    return (
      <div className={`custom-notification show ${notification.type}`}>
        {notification.type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
        <span>{notification.message}</span>
        <button onClick={() => setNotification(prev => ({ ...prev, show: false }))}><FaTimes /></button>
      </div>
    )
  }

  const CustomConfirm = () => {
    if (!confirmModal.show) return null;
    return (
      <div className="confirm-modal-overlay show" onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))}>
        <div className="confirm-mini-card" onClick={(e) => e.stopPropagation()}>
          <div className="confirm-mini-icon">
            <FaExclamationCircle />
          </div>
          <h3>{confirmModal.title}</h3>
          <p>{confirmModal.message}</p>
          <div className="confirm-mini-actions">
            <button className="confirm-no-btn" onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))}>No</button>
            <button className="confirm-delete-btn" onClick={() => {
              confirmModal.onConfirm()
              setConfirmModal(prev => ({ ...prev, show: false }))
            }}>Delete</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="app">
      <nav className="navbar">
        <div className="nav-brand">
          <FaBook className="brand-icon" />
          <span>Smart-Lib</span>
        </div>
        <div className="nav-user">
          <span>Welcome, {currentUser?.name || 'User'}</span>
          <button className="btn btn-logout" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
        <div className="nav-links">
          <Link to="/" className="nav-link"><FaHome /> Home</Link>
          <Link to="/books" className="nav-link"><FaBook /> Books</Link>
          {(currentUser?.role?.toLowerCase() === 'admin' || currentUser?.role?.toLowerCase() === 'normal') && (
            <Link to="/users" className="nav-link"><FaUsers /> Users</Link>
          )}
          <Link to="/transactions" className="nav-link"><FaExchangeAlt /> {currentUser?.role?.toLowerCase() === 'admin' ? 'Transactions' : 'My History'}</Link>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home books={books} users={users} transactions={transactions} currentUser={currentUser} />} />
          <Route path="/books" element={<Books books={books} addBook={addBook} currentUser={currentUser} borrowBook={borrowBook} />} />
          <Route path="/users" element={
            (currentUser?.role?.toLowerCase() === 'admin' || currentUser?.role?.toLowerCase() === 'normal') 
            ? <Users users={users} addUser={addUser} currentUser={currentUser} updateUserRole={updateUserRole} removeUser={removeUser} /> 
            : <div className="page"><h1>Unauthorized Access</h1><p>You don't have permission to view this page.</p></div>
          } />
          <Route path="/transactions" element={<Transactions transactions={transactions} users={users} books={books} borrowBook={borrowBook} returnBook={returnBook} currentUser={currentUser} />} />
        </Routes>
      </main>
    </div>
    <CustomNotification />
    <CustomConfirm />
  </>
)
}

function Home({ books, users, transactions, currentUser }) {
  const navigate = useNavigate()
  
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const isAdmin = currentUser?.role?.toLowerCase() === 'admin'
  const userTransactions = isAdmin ? transactions : transactions.filter(t => {
    const userId = typeof t.user === 'object' ? t.user?._id : t.user;
    return userId === currentUser?._id;
  })

  const activeLoans = userTransactions.filter(t => t.status?.toLowerCase() === 'borrowed').length;

  const overdueCount = userTransactions.filter(t => {
    if (t.status?.toLowerCase() !== 'borrowed' || !t.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(t.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  }).length;

  const totalBooks = books.length
  const totalUsers = users.length
  const issuedBooks = userTransactions.filter(t => t.status === 'borrowed').length
  const returnedBooks = userTransactions.filter(t => t.status === 'returned').length

  const availableBooks = books.filter(book => {
    const borrowed = transactions.filter(t => t.book?._id === book._id && t.status === 'borrowed').length
    return (book.quantity || 1) > borrowed
  })

  const booksDueToReturn = transactions
    .filter(t => {
      if (t.status !== 'borrowed' || !t.dueDate) return false
      const dueDate = new Date(t.dueDate)
      dueDate.setHours(0, 0, 0, 0)
      const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24))
      return daysUntilDue <= 7
    })
    .map(t => ({
      ...t,
      daysUntilDue: Math.ceil((new Date(t.dueDate) - today) / (1000 * 60 * 60 * 24))
    }))
    .sort((a, b) => a.daysUntilDue - b.daysUntilDue)

  const bookIssuanceCount = {}
  transactions.forEach(t => {
    if (t.book?._id) {
      bookIssuanceCount[t.book._id] = (bookIssuanceCount[t.book._id] || 0) + 1
    }
  })
  const mostIssuedBooks = Object.entries(bookIssuanceCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([bookId, count]) => {
      const book = books.find(b => b._id === bookId)
      return { book, count }
    })

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getDueDateClass = (daysUntilDue) => {
    if (daysUntilDue < 0) return 'overdue'
    if (daysUntilDue <= 3) return 'urgent'
    if (daysUntilDue <= 7) return 'soon'
    return 'normal'
  }

  return (
    <div className="home">
      <h1>Welcome to Smart-Lib</h1>
      <p className="subtitle">Library Management System</p>
      
      <div className="quick-actions">
        <h2><FaBolt /> Quick Actions</h2>
        <div className="quick-actions-grid">
          {isAdmin ? (
            <>
              <button className="quick-action-btn" onClick={() => navigate('/books')}>
                <FaPlus /> Add New Book
                <FaArrowRight className="action-arrow" />
              </button>
              <button className="quick-action-btn" onClick={() => navigate('/users')}>
                <FaUsers /> Add New User
                <FaArrowRight className="action-arrow" />
              </button>
              <button className="quick-action-btn" onClick={() => navigate('/transactions')}>
                <FaExchangeAlt /> New Transaction
                <FaArrowRight className="action-arrow" />
              </button>
            </>
          ) : (
            <>
              <button className="quick-action-btn" onClick={() => navigate('/books')}>
                <FaBook /> Borrow a Book
                <FaArrowRight className="action-arrow" />
              </button>
              <button className="quick-action-btn" onClick={() => navigate('/transactions')}>
                <FaClock /> My History
                <FaArrowRight className="action-arrow" />
              </button>
              <button className="quick-action-btn" onClick={() => navigate('/books')}>
                <FaSearch /> Search Library
                <FaArrowRight className="action-arrow" />
              </button>
            </>
          )}
          <button className="quick-action-btn" onClick={() => navigate('/books')}>
            <FaBook /> View All Books
            <FaArrowRight className="action-arrow" />
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <FaBook className="stat-icon" />
          <div className="stat-info">
            <h3>{totalBooks}</h3>
            <p>Total Books</p>
          </div>
        </div>
        <div className="stat-card">
          <FaUsers className="stat-icon" />
          <div className="stat-info">
            <h3>{isAdmin ? totalUsers : overdueCount}</h3>
            <p>{isAdmin ? 'Total Users' : 'Overdue Items'}</p>
          </div>
        </div>
        <div className="stat-card">
          <FaExchangeAlt className="stat-icon" />
          <div className="stat-info">
            <h3>{issuedBooks}</h3>
            <p>{isAdmin ? 'Books Issued' : 'Books Borrowed'}</p>
          </div>
        </div>
        <div className="stat-card">
          <FaCheckCircle className="stat-icon" />
          <div className="stat-info">
            <h3>{returnedBooks}</h3>
            <p>Books Returned</p>
          </div>
        </div>
      </div>

      <div className="home-columns">
        <div className="home-column">
          <div className="home-section due-books-section">
            <h2><FaClock /> Books Due to Return</h2>
            {booksDueToReturn.length === 0 ? (
              <p className="no-data">No books due soon</p>
            ) : (
              <div className="due-books-list">
                {booksDueToReturn.slice(0, 5).map(t => (
                  <div key={t._id} className={`due-book-item ${getDueDateClass(t.daysUntilDue)}`}>
                    <div className="due-book-info">
                      <span className="due-book-title">{t.book?.title || 'Unknown Book'}</span>
                      <span className="due-book-user">Borrowed by: {t.user?.name || 'Unknown'}</span>
                    </div>
                    <div className="due-book-date">
                      {t.daysUntilDue < 0 ? (
                        <span className="overdue-badge">{Math.abs(t.daysUntilDue)} days overdue</span>
                      ) : (
                        <span className="due-date">{formatDate(t.dueDate)}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="home-section most-issued-section">
            <h2><FaStar /> Most Issued Books</h2>
            {mostIssuedBooks.length === 0 ? (
              <p className="no-data">No books issued yet</p>
            ) : (
              <div className="most-issued-list">
                {mostIssuedBooks.map((item, index) => (
                  <div key={item.book?._id || index} className="most-issued-item">
                    <span className="issue-rank">#{index + 1}</span>
                    <span className="issue-title">{item.book?.title || 'Unknown'}</span>
                    <span className="issue-count">{item.count} times</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="home-column">
          <div className="home-section available-books-section">
            <h2><FaCheckCircle /> Available Books</h2>
            {availableBooks.length === 0 ? (
              <p className="no-data">No books available</p>
            ) : (
              <div className="available-books-list">
                {availableBooks.slice(0, 8).map(book => {
                  const borrowed = transactions.filter(t => t.book?._id === book._id && t.status === 'borrowed').length
                  const available = (book.quantity || 1) - borrowed
                  return (
                    <div key={book._id} className="available-book-item">
                      <FaBook className="available-icon" />
                      <div className="available-book-info">
                        <span className="available-title">{book.title}</span>
                        <span className="available-author">{book.author}</span>
                      </div>
                      <span className={`available-count ${available <= 2 ? 'low' : ''}`}>
                        {available} available
                      </span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="recent-activity">
        <h2>{isAdmin ? 'Recent Transactions' : 'My Recent Activity'}</h2>
        {userTransactions.length === 0 ? (
          <p className="no-data">{isAdmin ? 'No transactions yet' : 'You have no transactions yet'}</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                {isAdmin && <th>User</th>}
                <th>Book</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {userTransactions.slice(-5).reverse().map(t => (
                <tr key={t._id}>
                  {isAdmin && <td>{t.user?.name || 'N/A'}</td>}
                  <td>{t.book?.title || 'N/A'}</td>
                  <td><span className={`status ${t.status}`}>{t.status}</span></td>
                  <td>{new Date(t.borrowDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default App

