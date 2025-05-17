"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DualChatView } from "@/components/dual-chat-view"
import { AnimatePresence, motion } from "framer-motion"
import { agentGroups } from "@/data/agent-groups"

// Mock data for chat threads
const chatThreadsData = [
  {
    id: "thread1",
    groupId: "wifey",
    contactName: "Sarah",
    contactPhone: "+1 (555) 123-4567",
    hasUnread: true,
    messages: [
      {
        id: "msg1",
        content: "Don't forget we have dinner with my parents tonight at 7pm",
        timestamp: "10m ago",
        isFromAgent: false,
        isFromJack: false,
        read: true,
      },
      {
        id: "msg2",
        content: "I've added it to our calendar and set a reminder for 6pm. Should I order flowers for your mom?",
        timestamp: "8m ago",
        isFromAgent: true,
        isFromJack: true,
        read: false,
      },
    ],
  },
  {
    id: "thread2",
    groupId: "colleagues",
    contactName: "Alex",
    contactPhone: "+1 (555) 987-6543",
    hasUnread: true,
    messages: [
      {
        id: "msg3",
        content: "Can you share the Q3 report with the team?",
        timestamp: "1h ago",
        isFromAgent: false,
        isFromJack: false,
        read: true,
      },
      {
        id: "msg4",
        content: "I've shared the Q3 report with the team via email. I've also scheduled a review meeting for Friday.",
        timestamp: "45m ago",
        isFromAgent: true,
        isFromJack: true,
        read: false,
      },
    ],
  },
  {
    id: "thread3",
    groupId: "public",
    contactName: "Community",
    contactPhone: "+1 (555) 333-2222",
    hasUnread: false,
    messages: [
      {
        id: "msg5",
        content: "When is the next neighborhood cleanup event?",
        timestamp: "2h ago",
        isFromAgent: false,
        isFromJack: false,
        read: true,
      },
      {
        id: "msg6",
        content:
          "The next neighborhood cleanup is scheduled for Saturday, June 5th at 9am. I've checked the weather and it should be sunny.",
        timestamp: "1h ago",
        isFromAgent: true,
        isFromJack: true,
        read: true,
      },
    ],
  },
  {
    id: "thread4",
    groupId: "wifey",
    contactName: "Sarah (Work)",
    contactPhone: "+1 (555) 444-5555",
    hasUnread: false,
    messages: [
      {
        id: "msg7",
        content: "Can you send me the presentation for tomorrow's meeting?",
        timestamp: "1d ago",
        isFromAgent: false,
        isFromJack: false,
        read: true,
      },
      {
        id: "msg8",
        content:
          "I've sent the presentation to your work email. I've also added some notes about the key points to emphasize.",
        timestamp: "1d ago",
        isFromAgent: true,
        isFromJack: true,
        read: true,
      },
    ],
  },
  {
    id: "thread5",
    groupId: "colleagues",
    contactName: "Marketing Team",
    contactPhone: "+1 (555) 777-8888",
    hasUnread: false,
    messages: [
      {
        id: "msg9",
        content: "We need to finalize the campaign assets by EOD",
        timestamp: "3h ago",
        isFromAgent: false,
        isFromJack: false,
        read: true,
      },
      {
        id: "msg10",
        content:
          "I've compiled all the campaign assets in the shared drive and sent review links to the team. All items are ready for final approval.",
        timestamp: "2h ago",
        isFromAgent: true,
        isFromJack: true,
        read: true,
      },
    ],
  },
]

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const [thread, setThread] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // In a real app, you would fetch this data from an API
    const threadId = params.id as string
    console.log("Loading chat thread with ID:", threadId)

    try {
      const foundThread = chatThreadsData.find((t) => t.id === threadId)
      console.log("Found thread:", foundThread)

      if (foundThread) {
        // Ensure all messages have the isFromJack property
        const updatedThread = {
          ...foundThread,
          messages: foundThread.messages.map((msg) => ({
            ...msg,
            isFromJack: msg.isFromJack !== undefined ? msg.isFromJack : !msg.isFromAgent,
          })),
        }
        setThread(updatedThread)
      } else {
        setError(`Thread with ID ${threadId} not found`)
      }
    } catch (err) {
      console.error("Error loading thread:", err)
      setError(`Error loading thread: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setLoading(false)
    }

    // Animate in after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [params.id])

  // Handle back navigation with animation
  const handleBack = () => {
    setIsVisible(false)
    setTimeout(() => {
      router.push("/chats")
    }, 300) // Match this with the exit animation duration
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#9B60FF]"></div>
      </div>
    )
  }

  if (error || !thread) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-8">
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <p>{error || "Chat thread not found"}</p>
          <button
            onClick={() => router.push("/chats")}
            className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white"
          >
            Back to Chats
          </button>
        </div>
      </div>
    )
  }

  // Get group data - with fallback values if group not found
  const groupData = agentGroups[thread.groupId] || {
    name: thread.groupId || "Unknown",
    emoji: "💬",
  }

  console.log("Group data for thread:", groupData)

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-8 overflow-hidden">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key="dual-chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <DualChatView
              groupId={thread.groupId}
              groupName={groupData?.name || "Unknown Group"}
              groupEmoji={groupData?.emoji || "💬"}
              contactName={thread.contactName || "Unknown Contact"}
              messages={thread.messages || []}
              onBack={handleBack}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
