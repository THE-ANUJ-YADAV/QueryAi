import React, { useEffect, useState, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'
import { getSocket } from '../service/chat.socket'
import remarkGfm from 'remark-gfm'

const Dashboard = () => {
  const chat = useChat()
  const [chatInput, setChatInput] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [theme, setTheme] = useState('dark')
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector((state) => state.chat.currentChatId)
  const currentChat = chats[currentChatId]

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()
  }, [])

  // Join chat room when opening a chat
  useEffect(() => {
    if (currentChatId) {
      const socket = getSocket()
      if (socket) {
        socket.emit("join:chat", currentChatId)
      }
    }
  }, [currentChatId])

  useEffect(() => {
    scrollToBottom()
  }, [currentChat?.messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [chatInput])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmitMessage = (event) => {
    event.preventDefault()
    const trimmedMessage = chatInput.trim()
    if (!trimmedMessage) return

    chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId })
    setChatInput('')
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId, chats)
    setSidebarOpen(false)
  }

  const handleNewChat = () => {
    chat.handleCreateNewChat?.()
    setSidebarOpen(false)
  }

  const groupChatsByDate = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const sevenDaysAgo = new Date(today)
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const groups = { today: [], yesterday: [], previous7: [], older: [] }

    Object.values(chats).forEach((c) => {
      if (!c.title.toLowerCase().includes(searchQuery.toLowerCase())) return

      const chatDate = new Date(c.createdAt || new Date())
      const chatDay = new Date(chatDate.getFullYear(), chatDate.getMonth(), chatDate.getDate())

      if (chatDay.getTime() === today.getTime()) {
        groups.today.push(c)
      } else if (chatDay.getTime() === yesterday.getTime()) {
        groups.yesterday.push(c)
      } else if (chatDay.getTime() >= sevenDaysAgo.getTime()) {
        groups.previous7.push(c)
      } else {
        groups.older.push(c)
      }
    })

    return groups
  }

  const groups = groupChatsByDate()

  const renderChatGroup = (label, chatList) => {
    if (chatList.length === 0) return null
    return (
      <div key={label} className='mb-4'>
        <div className='px-3 py-2'>
          <p className='text-xs font-semibold uppercase tracking-wider text-white/40'>{label}</p>
        </div>
        <div className='space-y-1'>
          {chatList.map((c) => (
            <button
              key={c.id}
              onClick={() => openChat(c.id)}
              className={`group relative w-full rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 ${
                currentChatId === c.id
                  ? 'border-l-2 border-indigo-500 bg-white/8 text-white'
                  : 'border-l-2 border-transparent text-white/70 hover:bg-white/5 hover:text-white'
              }`}
            >
              <p className='truncate font-medium'>{c.title}</p>
              <button className='absolute right-2 top-2 hidden rounded p-1 hover:bg-white/10 group-hover:block'>
                <svg className='h-4 w-4' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='M10.5 1.5H9.5V4h1V1.5zM10.5 16h-1v2.5h1V16z' />
                  <circle cx='10.5' cy='10' r='1.5' />
                </svg>
              </button>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex h-screen w-full overflow-hidden bg-gradient-to-br from-[#0a0a0f] via-[#13131a] to-[#0d0d15] ${theme}`}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className='fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-white/10 bg-[#0f0f17]/95 backdrop-blur-md transition-transform duration-300 md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className='flex items-center justify-between border-b border-white/10 p-4'>
          <div className='flex items-center gap-2'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600'>
              <svg className='h-5 w-5 text-white' fill='currentColor' viewBox='0 0 20 20'>
                <path d='M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z' />
              </svg>
            </div>
            <h1 className='text-lg font-bold text-white'>Query-AI</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className='rounded-lg p-1 hover:bg-white/10 md:hidden'
          >
            <svg className='h-5 w-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>
        </div>

        {/* New Chat Button */}
        <div className='p-4'>
          <button
            onClick={handleNewChat}
            className='group relative w-full overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-0.5 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50'
          >
            <div className='flex items-center justify-center gap-2 rounded-full bg-[#0f0f17] px-4 py-2.5 text-sm font-medium text-white transition-colors group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:via-purple-500 group-hover:to-pink-500'>
              <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
              </svg>
              New Chat
            </div>
          </button>
        </div>

        {/* Search Input */}
        <div className='px-4 pb-4'>
          <div className='relative'>
            <svg className='absolute left-3 top-3 h-4 w-4 text-white/50' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
            </svg>
            <input
              type='text'
              placeholder='Search chats...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-indigo-500/50 focus:bg-white/10'
            />
          </div>
        </div>

        {/* Chat History */}
        <div className='flex-1 overflow-y-auto px-2 py-2'>
          {renderChatGroup('Today', groups.today)}
          {renderChatGroup('Yesterday', groups.yesterday)}
          {renderChatGroup('Previous 7 Days', groups.previous7)}
          {renderChatGroup('Older', groups.older)}
          {Object.values(chats).length === 0 && (
            <div className='flex flex-col items-center justify-center py-8 text-center'>
              <svg className='h-8 w-8 text-white/30 mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
              <p className='text-xs text-white/40'>No chats yet</p>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className='border-t border-white/10 p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <div className='flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-semibold text-white'>
                A
              </div>
              <div className='text-sm'>
                <p className='font-medium text-white'>Anuj</p>
                <p className='text-xs text-white/50'>user@query-ai.com</p>
              </div>
            </div>
            <button className='rounded-lg p-2 hover:bg-white/10 transition-colors'>
              <svg className='h-4 w-4 text-white/70' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' />
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {/* Header */}
        <header className='flex items-center justify-between border-b border-white/10 bg-[#0f0f17]/80 backdrop-blur-md px-4 md:px-6 py-4 md:py-5'>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => setSidebarOpen(true)}
              className='rounded-lg p-2 hover:bg-white/10 transition-colors md:hidden'
            >
              <svg className='h-5 w-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
              </svg>
            </button>
            <div>
              <h2 className='text-base md:text-lg font-semibold text-white'>
                {currentChat?.title || 'Start a New Conversation'}
              </h2>
              <p className='text-xs text-white/50 mt-0.5'>AI Assistant</p>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <select className='hidden sm:block rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500/50'>
              <option>GPT-4</option>
              <option>GPT-3.5</option>
              <option>Claude-3</option>
            </select>
            <button className='rounded-lg p-2 hover:bg-white/10 transition-colors'>
              <svg className='h-5 w-5 text-white/70' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8.684 13.342C9.589 12.438 10 11.149 10 9.5c0-2.485-2.686-4.5-6-4.5s-6 2.015-6 4.5S.684 14 4 14c1.126 0 2.342-.477 2.916-1.169' />
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 12a4 4 0 10-8 0 4 4 0 008 0z' />
              </svg>
            </button>
            <button className='rounded-lg p-2 hover:bg-white/10 transition-colors'>
              <svg className='h-5 w-5 text-white/70' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' />
              </svg>
            </button>
          </div>
        </header>

        {/* Messages Area */}
        <div className='flex-1 overflow-y-auto px-4 md:px-6 py-6 md:py-8 space-y-6'>
          {!currentChat || currentChat.messages.length === 0 ? (
            <div className='flex h-full flex-col items-center justify-center gap-6 py-12'>
              <div className='text-center'>
                <div className='mb-4 flex justify-center'>
                  <div className='h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5'>
                    <div className='flex h-full w-full items-center justify-center rounded-xl bg-[#13131a]'>
                      <svg className='h-8 w-8 text-white' fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z' />
                      </svg>
                    </div>
                  </div>
                </div>
                <h3 className='mb-2 text-xl font-semibold text-white'>Welcome to Query-AI</h3>
                <p className='mb-6 max-w-sm text-sm text-white/60'>
                  Start a conversation by typing a message below or explore suggested prompts
                </p>
              </div>

              <div className='grid w-full max-w-2xl gap-3 md:grid-cols-2'>
                {[
                  { icon: '✨', title: 'Explain like I\'m 5', text: 'Simplify any complex topic' },
                  { icon: '💡', title: 'Brainstorm Ideas', text: 'Get creative suggestions' },
                  { icon: '📚', title: 'Research', text: 'Deep dive into a subject' },
                  { icon: '🚀', title: 'Quick Answers', text: 'Get straight to the point' },
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setChatInput(prompt.text)}
                    className='group rounded-xl border border-white/10 bg-white/5 p-4 text-left transition-all duration-200 hover:border-indigo-500/50 hover:bg-white/10'
                  >
                    <p className='mb-1 text-lg'>{prompt.icon}</p>
                    <p className='font-medium text-white group-hover:text-indigo-300'>{prompt.title}</p>
                    <p className='text-xs text-white/50'>{prompt.text}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {currentChat.messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'ai' && (
                    <div className='mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600'>
                      <svg className='h-5 w-5 text-white' fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z' />
                      </svg>
                    </div>
                  )}

                  <div
                    className={`group relative max-w-xl rounded-2xl px-4 py-3 transition-all duration-200 ${
                      message.role === 'user'
                        ? 'rounded-br-none bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'text-white/90'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <p className='text-sm md:text-base leading-relaxed'>{message.content}</p>
                    ) : (
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => <p className='mb-2 text-sm md:text-base leading-relaxed last:mb-0'>{children}</p>,
                          h1: ({ children }) => <h1 className='mb-2 text-lg font-bold text-white'>{children}</h1>,
                          h2: ({ children }) => <h2 className='mb-2 text-base font-bold text-white'>{children}</h2>,
                          h3: ({ children }) => <h3 className='mb-2 font-bold text-white'>{children}</h3>,
                          ul: ({ children }) => <ul className='mb-2 list-disc space-y-1 pl-5 text-sm'>{children}</ul>,
                          ol: ({ children }) => <ol className='mb-2 list-decimal space-y-1 pl-5 text-sm'>{children}</ol>,
                          li: ({ children }) => <li className='text-white/90'>{children}</li>,
                          strong: ({ children }) => <strong className='font-bold text-white'>{children}</strong>,
                          em: ({ children }) => <em className='italic text-white/80'>{children}</em>,
                          code: ({ children }) => (
                            <code className='inline rounded bg-black/30 px-1.5 py-0.5 font-mono text-xs text-indigo-300'>
                              {children}
                            </code>
                          ),
                          pre: ({ children }) => (
                            <pre className='mb-2 overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-3 font-mono text-xs text-white/80'>
                              {children}
                            </pre>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className='mb-2 border-l-4 border-indigo-500 pl-3 italic text-white/70'>
                              {children}
                            </blockquote>
                          ),
                        }}
                        remarkPlugins={[remarkGfm]}
                      >
                        {message.content}
                      </ReactMarkdown>
                    )}

                    {/* Timestamp on hover */}
                    <div className='absolute -bottom-6 right-0 hidden text-xs text-white/40 group-hover:block'>
                      {new Date(message.timestamp || new Date()).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>

                  {message.role === 'user' && (
                    <div className='mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-red-500'>
                      <span className='text-sm font-semibold text-white'>You</span>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className='flex gap-3'>
                  <div className='mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600'>
                    <svg className='h-5 w-5 text-white' fill='currentColor' viewBox='0 0 20 20'>
                      <path d='M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z' />
                    </svg>
                  </div>
                  <div className='flex items-center gap-1 rounded-2xl rounded-bl-none border border-white/10 bg-white/5 px-4 py-3'>
                    <span className='inline-flex h-2 w-2 rounded-full bg-white/60 animate-pulse'></span>
                    <span className='ml-1 inline-flex h-2 w-2 rounded-full bg-white/60 animate-pulse' style={{ animationDelay: '0.2s' }}></span>
                    <span className='ml-1 inline-flex h-2 w-2 rounded-full bg-white/60 animate-pulse' style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input Area */}
        <div className='border-t border-white/10 bg-[#0f0f17]/80 backdrop-blur-md px-4 md:px-6 py-4 md:py-5'>
          <form onSubmit={handleSubmitMessage} className='mx-auto w-full max-w-3xl space-y-2'>
            <div className='group relative rounded-2xl border border-white/10 bg-white/5 shadow-lg transition-all duration-300 focus-within:border-indigo-500/50 focus-within:shadow-lg focus-within:shadow-indigo-500/20'>
              <textarea
                ref={textareaRef}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmitMessage(e)
                  }
                }}
                placeholder='Type your message... (Shift+Enter for new line)'
                rows={1}
                className='w-full resize-none rounded-2xl border-0 bg-transparent px-4 py-3 pr-12 text-base text-white outline-none placeholder:text-white/40'
              />

              <div className='absolute bottom-3 right-3 flex items-center gap-2'>
                <button
                  type='button'
                  className='rounded-lg p-1.5 hover:bg-white/10 transition-colors'
                >
                  <svg className='h-5 w-5 text-white/60 hover:text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
                  </svg>
                </button>

                <button
                  type='button'
                  className='rounded-lg p-1.5 hover:bg-white/10 transition-colors'
                >
                  <svg className='h-5 w-5 text-white/60 hover:text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4' />
                  </svg>
                </button>

                <button
                  type='submit'
                  disabled={!chatInput.trim()}
                  className={`ml-2 rounded-full p-2 transition-all duration-300 ${
                    chatInput.trim()
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-500/50 hover:shadow-lg hover:shadow-purple-500/70'
                      : 'bg-white/10 text-white/40 cursor-not-allowed'
                  }`}
                >
                  <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                </button>
              </div>
            </div>

            <div className='flex items-center justify-between px-2'>
              <p className='text-xs text-white/40'>
                AI can make mistakes. <span className='text-white/50'>Verify important information.</span>
              </p>
              {chatInput && (
                <p className='text-xs text-white/50'>{chatInput.length} / 4000</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
