import { Plus } from "lucide-react"

export function CreateAgentButton() {
  return (
    <button className="fixed right-4 bottom-20 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-colors">
      <Plus size={24} />
      <span className="ml-1 font-medium">Create Agent</span>
    </button>
  )
}
