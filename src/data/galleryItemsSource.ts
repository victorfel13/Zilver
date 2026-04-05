/**
 * Origen de los ítems de la galería (no es el componente visual).
 * En 'local', Vite incluye en el bundle los `.webp` de `src/assets/galery/` al compilar.
 * En 'api', usa fetch desde `Bio` (useEffect) en lugar de `galleryItems`.
 */
export type GalleryItemsSourceMode = 'local' | 'api'

export const galleryItemsSourceMode: GalleryItemsSourceMode = 'local'

export type GalleryItem = {
  id: string
  src: string
  /** Nombre del archivo, útil como pie de foto */
  fileName: string
}

/** Dos globs: en algunos sistemas `*.WEBP` no coincide con `*.webp`. */
const localModules = {
  ...import.meta.glob<{ default: string }>('../assets/galery/*.webp', { eager: true }),
  ...import.meta.glob<{ default: string }>('../assets/galery/*.WEBP', { eager: true }),
}

function itemsFromLocalFolder(): GalleryItem[] {
  const items = Object.entries(localModules).map(([path, mod]) => ({
    id: path,
    src: mod.default,
    fileName: path.split('/').pop() ?? path,
  }))
  items.sort((a, b) => a.fileName.localeCompare(b.fileName, undefined, { sensitivity: 'base' }))
  return items
}

/** Lista estática mientras `galleryItemsSourceMode === 'local'`. */
export const galleryItems: GalleryItem[] =
  galleryItemsSourceMode === 'local' ? itemsFromLocalFolder() : []

// Cuando galleryItemsSourceMode sea 'api', descomenta y úsalo desde Bio con useEffect:
// export async function fetchGalleryItems(): Promise<GalleryItem[]> {
//   const res = await fetch('https://tu-api.com/gallery')
//   if (!res.ok) throw new Error('Galería no disponible')
//   return res.json()
// }
