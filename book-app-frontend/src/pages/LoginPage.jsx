import { useState } from 'react'
import { authAPI } from '../services/api'
import './LoginPage.css'

export default function LoginPage({ onLogin, isLoading, setIsLoading }) {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const token = await authAPI.login(username, password)
      onLogin(token)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>📚 Book Manager</h1>
          <p>Learning Lab API Frontend</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              disabled={isLoading}
              required
            />
          </div>

          <button type="submit" className="btn-login" disabled={isLoading}>
            {isLoading ? (
              <span className="button-loading">
                <span className="spinner-dot"></span> Logging in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Demo Credentials:</p>
          <p>Username: <code>admin</code></p>
          <p>Password: <code>password</code></p>
        </div>
      </div>
    </div>
  )
}
