import { db } from './database'
import type { Payment } from './database'

export async function addPayment(data: Omit<Payment, 'id' | 'createdAt'>): Promise<number> {
  return db.payments.add({ ...data, createdAt: Date.now() })
}

export async function getPaymentsByAccount(accountId: number): Promise<Payment[]> {
  return db.payments.where('accountId').equals(accountId).toArray()
}

export async function deletePaymentsByAccount(accountId: number): Promise<void> {
  await db.payments.where('accountId').equals(accountId).delete()
}

