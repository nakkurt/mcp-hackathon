import { MobileFrame } from "@/components/mobile-frame"
import { AgentsScreen } from "@/components/agents-screen"

export default function Home() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <MobileFrame>
        <AgentsScreen />
      </MobileFrame>
    </div>
  )
}
