import { Box, Button, Dialog, DialogContent, IconButton, Stack, Typography } from '@mui/material'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { band } from '../../data/band'
import { galleryItems, galleryItemsSourceMode } from '../../data/galleryItemsSource'
import { getYouTubeEmbedSrc, getYouTubeThumbnailUrl, getYouTubeVideoId } from '../../utils/youtube'

const BIO_VIDEO_URL = 'https://www.youtube.com/watch?v=hYe6BNhS4qU'

/** Datos rápidos para managers / promotores (resumen de la biografía). */
const BIO_FACTS = [
  { label: 'Trayectoria', value: '+15 años', detail: 'en la escena yucateca' },
  { label: 'Origen', value: 'Mérida, Yucatán', detail: 'Sureste mexicano' },
  { label: 'Género', value: 'Indie · Synth rock', detail: 'Alternativo, atmósfera mística' },
  { label: 'Para fans de', value: 'Siddhartha', detail: 'New Order · Depeche Mode' },
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
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const playerState = useRef<YTState>(-1)
  const autoPaused = useRef(false)
  const noObserver = typeof window !== 'undefined' && !('IntersectionObserver' in window)
  const mountedRef = useRef(noObserver)
  const [shouldPlay, setShouldPlay] = useState(noObserver)
  const videoId = getYouTubeVideoId(BIO_VIDEO_URL)

  const command = useCallback((func: 'playVideo' | 'pauseVideo') => {
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'command', func, args: [] }), '*')
  }, [])

  // Escucha el estado del reproductor (enablejsapi=1)
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!/^https:\/\/www\.youtube(-nocookie)?\.com$/.test(e.origin)) return
      if (e.source !== iframeRef.current?.contentWindow) return
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
        const state = data?.info?.playerState
        if (typeof state === 'number') playerState.current = state as YTState
      } catch {
        /* mensaje ajeno */
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

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
            command('playVideo')
          }
        } else if (!entry.isIntersecting && playerState.current === 1) {
          autoPaused.current = true
          command('pauseVideo')
        }
      },
      { threshold: [0, 0.35] },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [videoId, command])

  if (!videoId) return null

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const src = `${getYouTubeEmbedSrc(videoId, true, true)}&enablejsapi=1&origin=${encodeURIComponent(origin)}`

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
            component="iframe"
            ref={iframeRef}
            src={src}
            title="Video de Zilver"
            onLoad={() =>
              iframeRef.current?.contentWindow?.postMessage(JSON.stringify({ event: 'listening', id: 'zilver-bio' }), '*')
            }
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0, display: 'block' }}
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
        gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
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

      <Box sx={{ position: 'relative', maxWidth: 1200, mx: 'auto', px: 2 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 5fr) minmax(0, 7fr)' },
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
