import type { Delivery, Payment } from '../db/database'
import type { AccountSummary, HistoryItem } from '../types'

export function calculateSummary(
  deliveries: Delivery[],
  payments: Payment[],
  todayStr: string
): AccountSummary {
  let totalBottles = 0
  let todayBottles = 0
  let totalDeliveryValue = 0

  for (const d of deliveries) {
    totalBottles += d.quantity
    totalDeliveryValue += d.totalAmount
    if (d.deliveryDate === todayStr) {
      todayBottles += d.quantity
    }
  }

  let totalPaid = 0
  for (const p of payments) {
    totalPaid += p.amount
  }

  return {
    totalBottles,
    todayBottles,
    totalDeliveryValue,
    totalPaid,
    due: totalDeliveryValue - totalPaid,
  }
}

export function buildHistory(
  deliveries: Delivery[],
  payments: Payment[],
  filter: 'all' | 'bottles' | 'payments'
): HistoryItem[] {
  const items: HistoryItem[] = []

  if (filter !== 'payments') {
    for (const d of deliveries) {
      items.push({
        id: d.id!,
        type: 'delivery',
        date: d.deliveryDate,
        quantity: d.quantity,
        unitRate: d.unitRate,
        amount: d.totalAmount,
        createdAt: d.createdAt,
      })
    }
  }

  if (filter !== 'bottles') {
    for (const p of payments) {
      items.push({
        id: p.id!,
        type: 'payment',
        date: p.paymentDate,
        amount: p.amount,
        createdAt: p.createdAt,
      })
    }
  }

  items.sort((a, b) => {
    const dateCmp = b.date.localeCompare(a.date)
    if (dateCmp !== 0) return dateCmp
    return b.createdAt - a.createdAt
  })

  return items
}

export function formatCurrency(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN')
}

export function getDueLabel(due: number): { text: string; color: string } {
  if (due > 0) return { text: `Due ${formatCurrency(due)}`, color: 'text-amber-600' }
  if (due === 0) return { text: 'Paid', color: 'text-emerald-600' }
  return { text: `Credit ${formatCurrency(Math.abs(due))}`, color: 'text-blue-600' }
}
