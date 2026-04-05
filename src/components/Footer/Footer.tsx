import { Box, IconButton, Stack, Typography } from '@mui/material'
import { band } from '../../data/band'

const iconSx = {
  color: 'rgba(255,255,255,0.85)',
  '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.06)' },
}

function IconInstagram() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
    </svg>
  )
}

function IconSpotify() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2m4.3 14.4c-.2 0-.4-.1-.6-.2-1.6-.9-3.6-1.4-5.7-1.4-.9 0-1.9.1-2.8.2h-.1c-.3 0-.6-.3-.6-.6v-.2c0-.4.2-.6.5-.7 1-.2 2-.3 3-.3 2.3 0 4.6.6 6.4 1.6.3.2.5.5.5.9 0 .3-.2.6-.5.7h-.1zm.8-3.1c-.2 0-.5-.1-.7-.2-1.8-1.1-4.2-1.7-6.8-1.7-1 0-2.1.1-3 .3-.4.1-.7.4-.7.8 0 .4.3.7.7.8.8.2 1.7.3 2.6.3 2.4 0 4.6-.6 6.2-1.5.4-.2.6-.6.6-1 0-.4-.2-.7-.5-.8h-.4zm.9-3.3c-2-1.2-4.7-1.8-7.5-1.8-1.1 0-2.2.1-3.3.4-.5.1-.8.6-.8 1.1 0 .5.3.9.8 1 1 .3 2.1.4 3.2.4 2.6 0 5-.5 6.7-1.5.5-.3.8-.8.8-1.3 0-.5-.3-1-.8-1.2l-.1-.1z" />
    </svg>
  )
}

function IconYouTube() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
    </svg>
  )
}

const social = [
  { key: 'instagram', href: band.socialUrls.instagram, label: 'Instagram', Icon: IconInstagram },
  { key: 'spotify', href: band.socialUrls.spotify, label: 'Spotify', Icon: IconSpotify },
  { key: 'youtube', href: band.socialUrls.youtube, label: 'YouTube', Icon: IconYouTube },
] as const

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
        <Stack direction="row" spacing={0.5} justifyContent="center" flexWrap="wrap" useFlexGap>
          {social.map(({ key, href, label, Icon }) => (
            <IconButton
              key={key}
              component="a"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              size="medium"
              sx={iconSx}
            >
              <Icon />
            </IconButton>
          ))}
        </Stack>

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
