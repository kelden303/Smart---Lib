import { useState } from 'react'
import { FaUser, FaLock, FaEnvelope, FaBookOpen, FaSave, FaArrowLeft, FaEye, FaEyeSlash } from 'react-icons/fa'
import { authApi } from '../services/mockData'

function ForgotPassword({ onBackToLogin }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)
    
    if (!username || !email || !newPassword) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    try {
      const response = await authApi.resetPassword(username, email, newPassword)
      setSuccess(response.message || 'Password reset successfully! You can now login.')
      // Optional: Clear form
      setUsername('')
      setEmail('')
      setNewPassword('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please check your username and email.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
        </div>
      </div>
      
      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">
            <FaBookOpen className="logo-icon" />
          </div>
          <h1>Reset Password</h1>
          <p>Verify your identity to reset password</p>
        </div>

        {success ? (
          <div className="success-message" style={{ textAlign: 'center', marginBottom: '20px', color: '#4CAF50', padding: '10px', backgroundColor: 'rgba(76, 175, 80, 0.1)', borderRadius: '8px' }}>
            {success}
            <div style={{ marginTop: '15px' }}>
              <button className="login-btn" onClick={onBackToLogin}>
                Back to Login
              </button>
            </div>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                <FaUser /> Username
              </label>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FaEnvelope /> Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ position: 'relative' }}>
              <label>
                <FaLock /> New Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <span 
                onClick={() => setShowPassword(!showPassword)} 
                style={{ position: 'absolute', right: '16px', bottom: '16px', cursor: 'pointer', color: '#94a3b8' }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? (
                <span className="loading-spinner"></span>
              ) : (
                <>
                  <FaSave /> Reset Password
                </>
              )}
            </button>
          </form>
        )}

        <div className="login-footer">
          <p>
            <span className="link-text" onClick={onBackToLogin} style={{cursor: 'pointer', color: '#667eea', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px'}}>
              <FaArrowLeft /> Back to Login
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
