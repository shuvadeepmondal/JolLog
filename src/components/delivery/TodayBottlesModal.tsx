import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { addDelivery } from '../../db/deliveries'
import { getTodayString } from '../../lib/dates'
import { formatCurrency } from '../../lib/calculations'

interface TodayBottlesModalProps {
  open: boolean
  onClose: () => void
  onSaved: () => void
  accountId: number
  bottleRate: number
  planType: 'single' | 'double'
}

export function TodayBottlesModal({ open, onClose, onSaved, accountId, bottleRate, planType }: TodayBottlesModalProps) {
  const defaultQty = planType === 'double' ? 2 : 1
  const [quantity, setQuantity] = useState(defaultQty)
  const [saving, setSaving] = useState(false)

  const total = quantity * bottleRate

  async function handleSave() {
    if (quantity <= 0) return
    setSaving(true)
    await addDelivery({
      accountId,
      quantity,
      unitRate: bottleRate,
      totalAmount: total,
      deliveryDate: getTodayString(),
    })
    setSaving(false)
    setQuantity(defaultQty)
    onSaved()
  }

  function handleClose() {
    setQuantity(defaultQty)
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Today's Bottles">
      <div className="text-center space-y-6">
        <p className="text-sm text-text-secondary">How many?</p>

        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-11 h-11 rounded-full border border-border flex items-center justify-center hover:bg-surface-hover active:scale-95 transition-all"
            aria-label="Decrease"
          >
            <Minus className="w-4.5 h-4.5 text-text-secondary" />
          </button>

          <span className="text-4xl font-semibold text-text-primary w-16 tabular-nums">{quantity}</span>

          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-11 h-11 rounded-full border border-border flex items-center justify-center hover:bg-surface-hover active:scale-95 transition-all"
            aria-label="Increase"
          >
            <Plus className="w-4.5 h-4.5 text-text-secondary" />
          </button>
        </div>

        <p className="text-[13px] text-text-muted">{formatCurrency(bottleRate)} / bottle</p>

        <div className="bg-surface rounded-xl p-4">
          <p className="text-[13px] text-text-muted mb-1">Total</p>
          <p className="text-xl font-semibold text-text-primary">{formatCurrency(total)}</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 active:bg-primary-700 transition-colors disabled:opacity-60"
        >
          {saving ? 'Adding…' : 'Add Bottles'}
        </button>
      </div>
    </Modal>
  )
}
