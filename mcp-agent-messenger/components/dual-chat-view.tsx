"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Send, Paperclip } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { MobileFrame } from "./mobile-frame"
import { sendMessageToAnthropic, callAgentWithFallback } from "@/actions/anthropic-api"

interface ChatMessage {
  id: string
  content: string
  timestamp: string
  isFromAgent: boolean
  isFromJack: boolean
  read: boolean
  error?: boolean
  isLoading?: boolean
}

interface DualChatViewProps {
  groupId: string
  groupName: string
  groupEmoji: string
  contactName: string
  messages: ChatMessage[]
  onBack: () => void
}

export function DualChatView({
  groupId,
  groupName,
  groupEmoji,
  contactName,
  messages: initialMessages,
  onBack,
}: DualChatViewProps) {
  console.log("DualChatView rendering with messages:", initialMessages)

  // Convert initial messages to include isFromJack property if it doesn't exist
  const processedInitialMessages = (initialMessages || []).map((msg) => ({
    ...msg,
    isFromJack: msg.isFromJack !== undefined ? msg.isFromJack : !msg.isFromAgent,
  }))

  const [messages, setMessages] = useState<ChatMessage[]>(processedInitialMessages)
  const [sarahMessage, setSarahMessage] = useState("")
  const [jackMessage, setJackMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const jackMessagesEndRef = useRef<HTMLDivElement>(null)
  const sarahMessagesEndRef = useRef<HTMLDivElement>(null)

  // Extract the user's name (Jack) and contact name for placeholders
  const userName = "Jack" // This could be fetched from user profile in a real app
  const contactNameOnly = contactName.split(" ")[0] // Get first name only

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    jackMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    sarahMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle Sarah sending a message (right phone)
  const handleSarahSendMessage = async () => {
    if (sarahMessage.trim() === "" || isLoading) return

    // Add Sarah's message to both phones
    const newSarahMessage: ChatMessage = {
      id: `msg-${Date.now()}-sarah`,
      content: sarahMessage,
      timestamp: "Just now",
      isFromAgent: false,
      isFromJack: false,
      read: true,
    }

    console.log("Sarah is sending a message:", newSarahMessage)
    setMessages((prev) => [...prev, newSarahMessage])
    setSarahMessage("")

    // Create a temporary loading message
    const loadingMessageId = `msg-${Date.now()}-loading`
    const loadingMessage: ChatMessage = {
      id: loadingMessageId,
      content: "...",
      timestamp: "Just now",
      isFromAgent: true,
      isFromJack: true,
      read: false,
      isLoading: true,
    }

    // Add the loading message
    setMessages((prev) => [...prev, loadingMessage])
    setIsLoading(true)

    try {
      console.log(`Calling Anthropic API for group ${groupId} with message:`, newSarahMessage.content)

      // Call Anthropic API
      const response = await callAgentWithFallback(newSarahMessage.content, { groupId })
      console.log(`Received response from Anthropic API:`, response)

      // Create the agent message
      const agentMessage: ChatMessage = {
        id: `msg-${Date.now()}-agent`,
        content: response,
        timestamp: "Just now",
        isFromAgent: true,
        isFromJack: true,
        read: false,
        error: response.includes("Error:") || response.includes("error"),
      }

      // Replace the loading message with the actual response
      setMessages((prev) => prev.filter((msg) => msg.id !== loadingMessageId).concat(agentMessage))

      console.log("Added agent response to chat:", agentMessage)
    } catch (error) {
      console.error("Error sending message to Anthropic:", error)

      // Create error message
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        content: `I'm sorry, I encountered an error while processing your request. Error: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: "Just now",
        isFromAgent: true,
        isFromJack: true,
        read: false,
        error: true,
      }

      // Replace the loading message with the error message
      setMessages((prev) => prev.filter((msg) => msg.id !== loadingMessageId).concat(errorMessage))
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Jack sending a manual message (left phone)
  const handleJackSendMessage = () => {
    if (jackMessage.trim() === "") return

    // Add Jack's message to both phones
    const newJackMessage: ChatMessage = {
      id: `msg-${Date.now()}-jack`,
      content: jackMessage,
      timestamp: "Just now",
      isFromAgent: false,
      isFromJack: true,
      read: true,
    }

    console.log("Jack is sending a manual message:", newJackMessage)
    setMessages((prev) => [...prev, newJackMessage])
    setJackMessage("")
  }

  return (
    <div className="flex w-full justify-center items-center gap-2">
      {/* Jack's Phone (Left) */}
      <motion.div
        className="w-[390px]"
        initial={{ x: 0 }}
        animate={{ x: "-10%" }}
        exit={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <MobileFrame>
          <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-800">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-gray-800/80 backdrop-blur-sm text-gray-100 px-4 py-3 shadow-lg border-b border-gray-700/50 flex items-center">
              <button onClick={onBack} className="mr-3">
                <ArrowLeft size={20} className="text-gray-300" />
              </button>
              <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-lg mr-2">
                {groupEmoji}
              </div>
              <div>
                <h1 className="text-lg font-medium text-gray-100">{contactName}</h1>
                <p className="text-xs text-gray-400">{groupName}</p>
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence mode="sync">
                {messages.map((message, index) => (
                  <motion.div
                    key={`jack-view-${message.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={`flex ${message.isFromJack ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        message.isFromJack
                          ? message.isLoading
                            ? "bg-gradient-to-r from-[#4D4CFF]/30 to-[#9B60FF]/30 text-white rounded-tr-sm"
                            : "bg-gradient-to-r from-[#4D4CFF] to-[#9B60FF] text-white rounded-tr-sm"
                          : "bg-gray-800 text-gray-200 rounded-tl-sm"
                      }`}
                    >
                      {message.isLoading ? (
                        <div className="flex space-x-2 items-center py-1">
                          <div
                            className="w-2 h-2 rounded-full bg-white animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 rounded-full bg-white animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 rounded-full bg-white animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          {message.isFromAgent && <p className="text-xs mt-1 opacity-50 text-left">Agent</p>}
                          <p className="text-xs mt-1 opacity-70 text-right">{message.timestamp}</p>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
                <div ref={jackMessagesEndRef} />
              </AnimatePresence>
            </div>

            {/* Message Input for Jack */}
            <div className="p-3 border-t border-gray-700/50 bg-gray-800/90 backdrop-blur-md">
              <div className="flex items-center bg-gray-750 rounded-full border border-gray-700/50 px-3 py-1">
                <button className="text-gray-400 p-2">
                  <Paperclip size={18} />
                </button>
                <input
                  type="text"
                  placeholder={`Type as ${userName}...`}
                  className="flex-1 bg-transparent border-none text-gray-200 placeholder:text-gray-500 focus:outline-none py-2 px-2 text-sm"
                  value={jackMessage}
                  onChange={(e) => setJackMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleJackSendMessage()
                    }
                  }}
                  disabled={isLoading}
                />
                <button
                  className={`rounded-full p-2 ${
                    jackMessage.trim() === "" || isLoading
                      ? "text-gray-500 cursor-not-allowed"
                      : "text-white bg-gradient-to-r from-[#4D4CFF] to-[#9B60FF]"
                  }`}
                  onClick={handleJackSendMessage}
                  disabled={jackMessage.trim() === "" || isLoading}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </MobileFrame>
      </motion.div>

      {/* Sarah's Phone (Right) */}
      <motion.div
        className="w-[390px]"
        initial={{ opacity: 0, x: "100%" }}
        animate={{ opacity: 1, x: "10%" }}
        exit={{ opacity: 0, x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <MobileFrame>
          <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-800">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-gray-800/80 backdrop-blur-sm text-gray-100 px-4 py-3 shadow-lg border-b border-gray-700/50 flex items-center">
              <button onClick={onBack} className="mr-3">
                <ArrowLeft size={20} className="text-gray-300" />
              </button>
              <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-lg mr-2">
                {groupEmoji}
              </div>
              <div>
                <h1 className="text-lg font-medium text-gray-100">Jack's Agent</h1>
                <p className="text-xs text-gray-400">{groupName}</p>
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence mode="sync">
                {messages.map((message, index) => (
                  <motion.div
                    key={`sarah-view-${message.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={`flex ${!message.isFromJack ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        !message.isFromJack
                          ? "bg-gradient-to-r from-[#4D4CFF] to-[#9B60FF] text-white rounded-tr-sm"
                          : message.isLoading
                            ? "bg-gray-800/70 text-gray-200 rounded-tl-sm"
                            : message.error
                              ? "bg-red-900/30 text-gray-200 rounded-tl-sm border border-red-700/50"
                              : "bg-gray-800 text-gray-200 rounded-tl-sm"
                      }`}
                    >
                      {message.isLoading ? (
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
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          {message.isFromJack && (
                            <p className="text-xs mt-1 opacity-50 text-left">
                              {message.isFromAgent ? "Agent" : "Jack"}
                            </p>
                          )}
                          <p className="text-xs mt-1 opacity-70 text-right">{message.timestamp}</p>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
                <div ref={sarahMessagesEndRef} />
              </AnimatePresence>
            </div>

            {/* Message Input for Sarah */}
            <div className="p-3 border-t border-gray-700/50 bg-gray-800/90 backdrop-blur-md">
              <div className="flex items-center bg-gray-750 rounded-full border border-gray-700/50 px-3 py-1">
                <button className="text-gray-400 p-2">
                  <Paperclip size={18} />
                </button>
                <input
                  type="text"
                  placeholder={`Type as ${contactNameOnly}...`}
                  className="flex-1 bg-transparent border-none text-gray-200 placeholder:text-gray-500 focus:outline-none py-2 px-2 text-sm"
                  value={sarahMessage}
                  onChange={(e) => setSarahMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSarahSendMessage()
                    }
                  }}
                  disabled={isLoading}
                />
                <button
                  className={`rounded-full p-2 ${
                    sarahMessage.trim() === "" || isLoading
                      ? "text-gray-500 cursor-not-allowed"
                      : "text-white bg-gradient-to-r from-[#4D4CFF] to-[#9B60FF]"
                  }`}
                  onClick={handleSarahSendMessage}
                  disabled={sarahMessage.trim() === "" || isLoading}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </MobileFrame>
      </motion.div>
    </div>
  )
}
