import { useState, useMemo } from 'react'
import { ArrowLeft, Droplet, Package, CreditCard, RotateCcw } from 'lucide-react'
import { useAccount } from '../hooks/useAccounts'
import { calculateSummary, formatCurrency, getDueLabel } from '../lib/calculations'
import { getTodayString } from '../lib/dates'
import { resetAccountData, deleteAccount } from '../db/accounts'
import { TodayBottlesModal } from '../components/delivery/TodayBottlesModal'
import { AdditionalOpModal } from '../components/delivery/AdditionalOpModal'
import { PaymentModal } from '../components/payment/PaymentModal'
import { WarningModal } from '../components/ui/WarningModal'
import { HistoryList } from '../components/dashboard/HistoryList'

interface AccountPageProps {
  accountId: number
  onBack: () => void
}

export function Account({ accountId, onBack }: AccountPageProps) {
  const { account, deliveries, payments, loading, refresh } = useAccount(accountId)
  const [showToday, setShowToday] = useState(false)
  const [showAdditional, setShowAdditional] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [resetting, setResetting] = useState(false)

  const summary = useMemo(() => {
    return calculateSummary(deliveries, payments, getTodayString())
  }, [deliveries, payments])

  function handleSaved() {
    setShowToday(false)
    setShowAdditional(false)
    setShowPayment(false)
    refresh()
  }

  async function handleResetAccountData() {
    setResetting(true)
    await resetAccountData(accountId)
    setResetting(false)
    setShowReset(false)
    refresh()
  }

  async function handleDeleteAccount() {
    setResetting(true)
    await deleteAccount(accountId)
    setResetting(false)
    setShowReset(false)
    onBack()
  }

  if (loading || !account) {
    return <div className="flex items-center justify-center min-h-screen"><p className="text-sm text-text-muted">Loading…</p></div>
  }

  const dueInfo = getDueLabel(summary.due)

  return (
    <div className="w-full pb-12">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-surface-card/95 backdrop-blur-xs border-b border-border-light px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBack}
              className="p-1.5 -ml-1.5 sm:p-2 rounded-lg hover:bg-surface-hover transition-colors flex items-center gap-1.5 text-text-secondary hover:text-text-primary"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">Back</span>
            </button>
            <div className="min-w-0 border-l border-border pl-3 sm:pl-4">
              <h1 className="text-base sm:text-lg font-semibold text-text-primary truncate">{account.companyName}</h1>
              <p className="text-[12px] sm:text-xs text-text-muted truncate">
                {account.distributorName} {account.mobileNumber ? `· ${account.mobileNumber}` : ''}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowReset(true)}
            className="p-2 sm:px-3 sm:py-1.5 rounded-xl text-text-muted hover:text-rose-600 hover:bg-rose-50 active:scale-95 transition-all flex items-center gap-1.5 text-xs font-medium flex-shrink-0"
            title="Reset Account Data"
            aria-label="Reset account"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6">
        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <SummaryCard label="Total Bottles" value={String(summary.totalBottles)} />
          <SummaryCard label="Today" value={String(summary.todayBottles)} />
          <SummaryCard label="Total Paid" value={formatCurrency(summary.totalPaid)} />
          <SummaryCard label={summary.due >= 0 ? 'Due' : 'Credit'} value={dueInfo.text} valueColor={dueInfo.color} />
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10">
          <ActionButton
            icon={<Droplet className="w-4.5 h-4.5" />}
            label="Today's Bottle Add"
            color="bg-blue-50 text-blue-600"
            onClick={() => setShowToday(true)}
          />
          <ActionButton
            icon={<Package className="w-4.5 h-4.5" />}
            label="Additional Operation"
            color="bg-amber-50 text-amber-600"
            onClick={() => setShowAdditional(true)}
          />
          <ActionButton
            icon={<CreditCard className="w-4.5 h-4.5" />}
            label="Payment Mark"
            color="bg-emerald-50 text-emerald-600"
            onClick={() => setShowPayment(true)}
          />
        </div>

        {/* History */}
        <HistoryList deliveries={deliveries} payments={payments} />
      </div>

      {/* Modals */}
      <TodayBottlesModal
        open={showToday}
        onClose={() => setShowToday(false)}
        onSaved={handleSaved}
        accountId={accountId}
        bottleRate={account.bottleRate}
        planType={account.planType}
      />
      <AdditionalOpModal
        open={showAdditional}
        onClose={() => setShowAdditional(false)}
        onSaved={handleSaved}
        accountId={accountId}
        bottleRate={account.bottleRate}
      />
      <PaymentModal
        open={showPayment}
        onClose={() => setShowPayment(false)}
        onSaved={handleSaved}
        accountId={accountId}
        currentDue={summary.due}
      />
      <WarningModal
        open={showReset}
        onClose={() => setShowReset(false)}
        onConfirm={handleResetAccountData}
        title="Reset Account Data?"
        description={`Are you sure you want to reset "${account.companyName}"? This will permanently delete all bottle deliveries and payment history, resetting the balance to zero.`}
        confirmText="Yes, Reset Data"
        cancelText="Cancel"
        loading={resetting}
        secondaryAction={{
          label: 'Delete Distributor Account',
          danger: true,
          onClick: handleDeleteAccount,
        }}
      />
    </div>
  )
}

function SummaryCard({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="bg-surface-card rounded-xl border border-border-light p-3.5">
      <p className="text-[11px] text-text-muted mb-1">{label}</p>
      <p className={`text-base font-semibold ${valueColor ?? 'text-text-primary'}`}>{value}</p>
    </div>
  )
}

function ActionButton({ icon, label, color, onClick }: { icon: React.ReactNode; label: string; color: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3.5 bg-surface-card rounded-xl border border-border hover:border-primary-200 active:scale-[0.99] transition-all"
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <span className="text-[14px] font-medium text-text-primary">{label}</span>
    </button>
  )
}
