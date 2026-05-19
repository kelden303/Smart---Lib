import { useState, useEffect } from 'react'
import { FaBook, FaLock, FaUser, FaEnvelope, FaPhone, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'
import { authApi } from '../services/mockData'
import './Auth.css'

function Signup({ onSwitchToLogin, onBackToLanding }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false
  })

  useEffect(() => {
    const pass = formData.password
    setPasswordStrength({
      length: pass.length >= 8,
      uppercase: /[A-Z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass)
    })
  }, [formData.password])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Constraints Validation
    if (!passwordStrength.length || !passwordStrength.uppercase || !passwordStrength.number || !passwordStrength.special) {
      setError('Password does not meet security requirements')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!formData.email.endsWith('@gmail.com')) {
      setError('Please use a legitimate @gmail.com address')
      return
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setError('Phone number must be exactly 10 digits')
      return
    }

    setLoading(true)

    try {
      await authApi.signup({
        ...formData,
        username: formData.name, // Use name as username
        phone: `+91${formData.phone}`,
        role: 'student' // Default role for signup
      })
      
      setLoading(false)
      alert("Account created successfully! Welcome to Smart-Lib.")
      onSwitchToLogin()
    } catch (err) {
      setError(err.response?.data?.message || 'Username or Email might already be registered.')
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card signup-card">
        <div className="auth-illustration">
          <img src="/assets/auth-hero.png" alt="Library Illustration" />
          <div className="illustration-overlay">
            <h2>Join the Smart-Lib Community</h2>
            <p>Unlock a world of knowledge with our intelligent library management system.</p>
            <div className="mini-stats">
              <div className="mini-stat">
                <span>10k+</span>
                <p>Books</p>
              </div>
              <div className="mini-stat">
                <span>5k+</span>
                <p>Users</p>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-form-container">
          <div className="auth-header">
            <div className="auth-logo" onClick={onBackToLanding}>
              <FaBook />
              <span>Smart-Lib</span>
            </div>
            <h1>Create Account</h1>
            <p>Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label><FaUser /> Name / Username</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label><FaEnvelope /> Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@gmail.com" required />
              </div>
              <div className="form-group">
                <label><FaPhone /> Phone Number</label>
                <div className="phone-input-split">
                  <span className="phone-prefix">+91</span>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="9876543210" maxLength="10" required />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label><FaLock /> Password</label>
                <div className="password-input-wrapper">
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label><FaLock /> Confirm</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" required />
              </div>
            </div>

            <div className="password-constraints">
              <p className={passwordStrength.length ? 'met' : ''}>{passwordStrength.length ? <FaCheckCircle /> : <FaExclamationCircle />} 8+ Characters</p>
              <p className={passwordStrength.uppercase ? 'met' : ''}>{passwordStrength.uppercase ? <FaCheckCircle /> : <FaExclamationCircle />} Uppercase (A-Z)</p>
              <p className={passwordStrength.number ? 'met' : ''}>{passwordStrength.number ? <FaCheckCircle /> : <FaExclamationCircle />} Number (0-9)</p>
              <p className={passwordStrength.special ? 'met' : ''}>{passwordStrength.special ? <FaCheckCircle /> : <FaExclamationCircle />} Special Char</p>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up Now'}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already a member? <span onClick={onSwitchToLogin}>Login here</span></p>
            <span className="back-link" onClick={onBackToLanding}>← Back to Home</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
