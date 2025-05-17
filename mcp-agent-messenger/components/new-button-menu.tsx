"use client"

import { useState, useRef, useEffect } from "react"
import { PlusCircle, Server, Users } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface NewButtonMenuProps {
  onSelectOption: (option: "agent" | "integration") => void
}

export function NewButtonMenu({ onSelectOption }: NewButtonMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleOptionClick = (option: "agent" | "integration") => {
    onSelectOption(option)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      <motion.button
        className="bg-gradient-to-r from-[#4D4CFF] to-[#9B60FF] text-white rounded-full p-3 shadow-lg flex items-center justify-center z-10"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <PlusCircle size={20} className="mr-1" />
        <span className="font-medium">New</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-full mb-2 right-0 bg-gray-800 rounded-lg shadow-lg border border-gray-700/50 overflow-hidden w-48"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <div className="py-1">
              <button
                className="w-full flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                onClick={() => handleOptionClick("agent")}
              >
                <Users size={16} className="mr-2 text-[#9B60FF]" />
                <span>New Agent Group</span>
              </button>
              <button
                className="w-full flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
                onClick={() => handleOptionClick("integration")}
              >
                <Server size={16} className="mr-2 text-[#9B60FF]" />
                <span>New Integration</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
