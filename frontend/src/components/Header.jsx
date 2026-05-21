import React,{ useState, useEffect } from 'react'
import { getHealth } from '../utils/api'

export default function Header() {
  const [apiOnline, setApiOnline] = useState(null)

  useEffect(() => {
    const check = async () => {
      try { await getHealth(); setApiOnline(true) }
      catch { setApiOnline(false) }
    }
    check()
    const id = setInterval(check, 30_000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50
      glass-dark border-b border-forest-900/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8
        h-16 flex items-center justify-between">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-forest-700/80 flex items-center justify-center
            border border-forest-600/30 glow-green">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" className="text-forest-200">
              <path d="M12 22V12M12 12C12 7 8 3 3 3c0 5 4 9 9 9zM12 12c0-5 4-9 9-9-1 5-4 9-9 9z"/>
            </svg>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-bold text-base text-gradient">
              CropScan AI
            </span>
            <span className="hidden sm:block text-[11px] text-forest-500 font-mono-custom mt-0.5">
              Disease Detection System
            </span>
          </div>
        </div>

        {/* API Status */}
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
            apiOnline === null ? 'bg-earth-400 animate-pulse' :
            apiOnline           ? 'bg-forest-400 animate-pulse-slow' :
                                  'bg-danger-400'
          }`} />
          <span className="font-mono-custom text-xs text-forest-500">
            {apiOnline === null ? 'Connecting…' : apiOnline ? 'API Online' : 'API Offline'}
          </span>
        </div>
      </div>
    </header>
  )
}
