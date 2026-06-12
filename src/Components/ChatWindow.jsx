import React, { useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import logo from '../logo.jpeg'
import './ChatWindow.css'

const ChatWindow = ({ messages, isTyping, onEditMessage }) => {
  const messagesEndRef = useRef(null)
  
  // Auto-scroll to the latest message whenever messages change or typing status changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages, isTyping])
  
  // Check if we should show welcome screen
  // Welcome screen shows when messages array is empty
  const shouldShowWelcome = () => {
    return messages.length === 0
  }
  
  if (shouldShowWelcome()) {
    return (
      <div className="chat-window welcome-active">
        <div className="welcome-screen">
          <div className="welcome-logo">
            <img src={logo} alt="ZaibChat Logo" className="welcome-logo-image" />
          </div>
          <h1 className="welcome-heading">Hello, I'm ZaibChat</h1>
          <p className="welcome-subtitle">How can I help you today?</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="chat-window">
      <div className="messages-container">
        {messages.map((msg) => (
          <MessageBubble 
            key={msg.id} 
            message={msg} 
            onEditMessage={onEditMessage}
          />
        ))}
        {isTyping && <TypingIndicator />}
        {/* Invisible anchor for auto-scroll */}
        <div ref={messagesEndRef} style={{ height: '4px' }} />
      </div>
    </div>
  )
}

export default ChatWindow