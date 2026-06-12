import React, { useState, useRef, useEffect } from 'react'
import './InputBar.css'

const InputBar = ({ onSendMessage, disabled }) => {
  const [inputValue, setInputValue] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [showFileMenu, setShowFileMenu] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const textareaRef = useRef(null)
  const recognitionRef = useRef(null)
  const fileMenuRef = useRef(null)
  const fileInputRef = useRef(null)
  const docInputRef = useRef(null)

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInputValue(prev => prev + (prev ? ' ' : '') + transcript)
        
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = Math.min(120, textareaRef.current.scrollHeight) + 'px'
          }
        }, 0)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        
        if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please allow microphone access to use voice input.')
        } else if (event.error === 'no-speech') {
          // Silent fail
        } else {
          alert(`Voice input error: ${event.error}. Please try again.`)
        }
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [])

  // Close file menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fileMenuRef.current && !fileMenuRef.current.contains(event.target)) {
        setShowFileMenu(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if ((inputValue.trim() === '' && !selectedFile) || disabled) return
    
    // Prepare message content
    let messageContent = inputValue.trim()
    if (selectedFile) {
      const fileInfo = selectedFile.type.startsWith('image/') 
        ? `[Image: ${selectedFile.name}]` 
        : `[File: ${selectedFile.name}]`
      messageContent = messageContent 
        ? `${messageContent}\n\n${fileInfo}`
        : fileInfo
    }
    
    onSendMessage(messageContent)
    setInputValue('')
    setSelectedFile(null)
    setFilePreview(null)
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }
  
  const handleInputChange = (e) => {
    setInputValue(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(120, textareaRef.current.scrollHeight) + 'px'
    }
  }

  const handleFileMenuToggle = () => {
    setShowFileMenu(!showFileMenu)
  }

  const handlePhotoSelect = () => {
    fileInputRef.current.click()
    setShowFileMenu(false)
  }

  const handleDocumentSelect = () => {
    docInputRef.current.click()
    setShowFileMenu(false)
  }

  const handleFileChange = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setFilePreview(reader.result)
        }
        reader.readAsDataURL(file)
      } else {
        setFilePreview(null)
      }
    }
    // Reset file input
    e.target.value = ''
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setFilePreview(null)
  }

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      alert('Voice input not supported in this browser. Please use Chrome, Edge, or Safari.')
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
      return
    }

    try {
      recognitionRef.current.start()
      setIsListening(true)
    } catch (error) {
      console.error('Failed to start speech recognition:', error)
      alert('Could not start voice input. Please try again.')
    }
  }
  
  return (
    <div className="input-bar-container">
      <form className="input-form" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          {/* Left side - Attach button */}
          <div className="input-actions-left" ref={fileMenuRef}>
            <button 
              type="button" 
              className={`action-btn attach-btn ${showFileMenu ? 'active' : ''}`}
              onClick={handleFileMenuToggle}
              aria-label="Attach file"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M12 8V16M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            
            {/* File Menu Popup */}
            {showFileMenu && (
              <div className="file-menu">
                <button className="file-menu-item" onClick={handlePhotoSelect}>
                  <svg className="file-menu-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="4" width="20" height="16" rx="2" ry="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <path d="M9 12C10.1046 12 11 11.1046 11 10C11 8.89543 10.1046 8 9 8C7.89543 8 7 8.89543 7 10C7 11.1046 7.89543 12 9 12Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <path d="M22 14L17 9L9 17L4 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                  <span>Photo</span>
                </button>
                <button className="file-menu-item" onClick={handleDocumentSelect}>
                  <svg className="file-menu-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <path d="M8 12H16M8 16H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                  </svg>
                  <span>Document</span>
                </button>
              </div>
            )}
            
            {/* Hidden file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => handleFileChange(e, 'photo')}
            />
            <input
              ref={docInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              style={{ display: 'none' }}
              onChange={(e) => handleFileChange(e, 'document')}
            />
          </div>

          <textarea
            ref={textareaRef}
            className="message-input"
            placeholder={isListening ? "Listening..." : "Type your message..."}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows="1"
            disabled={disabled}
          />
          
          {/* Right side - Mic and Send buttons */}
          <div className="input-actions-right">
            <button 
              type="button" 
              className={`action-btn voice-btn ${isListening ? 'listening' : ''}`}
              onClick={handleVoiceInput}
              aria-label="Voice input"
              disabled={disabled}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3C10.9 3 10 3.9 10 5V11C10 12.1 10.9 13 12 13C13.1 13 14 12.1 14 11V5C14 3.9 13.1 3 12 3Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M19 11C19 14.9 15.9 18 12 18C8.1 18 5 14.9 5 11M12 18V21M9 21H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </button>
            
            <button 
              type="submit" 
              className={`send-btn ${(inputValue.trim() || selectedFile) && !disabled ? 'active' : ''}`} 
              disabled={disabled || (!inputValue.trim() && !selectedFile)}
              aria-label="Send message"
            >
              <svg className="send-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M12 5L5 12M12 5L19 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* File Preview Chip */}
        {selectedFile && (
          <div className="file-preview-chip">
            <div className="file-preview-content">
              {filePreview ? (
                <img src={filePreview} alt="Preview" className="file-preview-thumbnail" />
              ) : (
                <div className="file-preview-icon">
                  {selectedFile.type.includes('pdf') ? '📄' : 
                   selectedFile.type.includes('word') ? '📝' : 
                   selectedFile.type.includes('text') ? '📃' : '📎'}
                </div>
              )}
              <span className="file-preview-name">
                {selectedFile.name.length > 30 
                  ? selectedFile.name.substring(0, 27) + '...' 
                  : selectedFile.name}
              </span>
            </div>
            <button 
              type="button" 
              className="file-preview-remove"
              onClick={handleRemoveFile}
              aria-label="Remove file"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
      </form>
    </div>
  )
}

export default InputBar