import { Box, IconButton, Stack, Tooltip } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { band } from '../data/band'

function IconInstagram() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8C2 4.6 4.6 2 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
    </svg>
  )
}

function IconSpotify() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <g fill="none" stroke="#050505" strokeLinecap="round">
        <path d="M6.9 9.7c3.4-1 7-.7 10.1 1" strokeWidth="1.7" />
        <path d="M7.2 12.7c2.8-.8 5.7-.5 8.2 1" strokeWidth="1.5" />
        <path d="M7.5 15.5c2.2-.6 4.5-.4 6.5.7" strokeWidth="1.3" />
      </g>
    </svg>
  )
}

function IconYouTube() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
    </svg>
  )
}

function IconBandcamp() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M2.18 15.81 5.06 8.19h16.76l-2.88 7.62H2.18Zm8.66-6.31c-.42-.17-.94-.26-1.58-.26H6.34l-.93 2.47h2.9c.5 0 .9-.08 1.19-.24.29-.17.49-.44.6-.8.09-.31.05-.58-.1-.8-.14-.18-.48-.3-1.16-.37Z" />
    </svg>
  )
}

function IconLinktree() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1ZM8 13h8v-2H8v2Zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5Z" />
    </svg>
  )
}

export const socialLinks = [
  { key: 'instagram', href: band.socialUrls.instagram, label: 'Instagram de Zilver', Icon: IconInstagram },
  { key: 'spotify', href: band.socialUrls.spotify, label: 'Spotify de Zilver', Icon: IconSpotify },
  { key: 'youtube', href: band.socialUrls.youtube, label: 'YouTube de Zilver', Icon: IconYouTube },
  { key: 'bandcamp', href: 'https://zilver.bandcamp.com/', label: 'Bandcamp de Zilver', Icon: IconBandcamp },
  { key: 'linktree', href: band.linktree, label: 'Linktree — todas las redes de Zilver', Icon: IconLinktree },
] as const

type SocialLinksProps = {
  overlay?: boolean
  direction?: 'row' | 'column'
  compact?: boolean
}

export function SocialLinks({ overlay = false, direction = 'row', compact = false }: SocialLinksProps) {
  return (
    <Stack direction={direction} spacing={0.25} alignItems="center" aria-label="Redes sociales de Zilver">
      {socialLinks.map(({ key, href, label, Icon }) => (
        <Tooltip key={key} title={label.replace(' de Zilver', '')} arrow>
          <IconButton
            component="a"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            size="medium"
            sx={{
              color: overlay ? '#fff' : 'rgba(255,255,255,0.85)',
              fontSize: compact
                ? '1.3rem'
                : overlay
                  ? { xs: '1.2rem', sm: '1.5rem', md: '1.75rem', lg: '2rem' }
                  : '1.375rem',
              width: compact ? 36 : overlay ? { xs: 38, sm: 48, md: 56, lg: 64 } : 42,
              height: compact ? 36 : overlay ? { xs: 38, sm: 48, md: 56, lg: 64 } : 42,
              '&:hover': {
                color: '#fff',
                bgcolor: 'rgba(255,255,255,0.16)',
              },
            }}
          >
            <Icon />
          </IconButton>
        </Tooltip>
      ))}
    </Stack>
  )
}

export function FloatingSocials() {
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))

  if (!isMdUp) return null

  return (
    <Box
      sx={{
        position: 'fixed',
        zIndex: 1100,
        top: '50%',
        right: { md: 22, lg: 30 },
        transform: 'translateY(-50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 0.7,
        py: 1,
        bgcolor: 'rgba(0,0,0,0.58)',
        border: '1px solid rgba(255,255,255,0.24)',
        borderRadius: 999,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.35)',
      }}
    >
      <SocialLinks overlay direction="column" />
    </Box>
  )
}
