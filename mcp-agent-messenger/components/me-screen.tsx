"use client"

import { useState, useRef, useEffect } from "react"
import { Menu, X, Search, PenSquare, Send, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { sendMessageToPersonalAgent } from "@/actions/personal-agent-api"

interface ChatMessage {
  id: string
  content: string
  isUser: boolean
  timestamp: string
  isLoading?: boolean
  error?: boolean
}

export function MeScreen() {
  const [message, setMessage] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Example chat threads
  const exampleThreads = [
    { id: "1", title: "Trip planning", date: "Yesterday" },
    { id: "2", title: "Meeting notes", date: "2 days ago" },
    { id: "3", title: "Shopping list", date: "Last week" },
    { id: "4", title: "Project ideas", date: "2 weeks ago" },
  ]

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (message.trim() === "" || isLoading) return

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      content: message,
      isUser: true,
      timestamp: "Just now",
    }

    setMessages((prev) => [...prev, userMessage])
    console.log("Added user message to chat:", userMessage)

    // Clear the input field
    const userMessageContent = message
    setMessage("")

    // Set loading state
    setIsLoading(true)

    // Create a temporary loading message
    const loadingMessageId = `msg-${Date.now()}-loading`
    const loadingMessage: ChatMessage = {
      id: loadingMessageId,
      content: "",
      isUser: false,
      timestamp: "Just now",
      isLoading: true,
    }

    // Add the loading message
    setMessages((prev) => [...prev, loadingMessage])

    try {
      console.log("Calling Anthropic API with message:", userMessageContent)

      // Call Anthropic API
      const response = await sendMessageToPersonalAgent(userMessageContent)
      console.log("Received API response")

      // Create the agent message
      const agentMessage: ChatMessage = {
        id: `msg-${Date.now()}-agent`,
        content: response,
        isUser: false,
        timestamp: "Just now",
        error: response.includes("Error:") || response.includes("error"),
      }

      // Replace the loading message with the actual response
      setMessages((prev) => prev.filter((msg) => msg.id !== loadingMessageId).concat(agentMessage))
      console.log("Added agent response to chat")
    } catch (error) {
      console.error("Error sending message to Anthropic:", error)

      // Create error message
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        content: `I'm sorry, I encountered an error while processing your request. Error: ${error instanceof Error ? error.message : String(error)}`,
        isUser: false,
        timestamp: "Just now",
        error: true,
      }

      // Replace the loading message with the error message
      setMessages((prev) => prev.filter((msg) => msg.id !== loadingMessageId).concat(errorMessage))
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-800 relative">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gray-800/80 backdrop-blur-sm text-gray-100 px-4 py-3 shadow-lg border-b border-gray-700/50 flex items-center">
        <button className="mr-3" onClick={toggleSidebar}>
          <Menu size={20} className="text-gray-300" />
        </button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-[#4D4CFF] to-[#9B60FF] bg-clip-text text-transparent">
          Ask
        </h1>
      </header>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            className="absolute top-0 left-0 h-full w-64 bg-gray-850 z-50 shadow-lg border-r border-gray-700/50 flex flex-col"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="p-4 flex justify-between items-center border-b border-gray-700/50">
              <h2 className="text-lg font-bold text-white">Chats</h2>
              <button onClick={toggleSidebar}>
                <X size={20} className="text-gray-300" />
              </button>
            </div>

            {/* Search bar */}
            <div className="p-3 border-b border-gray-700/50">
              <div className="relative">
                <Search size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations"
                  className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 pl-8 pr-2 text-sm text-gray-200 placeholder:text-gray-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* New chat button */}
            <button className="flex items-center gap-2 p-3 hover:bg-gray-800 transition-colors text-gray-300">
              <PenSquare size={16} />
              <span>New chat</span>
            </button>

            {/* Chat threads */}
            <div className="flex-1 overflow-y-auto">
              {exampleThreads.map((thread) => (
                <div key={thread.id} className="p-3 hover:bg-gray-800 cursor-pointer border-b border-gray-700/20">
                  <div className="text-sm text-gray-200 truncate">{thread.title}</div>
                  <div className="text-xs text-gray-400">{thread.date}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay when sidebar is open */}
      {isSidebarOpen && <div className="absolute inset-0 bg-black/50 z-40" onClick={toggleSidebar} />}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-300 text-center max-w-xs">
              Ask your personal agent questions with full access to all agent group data
            </p>
          </div>
        ) : (
          <AnimatePresence mode="sync">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.isUser
                      ? "bg-gradient-to-r from-[#4D4CFF] to-[#9B60FF] text-white rounded-tr-sm"
                      : msg.isLoading
                        ? "bg-gray-800/70 text-gray-200 rounded-tl-sm"
                        : msg.error
                          ? "bg-red-900/30 text-gray-200 rounded-tl-sm border border-red-700/50"
                          : "bg-gray-800 text-gray-200 rounded-tl-sm"
                  }`}
                >
                  {msg.isLoading ? (
                    <div className="flex space-x-2 items-center py-1">
                      <div
                        className="w-2 h-2 rounded-full bg-[#9B60FF] animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-[#9B60FF] animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-[#9B60FF] animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  ) : (
                    <>
                      {msg.error && !msg.isUser && (
                        <div className="flex items-center mb-1 text-red-400">
                          <AlertCircle size={14} className="mr-1" />
                          <span className="text-xs font-medium">Error</span>
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-xs mt-1 opacity-70 text-right">{msg.timestamp}</p>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="absolute bottom-20 left-0 right-0 p-3 bg-gray-800/90 backdrop-blur-md border-t border-gray-700/50 z-20">
        <div className="flex items-center bg-gray-750 rounded-full border border-gray-700/50 px-3 py-1">
          <input
            type="text"
            placeholder="Message your personal agent..."
            className="flex-1 bg-transparent border-none text-gray-200 placeholder:text-gray-500 focus:outline-none py-2 px-2 text-sm"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            disabled={isLoading}
          />
          <button
            className={`rounded-full p-2 ${
              message.trim() === "" || isLoading
                ? "text-gray-500 cursor-not-allowed"
                : "text-white bg-gradient-to-r from-[#4D4CFF] to-[#9B60FF]"
            }`}
            onClick={handleSendMessage}
            disabled={message.trim() === "" || isLoading}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
