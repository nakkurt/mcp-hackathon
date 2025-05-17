import { MobileFrame } from "@/components/mobile-frame"
import { ChatsScreen } from "@/components/chats-screen"
import { BottomNav } from "@/components/bottom-nav"

export default function ChatsPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <MobileFrame>
        <ChatsScreen />
        <BottomNav activeTab="chats" />
      </MobileFrame>
    </div>
  )
}
