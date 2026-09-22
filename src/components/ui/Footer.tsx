export function Footer() {
  return (
    <footer className="w-full border-t border-border-light bg-surface-card mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <img
            src="/icons/icon-512.png"
            alt="Jollog"
            className="w-7 h-7 rounded-lg object-contain"
          />
          <span className="text-sm font-semibold text-text-primary">JolLog</span>
          <span className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()}
          </span>
        </div>
        <p className="text-xs text-text-muted">
          Powered by <span className="font-medium text-text-secondary"><a href="shuvadeepmondal.vercel.app">SDM</a></span>
        </p>
      </div>
    </footer>
  )
}
