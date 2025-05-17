"use client"

import { useState } from "react"
import { AgentCard } from "./agent-card"
import { BottomNav } from "./bottom-nav"
import { agentGroups } from "@/data/agent-groups"
import { NewButtonMenu } from "./new-button-menu"

export function AgentsScreen() {
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null)
  const [showNewAgentForm, setShowNewAgentForm] = useState(false)
  const [showNewIntegrationForm, setShowNewIntegrationForm] = useState(false)

  // Get agent IDs from the agentGroups object
  const agentIds = Object.keys(agentGroups)

  const handleNewButtonOption = (option: "agent" | "integration") => {
    if (option === "agent") {
      setShowNewAgentForm(true)
      setShowNewIntegrationForm(false)
    } else {
      setShowNewAgentForm(false)
      setShowNewIntegrationForm(true)
    }

    // In a real app, you would show the appropriate form or modal
    console.log(`Selected option: ${option}`)
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gray-800/80 backdrop-blur-sm text-gray-100 px-4 py-3 shadow-lg border-b border-gray-700/50">
        <h1 className="text-xl font-bold bg-gradient-to-r from-[#4D4CFF] to-[#9B60FF] bg-clip-text text-transparent">
          Agents
        </h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-3 pb-24">
        <div className="space-y-3 py-3">
          {agentIds.map((agentId) => (
            <AgentCard
              key={agentId}
              id={agentId}
              isExpanded={expandedAgent === agentId}
              onToggle={() => setExpandedAgent(expandedAgent === agentId ? null : agentId)}
            />
          ))}
        </div>
      </main>

      {/* Create Agent Button with Popup Menu */}
      <div className="absolute right-4 bottom-24 z-10">
        <NewButtonMenu onSelectOption={handleNewButtonOption} />
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
