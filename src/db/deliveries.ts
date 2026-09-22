import { db } from './database'
import type { Delivery } from './database'

export async function addDelivery(data: Omit<Delivery, 'id' | 'createdAt'>): Promise<number> {
  return db.deliveries.add({ ...data, createdAt: Date.now() })
}

export async function getDeliveriesByAccount(accountId: number): Promise<Delivery[]> {
  return db.deliveries.where('accountId').equals(accountId).toArray()
}

export async function getTodayDeliveries(accountId: number, todayStr: string): Promise<Delivery[]> {
  return db.deliveries
    .where('[accountId+deliveryDate]')
    .equals([accountId, todayStr])
    .toArray()
}

export async function deleteDeliveriesByAccount(accountId: number): Promise<void> {
  await db.deliveries.where('accountId').equals(accountId).delete()
}

