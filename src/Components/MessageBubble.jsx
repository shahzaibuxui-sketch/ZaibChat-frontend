import React, { useState } from 'react'
import './MessageBubble.css'

const MessageBubble = ({ message, onEditMessage }) => {
  const isUser = message.role === 'user'
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(message.content)
  const [showCopyFeedback, setShowCopyFeedback] = useState(false)

  const handleEditClick = () => {
    setIsEditing(true)
    setEditedText(message.content)
  }

  const handleSave = () => {
    if (editedText.trim() && editedText !== message.content) {
      onEditMessage(message.id, editedText.trim())
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedText(message.content)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setShowCopyFeedback(true)
      setTimeout(() => setShowCopyFeedback(false), 1000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="message-wrapper">
      <div className={`message-container ${isUser ? 'user-container' : 'assistant-container'}`}>
        <div className={`bubble ${isUser ? 'user-bubble' : 'assistant-bubble'}`}>
          {isEditing ? (
            <div className="edit-mode">
              <textarea
                className="edit-input"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                rows={Math.min(5, editedText.split('\n').length)}
              />
              <div className="edit-actions">
                <button className="edit-save-btn" onClick={handleSave}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Save
                </button>
                <button className="edit-cancel-btn" onClick={handleCancel}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="message-text">{message.content}</div>
          )}
        </div>
        
        {/* Action buttons below the bubble - only show when not editing */}
        {!isEditing && (
          <div className={`message-actions ${isUser ? 'user-actions' : 'assistant-actions'}`}>
            {isUser && (
              <button 
                className="action-btn edit-action" 
                onClick={handleEditClick}
                title="Edit message"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 3L21 7L7 21H3V17L17 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </button>
            )}
            <button 
              className="action-btn copy-action" 
              onClick={handleCopy}
              title="Copy to clipboard"
            >
              {showCopyFeedback ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <path d="M5 15H4C2.9 15 2 14.1 2 13V4C2 2.9 2.9 2 4 2H13C14.1 2 15 2.9 15 4V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                </svg>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageBubble