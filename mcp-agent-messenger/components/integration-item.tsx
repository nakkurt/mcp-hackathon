"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronRight, Plus, X } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface IntegrationItemProps {
  name: string
  resources: string[]
  onResourcesChange?: (resources: string[]) => void
  onToggleChange?: (type: "read" | "write", value: boolean) => void
}

export function IntegrationItem({
  name,
  resources: initialResources,
  onResourcesChange,
  onToggleChange,
}: IntegrationItemProps) {
  const [expanded, setExpanded] = useState(false)
  const [resources, setResources] = useState<string[]>(initialResources)
  const [newResource, setNewResource] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const [readEnabled, setReadEnabled] = useState(true)
  const [writeEnabled, setWritEnabled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Example resources based on integration type
  const getExampleResources = () => {
    switch (name) {
      case "Notion":
        return [
          "Health Tracker",
          "Family Journal",
          "Meal Planner",
          "Therapy Log",
          "IEP Meeting Notes",
          "Project Tracker",
          "Meeting Notes",
          "Trip Planning",
          "Game Night Schedule",
          "Chore List",
          "Public Notes",
        ]
      case "Google Calendar":
        return ["Family Calendar", "Work Calendar", "Personal Calendar", "Date Nights", "Friend Events", "Appointments"]
      case "Gmail":
        return ["Personal Inbox", "Work Inbox", "Friend Group", "Family Emails", "Newsletters", "Receipts"]
      case "Google Contacts":
        return ["Family Contacts", "Work Contacts", "Friends List", "Emergency Contacts", "Medical Providers"]
      case "Discord":
        return ["Family Server", "Gaming Server", "Movie Club", "Book Club", "Community Server", "Study Group"]
      default:
        return []
    }
  }

  const filteredResources = getExampleResources().filter(
    (resource) => resource.toLowerCase().includes(newResource.toLowerCase()) && !resources.includes(resource),
  )

  const handleAddResource = (resource: string) => {
    const updatedResources = [...resources, resource]
    setResources(updatedResources)
    setNewResource("")
    setShowDropdown(false)
    if (onResourcesChange) {
      onResourcesChange(updatedResources)
    }
  }

  const handleRemoveResource = (resourceToRemove: string) => {
    const updatedResources = resources.filter((resource) => resource !== resourceToRemove)
    setResources(updatedResources)
    if (onResourcesChange) {
      onResourcesChange(updatedResources)
    }
  }

  const handleReadToggle = (checked: boolean) => {
    setReadEnabled(checked)
    if (onToggleChange) {
      onToggleChange("read", checked)
    }
  }

  const handleWriteToggle = (checked: boolean) => {
    setWritEnabled(checked)
    if (onToggleChange) {
      onToggleChange("write", checked)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const getIconSrc = () => {
    switch (name) {
      case "Notion":
        return "/notion-app-logo.png"
      case "Google Calendar":
        return "/google-calendar-logo-official.png"
      case "Gmail":
        return "/gmail-logo-official.png"
      case "Google Contacts":
        return "/contacts-logo-official.png"
      case "Discord":
        return "/discord-logo-official.png"
      default:
        return "/placeholder.svg"
    }
  }

  return (
    <motion.div className="rounded-lg border border-gray-700/50 bg-gray-800/80 overflow-hidden" layout>
      {/* Integration Header */}
      <motion.div
        className="flex items-center p-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
      >
        <div className="w-6 h-6 mr-3 relative flex items-center justify-center">
          <Image
            src={getIconSrc() || "/placeholder.svg"}
            alt={name}
            width={24}
            height={24}
            className="object-contain"
          />
        </div>
        <div className="flex-1 font-medium text-sm text-gray-200">{name}</div>
        <motion.div className="text-gray-400" animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronRight size={16} />
        </motion.div>
      </motion.div>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="border-t border-gray-700/50 p-3 bg-gray-750"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="flex justify-between mb-3">
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch id={`read-${name}`} checked={readEnabled} onCheckedChange={handleReadToggle} />
                  <Label htmlFor={`read-${name}`} className="text-xs text-gray-300">
                    Read
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id={`write-${name}`} checked={writeEnabled} onCheckedChange={handleWriteToggle} />
                  <Label htmlFor={`write-${name}`} className="text-xs text-gray-300">
                    Write
                  </Label>
                </div>
              </div>
            </div>

            <h5 className="text-xs font-medium text-gray-400 mb-2">Tools</h5>
            <motion.ul className="space-y-1 mb-3">
              {resources.map((resource, index) => (
                <motion.li
                  key={resource}
                  className="text-xs p-2 bg-gray-800 rounded border border-gray-700/50 text-gray-300 flex justify-between items-center"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <span>{resource}</span>
                  <button
                    className="text-gray-400 hover:text-gray-200 p-1 rounded-full hover:bg-gray-700/50"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveResource(resource)
                    }}
                  >
                    <X size={12} />
                  </button>
                </motion.li>
              ))}
            </motion.ul>

            {/* Resource Picker */}
            <div className="relative" ref={dropdownRef}>
              <div className="flex items-center bg-gray-800 rounded border border-gray-700 focus-within:border-[#9B60FF] transition-colors">
                <input
                  type="text"
                  placeholder="Add Tool"
                  className="w-full bg-transparent border-none text-xs p-2 text-gray-300 focus:outline-none"
                  value={newResource}
                  onChange={(e) => {
                    setNewResource(e.target.value)
                    setShowDropdown(true)
                  }}
                  onFocus={() => setShowDropdown(true)}
                />
                <button
                  className="p-2 text-gray-400 hover:text-gray-200"
                  onClick={() => {
                    if (newResource.trim()) {
                      handleAddResource(newResource.trim())
                    }
                  }}
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Dropdown - Fixed z-index issue */}
              {showDropdown && filteredResources.length > 0 && (
                <div
                  className="fixed mt-1 w-full bg-gray-800 border border-gray-700 rounded-md shadow-lg max-h-40 overflow-y-auto"
                  style={{
                    zIndex: 99999,
                    width: dropdownRef.current ? dropdownRef.current.offsetWidth : "auto",
                    left: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().left : 0,
                    top: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().bottom + 4 : 0,
                  }}
                >
                  {filteredResources.map((resource) => (
                    <div
                      key={resource}
                      className="text-xs p-2 hover:bg-gray-700 cursor-pointer text-gray-300"
                      onClick={() => handleAddResource(resource)}
                    >
                      {resource}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
