import React,{ useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

const MAX_SIZE = 10 * 1024 * 1024

export default function DropZone({ onFile, disabled }) {
  const [dragError, setDragError] = useState(null)

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setDragError(null)
    if (rejectedFiles.length > 0) {
      const err = rejectedFiles[0].errors[0]
      setDragError(
        err.code === 'file-too-large'
          ? 'File exceeds 10 MB limit.'
          : 'Only JPEG / PNG / WEBP images accepted.'
      )
      return
    }
    if (acceptedFiles.length > 0) onFile(acceptedFiles[0])
  }, [onFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'], 'image/webp': ['.webp'] },
    maxSize: MAX_SIZE,
    maxFiles: 1,
    disabled,
  })

  return (
    <div className="flex flex-col gap-2">
      <div
        {...getRootProps()}
        className={`
          relative cursor-pointer rounded-2xl text-center
          border-2 border-dashed px-6 py-14 transition-all duration-300 group
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-forest-500 hover:bg-forest-900/10'}
          ${isDragActive ? 'border-forest-400 bg-forest-900/20 scale-[1.01]' : 'border-forest-800/70'}
        `}
      >
        <input {...getInputProps()} />

        {/* Ping ring on drag */}
        {isDragActive && (
          <div className="absolute inset-4 rounded-xl border border-forest-500/20 animate-ping pointer-events-none" />
        )}

        {/* Icon */}
        <div className={`
          mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-5
          transition-all duration-300
          ${isDragActive
            ? 'bg-forest-600/30 scale-110'
            : 'bg-forest-900/60 group-hover:bg-forest-800/60'}
        `}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.5"
            className={`transition-colors ${isDragActive ? 'text-forest-300' : 'text-forest-500 group-hover:text-forest-400'}`}
          >
            {isDragActive ? (
              <path d="M12 2v12M12 2L8 6M12 2l4 4M3 14v5a2 2 0 002 2h14a2 2 0 002-2v-5"/>
            ) : (
              <>
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </>
            )}
          </svg>
        </div>

        {isDragActive ? (
          <p className="font-display font-semibold text-lg text-forest-300">
            Release to analyse leaf
          </p>
        ) : (
          <>
            <p className="font-display font-semibold text-lg text-forest-200 mb-1.5">
              Drop a crop leaf image here
            </p>
            <p className="text-forest-500 text-sm mb-5">
              or click to browse your files
            </p>
            <div className="flex items-center justify-center flex-wrap gap-2">
              {['JPEG', 'PNG', 'WEBP', 'max 10 MB'].map((tag) => (
                <span key={tag}
                  className="px-2.5 py-1 rounded-md text-xs font-mono-custom
                    text-forest-600 bg-forest-900/60 border border-forest-800/60">
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

      {dragError && (
        <p className="text-center text-xs text-danger-400 font-mono-custom px-2">
          ⚠ {dragError}
        </p>
      )}
    </div>
  )
}
