import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { Release } from '../components/Lanzamientos/releasesData'

type PlaybackContextValue = {
  current: Release | null
  playingId: string | null
  audioRef: React.RefObject<HTMLAudioElement | null>
  playReleaseFromCard: (release: Release) => void
  openSpotify: (url: string) => void
  /** Pausa el audio local (p. ej. al abrir un vídeo embebido) */
  pauseAudio: () => void
  onAudioPlay: () => void
  onAudioPause: () => void
  onAudioEnded: () => void
}

const PlaybackContext = createContext<PlaybackContextValue | null>(null)

export function PlaybackProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [current, setCurrent] = useState<Release | null>(null)
  const [playingId, setPlayingId] = useState<string | null>(null)

  const playReleaseFromCard = useCallback(
    (release: Release) => {
      if (!release.audioSrc) return
      if (current?.id === release.id) {
        const a = audioRef.current
        if (!a) return
        if (a.paused) void a.play()
        else a.pause()
        return
      }
      setCurrent(release)
    },
    [current?.id],
  )

  useEffect(() => {
    if (!current?.audioSrc) return
    const a = audioRef.current
    if (!a) return
    void a.play().catch(() => {})
  }, [current?.id, current?.audioSrc])

  const openSpotify = useCallback((url: string) => {
    audioRef.current?.pause()
    setPlayingId(null)
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [])

  const pauseAudio = useCallback(() => {
    audioRef.current?.pause()
    setPlayingId(null)
  }, [])

  const onAudioPlay = useCallback(() => {
    setPlayingId(current?.id ?? null)
  }, [current?.id])

  const onAudioPause = useCallback(() => {
    setPlayingId(null)
  }, [])

  const onAudioEnded = useCallback(() => {
    setPlayingId(null)
  }, [])

  const value = useMemo(
    () => ({
      current,
      playingId,
      audioRef,
      playReleaseFromCard,
      openSpotify,
      pauseAudio,
      onAudioPlay,
      onAudioPause,
      onAudioEnded,
    }),
    [
      current,
      playingId,
      playReleaseFromCard,
      openSpotify,
      pauseAudio,
      onAudioPlay,
      onAudioPause,
      onAudioEnded,
    ],
  )

  return <PlaybackContext.Provider value={value}>{children}</PlaybackContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook del mismo módulo que el provider
export function usePlayback() {
  const ctx = useContext(PlaybackContext)
  if (!ctx) throw new Error('usePlayback debe usarse dentro de PlaybackProvider')
  return ctx
}
