import { Box, Button, Stack, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import coverWaiting from '../../assets/releases/cover/waiting-for-you.webp'
import { waitingForYouPresave as track } from '../../data/presave'

type Countdown = { days: number; hours: number; minutes: number; seconds: number }

function getCountdown(targetMs: number, nowMs: number): Countdown {
  const diff = Math.max(0, targetMs - nowMs)
  const days = Math.floor(diff / 86_400_000)
  const hours = Math.floor((diff % 86_400_000) / 3_600_000)
  const minutes = Math.floor((diff % 3_600_000) / 60_000)
  const seconds = Math.floor((diff % 60_000) / 1000)
  return { days, hours, minutes, seconds }
}

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function CountdownBlock({ value, label }: { value: string; label: string }) {
  return (
    <Box sx={{ textAlign: 'center', minWidth: { xs: 52, sm: 60 } }}>
      <Typography
        component="span"
        sx={{
          display: 'block',
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: { xs: '1.75rem', md: '2.1rem' },
          lineHeight: 1,
          letterSpacing: '0.04em',
          color: '#fff',
        }}
      >
        {value}
      </Typography>
      <Typography
        component="span"
        sx={{
          display: 'block',
          mt: 0.5,
          fontSize: '0.62rem',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.45)',
        }}
      >
        {label}
      </Typography>
    </Box>
  )
}

export function PreSave() {
  const targetMs = new Date(track.releaseAt).getTime()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const { days, hours, minutes, seconds } = getCountdown(targetMs, now)

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
                fontSize: { xs: '0.9rem', md: '0.95rem' },
                lineHeight: 1.5,
                color: 'rgba(255,255,255,0.62)',
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
              alignItems="stretch"
              justifyContent={{ xs: 'center', md: 'flex-start' }}
              divider={
                <Box
                  aria-hidden
                  sx={{
                    width: '1px',
                    alignSelf: 'stretch',
                    bgcolor: 'rgba(255,255,255,0.2)',
                    mx: { xs: 1.25, sm: 1.75 },
                  }}
                />
              }
              sx={{ py: 0.5 }}
              aria-live="polite"
              aria-label="Cuenta regresiva al estreno"
            >
              <CountdownBlock value={pad2(days)} label="Días" />
              <CountdownBlock value={pad2(hours)} label="Horas" />
              <CountdownBlock value={pad2(minutes)} label="Min" />
              <CountdownBlock value={pad2(seconds)} label="Seg" />
            </Stack>

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
