import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" />
      <div className="relative w-full sm:max-w-[500px] max-h-[90dvh] bg-white rounded-t-2xl sm:rounded-2xl shadow-xl overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between px-5 pt-5 pb-3 sm:px-6 sm:pt-6 sm:pb-4 border-b border-border-light">
          <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-hover transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  )
}
