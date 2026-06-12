import React, { useState, useEffect, useRef } from 'react'
import './Sidebar.css'

const Sidebar = ({ 
  isDarkMode, 
  toggleTheme, 
  chats, 
  activeChatId, 
  onChatSelect, 
  onNewChat, 
  onDeleteChat,
  onRenameChat 
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const [renameModalOpen, setRenameModalOpen] = useState(null)
  const [newChatName, setNewChatName] = useState('')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [saveHistory, setSaveHistory] = useState(true)
  const dropdownRef = useRef(null)
  const settingsRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen !== null && dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(null)
      }
      if (settingsOpen && settingsRef.current && !settingsRef.current.contains(event.target)) {
        setSettingsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen, settingsOpen])

  const handleRename = (chatId, currentTitle) => {
    setRenameModalOpen(chatId)
    setNewChatName(currentTitle)
    setDropdownOpen(null)
  }

  const confirmRename = () => {
    if (renameModalOpen && newChatName.trim()) {
      onRenameChat(renameModalOpen, newChatName.trim())
      setRenameModalOpen(null)
      setNewChatName('')
    }
  }

  const handleDelete = (chatId) => {
    setDropdownOpen(null)
    onDeleteChat(chatId)
  }

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen)
  }

  return (
    <>
      <aside className="sidebar">
        <div className="sidebar-header">
          <button className="new-chat-btn" onClick={onNewChat}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>New Chat</span>
          </button>
        </div>

        <div className="chats-list">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${activeChatId === chat.id ? 'active' : ''}`}
              onClick={() => onChatSelect(chat.id)}
            >
              <div className="chat-info">
                <svg className="chat-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
                <span className="chat-title">{chat.title}</span>
              </div>
              <div className="chat-actions" ref={dropdownOpen === chat.id ? dropdownRef : null}>
                <button
                  className="menu-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    setDropdownOpen(dropdownOpen === chat.id ? null : chat.id)
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="6" r="1.5" fill="currentColor"/>
                    <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                    <circle cx="12" cy="18" r="1.5" fill="currentColor"/>
                  </svg>
                </button>
                {dropdownOpen === chat.id && (
                  <div className="dropdown-menu">
                    <button onClick={() => handleRename(chat.id, chat.title)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M17 3L21 7L7 21H3V17L17 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      </svg>
                      Rename
                    </button>
                    <button onClick={() => handleDelete(chat.id)} className="delete-btn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M4 7H20M10 11V16M14 11V16M5 7L6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19L19 7M9 7V4C9 3.73478 9.10536 3.48043 9.29289 3.29289C9.48043 3.10536 9.73478 3 10 3H14C14.2652 3 14.5196 3.10536 14.7071 3.29289C14.8946 3.48043 15 3.73478 15 4V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                      </svg>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Settings Button at Bottom */}
        <div className="sidebar-footer" ref={settingsRef}>
          <button className="settings-btn" onClick={toggleSettings}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
            <span>Settings</span>
          </button>
          
          {/* Settings Dropdown Panel */}
          {settingsOpen && (
            <div className="settings-panel">
              <div className="settings-section">
                <h4>Chat History</h4>
                <div className="toggle-switch">
                  <label className="toggle-label">
                    <span>Save chat history</span>
                    <div className="toggle-control">
                      <input 
                        type="checkbox" 
                        checked={saveHistory}
                        onChange={(e) => setSaveHistory(e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </div>
                  </label>
                </div>
              </div>
              
              <div className="settings-section">
                <h4>Appearance</h4>
                <div className="theme-buttons">
                  <button 
                    className={`theme-option ${!isDarkMode ? 'active' : ''}`}
                    onClick={() => {
                      if (isDarkMode) toggleTheme()
                    }}
                  >
                    Light
                  </button>
                  <button 
                    className={`theme-option ${isDarkMode ? 'active' : ''}`}
                    onClick={() => {
                      if (!isDarkMode) toggleTheme()
                    }}
                  >
                    Dark
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Rename Modal */}
      {renameModalOpen && (
        <div className="modal-overlay" onClick={() => setRenameModalOpen(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Rename Chat</h3>
            <input
              type="text"
              value={newChatName}
              onChange={(e) => setNewChatName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && confirmRename()}
              autoFocus
            />
            <div className="modal-buttons">
              <button onClick={() => setRenameModalOpen(null)}>Cancel</button>
              <button onClick={confirmRename} className="confirm-btn">Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar