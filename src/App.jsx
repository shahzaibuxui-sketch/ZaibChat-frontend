import React, { useState, useEffect } from 'react'
import Header from './Components/Header'
import ChatWindow from './Components/ChatWindow'
import InputBar from './Components/InputBar'
import Sidebar from './Components/Sidebar'
import './App.css'

// Helper: generate unique id for messages and chats
const generateId = () => Date.now() + '-' + Math.random().toString(36).substr(2, 8)

function App() {
  // State: chats array, active chat ID, dark mode, typing indicator
  const [chats, setChats] = useState(() => {
    // Initialize with 5 dummy chats
    return [
      { 
        id: '1', 
        title: 'Chat 1 - Introduction to AI', 
        messages: [] 
      },
      { 
        id: '2', 
        title: 'Chat 2 - React Best Practices', 
        messages: [] 
      },
      { 
        id: '3', 
        title: 'Chat 3 - Design Systems', 
        messages: [] 
      },
      { 
        id: '4', 
        title: 'Chat 4 - Product Strategy', 
        messages: [] 
      },
      { 
        id: '5', 
        title: 'Chat 5 - User Research', 
        messages: [] 
      },
    ]
  })
  
  const [activeChatId, setActiveChatId] = useState('1')
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if localStorage has preference or default to light mode
    const saved = localStorage.getItem('chatTheme')
    return saved ? saved === 'dark' : false
  })
  
  const [isTyping, setIsTyping] = useState(false)
  const [isSidebarVisible, setIsSidebarVisible] = useState(false)
  
  // Get current active chat and its messages
  const activeChat = chats.find(chat => chat.id === activeChatId)
  const messages = activeChat ? activeChat.messages : []
  
  // Apply theme to document root and set CSS variables dynamically
  useEffect(() => {
    const root = document.documentElement
    if (isDarkMode) {
      // Dark theme variables - Updated to match logo colors
      root.style.setProperty('--bg-body', '#0f0f0f')
      root.style.setProperty('--header-bg', 'rgba(26, 26, 26, 0.8)')
      root.style.setProperty('--chat-bg', '#121212')
      root.style.setProperty('--input-bar-bg', 'transparent')
      root.style.setProperty('--border-color', '#2c2c2e')
      root.style.setProperty('--text-primary', '#f0f0f0')
      root.style.setProperty('--text-secondary', '#a0a0a0')
      root.style.setProperty('--user-msg-bg', '#2d8fe0')
      root.style.setProperty('--user-msg-text', '#ffffff')
      root.style.setProperty('--ai-msg-bg', '#2d2d30')
      root.style.setProperty('--input-field-bg', '#252526')
      root.style.setProperty('--placeholder-color', '#7e7e7e')
      root.style.setProperty('--accent-color', '#2d8fe0')
      root.style.setProperty('--accent-hover', '#1a6fc4')
      root.style.setProperty('--toggle-bg', '#2c2c2e')
      root.style.setProperty('--toggle-hover', '#3a3a3c')
      root.style.setProperty('--scrollbar-thumb', '#3a3a3c')
      root.style.setProperty('--scrollbar-thumb-hover', '#4a4a4c')
      root.style.setProperty('--shadow-sm', '0 1px 2px rgba(0, 0, 0, 0.2)')
      root.style.setProperty('--shadow-md', '0 4px 6px -1px rgba(0, 0, 0, 0.2)')
      root.style.setProperty('--shadow-lg', '0 10px 15px -3px rgba(0, 0, 0, 0.2)')
    } else {
      // Light theme variables - Updated to match logo colors
      root.style.setProperty('--bg-body', '#f7f7f8')
      root.style.setProperty('--header-bg', 'rgba(255, 255, 255, 0.8)')
      root.style.setProperty('--chat-bg', '#f7f7f8')
      root.style.setProperty('--input-bar-bg', 'transparent')
      root.style.setProperty('--border-color', 'rgba(0, 0, 0, 0.08)')
      root.style.setProperty('--text-primary', '#1a1a1a')
      root.style.setProperty('--text-secondary', '#6e6e6e')
      root.style.setProperty('--user-msg-bg', '#1a6fc4')
      root.style.setProperty('--user-msg-text', '#ffffff')
      root.style.setProperty('--ai-msg-bg', '#ffffff')
      root.style.setProperty('--input-field-bg', '#ffffff')
      root.style.setProperty('--placeholder-color', '#8e8e8e')
      root.style.setProperty('--accent-color', '#1a6fc4')
      root.style.setProperty('--accent-hover', '#1558a0')
      root.style.setProperty('--toggle-bg', '#f0f0f0')
      root.style.setProperty('--toggle-hover', '#e0e0e0')
      root.style.setProperty('--scrollbar-thumb', '#d0d0d0')
      root.style.setProperty('--scrollbar-thumb-hover', '#b0b0b0')
      root.style.setProperty('--shadow-sm', '0 1px 2px rgba(0, 0, 0, 0.04)')
      root.style.setProperty('--shadow-md', '0 4px 6px -1px rgba(0, 0, 0, 0.05)')
      root.style.setProperty('--shadow-lg', '0 10px 15px -3px rgba(0, 0, 0, 0.05)')
    }
    localStorage.setItem('chatTheme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])
  
  // Real AI reply function: sends POST request to Python Flask backend with retry logic
  const getAIReply = async (userMessage, retryCount = 0) => {
    const maxRetries = 2;
    const retryDelay = 2000; // 2 seconds
    
    try {
      // Use environment variable for API URL
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'
      const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userMessage })
      })
      
      // Check for retryable status codes (503 Service Unavailable, 429 Too Many Requests)
      if (response.status === 503 || response.status === 429) {
        if (retryCount < maxRetries) {
          console.log(`Retryable error ${response.status}. Retrying in ${retryDelay}ms... (Attempt ${retryCount + 1}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, retryDelay))
          return getAIReply(userMessage, retryCount + 1)
        } else {
          throw new Error(`Service temporarily unavailable after ${maxRetries} retries. Please try again later.`)
        }
      }
      
      // Check if response is ok (status 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Validate that data has the reply field
      if (data && data.reply) {
        return data.reply
      } else {
        throw new Error("Invalid response format from server")
      }
    } catch (error) {
      console.error("Error calling backend API:", error)
      
      // If it's a network error and we have retries left, retry
      if (error.name === 'TypeError' && retryCount < maxRetries) {
        console.log(`Network error. Retrying in ${retryDelay}ms... (Attempt ${retryCount + 1}/${maxRetries})`)
        await new Promise(resolve => setTimeout(resolve, retryDelay))
        return getAIReply(userMessage, retryCount + 1)
      }
      
      // Return error message for display
      return `Sorry, I couldn't connect to the server. Please make sure the backend is running at ${import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'}`
    }
  }
  
  // Handler for sending user message
  const handleSendMessage = async (content) => {
    // Check if there's an active chat
    if (!activeChat) return
    
    // 1. Add user message to active chat
    const userMsg = {
      id: generateId(),
      role: 'user',
      content: content
    }
    
    // Update chat messages
    setChats(prev => prev.map(chat => 
      chat.id === activeChatId 
        ? { ...chat, messages: [...chat.messages, userMsg] }
        : chat
    ))
    
    // 2. If this is the first user message and chat title is still default, update it
    const currentChat = chats.find(chat => chat.id === activeChatId)
    const isFirstUserMessage = currentChat && currentChat.messages.length === 0
    
    if (isFirstUserMessage) {
      const newTitle = content.length > 30 ? content.substring(0, 27) + '...' : content
      setChats(prev => prev.map(chat => 
        chat.id === activeChatId 
          ? { ...chat, title: newTitle }
          : chat
      ))
    }
    
    // 3. Show typing indicator
    setIsTyping(true)
    
    // 4. Get AI response from backend
    const aiReplyText = await getAIReply(content)
    
    // 5. Add assistant message to active chat and stop typing
    const assistantMsg = {
      id: generateId(),
      role: 'assistant',
      content: aiReplyText
    }
    
    setChats(prev => prev.map(chat => 
      chat.id === activeChatId 
        ? { ...chat, messages: [...chat.messages, assistantMsg] }
        : chat
    ))
    setIsTyping(false)
  }
  
  // Handler for editing user message
  const handleEditMessage = (messageId, newContent) => {
    setChats(prev => prev.map(chat => 
      chat.id === activeChatId 
        ? { 
            ...chat, 
            messages: chat.messages.map(msg => 
              msg.id === messageId && msg.role === 'user'
                ? { ...msg, content: newContent }
                : msg
            )
          }
        : chat
    ))
  }
  
  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev)
  }
  
  // Chat selection handler
  const handleChatSelect = (chatId) => {
    setActiveChatId(chatId)
    // Close sidebar on mobile when chat selected
    if (window.innerWidth <= 768) {
      setIsSidebarVisible(false)
    }
  }
  
  // New Chat handler
  const handleNewChat = () => {
    const newChat = {
      id: generateId(),
      title: 'New Chat',
      messages: []
    }
    setChats(prev => [...prev, newChat])
    setActiveChatId(newChat.id)
  }
  
  // Delete Chat handler
  const handleDeleteChat = (chatId) => {
    // Don't delete if it's the last chat
    if (chats.length === 1) {
      alert("Cannot delete the last chat. Create a new chat first.")
      return
    }
    
    const updatedChats = chats.filter(chat => chat.id !== chatId)
    setChats(updatedChats)
    
    // If deleted chat was active, switch to first available chat
    if (activeChatId === chatId) {
      const firstAvailable = updatedChats[0]
      if (firstAvailable) {
        setActiveChatId(firstAvailable.id)
      }
    }
  }
  
  // Rename Chat handler
  const handleRenameChat = (chatId, newTitle) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, title: newTitle }
        : chat
    ))
  }
  
  const handleMenuToggle = (isOpen) => {
    setIsSidebarVisible(isOpen)
  }
  
  return (
    <div className="app-container">
      <Sidebar 
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        chats={chats}
        activeChatId={activeChatId}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
      />
      <div className={`main-chat-area ${isSidebarVisible ? 'sidebar-open' : ''}`}>
        <Header onMenuToggle={handleMenuToggle} />
        <ChatWindow 
          messages={messages} 
          isTyping={isTyping} 
          onEditMessage={handleEditMessage}
        />
        <InputBar onSendMessage={handleSendMessage} disabled={isTyping} />
      </div>
    </div>
  )
}

export default App