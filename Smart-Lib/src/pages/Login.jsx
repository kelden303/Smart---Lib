import { useState } from 'react'
import { FaBook, FaUser, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa'
import { authApi } from '../services/mockData'
import './Auth.css'

function Login({ onLogin, onSwitchToSignup, onForgotPassword, onBackToLanding }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      const validUser = await authApi.login(username, password)
      setIsLoading(false)
      onLogin(validUser)
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid username or password'
      setError(message)
      setIsLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card login-card">
        <div className="auth-illustration">
          <img src="/assets/auth-hero.png" alt="Library Illustration" />
          <div className="illustration-overlay">
            <h2>Welcome Back to Smart-Lib</h2>
            <p>Access your personalized dashboard, manage your borrowed books, and explore our vast collection.</p>
          </div>
        </div>

        <div className="auth-form-container">
          <div className="auth-header">
            <div className="auth-logo" onClick={onBackToLanding}>
              <FaBook />
              <span>Smart-Lib</span>
            </div>
            <h1>Member Login</h1>
            <p>Please enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label><FaUser /> Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" required />
            </div>

            <div className="form-group">
              <div className="label-with-link">
                <label><FaLock /> Password</label>
                <span className="small-link" onClick={onForgotPassword}>Forgot?</span>
              </div>
              <div className="password-input-wrapper">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {error && (
              <div className="auth-error">
                {error}
                {error === 'Invalid credentials' && (
                  <div className="login-hint">Hint: admin / password123</div>
                )}
              </div>
            )}

            <button type="submit" className="auth-submit-btn" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <p>New to Smart-Lib? <span onClick={onSwitchToSignup}>Create an account</span></p>
            <span className="back-link" onClick={onBackToLanding}>← Back to Home</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
