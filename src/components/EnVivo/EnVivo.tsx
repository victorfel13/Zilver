import { Box, Link, Stack, Typography } from '@mui/material'
import { band } from '../../data/band'
import liveImage from '../../assets/img/live.webp'

export function EnVivo() {
  return (
    <Box id="envivo" component="section" sx={{ py: { xs: 5, md: 8 }, bgcolor: '#000' }}>
      <Stack spacing={4} sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
        <Box
          component="img"
          src={liveImage}
          alt="En vivo"
          sx={{
            width: '100%',
            display: 'block',
            minHeight: { xs: 200, md: 300 },
            objectFit: 'cover',
            bgcolor: '#0d0d0d',
            border: '1px dashed rgba(255,255,255,0.12)',
          }}
        />

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 3, md: 6 }}
          alignItems="flex-start"
        >
          <Box sx={{ flex: { md: '0 0 240px' } }}>
            <Typography
              component="h2"
              sx={{ fontWeight: 700, letterSpacing: '0.2em', fontSize: { xs: '1.5rem', md: '2rem' }, mb: 1 }}
            >
              {band.liveTitle}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)' }}>
              <Link href="#" color="inherit" onClick={(e) => e.preventDefault()} sx={{ cursor: 'default' }}>
                {band.riderHint}
              </Link>
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ mb: 2, color: 'rgba(255,255,255,0.88)' }}>{band.liveLead}</Typography>
            <Stack spacing={2}>
              {band.liveFormats.map((f) => (
                <Box key={f.name}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', mb: 0.5 }}>{f.name}</Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)' }}>{f.text}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Box>
  )
}
