import { Box, Link, Stack, Typography } from '@mui/material'
import { band } from '../../data/band'
import contactImage from '../../assets/img/contac.webp'

export function Contacto() {
  return (
    <Box
      id="contacto"
      component="section"
      sx={{
        py: { xs: 6, md: 10 },
        bgcolor: '#050505',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',

        backgroundImage: `url(${contactImage})`,
        backgroundSize: 'cover',
        backgroundPosition: '50% 20%', // 👈 control real de encuadre
        backgroundRepeat: 'no-repeat',

        mx: 'auto',
        maxWidth: '90%',
        minHeight: { xs: 'min(90vh, 640px)', md: 700 },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 4, md: 8 }}
        sx={{
          flex: 1,
          maxWidth: 1200,
          mx: 'auto',
          pl: 2,
          pr: { xs: 2, md: 0 },
          width: '100%',
          alignItems: { xs: 'flex-start', md: 'stretch' },
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontWeight: 700,
            letterSpacing: '0.12em',
            fontSize: { xs: '2.2rem', md: '3.2rem' },
            lineHeight: 1,
            mt: { xs: 4, md: 10 },
            alignSelf: 'flex-start',
            flexShrink: 0,
          }}
        >
          {band.contactTitle}
        </Typography>

        <Stack
          spacing={2}
          sx={{
            maxWidth: 380,
            mt: { xs: 6, md: 0 },
            ml: { xs: 0, md: 'auto' },
            alignSelf: { xs: 'stretch', md: 'flex-end' },
            textAlign: { xs: 'left', md: 'right' },
            pb: { xs: 2, md: 3 },
            transform: { md: 'translateX(24px)' },
          }}
        >
          <Box>
            <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>
              Email
            </Typography>
            <Link href={`mailto:${band.email}`} color="inherit" sx={{ fontWeight: 600 }}>
              {band.email}
            </Link>
          </Box>

          <Box>
            <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>
              Web y plataformas
            </Typography>
            <Link href={band.linktree} target="_blank" rel="noopener noreferrer" color="inherit">
              {band.linktreeLabel}
            </Link>
          </Box>

          <Box>
            <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>
              Redes sociales
            </Typography>
            <Typography sx={{ fontWeight: 600 }}>
              {band.socialHandle}
            </Typography>
          </Box>

          <Box>
            <Typography sx={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>
              Celular
            </Typography>
            <Link href={`tel:${band.phoneTel}`} color="inherit" sx={{ fontWeight: 600 }}>
              {band.phone}
            </Link>
          </Box>
        </Stack>
      </Stack>
    </Box>
  )
}