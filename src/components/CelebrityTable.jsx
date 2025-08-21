import { useMemo, useState } from 'react'
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Avatar, Stack, Typography, TableContainer, TableSortLabel } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { fetchMarketsByIds, fetchMarketsByCategory, fetchMarketsByCategories } from '../api/coingecko'
import { CELEBRITY_TOKEN_IDS } from '../data/celebrityTokens'
import { formatCurrency, formatPercent, formatNumber } from '../utils/format'

export function CelebrityTable({ filter = 'celebrity' }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['markets-table', filter],
    queryFn: async () => {
      if (filter === 'meme') {
        return fetchMarketsByCategory('meme-token')
      }
      if (filter === 'all') {
        return fetchMarketsByCategories(['celebrity-themed-coins', 'meme-token'])
      }
      const cat = await fetchMarketsByCategory('celebrity-themed-coins')
      if (Array.isArray(cat) && cat.length > 0) return cat
      return fetchMarketsByIds(CELEBRITY_TOKEN_IDS)
    },
    refetchInterval: 60_000,
  })

  const rows = useMemo(() => data ?? [], [data])

  const [orderBy, setOrderBy] = useState('market_cap')
  const [order, setOrder] = useState('desc')

  function getComparator(property, direction) {
    return (a, b) => {
      let av
      let bv
      switch (property) {
        case 'name':
          av = a.name?.toLowerCase() ?? ''
          bv = b.name?.toLowerCase() ?? ''
          if (av < bv) return direction === 'asc' ? -1 : 1
          if (av > bv) return direction === 'asc' ? 1 : -1
          return 0
        case 'price':
          av = a.current_price ?? 0
          bv = b.current_price ?? 0
          break
        case 'change24h':
          av = a.price_change_percentage_24h ?? 0
          bv = b.price_change_percentage_24h ?? 0
          break
        case 'change7d':
          av = a.price_change_percentage_7d_in_currency ?? 0
          bv = b.price_change_percentage_7d_in_currency ?? 0
          break
        case 'volume':
          av = a.total_volume ?? 0
          bv = b.total_volume ?? 0
          break
        case 'market_cap':
        default:
          av = a.market_cap ?? 0
          bv = b.market_cap ?? 0
          break
      }
      if (av === bv) return 0
      return direction === 'asc' ? (av < bv ? -1 : 1) : (av > bv ? -1 : 1)
    }
  }

  const sortedRows = useMemo(() => rows.slice().sort(getComparator(orderBy, order)), [rows, orderBy, order])

  function handleRequestSort(property) {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ bgcolor: 'background.paper' }}>
      <Table size="small" aria-label="celebrity tokens table">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell sortDirection={orderBy === 'name' ? order : false}>
              <TableSortLabel active={orderBy === 'name'} direction={orderBy === 'name' ? order : 'asc'} onClick={() => handleRequestSort('name')}>
                Token
              </TableSortLabel>
            </TableCell>
            <TableCell align="right" sortDirection={orderBy === 'price' ? order : false}>
              <TableSortLabel active={orderBy === 'price'} direction={orderBy === 'price' ? order : 'asc'} onClick={() => handleRequestSort('price')}>
                Price
              </TableSortLabel>
            </TableCell>
            <TableCell align="right" sortDirection={orderBy === 'change24h' ? order : false}>
              <TableSortLabel active={orderBy === 'change24h'} direction={orderBy === 'change24h' ? order : 'asc'} onClick={() => handleRequestSort('change24h')}>
                24h %
              </TableSortLabel>
            </TableCell>
            <TableCell align="right" sortDirection={orderBy === 'change7d' ? order : false}>
              <TableSortLabel active={orderBy === 'change7d'} direction={orderBy === 'change7d' ? order : 'asc'} onClick={() => handleRequestSort('change7d')}>
                7d %
              </TableSortLabel>
            </TableCell>
            <TableCell align="right" sortDirection={orderBy === 'volume' ? order : false}>
              <TableSortLabel active={orderBy === 'volume'} direction={orderBy === 'volume' ? order : 'asc'} onClick={() => handleRequestSort('volume')}>
                24h Volume
              </TableSortLabel>
            </TableCell>
            <TableCell align="right" sortDirection={orderBy === 'market_cap' ? order : false}>
              <TableSortLabel active={orderBy === 'market_cap'} direction={orderBy === 'market_cap' ? order : 'asc'} onClick={() => handleRequestSort('market_cap')}>
                Market Cap
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading && (
            <TableRow><TableCell colSpan={7}>Loading…</TableCell></TableRow>
          )}
          {error && (
            <TableRow><TableCell colSpan={7}>Failed to load data</TableCell></TableRow>
          )}
          {sortedRows.map((row, idx) => (
            <TableRow key={row.id} hover>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Avatar src={row.image} alt={row.name} sx={{ width: 28, height: 28 }} />
                  <Stack direction="row" spacing={1} alignItems="baseline">
                    <Typography fontWeight={600}>{row.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{row.symbol?.toUpperCase()}</Typography>
                  </Stack>
                </Stack>
              </TableCell>
              <TableCell align="right">{formatCurrency(row.current_price)}</TableCell>
              <TableCell align="right" sx={{ color: (row.price_change_percentage_24h ?? 0) >= 0 ? 'success.main' : 'error.main' }}>
                {formatPercent(row.price_change_percentage_24h)}
              </TableCell>
              <TableCell align="right" sx={{ color: (row.price_change_percentage_7d_in_currency ?? 0) >= 0 ? 'success.main' : 'error.main' }}>
                {formatPercent(row.price_change_percentage_7d_in_currency)}
              </TableCell>
              <TableCell align="right">{formatNumber(row.total_volume)}</TableCell>
              <TableCell align="right">{formatNumber(row.market_cap)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}


