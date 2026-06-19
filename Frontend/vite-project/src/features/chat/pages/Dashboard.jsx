import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { useChat } from '../hooks/useChat'

const Dashboard = () => {
  const chat = useChat()
  const [chatInput, setChatInput] = useState('')

  const chats = useSelector((state) => state.chat.chats)
  const currentChatId = useSelector(
    (state) => state.chat.currentChatId
  )

  useEffect(() => {
    chat.initializeSocketConnection()
    chat.handleGetChats()
  }, [])

  const handleSubmitMessage = (e) => {
    e.preventDefault()

    const message = chatInput.trim()
    if (!message) return

    chat.handleSendMessage({
      message,
      chatId: currentChatId,
    })

    setChatInput('')
  }

  const openChat = (chatId) => {
    chat.handleOpenChat(chatId)
  }

  return (
    <main className="h-screen overflow-hidden bg-[#07090f] p-3 text-white md:p-5">
      <section className="mx-auto flex h-full gap-4">

        {/* Sidebar */}
        <aside className="hidden w-72 shrink-0 rounded-3xl bg-[#080b12] p-4 md:flex md:flex-col">
          <h1 className="mb-5 text-3xl font-semibold">
            QueryAi
          </h1>

          <div className="flex-1 space-y-2 overflow-y-auto">
            {Object.values(chats).map((chatItem, index) => (
              <button
                key={chatItem._id || chatItem.id || index}
                onClick={() =>
                  openChat(chatItem._id || chatItem.id)
                }
                className="w-full rounded-xl border border-white/20 px-4 py-3 text-left transition hover:border-white/50"
              >
                {chatItem.title || `Chat ${index + 1}`}
              </button>
            ))}
          </div>
        </aside>

        {/* Chat Section */}
        <section className="flex flex-1 flex-col rounded-3xl bg-[#080b12] p-4">

          {/* Messages */}
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-4">

              {chats[currentChatId]?.messages?.map(
                (message, index) => (
                  <div
                    key={
                      message.id ||
                      message._id ||
                      index
                    }
                    className={`flex ${
                      message.role === 'user'
                        ? 'justify-end'
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`w-fit max-w-[75%] rounded-2xl px-4 py-3 break-words text-sm md:text-base ${
                        message.role === 'user'
                          ? 'bg-white/10 text-white'
                          : 'border border-white/20 bg-[#111827] text-white'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <p className="whitespace-pre-wrap">
                          {message.content}
                        </p>
                      ) : (
                        <ReactMarkdown
                          components={{
                            p: ({ children }) => (
                              <p className="mb-2 last:mb-0">
                                {children}
                              </p>
                            ),
                            ul: ({ children }) => (
                              <ul className="mb-2 list-disc pl-5">
                                {children}
                              </ul>
                            ),
                            ol: ({ children }) => (
                              <ol className="mb-2 list-decimal pl-5">
                                {children}
                              </ol>
                            ),
                            code: ({ children }) => (
                              <code className="rounded bg-white/10 px-1 py-0.5">
                                {children}
                              </code>
                            ),
                            pre: ({ children }) => (
                              <pre className="mb-2 overflow-x-auto rounded-xl bg-black/30 p-3">
                                {children}
                              </pre>
                            ),
                          }}
                        >
                          {message.content || ''}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Input */}
          <footer className="mt-4 rounded-3xl border border-white/20 bg-[#0b0f17] p-4">
            <form
              onSubmit={handleSubmitMessage}
              className="flex gap-3"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) =>
                  setChatInput(e.target.value)
                }
                placeholder="Type your message..."
                className="flex-1 rounded-2xl border border-white/20 bg-transparent px-4 py-3 text-white outline-none placeholder:text-white/40 focus:border-white/60"
              />

              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="rounded-2xl border border-white/30 px-6 py-3 font-semibold transition hover:bg-white/10 disabled:opacity-50"
              >
                Send
              </button>
            </form>
          </footer>
        </section>
      </section>
    </main>
  )
}



export default Dashboard