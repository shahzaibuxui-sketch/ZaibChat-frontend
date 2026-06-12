import React, { useState } from 'react'
import logo from '../logo.jpeg'
import './Header.css'

const Header = ({ onMenuToggle }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleMenuClick = () => {
    setIsSidebarOpen(!isSidebarOpen)
    if (onMenuToggle) onMenuToggle(!isSidebarOpen)
  }

  return (
    <header className="chat-header">
      <div className="header-left">
        {/* Hamburger menu button for mobile */}
        <button className="menu-toggle-btn" onClick={handleMenuClick} aria-label="Toggle sidebar">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <div className="header-title">
          <div className="logo">
            <img src={logo} alt="ZaibChat Logo" className="logo-image" />
          </div>
          <h1>ZaibChat</h1>
        </div>
      </div>
    </header>
  )
}

export default Header