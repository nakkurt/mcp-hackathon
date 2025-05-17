"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronRight, Save, Check, Copy, Phone, LinkIcon, Lock, Plus } from "lucide-react"
import { IntegrationItem, type IntegrationAccess } from "./integration-item"
import { motion, AnimatePresence } from "framer-motion"
import { Textarea } from "@/components/ui/textarea"
import { agentGroups, type AgentGroup } from "@/data/agent-groups"
import { updateAgentConfig } from "@/actions/update-agent-config"

// Import the SimplifiedMCPIntegration type from the server action
// or define it locally to match the server action's expected shape
interface SimplifiedMCPIntegration {
  name: string;
  mcp: string;
  access: IntegrationAccess;
  resources: string[];
}

interface AgentCardProps {
  id: string
  isExpanded: boolean
  onToggle: () => void
}

export function AgentCard({ id, isExpanded, onToggle }: AgentCardProps) {
  const agentData = agentGroups[id]
  const [activeTab, setActiveTab] = useState<"integrations" | "instructions" | "share">("integrations")
  const [instructions, setInstructions] = useState<string>(agentData.systemPrompt)
  const [initialInstructions, setInitialInstructions] = useState<string>(agentData.systemPrompt)
  const [isSaving, setIsSaving] = useState(false)
  const [phoneNumberCopied, setPhoneNumberCopied] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  
  // Adapt initial state to the new SimplifiedMCPIntegration structure
  const [integrations, setIntegrations] = useState<SimplifiedMCPIntegration[]>(
    agentData.mcpIntegrations.map(ig => {
      // Create an integration with proper access level
      const defaultAccess: IntegrationAccess = "read";
      
      // Try to determine access level from various potential sources
      let access: IntegrationAccess = defaultAccess;
      
      // Check if ig has an 'access' property already
      if ('access' in ig && typeof ig.access === 'string' && 
          ["read", "write", "read-write", "off"].includes(ig.access)) {
        access = ig.access as IntegrationAccess;
      }
      // Otherwise, we'll use the default "read" access
      
      return {
        name: ig.name,
        mcp: ig.mcp,
        access: access,
        resources: ig.resources || []
      };
    })
  )
  const [initialIntegrations, setInitialIntegrations] = useState<SimplifiedMCPIntegration[]>(
    JSON.parse(JSON.stringify(integrations)) // Deep copy for initial state
  )
  
  const [hasChanges, setHasChanges] = useState(false)

  // Use refs to keep the values static
  const phoneNumberRef = useRef<string>(
    `+1 (${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${
      Math.floor(Math.random() * 9000) + 1000
    }`,
  )

  // Generate a link for demo purposes
  const mcpLinkRef = useRef<string>(`https://mcp.example.com/${id.toLowerCase()}`)

  // Track changes
  useEffect(() => {
    const instructionsChanged = instructions !== initialInstructions
    const integrationsChanged = JSON.stringify(integrations) !== JSON.stringify(initialIntegrations)
    const newHasChanges = instructionsChanged || integrationsChanged
    if (newHasChanges !== hasChanges) {
      setHasChanges(newHasChanges)
    }
    if (newHasChanges) {
      console.log('Configuration changes detected for agent:', id, { instructionsChanged, integrationsChanged })
    }
  }, [instructions, initialInstructions, integrations, initialIntegrations, hasChanges, id])

  const handleSave = async () => {
    if (!hasChanges) return

    // Show saving state
    setIsSaving(true)

    try {
      console.log('Saving configuration for agent:', id)
      
      // Filter out or convert access types before saving
      const updatedConfigForStorage = {
        systemPrompt: instructions,
        // Filter out integrations marked for deletion, and map "off" to "read"
        mcpIntegrations: integrations
          .filter(ig => ig.access !== "delete") // Don't save integrations marked for deletion
          .map(ig => ({
            ...ig,
            // Ensure only valid access values for the server
            access: ig.access === "off" ? "read" : 
                   (ig.access === "delete" ? "read" : ig.access) // This should not happen due to filter above, but just for type safety
          }))
      }
      
      console.log('Sending update with config:', JSON.stringify(updatedConfigForStorage, null, 2))
      
      // Call the server action to update the configuration
      const success = await updateAgentConfig(id, updatedConfigForStorage)
      
      if (success) {
        console.log('Successfully saved configuration for agent:', id)
        // Update the initial values to match current values
        setInitialInstructions(instructions)
        setInitialIntegrations(JSON.parse(JSON.stringify(integrations))) // Deep copy for new initial state
        
        // Reset the changes flag
        setHasChanges(false)
        
        // After successful save, collapse the dropdown
        setTimeout(() => {
          onToggle()
          // Reset the button state after the card is collapsed
          setTimeout(() => {
            setIsSaving(false)
          }, 300)
        }, 1000)
      } else {
        // Handle error
        console.error("Failed to save agent configuration for agent:", id)
        setIsSaving(false) // Ensure saving state is reset on failure
      }
    } catch (error) {
      console.error("Error saving agent configuration:", error)
      if (error instanceof Error) {
        console.error("Error details:", error.message, "Stack:", error.stack)
      }
      setIsSaving(false) // Ensure saving state is reset on error
    }
  }

  // Handler for changing integration-level access
  const handleIntegrationAccessChange = (integrationName: string, newAccess: IntegrationAccess) => {
    setIntegrations(prev => 
      prev.map(ig => ig.name === integrationName ? { ...ig, access: newAccess } : ig)
    )
  }

  // Handler for removing a resource from an integration
  const handleRemoveResource = (integrationName: string, resourceNameToRemove: string) => {
    setIntegrations(prev => 
      prev.map(ig => 
        ig.name === integrationName 
          ? { ...ig, resources: ig.resources.filter(r => r !== resourceNameToRemove) } 
          : ig
      )
    )
  }

  // Handler for adding a resource to an integration
  const handleAddResource = (integrationName: string, newResourceName: string) => {
    setIntegrations(prev =>
      prev.map(ig => {
        if (ig.name === integrationName && !ig.resources.includes(newResourceName)) {
          return { ...ig, resources: [...ig.resources, newResourceName] }
        }
        return ig
      })
    )
  }

  const copyToClipboard = (text: string, type: "phone" | "link") => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === "phone") {
        setPhoneNumberCopied(true)
        setTimeout(() => setPhoneNumberCopied(false), 2000)
      } else {
        setLinkCopied(true)
        setTimeout(() => setLinkCopied(false), 2000)
      }
    })
  }

  return (
    <motion.div
      className="rounded-xl overflow-hidden border border-gray-700/50 bg-gray-800/50 backdrop-blur-sm shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      layout
    >
      {/* Agent Card Header */}
      <motion.div
        className="flex items-center p-3 cursor-pointer"
        onClick={onToggle}
        whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
        whileTap={{ backgroundColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center text-2xl">
          {agentData.emoji}
        </div>
        <div className="ml-3 flex-1">
          <h3 className="font-medium text-gray-100">{agentData.name}</h3>
          <p className="text-sm text-gray-400">{integrations.length} integrations</p>
        </div>
        <motion.div className="text-gray-400" animate={{ rotate: isExpanded ? 90 : 0 }}>
          <ChevronRight size={20} />
        </motion.div>
      </motion.div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="border-t border-gray-700/50 bg-[#1E1F2B] rounded-b-xl"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Tabs */}
            <div className="flex border-b border-gray-700/50">
              <TabButton
                isActive={activeTab === "integrations"}
                onClick={() => setActiveTab("integrations")}
                label="Integrations"
              />
              <TabButton
                isActive={activeTab === "instructions"}
                onClick={() => setActiveTab("instructions")}
                label="Instructions"
              />
              <TabButton isActive={activeTab === "share"} onClick={() => setActiveTab("share")} label="Share" />
            </div>

            {/* Tab Content */}
            <div className="p-3">
              <AnimatePresence mode="wait">
                {activeTab === "integrations" ? (
                  <motion.div
                    key="integrations"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2"
                  >
                    {integrations.map((integration, index: number) => (
                      <motion.div
                        key={integration.name}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <IntegrationItem
                          integrationName={integration.name}
                          currentAccess={integration.access}
                          resources={integration.resources}
                          onAccessChange={(newAccess) => 
                            handleIntegrationAccessChange(integration.name, newAccess)
                          }
                          onRemoveResource={(resourceName) => 
                            handleRemoveResource(integration.name, resourceName)
                          }
                          onAddResource={(newResourceName) => 
                            handleAddResource(integration.name, newResourceName)
                          }
                        />
                      </motion.div>
                    ))}
                    
                    {/* Add Integration Button */}
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: integrations.length * 0.05 + 0.1 }}
                      className="w-full mt-3 flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium text-[#9B60FF] border border-dashed border-[#9B60FF]/50 hover:bg-[#9B60FF]/10 transition-colors"
                      onClick={() => console.log("Add integration clicked (non-functional demo)")}
                    >
                      <Plus size={16} className="mr-2" />
                      <span>Integration</span>
                    </motion.button>
                  </motion.div>
                ) : activeTab === "instructions" ? (
                  <motion.div
                    key="instructions"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Agent Behavior</label>
                      <Textarea
                        placeholder="Keep things warm and supportive. Use emojis sparingly."
                        className="bg-gray-800/50 border-gray-700 text-gray-200 placeholder:text-gray-500 min-h-[100px]"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                      />
                    </div>

                    {/* Private Info Section */}
                    <div>
                      <div className="flex items-center mb-2">
                        <Lock size={14} className="text-gray-400 mr-1" />
                        <label className="block text-sm font-medium text-gray-300">Private Information</label>
                      </div>
                      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                        {agentData.privateInfo.map((info, index) => (
                          <div
                            key={index}
                            className="bg-gray-800/70 border border-gray-700/50 rounded-md p-2 text-xs text-gray-300"
                          >
                            {info.content}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="share"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Agent Info</h4>
                    <div className="space-y-4 bg-gray-800/80 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Phone size={18} className="text-gray-400" />
                          <span className="text-sm text-gray-200">{phoneNumberRef.current}</span>
                        </div>
                        <button
                          className="p-2 rounded-md hover:bg-gray-700/70 transition-colors"
                          onClick={() => copyToClipboard(phoneNumberRef.current, "phone")}
                        >
                          {phoneNumberCopied ? (
                            <Check size={18} className="text-green-400" />
                          ) : (
                            <Copy size={18} className="text-gray-400" />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <LinkIcon size={18} className="text-gray-400" />
                          <span className="text-sm text-gray-200 truncate max-w-[200px]">{mcpLinkRef.current}</span>
                        </div>
                        <button
                          className="p-2 rounded-md hover:bg-gray-700/70 transition-colors"
                          onClick={() => copyToClipboard(mcpLinkRef.current, "link")}
                        >
                          {linkCopied ? (
                            <Check size={18} className="text-green-400" />
                          ) : (
                            <Copy size={18} className="text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Save Button - Fixed at bottom */}
            <div className="p-3 pt-0">
              <SaveButton onClick={handleSave} isSaved={isSaving} isDisabled={!hasChanges} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

interface TabButtonProps {
  isActive: boolean
  onClick: () => void
  label: string
}

function TabButton({ isActive, onClick, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`relative py-2 px-4 text-sm font-medium transition-colors ${
        isActive ? "text-[#9B60FF]" : "text-gray-400 hover:text-gray-300"
      }`}
    >
      {label}
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#4D4CFF] to-[#9B60FF]"
          layoutId={`tab-indicator-${label}`}
        />
      )}
    </button>
  )
}

interface SaveButtonProps {
  onClick: () => void
  isSaved: boolean
  isDisabled: boolean
}

function SaveButton({ onClick, isSaved, isDisabled }: SaveButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={isDisabled || isSaved}
      className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-white font-medium transition-all duration-300 ${
        isSaved
          ? "bg-green-600"
          : isDisabled
            ? "bg-gray-600 opacity-50 cursor-not-allowed"
            : "bg-gradient-to-r from-[#4D4CFF] to-[#9B60FF]"
      }`}
      whileHover={isSaved || isDisabled ? {} : { scale: 1.02, boxShadow: "0 5px 15px rgba(77, 76, 255, 0.3)" }}
      whileTap={isSaved || isDisabled ? {} : { scale: 0.98 }}
    >
      <AnimatePresence mode="wait">
        {isSaved ? (
          <motion.div
            key="saved"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Check size={16} className="text-white" />
            <span>Saved</span>
          </motion.div>
        ) : (
          <motion.div
            key="save"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex items-center gap-2"
          >
            <Save size={16} />
            <span>Save</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}
