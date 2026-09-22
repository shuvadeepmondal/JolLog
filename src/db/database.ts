import Dexie, { type Table } from 'dexie'

export interface WaterAccount {
  id?: number
  companyName: string
  distributorName: string
  mobileNumber?: string
  planType: 'single' | 'double'
  bottleRate: number
  createdAt: number
  updatedAt: number
}

export interface Delivery {
  id?: number
  accountId: number
  quantity: number
  unitRate: number
  totalAmount: number
  deliveryDate: string
  createdAt: number
}

export interface Payment {
  id?: number
  accountId: number
  amount: number
  paymentDate: string
  createdAt: number
}

export class JollogDatabase extends Dexie {
  accounts!: Table<WaterAccount, number>
  deliveries!: Table<Delivery, number>
  payments!: Table<Payment, number>

  constructor() {
    super('jollog')

    this.version(1).stores({
      accounts: '++id, companyName, distributorName',
      deliveries: '++id, accountId, deliveryDate, [accountId+deliveryDate]',
      payments: '++id, accountId, paymentDate',
    })
  }
}

export const db = new JollogDatabase()

export async function resetAllData(): Promise<void> {
  await Promise.all([
    db.accounts.clear(),
    db.deliveries.clear(),
    db.payments.clear(),
  ])
}