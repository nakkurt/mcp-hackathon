"use client"

import { useState } from "react"
import { sendMessageToAnthropic } from "@/actions/anthropic-api"

export function DebugPanel() {
  const [message, setMessage] = useState("")
  const [groupId, setGroupId] = useState("wifey")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPanel, setShowPanel] = useState(false)

  const handleTest = async () => {
    if (!message.trim()) return

    setLoading(true)
    setError(null)

    try {
      const result = await sendMessageToAnthropic(groupId, message)
      setResponse(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setResponse("")
    } finally {
      setLoading(false)
    }
  }

  if (!showPanel) {
    return (
      <button
        onClick={() => setShowPanel(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white p-2 rounded-md text-xs z-50"
      >
        Debug
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 border border-gray-700 p-4 rounded-lg shadow-lg z-50 w-80">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white text-sm font-bold">API Debug Panel</h3>
        <button onClick={() => setShowPanel(false)} className="text-gray-400 hover:text-white">
          ×
        </button>
      </div>

      <div className="mb-2">
        <label className="block text-gray-300 text-xs mb-1">Group ID</label>
        <select
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          className="w-full bg-gray-700 text-white text-xs p-1 rounded"
        >
          <option value="wifey">Wifey</option>
          <option value="colleagues">Colleagues</option>
          <option value="friends">Friends</option>
          <option value="public">Public</option>
        </select>
      </div>

      <div className="mb-2">
        <label className="block text-gray-300 text-xs mb-1">Test Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full bg-gray-700 text-white text-xs p-1 rounded h-16"
          placeholder="Enter test message"
        />
      </div>

      <button
        onClick={handleTest}
        disabled={loading || !message.trim()}
        className="bg-blue-600 text-white text-xs py-1 px-2 rounded mb-2 w-full disabled:bg-gray-600"
      >
        {loading ? "Testing..." : "Test API Call"}
      </button>

      {error && (
        <div className="bg-red-900/30 border border-red-700 p-2 rounded text-red-200 text-xs mb-2">{error}</div>
      )}

      {response && (
        <div className="mt-2">
          <label className="block text-gray-300 text-xs mb-1">Response:</label>
          <div className="bg-gray-700 p-2 rounded text-white text-xs max-h-32 overflow-y-auto">{response}</div>
        </div>
      )}
    </div>
  )
}
