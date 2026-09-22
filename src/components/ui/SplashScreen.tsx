import { useEffect, useState } from 'react'

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1400)
    const t2 = setTimeout(onDone, 1800)
    return () => { clearTimeout(t); clearTimeout(t2) }
  }, [onDone])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-400 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <img
        src="/icons/icon-512.png"
        alt="Jollog"
        className="w-20 h-20 rounded-2xl shadow-md mb-4 object-contain"
      />
      <h1 className="text-3xl font-semibold tracking-tight text-text-primary">Jollog</h1>
      <p className="text-sm text-text-muted mt-1.5 tracking-wide">Track. Pay. Done.</p>
      <p className="text-sm text-text-muted">Powered by <span className="font-medium text-text-secondary">SDM</span></p>
    </div>
  )
}
