import { useState, useCallback, useEffect } from 'react'
import { SplashScreen } from './components/ui/SplashScreen'
import { Footer } from './components/ui/Footer'
import { Home } from './pages/Home'
import { Account } from './pages/Account'
import type { AppView } from './types'

function App() {
  const [view, setView] = useState<AppView>({ page: 'splash' })

  const handleSplashDone = useCallback(() => {
    setView({ page: 'home' })
  }, [])

  // Browser back navigation
  useEffect(() => {
    function handlePopState() {
      setView((prev) => {
        if (prev.page !== 'home' && prev.page !== 'splash') {
          return { page: 'home' }
        }
        return prev
      })
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  function openAccount(id: number) {
    history.pushState(null, '', '')
    setView({ page: 'account', accountId: id })
  }

  function goHome() {
    setView({ page: 'home' })
  }

  return (
    <>
      {view.page === 'splash' && <SplashScreen onDone={handleSplashDone} />}
      {view.page !== 'splash' && (
        <div className="flex flex-col min-h-dvh">
          <main className="flex-1">
            {view.page === 'home' && <Home onOpenAccount={openAccount} />}
            {view.page === 'account' && <Account accountId={view.accountId} onBack={goHome} />}
          </main>
          <Footer />
        </div>
      )}
    </>
  )
}

export default App
