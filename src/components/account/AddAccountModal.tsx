import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { addAccount } from '../../db/accounts'

interface AddAccountModalProps {
  open: boolean
  onClose: () => void
  onSaved: () => void
}

export function AddAccountModal({ open, onClose, onSaved }: AddAccountModalProps) {
  const [companyName, setCompanyName] = useState('')
  const [distributorName, setDistributorName] = useState('')
  const [mobileNumber, setMobileNumber] = useState('')
  const [planType, setPlanType] = useState<'single' | 'double'>('single')
  const [bottleRate, setBottleRate] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  function validate() {
    const errs: Record<string, string> = {}
    if (!companyName.trim()) errs.companyName = 'Company name is required'
    if (!distributorName.trim()) errs.distributorName = 'Distributor name is required'
    const rate = parseFloat(bottleRate)
    if (!bottleRate || isNaN(rate) || rate <= 0) errs.bottleRate = 'Enter a valid bottle rate'
    return errs
  }

  async function handleSave() {
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSaving(true)
    await addAccount({
      companyName: companyName.trim(),
      distributorName: distributorName.trim(),
      mobileNumber: mobileNumber.trim() || undefined,
      planType,
      bottleRate: parseFloat(bottleRate),
    })
    setSaving(false)
    resetForm()
    onSaved()
  }

  function resetForm() {
    setCompanyName('')
    setDistributorName('')
    setMobileNumber('')
    setPlanType('single')
    setBottleRate('')
    setErrors({})
  }

  function handleClose() {
    resetForm()
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add Water Account">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Company name" error={errors.companyName}>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. ABC Water"
              className="field-input"
            />
          </Field>

          <Field label="Distributor name" error={errors.distributorName}>
            <input
              value={distributorName}
              onChange={(e) => setDistributorName(e.target.value)}
              placeholder="e.g. Rahul Das"
              className="field-input"
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Mobile number (optional)">
            <input
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="e.g. 9876543210"
              type="tel"
              className="field-input"
            />
          </Field>

          <Field label="Bottle rate" error={errors.bottleRate}>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">₹</span>
              <input
                value={bottleRate}
                onChange={(e) => setBottleRate(e.target.value)}
                placeholder="30"
                type="number"
                inputMode="decimal"
                className="field-input pl-7"
              />
            </div>
          </Field>
        </div>

        <Field label="Bottle plan">
          <div className="flex gap-2">
            {(['single', 'double'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setPlanType(t)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors capitalize ${
                  planType === t
                    ? 'bg-primary-500 text-white border-primary-500 shadow-xs'
                    : 'bg-white text-text-secondary border-border hover:border-primary-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Field>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto sm:min-w-[160px] py-2.5 px-6 bg-primary-500 text-white rounded-xl text-sm font-semibold hover:bg-primary-600 active:bg-primary-700 transition-colors shadow-sm disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save Account'}
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
