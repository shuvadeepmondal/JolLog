import { Droplets } from 'lucide-react'
import type { WaterAccount } from '../../db/database'
import { getDueLabel } from '../../lib/calculations'
import type { AccountSummary } from '../../types'

interface AccountCardProps {
  account: WaterAccount
  summary: AccountSummary
  onClick: () => void
}

export function AccountCard({ account, summary, onClick }: AccountCardProps) {
  const dueInfo = getDueLabel(summary.due)

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-surface-card rounded-xl border border-border p-4 sm:p-5 hover:border-primary-300 hover:shadow-sm active:scale-[0.99] transition-all duration-150 flex flex-col justify-between group"
    >
      <div className="flex items-start justify-between mb-4 w-full">
        <div className="min-w-0 pr-2">
          <h3 className="text-[15px] sm:text-base font-semibold text-text-primary group-hover:text-primary-600 transition-colors truncate">{account.companyName}</h3>
          <p className="text-[13px] text-text-muted truncate mt-0.5">{account.distributorName}</p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 transition-colors">
          <Droplets className="w-4.5 h-4.5" strokeWidth={1.5} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center pt-3 border-t border-border-light w-full">
        <div className="bg-surface/60 rounded-lg py-1.5 px-1">
          <p className="text-[11px] text-text-muted mb-0.5">Today</p>
          <p className="text-sm sm:text-base font-semibold text-text-primary">{summary.todayBottles}</p>
          <p className="text-[10px] sm:text-[11px] text-text-muted">{summary.todayBottles === 1 ? 'bottle' : 'bottles'}</p>
        </div>
        <div className="bg-surface/60 rounded-lg py-1.5 px-1">
          <p className="text-[11px] text-text-muted mb-0.5">Total</p>
          <p className="text-sm sm:text-base font-semibold text-text-primary">{summary.totalBottles}</p>
          <p className="text-[10px] sm:text-[11px] text-text-muted">{summary.totalBottles === 1 ? 'bottle' : 'bottles'}</p>
        </div>
        <div className="bg-surface/60 rounded-lg py-1.5 px-1 flex flex-col justify-center">
          <p className="text-[11px] text-text-muted mb-0.5">Status</p>
          <p className={`text-sm sm:text-base font-semibold leading-tight ${dueInfo.color}`}>{dueInfo.text}</p>
        </div>
      </div>
    </button>
  )
}
