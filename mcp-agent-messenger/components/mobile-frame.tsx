import type React from "react"
interface MobileFrameProps {
  children: React.ReactNode
}

export function MobileFrame({ children }: MobileFrameProps) {
  return (
    <div className="relative mx-auto h-[750px] w-[390px] rounded-[40px] bg-black shadow-2xl overflow-hidden border-[14px] border-gray-800 mb-12">
      {/* Notch */}
      <div className="absolute top-0 inset-x-0 h-6 w-full z-50 flex justify-center">
        <div className="h-7 w-40 bg-black rounded-b-3xl"></div>
      </div>

      {/* Status Bar */}
      <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-gray-900">
        <div className="absolute top-0 z-40 w-full flex justify-between items-center px-6 pt-2 text-white text-xs">
          <div>9:41</div>
          <div className="flex space-x-1">
            <div className="flex space-x-1 items-center">
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M1 4.5C1 2.84315 2.34315 1.5 4 1.5H12C13.6569 1.5 15 2.84315 15 4.5V7.5C15 9.15685 13.6569 10.5 12 10.5H4C2.34315 10.5 1 9.15685 1 7.5V4.5Z"
                  stroke="white"
                  strokeWidth="1.5"
                />
                <path d="M15 5.5H16.5V6.5H15V5.5Z" fill="white" />
                <path d="M4 4H12V8H4V4Z" fill="white" />
              </svg>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8 1.5C11.3137 1.5 14 4.18629 14 7.5C14 8.70948 13.6322 9.82608 13.0001 10.7553L14.4143 12.1695C14.8048 12.56 14.8048 13.1932 14.4143 13.5837C14.0237 13.9742 13.3906 13.9742 13 13.5837L11.5858 12.1695C10.6566 12.8016 9.54 13.1695 8.33051 13.1695C5.01681 13.1695 2.33051 10.4832 2.33051 7.16949C2.33051 3.85579 5.01681 1.16949 8.33051 1.16949C8.33051 1.16949 8.22034 1.5 8 1.5Z"
                  fill="white"
                />
              </svg>
              <div>100%</div>
            </div>
          </div>
        </div>

        {/* App Content */}
        <div className="h-full w-full pt-7 overflow-hidden relative">{children}</div>

        {/* Home Indicator */}
        <div className="absolute bottom-1 inset-x-0 flex justify-center">
          <div className="w-32 h-1 bg-gray-600 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
