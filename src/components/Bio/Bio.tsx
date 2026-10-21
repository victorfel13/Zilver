import { Box, Button, Dialog, DialogContent, IconButton, Slider, Stack, Typography } from '@mui/material'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { band } from '../../data/band'
import { galleryItems, galleryItemsSourceMode } from '../../data/galleryItemsSource'
import { getYouTubeThumbnailUrl, getYouTubeVideoId } from '../../utils/youtube'

type YouTubePlayer = {
  playVideo: () => void
  pauseVideo: () => void
  mute: () => void
  unMute: () => void
  isMuted: () => boolean
  setVolume: (volume: number) => void
  seekTo: (seconds: number, allowSeekAhead: boolean) => void
  getCurrentTime: () => number
  getDuration: () => number
  destroy: () => void
}

declare global {
  interface Window {
    YT?: { Player: new (...args: unknown[]) => YouTubePlayer }
    onYouTubeIframeAPIReady?: () => void
  }
}

let ytApiPromise: Promise<NonNullable<Window['YT']>> | null = null

function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT)
  if (ytApiPromise) return ytApiPromise

  ytApiPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      previous?.()
      if (window.YT) resolve(window.YT)
    }
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true
    document.head.appendChild(script)
  })
  return ytApiPromise
}

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00'
  const total = Math.floor(seconds)
  const mins = Math.floor(total / 60)
  const secs = total % 60
  return `${mins}:${String(secs).padStart(2, '0')}`
}

const controlPaths = {
  play: 'M8 5v14l11-7z',
  pause: 'M6 4h4v16H6V4zm8 0h4v16h-4V4z',
  replay:
    'M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z',
  volumeOff:
    'M3 9v6h4l5 5V4L7 9H3zm13.59 3L19 9.59 17.59 8.17 15.17 10.6 12.76 8.17 11.34 9.59 13.76 12l-2.42 2.41 1.42 1.42 2.41-2.42 2.42 2.42L19 14.41 16.59 12z',
  volumeUp:
    'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z',
  fullscreen: 'M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z',
} as const

function ControlGlyph({ path }: { path: string }) {
  return (
    <Box component="svg" viewBox="0 0 24 24" aria-hidden sx={{ width: 20, height: 20, fill: 'currentColor', display: 'block' }}>
      <path d={path} />
    </Box>
  )
}

const BIO_VIDEO_URL = 'https://www.youtube.com/watch?v=hYe6BNhS4qU'

/** Datos rápidos para managers / promotores (resumen de la biografía). */
const BIO_FACTS = [
  { label: 'Trayectoria', value: '+15 años', detail: 'en la escena yucateca' },
  { label: 'Origen', value: 'Mérida, Yucatán', detail: 'Sureste mexicano' },
  { label: 'Género', value: 'Indie · Synth rock', detail: 'Alternativo, atmósfera mística' },
] as const

const muted = 'rgba(255,255,255,0.55)'
const hairline = 'rgba(255,255,255,0.12)'

/** Separa la primera oración para destacarla como entrada (el texto no cambia). */
function splitLead(paragraph: string): [string, string] {
  const idx = paragraph.indexOf('. ')
  if (idx === -1) return [paragraph, '']
  return [paragraph.slice(0, idx + 1), paragraph.slice(idx + 2)]
}

type YTState = -1 | 0 | 1 | 2 | 3 | 5

/**
 * Video de YouTube: se monta y reproduce en silencio al entrar en pantalla.
 * Si sale de pantalla mientras suena se pausa, y se reanuda al volver.
 * El usuario activa el sonido con los controles nativos de YouTube.
 */
function BioVideo() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const playerHostRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<YouTubePlayer | null>(null)
  const playerState = useRef<YTState>(-1)
  const autoPaused = useRef(false)
  const noObserver = typeof window !== 'undefined' && !('IntersectionObserver' in window)
  const mountedRef = useRef(noObserver)
  const [shouldPlay, setShouldPlay] = useState(noObserver)
  const [playerReady, setPlayerReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMutedUi, setIsMutedUi] = useState(true)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const videoId = getYouTubeVideoId(BIO_VIDEO_URL)

  useEffect(() => {
    if (!shouldPlay || !videoId) return
    let cancelled = false

    loadYouTubeApi().then((YT) => {
      if (cancelled || !playerHostRef.current) return
      playerRef.current = new YT.Player(playerHostRef.current, {
        videoId,
        host: 'https://www.youtube-nocookie.com',
        width: '100%',
        height: '100%',
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          disablekb: 1,
          iv_load_policy: 3,
        },
        events: {
          onReady: (event: { target: YouTubePlayer }) => {
            event.target.mute()
            event.target.playVideo()
            if (!cancelled) {
              setPlayerReady(true)
              setIsMutedUi(true)
              setDuration(event.target.getDuration() || 0)
            }
          },
          onStateChange: (event: { data: number; target: YouTubePlayer }) => {
            playerState.current = event.data as YTState
            setIsPlaying(event.data === 1)
            setDuration(event.target.getDuration() || 0)
          },
        },
      } as unknown as Record<string, unknown>)
    })

    return () => {
      cancelled = true
      playerRef.current?.destroy()
      playerRef.current = null
      setPlayerReady(false)
    }
  }, [shouldPlay, videoId])

  useEffect(() => {
    if (!playerReady) return
    const id = window.setInterval(() => {
      const player = playerRef.current
      if (!player) return
      setCurrentTime(player.getCurrentTime() || 0)
      setDuration(player.getDuration() || 0)
      setIsMutedUi(player.isMuted())
    }, 500)
    return () => window.clearInterval(id)
  }, [playerReady])

  useEffect(() => {
    if (!videoId) return
    const node = wrapRef.current
    if (!node) return

    if (!('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio >= 0.35
        if (visible) {
          if (!mountedRef.current) {
            mountedRef.current = true
            setShouldPlay(true)
          } else if (autoPaused.current) {
            autoPaused.current = false
            playerRef.current?.playVideo()
          }
        } else if (!entry.isIntersecting && playerState.current === 1) {
          autoPaused.current = true
          playerRef.current?.pauseVideo()
        }
      },
      { threshold: [0, 0.35] },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [videoId])

  if (!videoId) return null

  const togglePlay = () => {
    const player = playerRef.current
    if (!player) return
    if (playerState.current === 1) player.pauseVideo()
    else player.playVideo()
  }

  const toggleMute = () => {
    const player = playerRef.current
    if (!player) return
    if (player.isMuted()) {
      player.unMute()
      player.setVolume(100)
      setIsMutedUi(false)
    } else {
      player.mute()
      setIsMutedUi(true)
    }
  }

  const handleSeek = (_event: Event, value: number | number[]) => {
    const seconds = Array.isArray(value) ? (value[0] ?? 0) : value
    setCurrentTime(seconds)
    playerRef.current?.seekTo(seconds, true)
  }

  const toggleFullscreen = () => {
    wrapRef.current?.requestFullscreen?.().catch(() => {})
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 1.25 }}
      >
        <Stack direction="row" alignItems="center" spacing={1} sx={{ whiteSpace: 'nowrap' }}>
          <Box
            aria-hidden
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: '#ff3b3b',
              boxShadow: '0 0 0 4px rgba(255,59,59,0.18)',
              animation: shouldPlay ? 'zilverPulse 1.8s ease-in-out infinite' : 'none',
              '@keyframes zilverPulse': {
                '0%, 100%': { opacity: 1 },
                '50%': { opacity: 0.35 },
              },
            }}
          />
          <Typography sx={{ fontSize: { xs: '0.62rem', sm: '0.68rem' }, fontWeight: 600, letterSpacing: { xs: '0.16em', sm: '0.22em' }, color: '#fff' }}>
            CONOCE A ZILVER
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.75} sx={{ color: muted, whiteSpace: 'nowrap' }}>
          <Box component="svg" viewBox="0 0 24 24" aria-hidden sx={{ width: 14, height: 14, fill: 'currentColor' }}>
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.59 3L19 9.59 17.59 8.17 15.17 10.6 12.76 8.17 11.34 9.59 13.76 12l-2.42 2.41 1.42 1.42 2.41-2.42 2.42 2.42L19 14.41 16.59 12z" />
          </Box>
          <Typography sx={{ fontSize: { xs: '0.58rem', sm: '0.62rem' }, letterSpacing: '0.12em' }}>
            ACTIVA EL SONIDO
          </Typography>
        </Stack>
      </Stack>

      <Box
        ref={wrapRef}
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          bgcolor: '#0d0d0d',
          border: `1px solid ${hairline}`,
          borderRadius: '4px',
          overflow: 'hidden',
          boxShadow: '0 30px 80px -30px rgba(255,255,255,0.18), 0 0 0 1px rgba(0,0,0,0.6)',
        }}
      >
        {shouldPlay ? (
          <Box
            ref={playerHostRef}
            sx={{
              position: 'absolute',
              inset: 0,
              '& iframe': { width: '100%', height: '100%', display: 'block', border: 0 },
            }}
          />
        ) : (
          <>
            <Box
              component="img"
              src={getYouTubeThumbnailUrl(videoId, 'hq')}
              alt=""
              loading="lazy"
              sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            <Box
              aria-hidden
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(0,0,0,0.35)',
              }}
            >
              <Typography
                component="span"
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  bgcolor: 'rgba(0,0,0,0.6)',
                  border: '1px solid rgba(255,255,255,0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem',
                  pl: '4px',
                  color: '#fff',
                }}
              >
                ▶
              </Typography>
            </Box>
          </>
        )}
      </Box>

      <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1 }} sx={{ mt: 1.25, px: 0.25 }}>
        <IconButton
          type="button"
          onClick={togglePlay}
          disabled={!playerReady}
          aria-label={isPlaying ? 'Pausar video' : 'Reproducir video'}
          sx={{ color: '#fff', '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)' } }}
        >
          <ControlGlyph path={isPlaying ? controlPaths.pause : controlPaths.play} />
        </IconButton>
        <IconButton
          type="button"
          onClick={() => playerRef.current?.seekTo(0, true)}
          disabled={!playerReady}
          aria-label="Reiniciar video"
          sx={{ color: '#fff', '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)' } }}
        >
          <ControlGlyph path={controlPaths.replay} />
        </IconButton>
        <IconButton
          type="button"
          onClick={toggleMute}
          disabled={!playerReady}
          aria-label={isMutedUi ? 'Activar sonido' : 'Silenciar video'}
          sx={{ color: '#fff', '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)' } }}
        >
          <ControlGlyph path={isMutedUi ? controlPaths.volumeOff : controlPaths.volumeUp} />
        </IconButton>

        <Typography sx={{ fontSize: '0.7rem', color: muted, whiteSpace: 'nowrap', minWidth: 76, textAlign: 'center' }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </Typography>

        <Slider
          value={Math.min(currentTime, duration || 0)}
          min={0}
          max={duration || 0}
          step={0.1}
          onChange={handleSeek}
          disabled={!playerReady || duration <= 0}
          aria-label="Progreso del video"
          sx={{
            flex: 1,
            color: '#fff',
            height: 4,
            '& .MuiSlider-thumb': { width: 12, height: 12 },
            '& .MuiSlider-rail': { opacity: 0.28 },
          }}
        />

        <IconButton
          type="button"
          onClick={toggleFullscreen}
          disabled={!playerReady}
          aria-label="Pantalla completa"
          sx={{ color: '#fff', '&.Mui-disabled': { color: 'rgba(255,255,255,0.3)' } }}
        >
          <ControlGlyph path={controlPaths.fullscreen} />
        </IconButton>
      </Stack>
    </Box>
  )
}

function BioGalleryAside() {
  const items = galleryItems
  const [index, setIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const maxIdx = useMemo(() => Math.max(0, items.length - 1), [items.length])
  /** Índice seguro aunque el estado quede desfasado al cambiar el número de fotos */
  const i = useMemo(() => Math.min(Math.max(0, index), maxIdx), [index, maxIdx])

  const goPrev = useCallback(
    () =>
      setIndex((prev) => {
        const cur = Math.min(Math.max(0, prev), maxIdx)
        return Math.max(0, cur - 1)
      }),
    [maxIdx],
  )
  const goNext = useCallback(
    () =>
      setIndex((prev) => {
        const cur = Math.min(Math.max(0, prev), maxIdx)
        return Math.min(maxIdx, cur + 1)
      }),
    [maxIdx],
  )

  if (items.length === 0) {
    return (
      <Box
        sx={{
          aspectRatio: '3 / 4',
          bgcolor: '#0d0d0d',
          border: '1px dashed rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 1.5,
        }}
      >
        <Typography
          sx={{
            textAlign: 'center',
            fontSize: '0.7rem',
            lineHeight: 1.5,
            color: 'rgba(255,255,255,0.45)',
          }}
        >
          {galleryItemsSourceMode === 'api'
            ? 'Modo API: conecta fetchGalleryItems en Bio.'
            : 'Añade .webp en src/assets/galery y recarga Vite.'}
        </Typography>
      </Box>
    )
  }

  const current = items[i]
  const canPrev = i > 0
  const canNext = i < maxIdx

  const navBtnSx = {
    position: 'absolute' as const,
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 1,
    bgcolor: 'rgba(0,0,0,0.5)',
    color: '#fff',
    width: 36,
    height: 36,
    '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
    '&.Mui-disabled': { opacity: 0.25, color: '#fff' },
  }

  return (
    <Stack spacing={1.25}>
      <Box
        tabIndex={0}
        role="region"
        aria-label={`Galería, imagen ${i + 1} de ${items.length}`}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') {
            e.preventDefault()
            if (canPrev) goPrev()
          }
          if (e.key === 'ArrowRight') {
            e.preventDefault()
            if (canNext) goNext()
          }
        }}
        sx={{
          outline: 'none',
          borderRadius: 1,
          '&:focus-visible': {
            boxShadow: (theme) => `0 0 0 2px ${theme.palette.primary.main}`,
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            aspectRatio: '4 / 3',
            bgcolor: '#0d0d0d',
            border: '1px solid rgba(255,255,255,0.1)',
            overflow: 'hidden',
            borderRadius: 1,
          }}
        >
          <Box
            component="img"
            src={current.src}
            alt=""
            onClick={() => setLightboxOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setLightboxOpen(true)
              }
            }}
            tabIndex={0}
            role="button"
            aria-label="Ampliar imagen"
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'center',
              display: 'block',
              cursor: 'pointer',
              '&:focus-visible': { outline: '2px solid rgba(255,255,255,0.5)', outlineOffset: 2 },
            }}
          />
          <IconButton
            size="small"
            aria-label="Imagen anterior"
            disabled={!canPrev}
            onClick={(e) => {
              e.stopPropagation()
              goPrev()
            }}
            sx={{ ...navBtnSx, left: 6 }}
          >
            <Typography component="span" sx={{ fontSize: '1.5rem', lineHeight: 1, mt: '-2px' }}>
              ‹
            </Typography>
          </IconButton>
          <IconButton
            size="small"
            aria-label="Imagen siguiente"
            disabled={!canNext}
            onClick={(e) => {
              e.stopPropagation()
              goNext()
            }}
            sx={{ ...navBtnSx, right: 6 }}
          >
            <Typography component="span" sx={{ fontSize: '1.5rem', lineHeight: 1, mt: '-2px' }}>
              ›
            </Typography>
          </IconButton>
        </Box>
      </Box>

      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
        <Typography
          sx={{
            fontSize: '0.65rem',
            letterSpacing: '0.12em',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          {i + 1} / {items.length}
        </Typography>
        <Stack direction="row" spacing={0.5} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {items.map((item, dot) => (
            <Box
              key={item.id}
              onClick={() => setIndex(dot)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setIndex(dot)
                }
              }}
              aria-label={`Ir a la imagen ${dot + 1}`}
              aria-current={dot === i ? 'true' : undefined}
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                cursor: 'pointer',
                bgcolor: dot === i ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.25)',
                transition: 'background-color 0.2s',
                '&:hover': { bgcolor: dot === i ? '#fff' : 'rgba(255,255,255,0.45)' },
              }}
            />
          ))}
        </Stack>
      </Stack>

      <Dialog
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        maxWidth={false}
        slotProps={{
          backdrop: { sx: { bgcolor: 'rgba(0,0,0,0.88)' } },
        }}
        PaperProps={{
          sx: {
            bgcolor: 'transparent',
            boxShadow: 'none',
            m: { xs: 1, sm: 2 },
            maxWidth: 'min(96vw, 1400px)',
            maxHeight: 'calc(100vh - 16px)',
            overflow: 'visible',
          },
        }}
      >
        <DialogContent
          sx={{
            position: 'relative',
            p: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <IconButton
            aria-label="Cerrar"
            onClick={() => setLightboxOpen(false)}
            sx={{
              position: 'absolute',
              top: { xs: 4, sm: 8 },
              right: { xs: 4, sm: 8 },
              zIndex: 2,
              color: '#fff',
              bgcolor: 'rgba(0,0,0,0.55)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.75)' },
            }}
          >
            <Typography component="span" sx={{ fontSize: '1.35rem', lineHeight: 1, px: 0.25 }}>
              ×
            </Typography>
          </IconButton>
          <Box
            component="img"
            src={current.src}
            alt=""
            sx={{
              maxWidth: '100%',
              maxHeight: 'min(88vh, 1200px)',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
              borderRadius: 1,
            }}
          />
        </DialogContent>
      </Dialog>
    </Stack>
  )
}

const scrollAnchorSx = { scrollMarginTop: { xs: '72px', sm: '100px' } } as const

/** Galería / carrusel de la bio — oculto por ahora; poner `true` para reactivar. */
const SHOW_BIO_GALLERY = false

function BioFacts() {
  return (
    <Box
      component="dl"
      sx={{
        m: 0,
        display: 'grid',
        gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(3, 1fr)' },
        borderTop: `1px solid ${hairline}`,
        borderLeft: { md: `1px solid ${hairline}` },
      }}
    >
      {BIO_FACTS.map((f, idx) => (
        <Box
          key={f.label}
          sx={{
            p: { xs: 2, md: 3 },
            borderBottom: `1px solid ${hairline}`,
            borderRight: {
              xs: idx % 2 === 0 ? `1px solid ${hairline}` : 'none',
              md: `1px solid ${hairline}`,
            },
            transition: 'background-color 0.25s',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' },
          }}
        >
          <Typography
            component="dt"
            sx={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.24em', color: muted, mb: 1, textTransform: 'uppercase' }}
          >
            {f.label}
          </Typography>
          <Typography
            component="dd"
            sx={{ m: 0, fontWeight: 700, fontSize: { xs: '0.95rem', md: '1.1rem' }, lineHeight: 1.25, color: '#fff' }}
          >
            {f.value}
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: '0.72rem', lineHeight: 1.45, color: 'rgba(255,255,255,0.6)' }}>
            {f.detail}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

export function Bio() {
  const paragraphs: readonly string[] = band.bioParagraphs
  const [lead, body] = splitLead(paragraphs[0] ?? '')
  const rest = paragraphs.slice(1)

  return (
    <Box
      id="bio"
      component="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        py: { xs: 6, md: 11 },
        bgcolor: '#000',
        backgroundImage:
          'radial-gradient(ellipse 60% 50% at 85% 20%, rgba(255,255,255,0.07), transparent 70%), radial-gradient(ellipse 40% 40% at 0% 100%, rgba(255,255,255,0.04), transparent 70%)',
        ...scrollAnchorSx,
      }}
    >
      {/* Marca de agua */}
      <Typography
        aria-hidden
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          top: { md: 24 },
          right: -20,
          fontFamily: '"Bebas Neue", sans-serif',
          fontSize: 'clamp(9rem, 18vw, 17rem)',
          lineHeight: 0.8,
          letterSpacing: '0.04em',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,0.06)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        {band.name.toUpperCase()}
      </Typography>

      <Box
        sx={{
          position: 'relative',
          maxWidth: 1560,
          mx: 'auto',
          pl: { xs: 2, md: 'clamp(24px, 4vw, 64px)' },
          pr: { xs: 2, md: 'clamp(96px, 8vw, 136px)' },
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 0.82fr) minmax(0, 1.38fr)' },
            gridTemplateAreas: {
              xs: '"head" "video" "text"',
              md: '"head video" "text video"',
            },
            columnGap: { md: 7 },
            rowGap: { xs: 3.5, md: 3 },
            alignItems: 'start',
          }}
        >
          {/* Encabezado */}
          <Box sx={{ gridArea: 'head' }}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
              <Box aria-hidden sx={{ width: 32, height: '1px', bgcolor: 'rgba(255,255,255,0.6)' }} />
              <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.28em', color: muted }}>
                PRESS KIT · {band.city.toUpperCase()}
              </Typography>
            </Stack>
            <Typography
              component="h2"
              sx={{ fontWeight: 700, letterSpacing: '0.2em', fontSize: { xs: '1.75rem', md: '2.4rem' }, lineHeight: 1.1 }}
            >
              {band.bioTitle}
            </Typography>
          </Box>

          {/* Video */}
          <Box sx={{ gridArea: 'video', mt: { md: 1 } }}>
            <BioVideo />
          </Box>

          {/* Texto */}
          <Stack component="article" spacing={2.25} sx={{ gridArea: 'text', minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                fontWeight: 500,
                lineHeight: 1.5,
                color: '#fff',
                pl: 2,
                borderLeft: '2px solid #fff',
              }}
            >
              {lead}
            </Typography>
            {body ? (
              <Typography sx={{ fontSize: { xs: '0.95rem', md: '1rem' }, lineHeight: 1.85, color: 'rgba(255,255,255,0.78)' }}>
                {body}
              </Typography>
            ) : null}
            {rest.map((p) => (
              <Typography
                key={p.slice(0, 24)}
                sx={{ fontSize: { xs: '0.95rem', md: '1rem' }, lineHeight: 1.85, color: 'rgba(255,255,255,0.78)' }}
              >
                {p}
              </Typography>
            ))}

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ pt: 1 }}>
              <Button
                href="#contacto"
                disableElevation
                variant="contained"
                sx={{
                  bgcolor: '#fff',
                  color: '#000',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  fontSize: '0.72rem',
                  px: 3,
                  py: 1.4,
                  borderRadius: '2px',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.85)' },
                }}
              >
                Booking / Contacto
              </Button>
              <Button
                href="#envivo"
                variant="outlined"
                sx={{
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.35)',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  fontSize: '0.72rem',
                  px: 3,
                  py: 1.4,
                  borderRadius: '2px',
                  '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.06)' },
                }}
              >
                Formatos en vivo
              </Button>
            </Stack>
          </Stack>
        </Box>

        <Box sx={{ mt: { xs: 5, md: 8 } }}>
          <BioFacts />
        </Box>

        {SHOW_BIO_GALLERY ? (
          <Box id="galeria" component="aside" aria-label="Galería" sx={{ ...scrollAnchorSx, mt: 6, maxWidth: 520 }}>
            <BioGalleryAside />
          </Box>
        ) : null}
      </Box>
    </Box>
  )
}
