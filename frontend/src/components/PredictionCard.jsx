import React from "react"
export function formatClassName(name) {
  if (!name) return name
  return name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function confidenceTheme(confidence) {
  if (confidence >= 85) return { ring: '#22c55e', text: 'text-forest-400', label: 'High Confidence' }
  if (confidence >= 60) return { ring: '#eab308', text: 'text-earth-400', label: 'Moderate Confidence' }
  return { ring: '#ef4444', text: 'text-danger-400', label: 'Low Confidence' }
}

export default function PredictionCard({ prediction, confidence, inferencMs }) {
  const theme = confidenceTheme(confidence)
  const radius = 48
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (confidence / 100) * circumference
  const isHealthy = prediction?.toLowerCase().includes('healthy')

  return (
    <div className="glass rounded-2xl p-6 glow-green">

      {/* Status badge */}
      <div className="flex items-center gap-2 mb-5">
        <div className={`w-2 h-2 rounded-full flex-shrink-0
          ${isHealthy ? 'bg-forest-400' : 'bg-danger-400'} animate-pulse`}
        />
        <span className="text-xs font-mono-custom text-forest-500 uppercase tracking-widest">
          {isHealthy ? 'Healthy Plant' : 'Disease Detected'}
        </span>
      </div>

      {/* Ring + text — side by side */}
      <div className="flex items-center gap-6 mb-6">

        {/* Confidence ring */}
        <div className="relative flex-shrink-0 w-[110px] h-[110px]">
          <svg width="110" height="110" viewBox="0 0 110 110">
            <circle cx="55" cy="55" r={radius} fill="none" stroke="#14532d" strokeWidth="7"/>
            <circle
              cx="55" cy="55" r={radius} fill="none"
              stroke={theme.ring} strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform="rotate(-90 55 55)"
              style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-display font-bold text-xl leading-none ${theme.text}`}>
              {confidence.toFixed(1)}%
            </span>
            <span className="text-[10px] text-forest-600 font-mono-custom mt-0.5">conf.</span>
          </div>
        </div>

        {/* Prediction label */}
        <div className="flex-1 min-w-0">
          <h2 className="font-display font-bold text-xl sm:text-2xl text-forest-100 leading-snug break-words">
            {formatClassName(prediction)}
          </h2>
          <p className={`text-sm mt-1.5 font-mono-custom ${theme.text}`}>
            {theme.label}
          </p>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs font-mono-custom text-forest-600">
          <span>Confidence Score</span>
          <span>{confidence.toFixed(2)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-forest-900 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${confidence}%`,
              background: `linear-gradient(90deg, ${theme.ring}88, ${theme.ring})`,
            }}
          />
        </div>
      </div>

      {/* Inference time */}
      {inferencMs && (
        <p className="mt-4 text-[11px] text-center font-mono-custom text-forest-800">
          Inference completed in {inferencMs} ms
        </p>
      )}
    </div>
  )
}
