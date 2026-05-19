import { useState } from 'react'
import { FaMoneyBillWave, FaSearch, FaFilter, FaCheckCircle, FaTimesCircle, FaClock, FaHistory, FaDownload } from 'react-icons/fa'

function Payments({ transactions }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all') // 'all', 'paid', 'unpaid'

  // Only consider transactions that have a fine
  const fineTransactions = transactions.filter(t => (t.fine || 0) > 0)

  const filteredPayments = fineTransactions.filter(t => {
    const matchesSearch = 
      t.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.user?.username?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'paid' && t.paymentStatus === 'paid') ||
      (filter === 'unpaid' && t.paymentStatus === 'unpaid');

    return matchesSearch && matchesFilter;
  })

  const totalRevenue = fineTransactions
    .filter(t => t.paymentStatus === 'paid')
    .reduce((sum, t) => sum + (t.fine || 0), 0);

  const pendingAmount = fineTransactions
    .filter(t => t.paymentStatus === 'unpaid')
    .reduce((sum, t) => sum + (t.fine || 0), 0);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Financial Overview</h1>
        <button className="btn btn-secondary">
          <FaDownload /> Export Report
        </button>
      </div>

      <div className="stats-grid" style={{ marginBottom: '30px' }}>
        <div className="stat-card">
          <FaMoneyBillWave className="stat-icon" style={{ color: '#2ecc71', background: 'rgba(46, 204, 113, 0.1)' }} />
          <div className="stat-info">
            <h3>₹{totalRevenue}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <FaClock className="stat-icon" style={{ color: '#e74c3c', background: 'rgba(231, 76, 60, 0.1)' }} />
          <div className="stat-info">
            <h3>₹{pendingAmount}</h3>
            <p>Pending Payments</p>
          </div>
        </div>
        <div className="stat-card">
          <FaHistory className="stat-icon" />
          <div className="stat-info">
            <h3>{fineTransactions.length}</h3>
            <p>Total Invoices</p>
          </div>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-bar" style={{ flex: 1, marginBottom: 0 }}>
          <FaSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by student or book..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <div className="filter-group">
          <FaFilter className="filter-icon" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Book Title</th>
              <th>Fine Amount</th>
              <th>Return Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">No payment records found</td>
              </tr>
            ) : (
              filteredPayments.map(t => (
                <tr key={t._id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar-small">{t.user?.name?.charAt(0) || 'U'}</div>
                      <div>
                        <div className="user-name">{t.user?.name || 'Unknown User'}</div>
                        <div className="user-sub">{t.user?.username}</div>
                      </div>
                    </div>
                  </td>
                  <td>{t.book?.title}</td>
                  <td style={{ fontWeight: '700', color: '#1e293b' }}>₹{t.fine}</td>
                  <td>{new Date(t.returnDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${t.paymentStatus === 'paid' ? 'status-success' : 'status-danger'}`}>
                      {t.paymentStatus === 'paid' ? <><FaCheckCircle /> Paid</> : <><FaTimesCircle /> Unpaid</>}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Payments
