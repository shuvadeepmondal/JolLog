import { AlertTriangle, X } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface WarningModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
  secondaryAction?: {
    label: string
    onClick: () => void
    danger?: boolean
  }
}

export function WarningModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Yes, Reset',
  cancelText = 'Cancel',
  loading = false,
  secondaryAction,
}: WarningModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current && !loading) onClose()
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" />
      <div className="relative w-full max-w-[360px] bg-white rounded-2xl shadow-xl overflow-hidden p-5 animate-slide-up">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-1 rounded-lg text-text-muted hover:bg-surface-hover transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center pt-2 pb-1">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
            <AlertTriangle className="w-6 h-6" strokeWidth={2} />
          </div>

          <h3 className="text-lg font-semibold text-text-primary leading-snug">{title}</h3>
          <p className="text-sm text-text-muted mt-2 leading-relaxed">{description}</p>
        </div>

        <div className="mt-6 space-y-2">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white rounded-xl text-sm font-semibold transition-all shadow-xs disabled:opacity-60"
          >
            {loading ? 'Processing…' : confirmText}
          </button>

          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              disabled={loading}
              className={`w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                secondaryAction.danger
                  ? 'text-rose-600 hover:bg-rose-50'
                  : 'text-text-secondary hover:bg-surface-hover'
              }`}
            >
              {secondaryAction.label}
            </button>
          )}

          <button
            onClick={onClose}
            disabled={loading}
            className="w-full py-2.5 px-4 bg-surface hover:bg-surface-hover text-text-secondary rounded-xl text-sm font-medium transition-all"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  )
}
