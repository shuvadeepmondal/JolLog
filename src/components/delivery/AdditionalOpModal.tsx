import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { addDelivery } from '../../db/deliveries'
import { formatCurrency } from '../../lib/calculations'
import { getTodayString } from '../../lib/dates'

interface AdditionalOpModalProps {
  open: boolean
  onClose: () => void
  onSaved: () => void
  accountId: number
  bottleRate: number
}

export function AdditionalOpModal({ open, onClose, onSaved, accountId, bottleRate }: AdditionalOpModalProps) {
  const [date, setDate] = useState(getTodayString())
  const [quantity, setQuantity] = useState('1')
  const [rate, setRate] = useState(String(bottleRate))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const qty = parseInt(quantity) || 0
  const unitRate = parseFloat(rate) || 0
  const total = qty * unitRate

  function validate() {
    const errs: Record<string, string> = {}
    if (!date) errs.date = 'Date is required'
    if (qty <= 0) errs.quantity = 'Enter a valid quantity'
    if (unitRate <= 0) errs.rate = 'Enter a valid rate'
    return errs
  }

  async function handleSave() {
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSaving(true)
    await addDelivery({
      accountId,
      quantity: qty,
      unitRate,
      totalAmount: total,
      deliveryDate: date,
    })
    setSaving(false)
    resetForm()
    onSaved()
  }

  function resetForm() {
    setDate(getTodayString())
    setQuantity('1')
    setRate(String(bottleRate))
    setErrors({})
  }

  function handleClose() {
    resetForm()
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Additional Operation">
      <div className="space-y-4">
        <Field label="Operation">
          <div className="field-input bg-surface-hover text-text-secondary">Bottle Delivery</div>
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Date" error={errors.date}>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="field-input" />
          </Field>

          <Field label="Quantity" error={errors.quantity}>
            <input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              type="number"
              inputMode="numeric"
              min="1"
              className="field-input"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
          <Field label="Rate" error={errors.rate}>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">₹</span>
              <input
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                type="number"
                inputMode="decimal"
                className="field-input pl-7"
              />
            </div>
          </Field>

          <div className="bg-surface rounded-xl p-3.5 text-center border border-border-light h-[58px] flex flex-col justify-center">
            <p className="text-[11px] text-text-muted">Total Amount</p>
            <p className="text-lg font-semibold text-text-primary leading-tight">{formatCurrency(total)}</p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto sm:min-w-[140px] py-2.5 px-6 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 active:bg-primary-700 transition-colors shadow-sm disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-text-secondary mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  )
}
