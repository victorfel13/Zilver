import { Box, Dialog, DialogContent, IconButton, Stack, Typography } from '@mui/material'
import { useCallback, useState } from 'react'
import { usePlayback } from '../../context/PlaybackContext'
import { videoFeatured, videoTiles } from '../../data/videos'
import { getYouTubeEmbedSrc, getYouTubeThumbnailUrl, getYouTubeVideoId } from '../../utils/youtube'

type ModalState = { videoId: string; title: string } | null

function VideoThumb({
  label,
  url,
  tall,
  onOpen,
}: {
  label: string
  url: string
  tall?: boolean
  onOpen: (url: string, title: string) => void
}) {
  const id = getYouTubeVideoId(url)
  const thumbUrl = id ? getYouTubeThumbnailUrl(id, 'hq') : null

  return (
    <Box
      component="button"
      type="button"
      onClick={() => onOpen(url, label)}
      sx={{
        position: 'relative',
        display: 'block',
        width: '100%',
        height: tall ? '100%' : undefined,
        minHeight: tall ? { xs: 200, md: 120 } : { xs: 100, md: 120 },
        p: 0,
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 1,
        cursor: 'pointer',
        overflow: 'hidden',
        bgcolor: '#141414',
        textAlign: 'left',
        '&:hover': {
          borderColor: 'rgba(255,255,255,0.22)',
          '& .video-thumb__play': { opacity: 1 },
        },
        '&:focus-visible': {
          outline: '2px solid rgba(255,255,255,0.45)',
          outlineOffset: 2,
        },
      }}
    >
      {thumbUrl ? (
        <Box
          component="img"
          src={thumbUrl}
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
      ) : null}

      <Box
        className="video-thumb__play"
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: thumbUrl ? 'rgba(0,0,0,0.35)' : 'transparent',
          opacity: thumbUrl ? 0.85 : 1,
          transition: 'opacity 0.2s',
        }}
        aria-hidden
      >
        <Typography
          component="span"
          sx={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            bgcolor: 'rgba(0,0,0,0.55)',
            border: '1px solid rgba(255,255,255,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            pl: '3px',
            color: '#fff',
          }}
        >
          ▶
        </Typography>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          px: 1,
          py: 0.75,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
        }}
      >
        <Typography
          sx={{
            fontSize: tall ? '0.8rem' : '0.62rem',
            fontWeight: 600,
            letterSpacing: '0.06em',
            color: '#fff',
            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
          }}
        >
          {label}
        </Typography>
      </Box>
    </Box>
  )
}

export function Videos() {
  const { pauseAudio } = usePlayback()
  const [a, b, c] = videoTiles
  const [modal, setModal] = useState<ModalState>(null)

  const handleOpenVideo = useCallback(
    (url: string, title: string) => {
      pauseAudio()
      const id = getYouTubeVideoId(url)
      if (id) {
        setModal({ videoId: id, title })
        return
      }
      window.open(url, '_blank', 'noopener,noreferrer')
    },
    [pauseAudio],
  )

  const handleCloseModal = useCallback(() => {
    setModal(null)
  }, [])

  return (
    <Box id="videos" component="section" sx={{ py: { xs: 5, md: 8 }, bgcolor: '#000' }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 3, md: 5 }}
        sx={{ maxWidth: 1200, mx: 'auto', px: 2, alignItems: 'flex-start' }}
      >
        <Box sx={{ flex: { md: '0 0 240px' } }}>
          <Typography
            component="h2"
            sx={{ fontWeight: 700, letterSpacing: '0.15em', fontSize: { xs: '1.5rem', md: '2rem' }, mb: 1 }}
          >
            VIDEOS OFICIALES
          </Typography>
          <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)' }}>
            Pulsa una miniatura para ver el vídeo en una ventana emergente.
          </Typography>
        </Box>

        <Box
          sx={{
            flex: 1,
            width: '100%',
            display: 'grid',
            gap: 1,
            gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr minmax(140px, 30%)' },
            gridTemplateRows: { md: 'minmax(112px, auto) minmax(112px, auto)' },
            gridTemplateAreas: {
              xs: `
                "va vb"
                "vf vf"
                "vc vc"
              `,
              md: `
                "va vb vf"
                "vc vc vf"
              `,
            },
            alignItems: 'stretch',
          }}
        >
          {a ? (
            <Box sx={{ gridArea: 'va', minWidth: 0 }}>
              <VideoThumb label={a.label} url={a.url} onOpen={handleOpenVideo} />
            </Box>
          ) : null}
          {b ? (
            <Box sx={{ gridArea: 'vb', minWidth: 0 }}>
              <VideoThumb label={b.label} url={b.url} onOpen={handleOpenVideo} />
            </Box>
          ) : null}
          {c ? (
            <Box sx={{ gridArea: 'vc', minWidth: 0 }}>
              <VideoThumb label={c.label} url={c.url} onOpen={handleOpenVideo} />
            </Box>
          ) : null}
          <Box
            sx={{
              gridArea: 'vf',
              display: 'flex',
              flexDirection: 'column',
              minHeight: { xs: 200, md: 0 },
              alignSelf: 'stretch',
            }}
          >
            <VideoThumb label={videoFeatured.label} url={videoFeatured.url} tall onOpen={handleOpenVideo} />
          </Box>
        </Box>
      </Stack>

      <Dialog
        open={Boolean(modal)}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        slotProps={{
          backdrop: { sx: { bgcolor: 'rgba(0,0,0,0.88)' } },
        }}
        PaperProps={{
          sx: {
            bgcolor: '#000',
            backgroundImage: 'none',
            boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
          },
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            type="button"
            aria-label="Cerrar vídeo"
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 2,
              color: '#fff',
              bgcolor: 'rgba(0,0,0,0.55)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.75)' },
            }}
          >
            <Typography component="span" sx={{ fontSize: '1.25rem', lineHeight: 1 }}>
              ×
            </Typography>
          </IconButton>
          {modal ? (
            <Box sx={{ pt: '56.25%', position: 'relative', width: '100%' }}>
              <Box
                component="iframe"
                key={modal.videoId}
                src={getYouTubeEmbedSrc(modal.videoId, true)}
                title={modal.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0,
                }}
              />
            </Box>
          ) : null}
        </DialogContent>
      </Dialog>
    </Box>
  )
}
