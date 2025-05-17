"use client"

import type React from "react"
import { Bell, Users, User, MessageSquare, Settings } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

interface BottomNavProps {
  activeTab?: string
}

export function BottomNav({ activeTab = "agents" }: BottomNavProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gray-800/90 backdrop-blur-md border-t border-gray-700/50 flex justify-around items-center h-20 z-10 px-4">
      <NavItem href="#" icon={<Bell size={22} />} label="Alerts" isActive={activeTab === "alerts"} />
      <NavItem href="/" icon={<Users size={22} />} label="Agents" isActive={activeTab === "agents"} />
      <NavItem href="/me" icon={<User size={24} />} label="Ask" isActive={activeTab === "me"} isSpecial />
      <NavItem href="/chats" icon={<MessageSquare size={22} />} label="Chats" isActive={activeTab === "chats"} />
      <NavItem href="#" icon={<Settings size={22} />} label="Settings" isActive={activeTab === "settings"} />
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive?: boolean
  isSpecial?: boolean
}

function NavItem({ href, icon, label, isActive, isSpecial }: NavItemProps) {
  return (
    <Link href={href} className="relative flex flex-col items-center justify-center w-full">
      <motion.div
        className={`flex flex-col items-center justify-center ${
          isActive && !isSpecial ? "text-[#9B60FF]" : isSpecial ? "text-white" : "text-gray-400"
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isSpecial ? (
          <div className="flex flex-col items-center justify-center">
            <div
              className={`flex flex-col items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-[#4D4CFF] to-[#9B60FF] ${isActive ? "ring-2 ring-white" : ""}`}
            >
              {icon}
              <span className="text-sm font-medium mt-0.5">{label}</span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center space-y-0.5">
              <div className="flex items-center justify-center">{icon}</div>
              <span className="text-xs">{label}</span>
            </div>
          </>
        )}
      </motion.div>
    </Link>
  )
}
