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
      <Box
        sx={{
          flex: 1,
          display: 'grid',
          maxWidth: 1200,
          mx: 'auto',
          px: 2,
          width: '100%',
          minHeight: { xs: 'min(82vh, 580px)', md: 'min(560px, 65vh)' },
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) auto' },
          gridTemplateRows: { xs: 'auto 1fr auto', md: '1fr' },
          columnGap: { md: 4 },
        }}
      >
        <Typography
          component="h2"
          sx={{
            gridColumn: 1,
            gridRow: 1,
            fontWeight: 700,
            letterSpacing: '0.12em',
            fontSize: { xs: '2.2rem', md: '3.2rem' },
            lineHeight: 1,
            pt: { xs: 4, md: 10 },
            alignSelf: 'start',
            justifySelf: 'start',
          }}
        >
          {band.contactTitle}
        </Typography>

        <Stack
          spacing={2}
          sx={{
            gridColumn: { xs: 1, md: 2 },
            gridRow: { xs: 3, md: 1 },
            maxWidth: 380,
            width: '100%',
            alignSelf: { xs: 'end', md: 'end' },
            justifySelf: 'end',
            textAlign: 'right',
            pb: { xs: 3, md: 4 },
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
              Celular
            </Typography>
            <Link href={`tel:${band.phoneTel}`} color="inherit" sx={{ fontWeight: 600 }}>
              {band.phoneTel}
            </Link>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}