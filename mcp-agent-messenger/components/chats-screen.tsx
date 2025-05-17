"use client"

import { useState } from "react"
import { Search, Circle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ChatThreadPreview } from "./chat-thread-preview"

// Types for our chat data
interface ChatMessage {
  id: string
  content: string
  timestamp: string
  isFromAgent: boolean
  read: boolean
}

interface ChatThread {
  id: string
  groupId: string
  groupName: string
  groupEmoji: string
  contactName: string
  contactPhone: string
  messages: ChatMessage[]
  hasUnread: boolean
}

export function ChatsScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  // Mock data for chat threads
  const chatThreads: ChatThread[] = [
    {
      id: "thread1",
      groupId: "wifey",
      groupName: "Wifey",
      groupEmoji: "🧡",
      contactName: "Sarah",
      contactPhone: "+1 (555) 123-4567",
      hasUnread: true,
      messages: [
        {
          id: "msg1",
          content: "Don't forget we have dinner with my parents tonight at 7pm",
          timestamp: "10m ago",
          isFromAgent: false,
          read: true,
        },
        {
          id: "msg2",
          content: "I've added it to our calendar and set a reminder for 6pm. Should I order flowers for your mom?",
          timestamp: "8m ago",
          isFromAgent: true,
          read: false,
        },
      ],
    },
    {
      id: "thread2",
      groupId: "colleagues",
      groupName: "Colleagues",
      groupEmoji: "💼",
      contactName: "Alex",
      contactPhone: "+1 (555) 987-6543",
      hasUnread: true,
      messages: [
        {
          id: "msg3",
          content: "Can you share the Q3 report with the team?",
          timestamp: "1h ago",
          isFromAgent: false,
          read: true,
        },
        {
          id: "msg4",
          content:
            "I've shared the Q3 report with the team via email. I've also scheduled a review meeting for Friday.",
          timestamp: "45m ago",
          isFromAgent: true,
          read: false,
        },
      ],
    },
    {
      id: "thread3",
      groupId: "public",
      groupName: "Public",
      groupEmoji: "🌐",
      contactName: "Community",
      contactPhone: "+1 (555) 333-2222",
      hasUnread: false,
      messages: [
        {
          id: "msg5",
          content: "When is the next neighborhood cleanup event?",
          timestamp: "2h ago",
          isFromAgent: false,
          read: true,
        },
        {
          id: "msg6",
          content:
            "The next neighborhood cleanup is scheduled for Saturday, June 5th at 9am. I've checked the weather and it should be sunny.",
          timestamp: "1h ago",
          isFromAgent: true,
          read: true,
        },
      ],
    },
    {
      id: "thread4",
      groupId: "wifey",
      groupName: "Wifey",
      groupEmoji: "🧡",
      contactName: "Sarah (Work)",
      contactPhone: "+1 (555) 444-5555",
      hasUnread: false,
      messages: [
        {
          id: "msg7",
          content: "Can you send me the presentation for tomorrow's meeting?",
          timestamp: "1d ago",
          isFromAgent: false,
          read: true,
        },
        {
          id: "msg8",
          content:
            "I've sent the presentation to your work email. I've also added some notes about the key points to emphasize.",
          timestamp: "1d ago",
          isFromAgent: true,
          read: true,
        },
      ],
    },
    {
      id: "thread5",
      groupId: "colleagues",
      groupName: "Colleagues",
      groupEmoji: "💼",
      contactName: "Marketing Team",
      contactPhone: "+1 (555) 777-8888",
      hasUnread: false,
      messages: [
        {
          id: "msg9",
          content: "We need to finalize the campaign assets by EOD",
          timestamp: "3h ago",
          isFromAgent: false,
          read: true,
        },
        {
          id: "msg10",
          content:
            "I've compiled all the campaign assets in the shared drive and sent review links to the team. All items are ready for final approval.",
          timestamp: "2h ago",
          isFromAgent: true,
          read: true,
        },
      ],
    },
  ]

  // Filter threads based on search query and active tab
  const filteredThreads = chatThreads.filter((thread) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      thread.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.messages.some((msg) => msg.content.toLowerCase().includes(searchQuery.toLowerCase()))

    // Filter by tab
    const matchesTab = activeTab === "all" || thread.groupId === activeTab.toLowerCase()

    return matchesSearch && matchesTab
  })

  // Get unique group IDs for tabs
  const groups = Array.from(new Set(chatThreads.map((thread) => thread.groupId)))

  // Check if a group has any unread messages
  const hasUnreadMessages = (groupId: string) => {
    return chatThreads.some((thread) => (groupId === "all" || thread.groupId === groupId) && thread.hasUnread)
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gray-800/80 backdrop-blur-sm text-gray-100 px-4 py-3 shadow-lg border-b border-gray-700/50">
        <h1 className="text-xl font-bold bg-gradient-to-r from-[#4D4CFF] to-[#9B60FF] bg-clip-text text-transparent">
          Chats
        </h1>
      </header>

      {/* Search Bar */}
      <div className="px-4 py-3 border-b border-gray-700/50">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search threads..."
            className="w-full bg-gray-800/80 border border-gray-700/50 rounded-lg py-2 pl-10 pr-4 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#9B60FF]/50 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Subtabs */}
      <div className="flex border-b border-gray-700/50 overflow-x-auto scrollbar-hide">
        <TabButton
          label="All"
          isActive={activeTab === "all"}
          onClick={() => setActiveTab("all")}
          hasUnread={hasUnreadMessages("all")}
        />
        {groups.map((groupId) => {
          const thread = chatThreads.find((t) => t.groupId === groupId)
          if (!thread) return null
          return (
            <TabButton
              key={groupId}
              label={thread.groupName}
              isActive={activeTab === groupId}
              onClick={() => setActiveTab(groupId)}
              hasUnread={hasUnreadMessages(groupId)}
            />
          )
        })}
      </div>

      {/* Chat Threads List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 pb-24">
        <AnimatePresence>
          {filteredThreads.length > 0 ? (
            <motion.div className="space-y-2">
              {filteredThreads.map((thread, index) => (
                <motion.div
                  key={thread.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <ChatThreadPreview thread={thread} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="flex flex-col items-center justify-center h-full text-gray-400 py-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p>No chat threads found</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

interface TabButtonProps {
  label: string
  isActive: boolean
  onClick: () => void
  hasUnread: boolean
}

function TabButton({ label, isActive, onClick, hasUnread }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative py-2 px-4 text-sm font-medium transition-colors whitespace-nowrap flex items-center ${
        isActive ? "text-[#9B60FF]" : "text-gray-400 hover:text-gray-300"
      }`}
    >
      <span>{label}</span>

      {hasUnread && (
        <div className="relative ml-1.5">
          <Circle size={8} className="text-[#9B60FF] fill-[#9B60FF]" />
          <div
            className="absolute inset-0 rounded-full bg-[#9B60FF] animate-pulse opacity-50"
            style={{ animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}
          ></div>
        </div>
      )}

      {isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#4D4CFF] to-[#9B60FF]"
          layoutId="activeTabIndicator"
        />
      )}
    </button>
  )
}
