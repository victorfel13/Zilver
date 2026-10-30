/**
 * Calendario de Zilver — shows, festivales y lanzamientos.
 * `date` en formato YYYY-MM-DD (hora local de Mérida). Las fechas pasadas
 * se marcan solas como "Realizado" según el día actual.
 */
export type FechaKind = 'show' | 'festival' | 'lanzamiento'

export interface Fecha {
  date: string
  time?: string
  title: string
  venue?: string
  city: string
  kind: FechaKind
  /** Boletos, pre-save, mapa, fotos… (opcional) */
  url?: string
  urlLabel?: string
}

export const fechas: Fecha[] = [
  { date: '2026-10-03', title: 'Casa Moloch', city: 'Valladolid, Yuc.', kind: 'show' },
  { date: '2026-10-17', title: 'Indie Fest Yucatán', city: 'Yucatán', kind: 'festival' },
  { date: '2026-10-23', time: '7:00 PM', title: 'Ánimas Show Time', venue: 'Harvest Hall', city: 'Mérida, Yuc.', kind: 'show' },
  {
    date: '2026-10-24',
    title: 'Waiting For You',
    venue: 'Nuevo sencillo',
    city: 'Todas las plataformas',
    kind: 'lanzamiento',
    url: 'https://found.ee/4MD09y',
    urlLabel: 'Escuchar',
  },
  { date: '2026-10-25', time: '12:00 PM', title: 'Tianguis Rockultura', venue: 'Patio de Cuerdas', city: 'Mérida, Yuc.', kind: 'show' },
  { date: '2026-11-18', time: '7:00 PM', title: 'Edúcate Fest', venue: 'Universidad Modelo', city: 'Mérida, Yuc.', kind: 'festival' },
  {
    date: '2026-11-21',
    time: '8:00 PM',
    title: 'Telequinesis',
    venue: 'Harvest Hall',
    city: 'Mérida, Yuc.',
    kind: 'show',
    url: 'https://victors.puntofast.com/victors/telequinesis-preventa',
    urlLabel: 'Comprar boleto',
  },
]
