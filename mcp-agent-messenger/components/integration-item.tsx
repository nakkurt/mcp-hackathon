"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronDown, ChevronRight, X, Plus, PowerOff, Trash2 } from "lucide-react"
import Image from "next/image"

// Updated to include "delete" as a possible access state
export type IntegrationAccess = "read" | "write" | "read-write" | "off" | "delete";

// Mapping of integration names to logo filenames
const LOGO_MAP: Record<string, string> = {
  "notion": "notion-app-logo.png",
  "gmail": "gmail-logo-official.png",
  "google calendar": "google-calendar-logo-official.png",
  "google contacts": "contacts-logo-official.png",
  "discord": "discord-logo-official.png",
  // Add more mappings as needed
};

// Accessible label mapping for access levels
const ACCESS_LABELS: Record<IntegrationAccess, string> = {
  "read": "Read",
  "write": "Write",
  "read-write": "All", // Changed from "Read & Write" to "All"
  "off": "Off",
  "delete": "Delete"
};

// Access styling based on current access level
const ACCESS_STYLES: Record<IntegrationAccess, string> = {
  "read": "bg-blue-600 hover:bg-blue-500 border-blue-400",
  "write": "bg-green-600 hover:bg-green-500 border-green-400",
  "read-write": "bg-purple-600 hover:bg-purple-500 border-purple-400",
  "off": "bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-300",
  "delete": "bg-red-600 hover:bg-red-500 border-red-400"
};

// Order for cycling through access levels
const ACCESS_CYCLE: IntegrationAccess[] = ["read", "write", "read-write", "off", "delete"];

interface IntegrationItemProps {
  integrationName: string;
  currentAccess: IntegrationAccess;
  resources: string[];
  onAccessChange: (newAccess: IntegrationAccess) => void;
  onRemoveResource: (resourceName: string) => void;
  onAddResource: (newResourceName: string) => void;
}

export function IntegrationItem({
  integrationName,
  currentAccess,
  resources,
  onAccessChange,
  onRemoveResource,
  onAddResource,
}: IntegrationItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newResourceName, setNewResourceName] = useState("");

  const getNextAccess = (current: IntegrationAccess): IntegrationAccess => {
    const currentIndex = ACCESS_CYCLE.indexOf(current);
    // If current access is not in the cycle (or is -1), start with "read"
    const nextIndex = (currentIndex === -1) ? 0 : (currentIndex + 1) % ACCESS_CYCLE.length;
    return ACCESS_CYCLE[nextIndex];
  };

  const getLogoSrc = (name: string): string => {
    // Normalize the name (lowercase, trim)
    const normalizedName = name.toLowerCase().trim();
    
    // First try exact match
    if (LOGO_MAP[normalizedName]) {
      return `/${LOGO_MAP[normalizedName]}`;
    }
    
    // Then try partial match
    for (const [key, logoPath] of Object.entries(LOGO_MAP)) {
      if (normalizedName.includes(key) || key.includes(normalizedName)) {
        return `/${logoPath}`;
      }
    }
    
    // Default fallback
    return "/placeholder.png";
  };

  const handleAddResourceClick = () => {
    if (newResourceName.trim()) {
      onAddResource(newResourceName.trim());
      setNewResourceName("");
    }
  };

  const handleAccessClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent header click
    const nextAccess = getNextAccess(currentAccess);
    onAccessChange(nextAccess);
  };

  // Add a class for delete mode
  const isDeleteMode = currentAccess === "delete";
  const isOffMode = currentAccess === "off";

  return (
    <div className={`bg-gray-800/70 rounded-xl overflow-hidden border border-gray-700/50 mb-3 shadow-md 
      ${isOffMode ? "opacity-75" : ""} 
      ${isDeleteMode ? "border-red-500/50 bg-red-900/10" : ""}`}>
      {/* Integration Header */}
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-700/60 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 relative flex items-center justify-center bg-gray-700 rounded-md p-1">
            <Image 
              src={getLogoSrc(integrationName)}
              alt={`${integrationName} logo`}
              width={24}
              height={24}
              className={`object-contain ${isOffMode ? "opacity-50" : ""} ${isDeleteMode ? "opacity-30" : ""}`}
              onError={(e) => {
                // Fallback to placeholder if logo fails to load
                (e.currentTarget as HTMLImageElement).src = "/placeholder.png";
              }}
            />
          </div>
          <h3 className={`font-medium ${isDeleteMode ? "text-red-300" : "text-gray-100"}`}>{integrationName}</h3>
        </div>
        <div className="flex items-center space-x-2">
          {/* Access Toggle Button - Now just cycles through options */}
          <button
            onClick={handleAccessClick}
            className={`px-3 py-1.5 text-xs rounded transition-colors border ${ACCESS_STYLES[currentAccess]} text-white font-medium flex items-center gap-1`}
          >
            {isOffMode && <PowerOff size={12} className="mr-1" />}
            {isDeleteMode && <Trash2 size={12} className="mr-1" />}
            {ACCESS_LABELS[currentAccess]}
          </button>

          <motion.div animate={{ rotate: isExpanded ? 0 : -90 }} className="text-gray-400">
            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </motion.div>
        </div>
      </div>

      {/* Resources List - Only show this if access is not "off" or "delete" */}
      {isExpanded && (!isOffMode && !isDeleteMode) && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="space-y-2 p-3 pt-1"
        >
          {resources.length > 0 ? (
            resources.map((resource) => (
              <div key={resource} className="flex items-center justify-between bg-gray-800/70 rounded p-2 group">
                <span className="text-sm text-gray-300 truncate" title={resource}>{resource}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveResource(resource);
                  }}
                  title="Remove resource"
                  className="p-1 text-gray-500 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 italic p-2">No resources</div>
          )}
          
          {/* Add Resource Input */}
          <div className="flex items-center space-x-2 pt-2">
            <input 
              type="text"
              value={newResourceName}
              onChange={(e) => setNewResourceName(e.target.value)}
              placeholder="New resource name..."
              className="flex-grow text-sm bg-gray-700/80 text-gray-200 rounded px-2 py-1.5 border border-gray-600 focus:outline-none focus:ring-1 focus:ring-[#9B60FF] placeholder-gray-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newResourceName.trim()) {
                  handleAddResourceClick();
                }
              }}
            />
            <button
              onClick={handleAddResourceClick}
              disabled={!newResourceName.trim()}
              className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded disabled:opacity-50 transition-colors"
              title="Add Resource"
            >
              <Plus size={16} />
            </button>
          </div>
        </motion.div>
      )}
      
      {/* Confirmation message when access is Off */}
      {isExpanded && isOffMode && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="p-3 pt-1"
        >
          <div className="text-sm text-gray-400 italic p-2">
            This integration is disabled. Click the "Off" button to enable it.
          </div>
        </motion.div>
      )}

      {/* Confirmation message when in Delete mode */}
      {isExpanded && isDeleteMode && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="p-3 pt-1"
        >
          <div className="text-sm text-red-400 italic p-2">
            This integration will be deleted. Click the "Delete" button again to proceed.
          </div>
        </motion.div>
      )}
    </div>
  )
}
