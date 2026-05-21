import React,{ useState } from 'react'
import { formatClassName } from './PredictionCard'

export default function ProbabilitiesTable({ probabilities, topPrediction }) {
  const [showAll, setShowAll] = useState(false)

  const sorted = Object.entries(probabilities).sort(([, a], [, b]) => b - a)
  const visible = showAll ? sorted : sorted.slice(0, 5)
  const maxProb = sorted[0]?.[1] ?? 1

  return (
    <div className="glass rounded-2xl overflow-hidden">

      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-forest-800/40">
        <h3 className="font-display font-semibold text-sm text-forest-200">
          All Probabilities
        </h3>
        <span className="text-[11px] font-mono-custom text-forest-600
          bg-forest-900/60 px-2.5 py-1 rounded-md border border-forest-800/50">
          {sorted.length} classes
        </span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-forest-900/40">
        {visible.map(([cls, prob], idx) => {
          const isTop = cls === topPrediction
          const barWidth = (prob / maxProb) * 100

          return (
            <div
              key={cls}
              className={`px-5 py-3 flex items-center gap-3 transition-colors
                ${isTop ? 'bg-forest-900/25' : 'hover:bg-forest-900/10'}`}
            >
              {/* Rank number */}
              <span className={`font-mono-custom text-[11px] w-4 text-right flex-shrink-0
                ${idx === 0 ? 'text-forest-500' : 'text-forest-800'}`}>
                {idx + 1}
              </span>

              {/* Class name */}
              <p className={`flex-1 text-sm truncate
                ${isTop ? 'text-forest-200 font-medium' : 'text-forest-500'}`}>
                {formatClassName(cls)}
              </p>

              {/* Bar */}
              <div className="w-20 sm:w-28 h-1 rounded-full bg-forest-900/80 overflow-hidden flex-shrink-0">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${barWidth}%`,
                    background: isTop
                      ? 'linear-gradient(90deg, #166534, #22c55e)'
                      : '#1a5c2a',
                  }}
                />
              </div>

              {/* Percentage */}
              <span className={`font-mono-custom text-[11px] w-12 text-right flex-shrink-0
                ${isTop ? 'text-forest-300' : 'text-forest-700'}`}>
                {prob.toFixed(2)}%
              </span>
            </div>
          )
        })}
      </div>

      {/* Show more / less */}
      {sorted.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full py-3 text-xs font-mono-custom text-forest-600
            hover:text-forest-400 border-t border-forest-900/40
            transition-colors hover:bg-forest-900/10"
        >
          {showAll ? '▲ Show less' : `▼ Show all ${sorted.length} classes`}
        </button>
      )}
    </div>
  )
}
