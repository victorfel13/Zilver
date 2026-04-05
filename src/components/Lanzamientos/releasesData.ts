/**
 * Lanzamientos — metadatos y rutas a archivos en `src/assets/releases/`.
 *
 * Estructura de carpetas:
 * - `cover/`  → imágenes de portada (.webp, .png…)
 * - `audio/`  → pistas (.m4a, .mp3…)
 *
 * En este archivo no van rutas “a mano” como string: Vite debe **importar** cada
 * archivo para incluirlo en el bundle y obtener la URL final (`coverSrc`, `audioSrc`).
 * Si añades un lanzamiento nuevo, importa aquí su cover y su audio y asígnalos al objeto.
 */
import audioAlmas from '../../assets/releases/audio/3 Almas.m4a'
import audioGala from '../../assets/releases/audio/4 Gala.m4a'
import audioMoonlight from '../../assets/releases/audio/2 Moonlight Dance.m4a'
import audioSavia from '../../assets/releases/audio/1 Savia.m4a'

import coverAlmas from '../../assets/releases/cover/almas.webp'
import coverGala from '../../assets/releases/cover/gala.webp'
import coverMoonlight from '../../assets/releases/cover/moonligth.webp'
import coverSavia from '../../assets/releases/cover/savia.webp'

export type Release = {
  id: string
  /** Nombre del lanzamiento o del single/álbum */
  title: string
  artist: string
  year: string
  /** Portada: URL que devuelve Vite al importar desde `assets/releases/cover/` */
  coverSrc: string
  /** Pista local: URL al importar desde `assets/releases/audio/` */
  audioSrc?: string
  /** Fondo si aún no hay imagen */
  coverTint: string
  /** Single, EP, Álbum… */
  type?: string
  /** Enlace opcional a plataforma externa (genérico) */
  streamUrl?: string
  /** Enlace a la pista o búsqueda en Spotify (icono en la tarjeta) */
  spotifyUrl?: string
}

export const releases: Release[] = [
  {
    id: 'savia',
    title: 'SAVIA',
    artist: 'Zilver',
    year: '2023',
    coverSrc: coverSavia,
    audioSrc: audioSavia,
    coverTint: '#4a2d3d',
    type: 'Single',
    spotifyUrl: 'https://open.spotify.com/search/Zilver%20Savia',
  },
  {
    id: 'almas',
    title: 'ALMAS',
    artist: 'Zilver',
    year: '2022',
    coverSrc: coverAlmas,
    audioSrc: audioAlmas,
    coverTint: '#2d3a4a',
    type: 'Single',
    spotifyUrl: 'https://open.spotify.com/search/Zilver%20Almas',
  },
  {
    id: 'moonlight',
    title: 'MOONLIGHT DANCE',
    artist: 'Zilver',
    year: '2024',
    coverSrc: coverMoonlight,
    audioSrc: audioMoonlight,
    coverTint: '#3d3a2d',
    type: 'Single',
    spotifyUrl: 'https://open.spotify.com/search/Zilver%20Moonlight%20Dance',
  },
  {
    id: 'gala',
    title: 'GALA',
    artist: 'Zilver',
    year: '2021',
    coverSrc: coverGala,
    audioSrc: audioGala,
    coverTint: '#2d4a42',
    type: 'Single',
    spotifyUrl: 'https://open.spotify.com/search/Zilver%20Gala',
  },
]
