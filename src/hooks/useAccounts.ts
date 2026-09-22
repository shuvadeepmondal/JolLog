import { useState, useEffect, useCallback } from 'react'
import type { WaterAccount, Delivery, Payment } from '../db/database'
import { getAllAccounts, getAccount } from '../db/accounts'
import { getDeliveriesByAccount } from '../db/deliveries'
import { getPaymentsByAccount } from '../db/payments'

export function useAccounts() {
  const [accounts, setAccounts] = useState<WaterAccount[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const data = await getAllAccounts()
    setAccounts(data)
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  return { accounts, loading, refresh }
}

export function useAccount(id: number) {
  const [account, setAccount] = useState<WaterAccount | null>(null)
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const [acc, del, pay] = await Promise.all([
      getAccount(id),
      getDeliveriesByAccount(id),
      getPaymentsByAccount(id),
    ])
    setAccount(acc ?? null)
    setDeliveries(del)
    setPayments(pay)
    setLoading(false)
  }, [id])

  useEffect(() => { refresh() }, [refresh])

  return { account, deliveries, payments, loading, refresh }
}
