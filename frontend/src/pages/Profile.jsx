import { FaUser, FaEnvelope, FaIdBadge, FaPhone, FaBuilding, FaUserGraduate, FaCalendarAlt } from 'react-icons/fa'

function Profile({ currentUser }) {
  if (!currentUser) return <div className="page">Please login to view your profile.</div>

  return (
    <div className="page">
      <div className="page-header">
        <h1>My Profile</h1>
      </div>

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {currentUser.name?.charAt(0) || currentUser.username?.charAt(0)}
            </div>
            <div className="profile-titles">
              <h2>{currentUser.name || currentUser.username}</h2>
              <span className="profile-role-badge">{currentUser.role || 'User'}</span>
            </div>
          </div>

          <div className="profile-details-grid">
            <div className="profile-detail-item">
              <FaUser className="detail-icon" />
              <div className="detail-info">
                <label>Username</label>
                <p>{currentUser.username}</p>
              </div>
            </div>

            <div className="profile-detail-item">
              <FaEnvelope className="detail-icon" />
              <div className="detail-info">
                <label>Email Address</label>
                <p>{currentUser.email || 'not provided'}</p>
              </div>
            </div>

            {currentUser.enrollmentNumber && (
              <div className="profile-detail-item">
                <FaIdBadge className="detail-icon" />
                <div className="detail-info">
                  <label>Enrollment Number</label>
                  <p>{currentUser.enrollmentNumber}</p>
                </div>
              </div>
            )}

            {currentUser.phone && (
              <div className="profile-detail-item">
                <FaPhone className="detail-icon" />
                <div className="detail-info">
                  <label>Phone Number</label>
                  <p>{currentUser.phone}</p>
                </div>
              </div>
            )}

            {currentUser.department && (
              <div className="profile-detail-item">
                <FaBuilding className="detail-icon" />
                <div className="detail-info">
                  <label>Department</label>
                  <p>{currentUser.department}</p>
                </div>
              </div>
            )}

            <div className="profile-detail-item">
              <FaCalendarAlt className="detail-icon" />
              <div className="detail-info">
                <label>Member Since</label>
                <p>{currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Recent'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
