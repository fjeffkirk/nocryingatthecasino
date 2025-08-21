const COINGECKO_BASE = 'https://api.coingecko.com/api/v3'

function buildQuery(params) {
  const usp = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    usp.append(key, String(value))
  })
  const apiKey = import.meta.env.NEXT_PUBLIC_COINGECKO_API_KEY
  if (apiKey) usp.append('x_cg_pro_api_key', apiKey)
  return usp.toString()
}

export async function fetchMarketsByIds(ids, vsCurrency = 'usd') {
  const idsParam = Array.isArray(ids) ? ids.join(',') : ids
  const qs = buildQuery({ vs_currency: vsCurrency, ids: idsParam, price_change_percentage: '1h,24h,7d' })
  const url = `${COINGECKO_BASE}/coins/markets?${qs}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`)
  return res.json()
}

export async function fetchCoin(id) {
  const qs = buildQuery({ localization: false, tickers: false, market_data: true, community_data: false, developer_data: false, sparkline: false })
  const url = `${COINGECKO_BASE}/coins/${encodeURIComponent(id)}?${qs}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`)
  return res.json()
}

export async function fetchMarketsByCategory(categorySlug, vsCurrency = 'usd') {
  const qs = buildQuery({ vs_currency: vsCurrency, category: categorySlug, price_change_percentage: '1h,24h,7d' })
  const url = `${COINGECKO_BASE}/coins/markets?${qs}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`)
  return res.json()
}

export async function fetchMarketsByCategories(categorySlugs, vsCurrency = 'usd') {
  const lists = await Promise.all(
    categorySlugs.map((slug) => fetchMarketsByCategory(slug, vsCurrency).catch(() => []))
  )
  // Merge by unique id; prefer first occurrence
  const map = new Map()
  for (const arr of lists) {
    for (const coin of arr) {
      if (!map.has(coin.id)) map.set(coin.id, coin)
    }
  }
  return Array.from(map.values())
}


