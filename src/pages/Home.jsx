import { Container, Box, Tabs, Tab } from '@mui/material'
import { StatsHeader } from '../components/StatsHeader'
import { CelebrityTable } from '../components/CelebrityTable'
import { useState } from 'react'

export default function Home() {
  const [tab, setTab] = useState('celebrity')

  return (
    <Container maxWidth={false} sx={{ py: 0, px: { xs: 2, sm: 3, md: 4 } }}>
      <StatsHeader filter={tab} />
      <Box sx={{ mt: 4 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          textColor="primary"
          indicatorColor="primary"
          sx={{ mb: 2 }}
        >
          <Tab label="All" value="all" />
          <Tab label="Celebrity" value="celebrity" />
          <Tab label="Meme" value="meme" />
        </Tabs>
        <CelebrityTable filter={tab} />
      </Box>
    </Container>
  )
}


