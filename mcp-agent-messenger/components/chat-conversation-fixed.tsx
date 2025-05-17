"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Send, Paperclip, AlertCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { sendMessageToAnthropic } from "@/actions/anthropic-api"

interface ChatMessage {
  id: string
  content: string
  timestamp: string
  isFromAgent: boolean
  read: boolean
  error?: boolean
}

interface ChatConversationProps {
  groupId: string
  groupName: string
  groupEmoji: string
  contactName: string
  messages: ChatMessage[]
  onBack: () => void
}

export function ChatConversation({
  groupId,
  groupName,
  groupEmoji,
  contactName,
  messages: initialMessages,
  onBack,
}: ChatConversationProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Debug: Log initial messages
  useEffect(() => {
    console.log("Initial messages:", initialMessages)
  }, [initialMessages])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    console.log("Messages updated, scrolling to bottom")
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || isLoading) return

    console.log("Sending new message:", newMessage)

    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      content: newMessage,
      timestamp: "Just now",
      isFromAgent: false,
      read: true,
    }

    console.log("Adding user message to chat:", userMessage)
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, userMessage]
      console.log("Updated messages after adding user message:", updatedMessages)
      return updatedMessages
    })

    // Clear the input field
    const userMessageContent = newMessage
    setNewMessage("")

    // Set loading state
    setIsLoading(true)
    console.log("Set loading state to true")

    try {
      console.log(`Calling Anthropic API for group ${groupId} with message:`, userMessageContent)

      // Call Anthropic API
      const response = await sendMessageToAnthropic(groupId, userMessageContent)
      console.log(`Received response from Anthropic API:`, response)

      // Add agent message
      const agentMessage: ChatMessage = {
        id: `msg-${Date.now()}-agent`,
        content: response,
        timestamp: "Just now",
        isFromAgent: true,
        read: false,
        error: response.includes("Error:") || response.includes("error"),
      }

      console.log("Adding agent message to chat:", agentMessage)
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, agentMessage]
        console.log("Updated messages after adding agent response:", updatedMessages)
        return updatedMessages
      })
    } catch (error) {
      console.error("Error sending message to Anthropic:", error)

      // Add error message
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        content: `I'm sorry, I encountered an error while processing your request. Error: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: "Just now",
        isFromAgent: true,
        read: false,
        error: true,
      }

      console.log("Adding error message to chat:", errorMessage)
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, errorMessage]
        console.log("Updated messages after adding error message:", updatedMessages)
        return updatedMessages
      })
    } finally {
      console.log("Setting loading state to false")
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gray-800/80 backdrop-blur-sm text-gray-100 px-4 py-3 shadow-lg border-b border-gray-700/50 flex items-center">
        <Link href="/chats" className="mr-3" onClick={onBack}>
          <ArrowLeft size={20} className="text-gray-300" />
        </Link>
        <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-lg mr-2">
          {groupEmoji}
        </div>
        <div>
          <h1 className="text-lg font-medium text-gray-100">{contactName}</h1>
          <p className="text-xs text-gray-400">{groupName} agent</p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={`flex ${message.isFromAgent ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.isFromAgent
                    ? message.error
                      ? "bg-red-900/30 text-gray-200 rounded-tl-sm border border-red-700/50"
                      : "bg-gray-800 text-gray-200 rounded-tl-sm"
                    : "bg-gradient-to-r from-[#4D4CFF] to-[#9B60FF] text-white rounded-tr-sm"
                }`}
              >
                {message.error && message.isFromAgent && (
                  <div className="flex items-center mb-1 text-red-400">
                    <AlertCircle size={14} className="mr-1" />
                    <span className="text-xs font-medium">Error</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs mt-1 opacity-70 text-right">{message.timestamp}</p>
              </div>
            </motion.div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="bg-gray-800 text-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 max-w-[80%]">
                <div className="flex space-x-2 items-center">
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
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </AnimatePresence>
      </div>

      {/* Message Input */}
      <div className="p-3 border-t border-gray-700/50 bg-gray-800/90 backdrop-blur-md">
        <div className="flex items-center bg-gray-750 rounded-full border border-gray-700/50 px-3 py-1">
          <button className="text-gray-400 p-2">
            <Paperclip size={18} />
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none text-gray-200 placeholder:text-gray-500 focus:outline-none py-2 px-2 text-sm"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
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
              newMessage.trim() === "" || isLoading
                ? "text-gray-500 cursor-not-allowed"
                : "text-white bg-gradient-to-r from-[#4D4CFF] to-[#9B60FF]"
            }`}
            onClick={handleSendMessage}
            disabled={newMessage.trim() === "" || isLoading}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
