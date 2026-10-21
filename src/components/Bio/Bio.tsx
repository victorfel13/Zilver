import { Box, Dialog, DialogContent, IconButton, Stack, Typography } from '@mui/material'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { band } from '../../data/band'
import { galleryItems, galleryItemsSourceMode } from '../../data/galleryItemsSource'
import { getYouTubeEmbedSrc, getYouTubeThumbnailUrl, getYouTubeVideoId } from '../../utils/youtube'

const BIO_VIDEO_URL = 'https://www.youtube.com/watch?v=hYe6BNhS4qU'

function BioVideo() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [shouldPlay, setShouldPlay] = useState(false)
  const videoId = getYouTubeVideoId(BIO_VIDEO_URL)

  useEffect(() => {
    if (!videoId || shouldPlay) return
    const node = wrapRef.current
    if (!node) return

    if (!('IntersectionObserver' in window)) {
      setShouldPlay(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldPlay(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [videoId, shouldPlay])

  if (!videoId) return null

  return (
    <Box sx={{ mt: 1, width: '100%' }}>
      <Box
        ref={wrapRef}
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 9',
          bgcolor: '#0d0d0d',
          border: '1px solid rgba(255,255,255,0.12)',
          overflow: 'hidden',
        }}
      >
        {shouldPlay ? (
          <Box
            component="iframe"
            src={getYouTubeEmbedSrc(videoId, true, true)}
            title="Video de Zilver"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              border: 0,
              display: 'block',
            }}
          />
        ) : (
          <>
            <Box
              component="img"
              src={getYouTubeThumbnailUrl(videoId, 'hq')}
              alt=""
              loading="lazy"
              sx={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <Box
              aria-hidden
              sx={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(0,0,0,0.28)',
              }}
            >
              <Typography
                component="span"
                sx={{
                  width: 58,
                  height: 58,
                  borderRadius: '50%',
                  bgcolor: 'rgba(0,0,0,0.62)',
                  border: '1px solid rgba(255,255,255,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.35rem',
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
      <Typography sx={{ mt: 1, fontSize: '0.68rem', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.45)' }}>
        El video comienza automáticamente en silencio al llegar a esta parte; activa el sonido desde los controles de YouTube.
      </Typography>
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

export function Bio() {
  return (
    <Box
      id="bio"
      component="section"
      sx={{ py: { xs: 5, md: 8 }, bgcolor: '#000', ...scrollAnchorSx }}
    >
      <Box
        sx={{
          maxWidth: SHOW_BIO_GALLERY ? 1200 : 720,
          mx: 'auto',
          px: 2,
          display: 'flex',
          flexDirection: { xs: 'column', sm: SHOW_BIO_GALLERY ? 'row' : 'column' },
          flexWrap: 'nowrap',
          alignItems: 'flex-start',
          gap: { xs: 3, sm: 4, md: 6 },
        }}
      >
        {SHOW_BIO_GALLERY ? (
          <Box
            id="galeria"
            component="aside"
            aria-label="Galería"
            sx={{
              ...scrollAnchorSx,
              width: { xs: '100%', sm: '40%' },
              minWidth: { sm: 260 },
              maxWidth: { sm: 440 },
              flexShrink: 0,
              pr: { sm: 2 },
              borderRight: { sm: '1px solid rgba(255,255,255,0.1)' },
            }}
          >
            <BioGalleryAside />
          </Box>
        ) : null}

        <Stack
          component="article"
          spacing={0}
          sx={{
            flex: '1 1 auto',
            minWidth: 0,
            width: '100%',
          }}
        >
          <Typography
            component="h2"
            sx={{
              fontWeight: 700,
              letterSpacing: '0.2em',
              fontSize: { xs: '1.5rem', md: '2rem' },
              mb: 2,
            }}
          >
            {band.bioTitle}
          </Typography>
          {band.bioParagraphs.map((p) => (
            <Typography
              key={p.slice(0, 24)}
              sx={{
                textAlign: 'justify',
                mb: 2,
                color: 'rgba(255,255,255,0.88)',
              }}
            >
              {p}
            </Typography>
          ))}
          <BioVideo />
        </Stack>
      </Box>
    </Box>
  )
}
