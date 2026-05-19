import { useState } from 'react'
import { FaPlus, FaSearch, FaUserGraduate, FaChalkboardTeacher, FaUserShield, FaEnvelope, FaPhone, FaBuilding, FaIdCard, FaTrash } from 'react-icons/fa'

// Role colors
const roleColors = {
  'admin': { bg: 'rgba(239, 68, 68, 0.15)', color: '#dc2626', icon: FaUserShield },
  'teacher': { bg: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6', icon: FaChalkboardTeacher },
  'student': { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', icon: FaUserGraduate },
  'normal': { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', icon: FaUserShield }
}

function getRoleStyle(role) {
  return roleColors[role] || roleColors['student']
}

function Users({ users, addUser, currentUser, updateUserRole, removeUser }) {
  const isSuperAdmin = currentUser?.username === 'admin' || currentUser?._id === '69d7b789d18e8ed4497c4afa'
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [newUser, setNewUser] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    role: 'student',
    password: '',
    department: '',
    enrollmentNumber: ''
  })

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.enrollmentNumber && user.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newUser.email)) {
      alert('Please enter a valid email address');
      return;
    }

    // Phone validation (+91 followed by 10 digits)
    const phoneRegex = /^\+91\d{10}$/;
    if (!phoneRegex.test(newUser.phone)) {
      alert('Phone number must start with +91 followed by 10 digits (e.g., +919876543210)');
      return;
    }

    addUser(newUser)
    setNewUser({ name: '', username: '', email: '', phone: '', role: 'student', password: '', department: '', enrollmentNumber: '' })
    setShowForm(false)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Users Management</h1>
        <div className="header-actions">
          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="1" width="6" height="6" rx="1"/>
                <rect x="9" y="1" width="6" height="6" rx="1"/>
                <rect x="1" y="9" width="6" height="6" rx="1"/>
                <rect x="9" y="9" width="6" height="6" rx="1"/>
              </svg>
            </button>
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="2" width="14" height="3" rx="1"/>
                <rect x="1" y="7" width="14" height="3" rx="1"/>
                <rect x="1" y="12" width="14" height="3" rx="1"/>
              </svg>
            </button>
          </div>
          {currentUser?.role?.toLowerCase() === 'admin' && (
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              <FaPlus /> Add User
            </button>
          )}
        </div>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>Add New User</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} required placeholder="Enter full name" />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} required placeholder="Enter email address" />
              </div>
              <div className="form-group">
                <label>Username *</label>
                <input type="text" value={newUser.username} onChange={(e) => setNewUser({...newUser, username: e.target.value})} required placeholder="Choose a username" />
              </div>
              <div className="form-group">
                <label>Password *</label>
                <input type="password" value={newUser.password} onChange={(e) => setNewUser({...newUser, password: e.target.value})} required placeholder="Set password" />
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input type="text" value={newUser.phone} onChange={(e) => setNewUser({...newUser, phone: e.target.value})} required placeholder="Enter phone number" />
              </div>
              <div className="form-group">
                <label>Role *</label>
                <select value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value})}>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="normal">Normal User</option>
                  {isSuperAdmin && <option value="admin">Admin</option>}
                </select>
              </div>
              <div className="form-group">
                <label>Department</label>
                <input type="text" value={newUser.department} onChange={(e) => setNewUser({...newUser, department: e.target.value})} placeholder="e.g., Computer Science" />
              </div>
              <div className="form-group">
                <label>Enrollment Number</label>
                <input type="text" value={newUser.enrollmentNumber} onChange={(e) => setNewUser({...newUser, enrollmentNumber: e.target.value})} placeholder="e.g., CS2024001" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary">Add User</button>
          </form>
        </div>
      )}

      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Search by name, email, enrollment number, or department..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="books-count">
        Showing {filteredUsers.length} of {users.length} users
      </div>

      {filteredUsers.length === 0 ? (
        <div className="no-data">No users found</div>
      ) : viewMode === 'grid' ? (
        <div className="books-grid">
          {filteredUsers.map(user => {
            const roleStyle = getRoleStyle(user.role)
            const RoleIcon = roleStyle.icon
            return (
              <div key={user._id} className="user-card">
                <div className="user-card-header">
                  <div className="user-avatar">
                    <RoleIcon className="avatar-icon" />
                  </div>
                  <span 
                    className="role-badge"
                    style={{ background: roleStyle.bg, color: roleStyle.color }}
                  >
                    {user.role}
                  </span>
                </div>
                <div className="user-card-body">
                  <h3 className="user-name">{user.name}</h3>
                  <div className="user-detail">
                    <FaEnvelope className="detail-icon" />
                    <span>{user.email}</span>
                  </div>
                  <div className="user-detail">
                    <FaPhone className="detail-icon" />
                    <span>{user.phone}</span>
                  </div>
                  {user.department && (
                    <div className="user-detail">
                      <FaBuilding className="detail-icon" />
                      <span>{user.department}</span>
                    </div>
                  )}
                  {user.enrollmentNumber && (
                    <div className="user-detail">
                      <FaIdCard className="detail-icon" />
                      <span>{user.enrollmentNumber}</span>
                    </div>
                  )}
                  {isSuperAdmin && user.username !== 'admin' && (
                    <div className="user-role-edit" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <label style={{ fontSize: '0.8rem', opacity: 0.7 }}>Change Role:</label>
                        <button 
                          onClick={() => removeUser(user._id)} 
                          className="btn-icon-danger" 
                          title="Remove User"
                          style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                        >
                          <FaTrash />
                        </button>
                      </div>
                      <select 
                        value={user.role} 
                        onChange={(e) => updateUserRole(user._id, e.target.value)}
                        style={{ 
                          width: '100%', 
                          padding: '8px', 
                          borderRadius: '8px', 
                          background: '#0f172a', 
                          color: 'white', 
                          border: '1px solid rgba(255,255,255,0.1)',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="student" style={{ background: '#0f172a' }}>Student</option>
                        <option value="teacher" style={{ background: '#0f172a' }}>Teacher</option>
                        <option value="normal" style={{ background: '#0f172a' }}>Normal User</option>
                        <option value="admin" style={{ background: '#0f172a' }}>Admin</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Department</th>
              <th>Enrollment No.</th>
              {isSuperAdmin && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => {
              const roleStyle = getRoleStyle(user.role)
              return (
                <tr key={user._id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-icon-small" style={{ background: roleStyle.bg }}>
                        <span style={{ color: roleStyle.color }}>{user.name.charAt(0)}</span>
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <span 
                      className="role-badge-table"
                      style={{ background: roleStyle.bg, color: roleStyle.color }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>{user.department || '-'}</td>
                  <td>{user.enrollmentNumber || '-'}</td>
                  {isSuperAdmin && (
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {user.username !== 'admin' ? (
                          <>
                            <select 
                              value={user.role} 
                              onChange={(e) => updateUserRole(user._id, e.target.value)}
                              className="role-select-table"
                              style={{ 
                                padding: '6px 12px', 
                                borderRadius: '6px', 
                                background: '#0f172a', 
                                color: 'white', 
                                border: '1px solid rgba(255,255,255,0.1)',
                                cursor: 'pointer'
                              }}
                            >
                              <option value="student" style={{ background: '#0f172a' }}>Student</option>
                              <option value="teacher" style={{ background: '#0f172a' }}>Teacher</option>
                              <option value="normal" style={{ background: '#0f172a' }}>Normal User</option>
                              <option value="admin" style={{ background: '#0f172a' }}>Admin</option>
                            </select>
                            <button 
                              onClick={() => removeUser(user._id)} 
                              className="btn-icon-danger" 
                              title="Remove User"
                              style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px', borderRadius: '4px' }}
                            >
                              <FaTrash />
                            </button>
                          </>
                        ) : (
                          <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>Primary Admin</span>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Users

