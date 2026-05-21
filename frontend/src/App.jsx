import React,{ useState, useCallback } from 'react'
import Header from './components/Header'
import DropZone from './components/DropZone'
import LoadingOverlay from './components/LoadingOverlay'
import PredictionCard from './components/PredictionCard'
import ProbabilitiesTable from './components/ProbabilitiesTable'
import ErrorBanner from './components/ErrorBanner'
import { usePrediction, STATUS } from './hooks/usePrediction'

export default function App() {
  const { status, result, error, uploadProgress, predict, reset } = usePrediction()
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)

  const handleFile = useCallback((file) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    const url = URL.createObjectURL(file)
    setSelectedFile(file)
    setPreviewUrl(url)
    predict(file)
  }, [predict, previewUrl])

  const handleReset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setSelectedFile(null)
    setPreviewUrl(null)
    reset()
  }, [reset, previewUrl])

  const isLoading = status === STATUS.UPLOADING || status === STATUS.PREDICTING

  return (
    <div className="min-h-screen bg-[#030a06] text-forest-100">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] bg-forest-900/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 w-[500px] h-[500px] bg-forest-950/30 rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(rgba(34,197,94,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,1) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <Header />

      {/* Main content — starts below fixed header (64px) */}
      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
            border border-forest-700/50 bg-forest-900/30 mb-5
            text-xs font-mono-custom text-forest-400 tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-forest-400 animate-pulse" />
            MobileNet v2 · Fine-tuned · 128×128
          </div>

          <h1 className="font-display font-extrabold text-5xl sm:text-6xl text-gradient
            leading-[1.1] tracking-tight mb-4">
            Crop Disease<br />Detection
          </h1>

          <p className="text-forest-400/80 text-base sm:text-lg max-w-lg mx-auto leading-relaxed">
            Upload a leaf image for instant AI-powered diagnosis.
            Powered by a fine-tuned MobileNet model.
          </p>
        </section>

        {/* ── Two-column grid ───────────────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-6 items-start">

          {/* Left — Upload / Preview */}
          <div className="flex flex-col gap-4">

            {isLoading ? (
              <LoadingOverlay
                status={status}
                uploadProgress={uploadProgress}
                imageUrl={previewUrl}
              />
            ) : status === STATUS.SUCCESS && previewUrl ? (
              <div className="glass rounded-2xl overflow-hidden">
                <div className="aspect-video w-full">
                  <img
                    src={previewUrl}
                    alt="Uploaded crop leaf"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-5 py-4 flex items-center justify-between gap-4 border-t border-forest-800/40">
                  <div className="min-w-0">
                    <p className="text-sm text-forest-300 font-medium truncate">
                      {selectedFile?.name}
                    </p>
                    <p className="text-xs font-mono-custom text-forest-600 mt-0.5">
                      {(selectedFile?.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="flex-shrink-0 text-xs font-mono-custom text-forest-500
                      hover:text-forest-200 border border-forest-800 hover:border-forest-500
                      px-4 py-2 rounded-lg transition-all whitespace-nowrap"
                  >
                    Analyse new image
                  </button>
                </div>
              </div>
            ) : (
              <DropZone onFile={handleFile} disabled={isLoading} />
            )}

            {status === STATUS.ERROR && (
              <ErrorBanner message={error} onDismiss={handleReset} />
            )}

            {/* How it works — only on idle */}
            {status === STATUS.IDLE && (
              <div className="glass rounded-2xl p-5">
                <h3 className="font-display font-semibold text-forest-300 text-xs
                  uppercase tracking-widest mb-4">
                  How it works
                </h3>
                <div className="flex flex-col gap-3">
                  {[
                    ['01', 'Upload',     'Drop any JPEG or PNG of a crop leaf'],
                    ['02', 'Preprocess', 'Image is resized to 128×128 and normalised'],
                    ['03', 'Inference',  'MobileNet model predicts the disease class'],
                    ['04', 'Results',    'Confidence score and all probabilities returned'],
                  ].map(([num, title, desc]) => (
                    <div key={num} className="flex items-start gap-3">
                      <span className="font-mono-custom text-xs text-forest-700 w-5 flex-shrink-0 pt-0.5">
                        {num}
                      </span>
                      <p className="text-sm leading-snug">
                        <span className="text-forest-300 font-medium mr-1.5">{title}</span>
                        <span className="text-forest-600">{desc}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right — Results */}
          <div className="flex flex-col gap-4">
            {status === STATUS.SUCCESS && result ? (
              <>
                <PredictionCard
                  prediction={result.prediction}
                  confidence={result.confidence}
                  imageUrl={previewUrl}
                  inferencMs={result.inference_ms}
                />
                <ProbabilitiesTable
                  probabilities={result.probabilities}
                  topPrediction={result.prediction}
                />
              </>
            ) : (
              <>
                {/* Placeholder — awaiting analysis */}
                <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center min-h-[220px] gap-4">
                  <div className="w-12 h-12 rounded-xl bg-forest-900/60 flex items-center justify-center animate-float">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="1.5" className="text-forest-600">
                      <path d="M9 17H7A5 5 0 017 7h2M15 7h2a5 5 0 010 10h-2M8 12h8"/>
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="font-display text-forest-600 font-semibold text-base">
                      Awaiting Analysis
                    </p>
                    <p className="text-xs text-forest-700 mt-1 font-mono-custom">
                      Upload a leaf image to see results
                    </p>
                  </div>
                </div>

                {/* Placeholder — probability table */}
                <div className="glass rounded-2xl p-8 flex flex-col items-center justify-center min-h-[140px] gap-2">
                  <p className="font-display text-forest-700 font-semibold text-sm">
                    Probability Table
                  </p>
                  <p className="text-xs text-forest-800 font-mono-custom">
                    All class scores will appear here
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Footer ────────────────────────────────────────────────── */}
        <footer className="mt-16 pt-6 border-t border-forest-900/40
          flex flex-wrap items-center justify-center gap-x-4 gap-y-1
          text-xs font-mono-custom text-forest-800">
          <span>CropScan AI v1.0</span>
          <span className="text-forest-900">·</span>
          <span>MobileNet Fine-tuned</span>
          <span className="text-forest-900">·</span>
          <span>FastAPI + React</span>
        </footer>
      </main>
    </div>
  )
}
