export function getTodayString(): string {
  return formatDateToString(new Date())
}

export function formatDateToString(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning user'
  if (h < 17) return 'Good afternoon user'
  return 'Good evening user'
}

export function getFormattedToday(): string {
  return new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}
