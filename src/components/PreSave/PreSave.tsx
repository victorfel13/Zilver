import { Box, Button, Stack, Typography } from '@mui/material'
import coverWaiting from '../../assets/releases/cover/waiting-for-you.webp'
import { waitingForYouPresave as track } from '../../data/presave'

export function PreSave() {
  const btnBase = {
    flex: 1,
    minWidth: 0,
    borderRadius: 0,
    py: 1.15,
    px: 2,
    fontFamily: '"Bebas Neue", sans-serif',
    fontSize: '1.05rem',
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
  }

  return (
    <Box
      id="estreno"
      component="section"
      sx={{
        scrollMarginTop: { xs: '72px', sm: '96px' },
        py: { xs: 5, md: 7 },
        bgcolor: '#000',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <Box sx={{ maxWidth: 920, mx: 'auto', px: { xs: 2, md: 3 } }}>
        <Typography
          component="h2"
          align="center"
          sx={{
            m: 0,
            mb: { xs: 3, md: 4 },
            fontWeight: 500,
            letterSpacing: '0.28em',
            fontSize: { xs: '0.85rem', md: '0.95rem' },
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.88)',
          }}
        >
          {track.eyebrow}
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 340px) 1px minmax(0, 1fr)' },
            columnGap: { md: 4 },
            rowGap: 3,
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: { xs: 280, sm: 320, md: 'none' },
              mx: { xs: 'auto', md: 0 },
              aspectRatio: '1',
              bgcolor: '#fff',
              overflow: 'hidden',
            }}
          >
            <Box
              component="img"
              src={coverWaiting}
              alt={`Portada — ${track.artist} · ${track.title}`}
              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </Box>

          <Box
            aria-hidden
            sx={{
              display: { xs: 'none', md: 'block' },
              alignSelf: 'stretch',
              bgcolor: 'rgba(255,255,255,0.18)',
              width: 1,
            }}
          />

          <Stack
            spacing={1.75}
            sx={{
              textAlign: { xs: 'center', md: 'left' },
              alignItems: { xs: 'center', md: 'stretch' },
              maxWidth: { xs: 360, md: 'none' },
              mx: { xs: 'auto', md: 0 },
            }}
          >
            <Typography
              sx={{
                m: 0,
                fontSize: '0.68rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              {track.kicker}
            </Typography>

            <Typography
              component="p"
              sx={{
                m: 0,
                fontFamily: '"Bebas Neue", sans-serif',
                fontSize: { xs: '2.35rem', md: '3rem' },
                letterSpacing: '0.04em',
                lineHeight: 0.95,
                color: '#fff',
              }}
            >
              {track.title}
            </Typography>

            <Typography
              sx={{
                m: 0,
                maxWidth: 380,
                fontSize: { xs: '0.95rem', md: '1.05rem' },
                lineHeight: 1.5,
                color: 'rgba(255,255,255,0.72)',
              }}
            >
              {track.blurb}
            </Typography>

            <Typography
              sx={{
                m: 0,
                pt: 0.5,
                fontSize: '0.68rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              {track.availableLabel}
            </Typography>

            <Stack
              direction="row"
              spacing={1.25}
              sx={{ pt: 0.5, width: '100%', maxWidth: { xs: 340, md: 380 } }}
            >
              <Button
                component="a"
                href={track.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  ...btnBase,
                  bgcolor: '#fff',
                  color: '#000',
                  border: '1px solid #fff',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.88)' },
                }}
              >
                {track.ctaLabel}
              </Button>
              <Button
                component="a"
                href={track.bandcampUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  ...btnBase,
                  bgcolor: 'transparent',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.65)',
                  '&:hover': {
                    borderColor: '#fff',
                    bgcolor: 'rgba(255,255,255,0.06)',
                  },
                }}
              >
                {track.bandcampLabel}
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
