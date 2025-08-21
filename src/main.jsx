import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { PrivyProvider } from '@privy-io/react-auth'
import { WagmiProvider } from 'wagmi'
import { http, createConfig } from 'wagmi'
import { mainnet } from 'viem/chains'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#dc143c' }, // crimson
    secondary: { main: '#ff6b6b' },
    error: { main: '#ff5252' },
    warning: { main: '#ffb74d' },
    background: { default: '#0a0c12', paper: '#11151c' },
    text: { primary: 'rgba(255,255,255,0.92)', secondary: 'rgba(255,255,255,0.62)' },
    divider: 'rgba(220,20,60,0.22)'
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: [
            'radial-gradient(1200px 500px at 10% -5%, rgba(220,20,60,0.10), rgba(220,20,60,0) 70%)',
            'radial-gradient(800px 400px at 90% 0%, rgba(255,77,77,0.08), rgba(255,77,77,0) 70%)',
            'linear-gradient(#0a0c12, #0a0c12)'
          ].join(','),
          backgroundAttachment: 'fixed',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(220,20,60,0.28)',
          backgroundImage: 'linear-gradient(180deg, rgba(220,20,60,0.08), rgba(220,20,60,0.02))',
          backgroundColor: '#11151c',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#0f141b',
          backgroundImage: 'linear-gradient(180deg, rgba(220,20,60,0.10), rgba(220,20,60,0))',
        },
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: { color: 'inherit' },
        icon: { color: 'inherit !important' },
      },
    },
    MuiLink: { styleOverrides: { root: { color: '#ff6b6b' } } },
    MuiAvatar: { styleOverrides: { root: { boxShadow: '0 0 0 2px rgba(220,20,60,0.25)' } } },
  },
  typography: {
    fontWeightBold: 700,
  },
})

const queryClient = new QueryClient()

const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
})

const PRIVY_APP_ID = import.meta.env.NEXT_PUBLIC_PRIVY_APP_ID || ''

const AppTree = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          {PRIVY_APP_ID ? (
            <PrivyProvider appId={PRIVY_APP_ID}>{AppTree}</PrivyProvider>
          ) : (
            AppTree
          )}
        </WagmiProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
)
