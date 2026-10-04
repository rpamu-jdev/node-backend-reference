import './Header.css'

export default function Header({ onLogout }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <h1>📚 Book Manager</h1>
        </div>
        <button className="btn-logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  )
}
