import React from "react"
export default function LoadingOverlay({ status, uploadProgress, imageUrl }) {
  const isUploading = status === 'uploading'
  const isPredicting = status === 'predicting'

  return (
    <div className="glass rounded-2xl overflow-hidden">

      {/* Image + scan area */}
      <div className="relative aspect-video w-full overflow-hidden bg-forest-950/60">
        {imageUrl && (
          <img src={imageUrl} alt="Analysing…"
            className="w-full h-full object-cover opacity-30" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/50 via-transparent to-forest-950/80" />

        {/* Scan grid */}
        <div className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'linear-gradient(rgba(34,197,94,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.8) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />

        {/* Scan beam */}
        {isPredicting && (
          <div className="absolute inset-x-0 h-px bg-gradient-to-r
            from-transparent via-forest-400 to-transparent
            animate-scan opacity-90 pointer-events-none" />
        )}

        {/* Centre status */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
          <div className="w-12 h-12 rounded-full border-2 border-forest-400/20 border-t-forest-400 animate-spin" />
          <div className="text-center">
            <p className="font-display font-semibold text-forest-200 text-base">
              {isUploading ? 'Uploading image…' : 'Analysing leaf…'}
            </p>
            <p className="font-mono-custom text-xs text-forest-500 mt-1">
              {isUploading
                ? `${uploadProgress}% transferred`
                : 'Running MobileNet inference'}
            </p>
          </div>
        </div>
      </div>

      {/* Upload progress bar */}
      {isUploading && (
        <div className="h-0.5 bg-forest-900">
          <div
            className="h-full bg-gradient-to-r from-forest-600 to-forest-400 transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {/* Step indicators */}
      <div className="px-5 py-4 flex items-center justify-center gap-3">
        {[
          { label: 'Upload',     done: uploadProgress === 100 },
          { label: 'Preprocess', done: isPredicting },
          { label: 'Inference',  done: false },
        ].map((step, i) => (
          <div key={step.label} className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full
              ${step.done ? 'bg-forest-400' : 'bg-forest-800'}`}
            />
            <span className={`text-xs font-mono-custom
              ${step.done ? 'text-forest-400' : 'text-forest-700'}`}>
              {step.label}
            </span>
            {i < 2 && <span className="text-forest-900 text-xs mx-0.5">—</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
