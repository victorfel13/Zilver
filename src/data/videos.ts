/** Tres miniaturas en la cuadrícula + `videoFeatured` = 4 vídeos en total */
export const videoTiles = [
  { id: 'a', label: 'Gala', url: 'https://www.youtube.com/watch?v=JjshrCLSgxg' },
  { id: 'b', label: 'Moonlight Dance', url: 'https://www.youtube.com/embed/qmzy2fIiygs?si=WGgSOEm8_4AjwHhe' },
  { id: 'c', label: 'Almas', url: 'https://www.youtube.com/embed/J8Tm0jNly9w?si=HIDUd7ptaiGVfE1E' },
] as const

export const videoFeatured = {
  id: 'savia',
  label: 'SAVIA',
  /** Misma idea que en videoTiles: URL de YouTube (watch, embed o youtu.be) */
  url: 'https://www.youtube.com/watch?v=9X9DgiSo7JQ',
} as const
