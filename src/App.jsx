import { Container, Box, Typography, Stack, Avatar } from '@mui/material'
import './App.css'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'

function App() {
  return (
    <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      <Box sx={{ mb: 4, ml: { xs: 2, sm: 2, md: 2 } }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar src="/logo.png" alt="No Crying at the Casino" sx={{ width: 80, height: 80 }} />
          <Typography variant="h4" fontWeight={700} gutterBottom sx={{ m: 0 }}>
            No Crying at the Casino
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Tracking celebrity meme tokens. This is not financial advice.
        </Typography>
      </Box>

      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Container>
  )
}

export default App
