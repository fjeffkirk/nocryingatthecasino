const currency = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 6 })
const number0 = new Intl.NumberFormat(undefined, { notation: 'compact', maximumFractionDigits: 2 })
const currencyCompact = new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2 })
const percent = new Intl.NumberFormat(undefined, { style: 'percent', maximumFractionDigits: 2 })

export function formatCurrency(value) {
  if (value === undefined || value === null || Number.isNaN(value)) return '—'
  if (value < 0.01) return `$${value.toFixed(6)}`
  return currency.format(value)
}

export function formatNumber(value) {
  if (value === undefined || value === null || Number.isNaN(value)) return '—'
  return number0.format(value)
}

export function formatPercent(value) {
  if (value === undefined || value === null || Number.isNaN(value)) return '—'
  return `${value.toFixed(2)}%`
}

export function formatCurrencyCompact(value) {
  if (value === undefined || value === null || Number.isNaN(value)) return '—'
  return currencyCompact.format(value)
}


