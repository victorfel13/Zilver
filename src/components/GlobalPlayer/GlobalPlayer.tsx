import { Box, IconButton, Stack, Typography } from '@mui/material'
import { SpotifyGlyph } from '../SpotifyGlyph'
import { usePlayback } from '../../context/PlaybackContext'

const spotifyBtnSx = {
  color: 'rgba(255,255,255,0.42)',
  flexShrink: 0,
  '&:hover': {
    color: 'rgba(255,255,255,0.78)',
    bgcolor: 'rgba(255,255,255,0.06)',
  },
} as const

/**
 * Reproductor fijo abajo: audio + Spotify del tema cargado desde Lanzamientos.
 */
export function GlobalPlayer() {
  const { current, audioRef, onAudioPlay, onAudioPause, onAudioEnded, openSpotify } = usePlayback()

  return (
    <Box
      id="global-player"
      component="aside"
      aria-label="Reproductor de música"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        bgcolor: 'rgba(6,6,6,0.92)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.35)',
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 1.5, sm: 2 },
          py: { xs: 1.25, sm: 1.5 },
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          gap: { xs: 1.25, sm: 2 },
        }}
      >
        <Box
          sx={{
            width: 52,
            height: 52,
            flexShrink: 0,
            borderRadius: 0.5,
            overflow: 'hidden',
            bgcolor: current?.coverTint ?? '#0d0d0d',
            border: '1px solid rgba(255,255,255,0.08)',
            alignSelf: { xs: 'center', sm: 'center' },
          }}
        >
          {current?.coverSrc ? (
            <Box
              component="img"
              src={current.coverSrc}
              alt=""
              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          ) : null}
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: '0.82rem',
              letterSpacing: '0.06em',
              color: current ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)',
            }}
            noWrap
          >
            {current ? current.title : 'Reproductor'}
          </Typography>
          <Typography
            sx={{
              fontSize: '0.68rem',
              color: 'rgba(255,255,255,0.42)',
              mt: 0.2,
            }}
            noWrap
          >
            {current ? `${current.artist}${current.year ? ` · ${current.year}` : ''}` : 'Elige un lanzamiento y pulsa play en la portada'}
          </Typography>

          {current?.audioSrc ? (
            <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 1, width: '100%' }}>
              <Box
                component="audio"
                ref={audioRef}
                controls
                controlsList="nodownload"
                src={current.audioSrc}
                preload="metadata"
                aria-label={`Reproducir ${current.title}`}
                onPlay={onAudioPlay}
                onPause={onAudioPause}
                onEnded={onAudioEnded}
                sx={{
                  flex: 1,
                  minWidth: 0,
                  height: 34,
                  display: 'block',
                  /** Progreso: acento claro; resto de controles más apagados */
                  accentColor: '#ffffff',
                  colorScheme: 'dark',
                  opacity: 1,
                  '&::-webkit-media-controls-panel': {
                    backgroundColor: 'transparent',
                  },
                  '&::-webkit-media-controls-play-button': {
                    filter: 'opacity(0.5)',
                  },
                  '&::-webkit-media-controls-mute-button': {
                    filter: 'opacity(0.45)',
                  },
                  '&::-webkit-media-controls-volume-slider': {
                    filter: 'opacity(0.5)',
                  },
                  /** Pista del tiempo: poco contraste; el recorrido usa accentColor */
                  '&::-webkit-media-controls-timeline': {
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    borderRadius: '2px',
                  },
                  '&::-webkit-media-controls-current-time-display': {
                    display: 'none',
                  },
                  '&::-webkit-media-controls-time-remaining-display': {
                    display: 'none',
                  },
                }}
              />
              {current.spotifyUrl ? (
                <IconButton
                  size="small"
                  aria-label="Abrir en Spotify"
                  onClick={() => openSpotify(current.spotifyUrl!)}
                  sx={spotifyBtnSx}
                >
                  <SpotifyGlyph size={20} />
                </IconButton>
              ) : null}
            </Stack>
          ) : null}
        </Box>
      </Box>
    </Box>
  )
}
