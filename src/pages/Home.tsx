import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { useAccounts } from '../hooks/useAccounts'
import { getDeliveriesByAccount } from '../db/deliveries'
import { getPaymentsByAccount } from '../db/payments'
import { calculateSummary } from '../lib/calculations'
import { getGreeting, getFormattedToday, getTodayString } from '../lib/dates'
import { AccountCard } from '../components/account/AccountCard'
import { AddAccountModal } from '../components/account/AddAccountModal'
import type { AccountSummary } from '../types'

interface HomeProps {
  onOpenAccount: (id: number) => void
}

export function Home({ onOpenAccount }: HomeProps) {
  const { accounts, loading, refresh } = useAccounts()
  const [summaries, setSummaries] = useState<Record<number, AccountSummary>>({})
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    async function loadSummaries() {
      const today = getTodayString()
      const result: Record<number, AccountSummary> = {}
      for (const acc of accounts) {
        const [deliveries, payments] = await Promise.all([
          getDeliveriesByAccount(acc.id!),
          getPaymentsByAccount(acc.id!),
        ])
        result[acc.id!] = calculateSummary(deliveries, payments, today)
      }
      setSummaries(result)
    }
    if (accounts.length > 0) loadSummaries()
  }, [accounts])

  function handleAccountSaved() {
    setShowAdd(false)
    refresh()
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><p className="text-sm text-text-muted">Loading…</p></div>
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 sm:pb-6 border-b border-border-light/80">
        <div className="flex items-center gap-3.5">
          <img
            src="/icons/icon-512.png"
            alt="Jollog"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl shadow-xs object-contain border border-slate-100 flex-shrink-0"
          />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary leading-tight tracking-tight">{getGreeting()}</h1>
            <p className="text-[13px] sm:text-sm text-text-muted mt-0.5">{getFormattedToday()}</p>
          </div>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="h-10 sm:h-11 px-3 sm:px-5 rounded-xl bg-primary-500 text-white flex items-center gap-2 hover:bg-primary-600 active:bg-primary-700 active:scale-95 transition-all shadow-sm flex-shrink-0 font-medium text-sm"
          aria-label="Add Connection"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add Connection</span>
        </button>
      </div>

      {/* Content */}
      {accounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20 bg-surface-card rounded-2xl border border-border-light p-8">
          <img
            src="/icons/icon-512.png"
            alt="Jollog"
            className="w-16 h-16 rounded-2xl shadow-xs mb-4 object-contain opacity-90"
          />
          <h2 className="text-base sm:text-lg font-semibold text-text-primary mb-1.5">No water accounts yet</h2>
          <p className="text-sm text-text-muted max-w-[280px] mb-6">
            Add your first distributor to start tracking bottles and payments.
          </p>
          <button
            onClick={() => setShowAdd(true)}
            className="px-6 py-2.5 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 active:bg-primary-700 transition-colors shadow-sm"
          >
            Add Connection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {accounts.map((acc) => (
            <AccountCard
              key={acc.id}
              account={acc}
              summary={summaries[acc.id!] ?? { totalBottles: 0, todayBottles: 0, totalDeliveryValue: 0, totalPaid: 0, due: 0 }}
              onClick={() => onOpenAccount(acc.id!)}
            />
          ))}
        </div>
      )}

      <AddAccountModal open={showAdd} onClose={() => setShowAdd(false)} onSaved={handleAccountSaved} />
    </div>
  )
}
