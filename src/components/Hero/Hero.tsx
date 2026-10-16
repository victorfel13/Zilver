import { Box } from '@mui/material'
import { band } from '../../data/band'
import heroImage from '../../assets/img/hero-zilver.webp'

export function Hero() {
  return (
    <Box
      id="hero"
      component="section"
      sx={{ bgcolor: '#000', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
    >
      <Box
        component="img"
        src={heroImage}
        alt={band.name}
        sx={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </Box>
  )
}
