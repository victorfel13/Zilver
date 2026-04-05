import { Box, IconButton, Link, Typography } from '@mui/material'
import { useCallback, useState } from 'react'
import { SpotifyGlyph } from '../SpotifyGlyph'
import { usePlayback } from '../../context/PlaybackContext'
import type { Release } from './releasesData'
import { releases } from './releasesData'

type ReleaseCardProps = {
  release: Release
  selected: boolean
  playingId: string | null
  onSelectCover: (id: string) => void
  playReleaseFromCard: (release: Release) => void
  openSpotify: (url: string) => void
}

function ReleaseCard({
  release,
  selected,
  playingId,
  onSelectCover,
  playReleaseFromCard,
  openSpotify,
}: ReleaseCardProps) {
  const hasCover = Boolean(release.coverSrc?.trim())
  const hasAudio = Boolean(release.audioSrc)
  const lockedOut = playingId !== null && playingId !== release.id
  const showPlayerOverlay = selected && hasAudio
  const isPlaying = playingId === release.id && hasAudio

  const handleCoverClick = () => {
    if (lockedOut) return
    onSelectCover(release.id)
  }

  const handleBigPlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!hasAudio) return
    playReleaseFromCard(release)
  }

  const spotifyIconButtonSx = {
    color: 'rgba(255,255,255,0.42)',
    p: 0.4,
    '&:hover': {
      color: 'rgba(255,255,255,0.78)',
      bgcolor: 'rgba(255,255,255,0.06)',
    },
  } as const

  const coverImage = (
    <Box
      onClick={release.streamUrl ? undefined : handleCoverClick}
      sx={{
        position: 'relative',
        aspectRatio: '1',
        bgcolor: release.coverTint,
        border: '1px solid rgba(255,255,255,0.07)',
        overflow: 'hidden',
        mb: 1,
        cursor: release.streamUrl ? 'default' : lockedOut ? 'not-allowed' : 'pointer',
        opacity: lockedOut ? 0.5 : 1,
        pointerEvents: lockedOut ? 'none' : 'auto',
        transition: 'opacity 0.2s',
      }}
    >
      {hasCover ? (
        <Box
          component="img"
          src={release.coverSrc}
          alt={`Portada — ${release.title}`}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : null}

      {!showPlayerOverlay && release.spotifyUrl ? (
        <IconButton
          size="small"
          aria-label={`Abrir ${release.title} en Spotify`}
          onClick={(e) => {
            e.stopPropagation()
            openSpotify(release.spotifyUrl!)
          }}
          sx={{
            ...spotifyIconButtonSx,
            position: 'absolute',
            top: 4,
            right: 4,
            zIndex: 1,
          }}
        >
          <SpotifyGlyph size={17} />
        </IconButton>
      ) : null}

      {showPlayerOverlay ? (
        <Box
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background:
              'linear-gradient(to top, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.08) 55%, rgba(255,255,255,0.03) 100%)',
          }}
        >
          <IconButton
            type="button"
            aria-label={isPlaying ? 'Pausar' : 'Reproducir (control en la barra inferior)'}
            onClick={handleBigPlayToggle}
            sx={{
              width: { xs: 48, sm: 52 },
              height: { xs: 48, sm: 52 },
              bgcolor: 'transparent',
              color: '#fff',
              border: 'none',
              borderRadius: 0,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.08)',
              },
            }}
          >
            {isPlaying ? (
              <Box
                component="span"
                aria-hidden
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                }}
              >
                <Box sx={{ width: 3, height: 16, bgcolor: '#fff', flexShrink: 0 }} />
                <Box sx={{ width: 3, height: 16, bgcolor: '#fff', flexShrink: 0 }} />
              </Box>
            ) : (
              <Typography
                component="span"
                sx={{
                  fontSize: { xs: '1.35rem', sm: '1.45rem' },
                  lineHeight: 1,
                  ml: '3px',
                  color: '#fff',
                  fontFamily: 'system-ui, sans-serif',
                  fontWeight: 300,
                }}
              >
                ▶
              </Typography>
            )}
          </IconButton>
        </Box>
      ) : null}
    </Box>
  )

  const meta = (
    <>
      <Typography
        align="center"
        sx={{
          fontSize: '0.72rem',
          fontWeight: 500,
          letterSpacing: '0.06em',
          color: 'rgba(255,255,255,0.82)',
        }}
      >
        {release.title}
      </Typography>
      <Typography
        align="center"
        sx={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.42)', mt: 0.2, fontWeight: 400 }}
      >
        {release.artist}
        {release.year ? ` · ${release.year}` : ''}
      </Typography>
      {release.type ? (
        <Typography
          align="center"
          sx={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.28)', mt: 0.2, letterSpacing: '0.04em' }}
        >
          {release.type}
        </Typography>
      ) : null}
    </>
  )

  return (
    <Box
      sx={{
        width: { xs: 'calc(50% - 8px)', sm: 'calc(25% - 12px)' },
        maxWidth: 200,
        flex: { sm: '0 1 auto' },
      }}
    >
      {release.streamUrl ? (
        <Link
          href={release.streamUrl}
          target="_blank"
          rel="noopener noreferrer"
          underline="none"
          sx={{
            display: 'block',
            color: 'inherit',
            width: '100%',
            maxWidth: 200,
            '&:hover': { opacity: 0.92 },
          }}
        >
          {coverImage}
          {meta}
        </Link>
      ) : (
        <Box sx={{ width: '100%', maxWidth: 200 }}>
          {coverImage}
          {meta}
        </Box>
      )}
    </Box>
  )
}

export function Lanzamientos() {
  const { playingId, playReleaseFromCard, openSpotify } = usePlayback()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const handleSelectCover = useCallback(
    (id: string) => {
      if (playingId !== null && playingId !== id) return
      setSelectedId(id)
    },
    [playingId],
  )

  return (
    <Box id="lanzamientos" component="section" sx={{ py: { xs: 5, md: 8 }, bgcolor: '#000' }}>
      <Box sx={{ maxWidth: 960, mx: 'auto', px: 2 }}>
        <Typography
          component="h2"
          align="center"
          sx={{
            fontWeight: 500,
            letterSpacing: '0.14em',
            fontSize: { xs: '1.35rem', md: '1.65rem' },
            mb: 4,
            color: 'rgba(255,255,255,0.88)',
          }}
        >
          LANZAMIENTOS
        </Typography>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'center',
          }}
        >
          {releases.map((r) => (
            <ReleaseCard
              key={r.id}
              release={r}
              selected={selectedId === r.id}
              playingId={playingId}
              onSelectCover={handleSelectCover}
              playReleaseFromCard={playReleaseFromCard}
              openSpotify={openSpotify}
            />
          ))}
        </Box>
       
        <Typography
          align="center"
          sx={{
            mt: 2.5,
            fontWeight: 500,
            letterSpacing: '0.1em',
            fontSize: '0.72rem',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          PRÓXIMAMENTE NUEVO MATERIAL EN 2026
        </Typography>
      </Box>
    </Box>
  )
}
