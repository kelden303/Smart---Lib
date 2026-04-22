import { useState } from 'react'
import { FaBook, FaLock, FaUser } from 'react-icons/fa'

function Login({ onLogin, onSwitchToSignup }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (username && password) {
      setTimeout(() => {
        onLogin({ username, name: username })
        setLoading(false)
      }, 500)
    } else {
      setError('Please enter username and password')
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <FaBook className="login-icon" />
          <h1>Smart-Lib</h1>
          <p>Library Management System</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label><FaUser /> Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" required />
          </div>
          <div className="form-group">
            <label><FaLock /> Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="login-footer">
          <p>New user? <span className="link-text" onClick={onSwitchToSignup}>Sign up</span></p>
        </div>
      </div>
    </div>
  )
}

export default Login
