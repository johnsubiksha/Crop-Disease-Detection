import React from "react"
export default function ErrorBanner({ message, onDismiss }) {
  return (
    <div className="rounded-xl border border-danger-600/30 bg-danger-600/8 px-4 py-3.5
      flex items-start gap-3">
      <div className="w-5 h-5 rounded-full bg-danger-600/20 flex items-center justify-center
        flex-shrink-0 mt-0.5">
        <span className="text-danger-400 text-xs font-bold leading-none">!</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-display font-semibold text-danger-300 text-sm mb-0.5">
          Prediction Failed
        </p>
        <p className="text-danger-400/70 text-xs leading-relaxed break-words">
          {message}
        </p>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        className="text-danger-700 hover:text-danger-400 transition-colors
          flex-shrink-0 text-xl leading-none mt-0.5 px-1"
      >
        ×
      </button>
    </div>
  )
}
