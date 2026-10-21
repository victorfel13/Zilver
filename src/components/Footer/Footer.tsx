import { Box, Stack, Typography } from '@mui/material'
import { band } from '../../data/band'
import { SocialLinks } from '../SocialLinks'

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        borderTop: '1px solid rgba(255,255,255,0.1)',
        bgcolor: '#000',
      }}
    >
      <Stack
        spacing={2.5}
        alignItems="center"
        sx={{ maxWidth: 1200, mx: 'auto', textAlign: 'center' }}
      >
        <SocialLinks />

        <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.04em' }}>
          © {new Date().getFullYear()} {band.name}. {band.city}. Todos los derechos reservados.
        </Typography>

        <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.03em' }}>
          Sitio realizado por{' '}
          <Box component="span" sx={{ fontWeight: 600, color: 'rgba(255,255,255,0.55)' }}>
            VicOsi
          </Box>
          .
        </Typography>
      </Stack>
    </Box>
  )
}
