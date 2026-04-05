import { Box, Stack } from '@mui/material'
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
        sx={{
          position: 'relative',
          width: '90%',
          mx: 'auto',
        }}
      >
        <Box
          component="img"
          src={heroImage}
          alt={band.name}
          sx={{
            width: '100%',
            display: 'block',
            minHeight: { xs: '45vh', md: '58vh' },
            maxHeight: { xs: '80vh', md: '85vh' },
            objectFit: 'cover',
            objectPosition: 'center top, center bottom',
          }}
        />

        {/* Logo sobre la foto: desactivado (el logo está en la Navbar). Para reactivar, importa zilver-logo-white.webp y vuelve a poner aquí un Box absolute + img. */}
      </Box>

      <Stack
        justifyContent="center"
        alignItems={{ xs: 'center', md: 'flex-start' }}
        spacing={1}
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 2, md: 3 },
          py: { xs: 3, md: 4 },
          textAlign: { xs: 'center', md: 'left' },
        }}
      >
        {/*<Typography
          component="h1"
          sx={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: { xs: '4.5rem', md: '7rem' },
            lineHeight: 0.95,
          }}
        >
          {band.name}
        </Typography>*/}

        {/*<Typography
          sx={{
            letterSpacing: '0.45em',
            fontSize: '0.75rem',
            fontWeight: 600,
          }}
        >
          {band.pressKit}
        </Typography> */}
      </Stack>
    </Box>
  )
}
