import { Card, CardContent, Grid, Stack, Typography, Box, Avatar, Tooltip } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { fetchMarketsByIds, fetchMarketsByCategory, fetchMarketsByCategories } from '../api/coingecko'
import { CELEBRITY_TOKEN_IDS } from '../data/celebrityTokens'
import { formatCurrency, formatPercent, formatNumber, formatCurrencyCompact } from '../utils/format'

function StatCard({ title, primary, secondary, image, hint }) {
  return (
    <Card variant="outlined" sx={{ bgcolor: 'background.paper', height: '100%', width: '100%' }}>
      <CardContent sx={{ minHeight: 112, display: 'flex', alignItems: 'center' }}>
        <Stack direction="row" spacing={2} alignItems="center">
          {image ? <Avatar src={image} alt={title} /> : <Box sx={{ width: 40, height: 40 }} />}
          <Box>
            <Typography variant="overline" color="text.secondary">{title}</Typography>
            <Stack direction="column" spacing={0.5} alignItems="flex-start">
              <Typography variant="h6" fontWeight={700}>{primary}</Typography>
              {secondary ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>{secondary}</Typography>
              ) : null}
            </Stack>
            {hint ? (
              <Typography variant="caption" color="text.secondary">{hint}</Typography>
            ) : null}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}

export function StatsHeader({ filter = 'celebrity' }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['markets', 'stats', filter],
    queryFn: async () => {
      if (filter === 'meme') {
        return fetchMarketsByCategory('meme-token')
      }
      if (filter === 'all') {
        return fetchMarketsByCategories(['celebrity-themed-coins', 'meme-token'])
      }
      // CoinGecko celebrity category slug is usually 'celebrity-themed-coins'
      const cat = await fetchMarketsByCategory('celebrity-themed-coins')
      if (Array.isArray(cat) && cat.length > 0) return cat
      return fetchMarketsByIds(CELEBRITY_TOKEN_IDS)
    },
    staleTime: 30_000,
  })

  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {[0, 1, 2].map((i) => (
          <Grid item xs={12} md={4} key={i}>
            <Card variant="outlined"><CardContent><Typography>Loading…</Typography></CardContent></Card>
          </Grid>
        ))}
      </Grid>
    )
  }

  if (error || !data || data.length === 0) {
    return (
      <Typography color="error">No market data. Try setting valid CoinGecko IDs.</Typography>
    )
  }

  const sortedBy24h = [...data].sort((a, b) => (a.price_change_percentage_24h ?? 0) - (b.price_change_percentage_24h ?? 0))
  const biggestLoser = sortedBy24h[0]

  const sortedByVol = [...data].sort((a, b) => (a.total_volume ?? 0) - (b.total_volume ?? 0))
  const lowestVolume = sortedByVol[0]

  const riskiest = sortedBy24h.at(-1) // tongue-in-cheek: biggest pump tends to dump

  // New metrics
  const avgDecline24h = data.reduce((acc, c) => acc + (c.price_change_percentage_24h ?? 0), 0) / data.length
  const totalMarketCap = data.reduce((acc, c) => acc + (c.market_cap ?? 0), 0)

  // Approximate total loss from ATH: sum of (market_cap * drawdown%)
  // drawdown% = (1 - price/current_ath_price). We only have current price and ath change % sometimes via /coins, not markets.
  // markets gives 'ath' and 'ath_change_percentage' fields; use those if present.
  const totalDrawdownUsd = data.reduce((acc, c) => {
    const athChangePct = c.ath_change_percentage // negative when below ATH
    if (athChangePct === undefined || athChangePct === null) return acc
    const drawdownRatio = Math.max(0, Math.min(1, Math.abs(athChangePct) / (100 + Math.abs(athChangePct))))
    // Estimate loss basis as market cap at ATH ~ current market cap / (1 - drawdownRatio)
    const currentCap = c.market_cap ?? 0
    if (currentCap <= 0 || drawdownRatio <= 0) return acc
    const athCap = currentCap / (1 - drawdownRatio)
    const loss = athCap - currentCap
    return acc + loss
  }, 0)

  return (
    <Grid container spacing={2} alignItems="stretch">
      <Grid item xs={12} md={4} lg={4} sx={{ display: 'flex' }}>
        <StatCard
          title="Avg Decline (24h)"
          image={biggestLoser?.image}
          primary={`${formatPercent(avgDecline24h)}`}
          secondary={`Biggest: ${biggestLoser?.name ?? '—'} ${formatPercent(biggestLoser?.price_change_percentage_24h)}`}
        />
      </Grid>
      <Grid item xs={12} md={4} lg={4} sx={{ display: 'flex' }}>
        <StatCard
          title="Total Market Cap"
          image={lowestVolume?.image}
          primary={`${formatCurrencyCompact(totalMarketCap)}`}
          secondary={`Across ${data.length} tokens`}
        />
      </Grid>
      <Grid item xs={12} md={4} lg={4} sx={{ display: 'flex' }}>
        <StatCard
          title="Total Loss From ATH (est.)"
          image={riskiest?.image}
          primary={`${formatCurrencyCompact(totalDrawdownUsd)}`}
          secondary={`Token ATHs compared to current price`}
        />
      </Grid>
    </Grid>
  )
}


