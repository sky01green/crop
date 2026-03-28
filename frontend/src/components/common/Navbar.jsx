import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <svg
            className="logo-icon"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="CropScan logo"
            width="36"
            height="36"
          >
            <circle cx="16" cy="16" r="15" fill="#2E7D32" />
            <path
              d="M16 8 C16 8 10 12 10 18 C10 21.3 12.7 24 16 24 C19.3 24 22 21.3 22 18 C22 12 16 8 16 8Z"
              fill="white"
              opacity="0.9"
            />
            <path
              d="M16 14 L16 24"
              stroke="#2E7D32"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M16 18 L13 15"
              stroke="#2E7D32"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M16 20 L19 17"
              stroke="#2E7D32"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span className="logo-text">CropScan</span>
        </Link>

        {/* Hamburger for mobile */}
        <button
          className={`nav-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Navigation links */}
        <nav className={`nav-links ${menuOpen ? 'nav-open' : ''}`} role="navigation">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                Dashboard
              </NavLink>
              <NavLink to="/upload" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                Analyze
              </NavLink>
              <NavLink to="/history" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                History
              </NavLink>
              <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                {user?.name || 'Profile'}
              </NavLink>
              <button className="btn btn-outline nav-btn" onClick={handleLogout}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
                Sign In
              </NavLink>
              <Link to="/register" className="btn btn-primary nav-btn" onClick={closeMenu}>
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
