import { MobileFrame } from "@/components/mobile-frame"
import { MeScreen } from "@/components/me-screen"
import { BottomNav } from "@/components/bottom-nav"

export default function MePage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <MobileFrame>
        <MeScreen />
        <BottomNav activeTab="me" />
      </MobileFrame>
    </div>
  )
}
