import { db } from './database'
import type { WaterAccount } from './database'

export async function addAccount(data: Omit<WaterAccount, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
  const now = Date.now()
  return db.accounts.add({ ...data, createdAt: now, updatedAt: now })
}

export async function getAllAccounts(): Promise<WaterAccount[]> {
  return db.accounts.toArray()
}

export async function getAccount(id: number): Promise<WaterAccount | undefined> {
  return db.accounts.get(id)
}

export async function updateAccount(id: number, data: Partial<Omit<WaterAccount, 'id' | 'createdAt'>>): Promise<void> {
  await db.accounts.update(id, { ...data, updatedAt: Date.now() })
}

export async function resetAccountData(id: number): Promise<void> {
  await Promise.all([
    db.deliveries.where('accountId').equals(id).delete(),
    db.payments.where('accountId').equals(id).delete(),
  ])
}

export async function deleteAccount(id: number): Promise<void> {
  await Promise.all([
    db.deliveries.where('accountId').equals(id).delete(),
    db.payments.where('accountId').equals(id).delete(),
    db.accounts.delete(id),
  ])
}

