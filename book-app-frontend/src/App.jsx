import { useState, useEffect } from 'react'
import './App.css'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import LoadingScreen from './components/LoadingScreen'

function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken'))
  const [isLoading, setIsLoading] = useState(false)
  const [showInitialLoader, setShowInitialLoader] = useState(true)

  useEffect(() => {
    // Show loading screen for at least 2 seconds
    const timer = setTimeout(() => {
      setShowInitialLoader(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleLogin = (authToken) => {
    localStorage.setItem('authToken', authToken)
    setToken(authToken)
  }

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    setToken(null)
  }

  if (showInitialLoader) {
    return (
      <div className="app">
        <LoadingScreen message="📚 Loading Book Manager..." />
      </div>
    )
  }

  return (
    <div className="app">
      {!token ? (
        <LoginPage onLogin={handleLogin} isLoading={isLoading} setIsLoading={setIsLoading} />
      ) : (
        <DashboardPage token={token} onLogout={handleLogout} />
      )}
    </div>
  )
}

export default App
