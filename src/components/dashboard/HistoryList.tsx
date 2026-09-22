import { useState } from 'react'
import { Droplet, CreditCard } from 'lucide-react'
import type { Delivery, Payment } from '../../db/database'
import type { HistoryFilter } from '../../types'
import { buildHistory, formatCurrency } from '../../lib/calculations'
import { formatDisplayDate, formatTime } from '../../lib/dates'

interface HistoryListProps {
  deliveries: Delivery[]
  payments: Payment[]
}

export function HistoryList({ deliveries, payments }: HistoryListProps) {
  const [filter, setFilter] = useState<HistoryFilter>('all')
  const items = buildHistory(deliveries, payments, filter)

  const filters: { key: HistoryFilter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'bottles', label: 'Bottles' },
    { key: 'payments', label: 'Payments' },
  ]

  return (
    <div>
      <h3 className="text-[15px] font-semibold text-text-primary mb-3">History</h3>

      <div className="flex gap-1.5 mb-4 bg-surface rounded-lg p-1">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex-1 py-2 text-[13px] font-medium rounded-md transition-colors ${
              filter === f.key
                ? 'bg-white text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="text-center text-sm text-text-muted py-8">No records yet</p>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <div key={`${item.type}-${item.id}`} className="flex items-start gap-3 p-3 bg-surface-card rounded-lg border border-border-light">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                item.type === 'delivery' ? 'bg-blue-50 text-blue-500' : 'bg-emerald-50 text-emerald-500'
              }`}>
                {item.type === 'delivery'
                  ? <Droplet className="w-3.5 h-3.5" />
                  : <CreditCard className="w-3.5 h-3.5" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-text-muted">
                  {formatDisplayDate(item.date)}
                  <span className="mx-1">·</span>
                  <span className="font-mono">{formatTime(item.createdAt)}</span>
                </p>
                <p className="text-[13px] font-medium text-text-primary mt-0.5">
                  {item.type === 'delivery' ? 'Bottle Addition' : 'Payment'}
                </p>
                {item.type === 'delivery' && (
                  <p className="text-[12px] text-text-secondary mt-0.5">
                    {item.quantity} {item.quantity === 1 ? 'bottle' : 'bottles'} × {formatCurrency(item.unitRate!)}
                  </p>
                )}
              </div>
              <p className={`text-sm font-semibold flex-shrink-0 ${
                item.type === 'delivery' ? 'text-text-primary' : 'text-emerald-600'
              }`}>
                {item.type === 'payment' ? '−' : ''}{formatCurrency(item.amount)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
