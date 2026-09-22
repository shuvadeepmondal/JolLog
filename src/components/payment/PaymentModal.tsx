import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { addPayment } from '../../db/payments'
import { formatCurrency } from '../../lib/calculations'
import { getTodayString } from '../../lib/dates'

interface PaymentModalProps {
  open: boolean
  onClose: () => void
  onSaved: () => void
  accountId: number
  currentDue: number
}

export function PaymentModal({ open, onClose, onSaved, accountId, currentDue }: PaymentModalProps) {
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const parsedAmount = parseFloat(amount) || 0
  const remaining = currentDue - parsedAmount

  async function handleSave() {
    if (!amount || parsedAmount <= 0) {
      setError('Enter a valid amount')
      return
    }
    setError('')
    setSaving(true)
    await addPayment({
      accountId,
      amount: parsedAmount,
      paymentDate: getTodayString(),
    })
    setSaving(false)
    setAmount('')
    onSaved()
  }

  function handleClose() {
    setAmount('')
    setError('')
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Payment">
      <div className="space-y-5">
        <div className="bg-surface rounded-xl p-4 text-center">
          <p className="text-[13px] text-text-muted mb-1">Current Due</p>
          <p className={`text-xl font-semibold ${currentDue > 0 ? 'text-amber-600' : currentDue === 0 ? 'text-emerald-600' : 'text-blue-600'}`}>
            {currentDue > 0 ? formatCurrency(currentDue) : currentDue === 0 ? 'Paid' : `Credit ${formatCurrency(Math.abs(currentDue))}`}
          </p>
        </div>

        <div>
          <label className="block text-[13px] font-medium text-text-secondary mb-1.5">Amount Paid</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">₹</span>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              inputMode="decimal"
              placeholder="0"
              className="field-input pl-7"
            />
          </div>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        {parsedAmount > 0 && (
          <div className="bg-surface rounded-xl p-4 text-center">
            <p className="text-[13px] text-text-muted mb-1">Remaining</p>
            <p className={`text-lg font-semibold ${remaining > 0 ? 'text-amber-600' : remaining === 0 ? 'text-emerald-600' : 'text-blue-600'}`}>
              {remaining > 0 ? formatCurrency(remaining) : remaining === 0 ? 'Paid' : `Credit ${formatCurrency(Math.abs(remaining))}`}
            </p>
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 active:bg-primary-700 transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save Payment'}
        </button>
      </div>
    </Modal>
  )
}
