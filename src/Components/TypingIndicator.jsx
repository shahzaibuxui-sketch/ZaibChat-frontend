import React from 'react'
import './TypingIndicator.css'

const TypingIndicator = () => {
  return (
    <div className="typing-wrapper">
      <div className="typing-bubble">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  )
}

export default TypingIndicator