export type { WaterAccount, Delivery, Payment } from '../db/database'

export type AccountSummary = {
  totalBottles: number
  todayBottles: number
  totalDeliveryValue: number
  totalPaid: number
  due: number
}

export type HistoryItem = {
  id: number
  type: 'delivery' | 'payment'
  date: string
  quantity?: number
  unitRate?: number
  amount: number
  createdAt: number
}

export type HistoryFilter = 'all' | 'bottles' | 'payments'

export type AppView =
  | { page: 'splash' }
  | { page: 'home' }
  | { page: 'account'; accountId: number }
  | { page: 'add-account' }
  | { page: 'today-bottles'; accountId: number }
  | { page: 'additional-op'; accountId: number }
  | { page: 'payment'; accountId: number }
