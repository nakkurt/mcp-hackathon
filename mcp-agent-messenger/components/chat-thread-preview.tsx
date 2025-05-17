"use client"

import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ChatMessage {
  id: string
  content: string
  timestamp: string
  isFromAgent: boolean
  isFromJack?: boolean
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

interface ChatThreadPreviewProps {
  thread: ChatThread
}

export function ChatThreadPreview({ thread }: ChatThreadPreviewProps) {
  // Get the most recent message
  const lastMessage = thread.messages[thread.messages.length - 1]

  // Truncate message content if it's too long
  const truncateMessage = (message: string, maxLength = 60) => {
    if (message.length <= maxLength) return message
    return message.substring(0, maxLength) + "..."
  }

  return (
    <Link href={`/chats/${thread.id}`}>
      <motion.div
        className={`p-3 rounded-xl border ${thread.hasUnread ? "border-gray-600/50 bg-gray-750/80" : "border-gray-700/30 bg-gray-800/50"} cursor-pointer`}
        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
        whileTap={{ backgroundColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-start">
          {/* Group Emoji */}
          <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-xl mr-3 flex-shrink-0">
            {thread.groupEmoji}
          </div>

          {/* Thread Info */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-gray-200 truncate">
                <span className="font-bold">{thread.contactName}</span>{" "}
                <span className="text-gray-400 font-normal">· {thread.groupName}</span>
              </h3>
              <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{lastMessage.timestamp}</span>
            </div>

            <div className="flex items-center mt-1">
              {lastMessage.isFromAgent && (
                <div className="mr-1.5 text-xs text-[#9B60FF]">
                  <ArrowLeft size={12} className="inline-block" />
                </div>
              )}
              <p
                className={`text-sm truncate ${thread.hasUnread && !lastMessage.isFromAgent ? "text-gray-200 font-medium" : "text-gray-400"}`}
              >
                {truncateMessage(lastMessage.content)}
                {lastMessage.isFromAgent && <span className="text-xs text-gray-500 ml-1">(Agent)</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Unread indicator */}
        {thread.hasUnread && !lastMessage.isFromAgent && (
          <div className="absolute top-3 right-3 h-2.5 w-2.5 rounded-full bg-[#9B60FF]"></div>
        )}
      </motion.div>
    </Link>
  )
}
