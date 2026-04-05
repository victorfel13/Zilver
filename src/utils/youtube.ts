/**
 * Extrae el ID de vídeo de URLs habituales de YouTube (watch, embed, youtu.be, shorts).
 */
export function getYouTubeVideoId(url: string): string | null {
  const trimmed = url.trim()
  if (!trimmed) return null

  try {
    const u = new URL(trimmed)
    const host = u.hostname.replace(/^www\./, '')

    if (host === 'youtu.be') {
      const id = u.pathname.split('/').filter(Boolean)[0]
      return id?.split('?')[0] ?? null
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      const v = u.searchParams.get('v')
      if (v) return v

      const parts = u.pathname.split('/').filter(Boolean)
      const embedIdx = parts.indexOf('embed')
      if (embedIdx !== -1 && parts[embedIdx + 1]) {
        return parts[embedIdx + 1].split('?')[0]
      }
      const shortsIdx = parts.indexOf('shorts')
      if (shortsIdx !== -1 && parts[shortsIdx + 1]) {
        return parts[shortsIdx + 1].split('?')[0]
      }
      const liveIdx = parts.indexOf('live')
      if (liveIdx !== -1 && parts[liveIdx + 1]) {
        return parts[liveIdx + 1].split('?')[0]
      }
    }
  } catch {
    return null
  }

  return null
}

export function getYouTubeThumbnailUrl(videoId: string, quality: 'hq' | 'max' = 'hq'): string {
  const file = quality === 'max' ? 'maxresdefault.jpg' : 'hqdefault.jpg'
  return `https://img.youtube.com/vi/${videoId}/${file}`
}

export function getYouTubeEmbedSrc(videoId: string, autoplay = true): string {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    ...(autoplay ? { autoplay: '1' } : {}),
  })
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
}
