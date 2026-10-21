import { Box, IconButton, Link, Stack, Typography } from '@mui/material'
import { useRef, useState } from 'react'
import { band } from '../../data/band'
import liveImage1 from '../../assets/img/live-1.webp'
import liveImage2 from '../../assets/img/live-2.webp'
import liveImage3 from '../../assets/img/live-3.webp'

const liveImages = [
  { src: liveImage1, alt: 'Zilver cantando en vivo frente al público' },
  { src: liveImage2, alt: 'Zilver en el escenario de Indie Fest' },
  { src: liveImage3, alt: 'Zilver cantando en vivo' },
] as const

function LivePhotos() {
  const [index, setIndex] = useState(0)
  const touchX = useRef<number | null>(null)
  const count = liveImages.length

  const goTo = (next: number) => setIndex(((next % count) + count) % count)

  const navBtnSx = {
    position: 'absolute' as const,
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 1,
    bgcolor: 'rgba(0,0,0,0.55)',
    color: '#fff',
    width: 38,
    height: 38,
    '&:hover': { bgcolor: 'rgba(0,0,0,0.75)' },
  }

  return (
    <>
      {/* Móvil: carrusel, foto completa sin recorte */}
      <Box sx={{ display: { xs: 'block', md: 'none' }, width: '100%' }}>
        <Box
          role="region"
          aria-label={`Foto ${index + 1} de ${count}`}
          onTouchStart={(e) => {
            touchX.current = e.touches[0]?.clientX ?? null
          }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return
            const delta = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current
            if (Math.abs(delta) > 40) goTo(index + (delta < 0 ? 1 : -1))
            touchX.current = null
          }}
          sx={{ position: 'relative', overflow: 'hidden', bgcolor: '#0d0d0d' }}
        >
          <Box
            sx={{
              display: 'flex',
              transform: `translateX(-${index * 100}%)`,
              transition: 'transform 0.45s ease',
            }}
          >
            {liveImages.map((image) => (
              <Box
                key={image.src}
                component="img"
                src={image.src}
                alt={image.alt}
                loading="lazy"
                sx={{
                  flex: '0 0 100%',
                  width: '100%',
                  aspectRatio: '2 / 3',
                  display: 'block',
                  objectFit: 'contain',
                  bgcolor: '#0d0d0d',
                }}
              />
            ))}
          </Box>

          <IconButton aria-label="Foto anterior" onClick={() => goTo(index - 1)} sx={{ ...navBtnSx, left: 8 }}>
            <Typography component="span" sx={{ fontSize: '1.6rem', lineHeight: 1, mt: '-2px' }}>
              ‹
            </Typography>
          </IconButton>
          <IconButton aria-label="Foto siguiente" onClick={() => goTo(index + 1)} sx={{ ...navBtnSx, right: 8 }}>
            <Typography component="span" sx={{ fontSize: '1.6rem', lineHeight: 1, mt: '-2px' }}>
              ›
            </Typography>
          </IconButton>
        </Box>

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
          <Typography sx={{ fontSize: '0.65rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.5)' }}>
            {index + 1} / {count}
          </Typography>
          <Stack direction="row" spacing={0.75}>
            {liveImages.map((image, dot) => (
              <Box
                key={image.src}
                role="button"
                tabIndex={0}
                aria-label={`Ir a la foto ${dot + 1}`}
                aria-current={dot === index ? 'true' : undefined}
                onClick={() => goTo(dot)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    goTo(dot)
                  }
                }}
                sx={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  cursor: 'pointer',
                  bgcolor: dot === index ? '#fff' : 'rgba(255,255,255,0.3)',
                }}
              />
            ))}
          </Stack>
        </Stack>
      </Box>

      {/* Escritorio: las tres en fila */}
      <Box
        sx={{
          display: { xs: 'none', md: 'grid' },
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 2,
          width: '100%',
        }}
      >
        {liveImages.map((image) => (
          <Box
            key={image.src}
            component="img"
            src={image.src}
            alt={image.alt}
            loading="lazy"
            sx={{
              width: '100%',
              aspectRatio: '2 / 3',
              display: 'block',
              objectFit: 'cover',
              bgcolor: '#0d0d0d',
            }}
          />
        ))}
      </Box>
    </>
  )
}

export function EnVivo() {
  return (
    <Box id="envivo" component="section" sx={{ py: { xs: 5, md: 8 }, bgcolor: '#000' }}>
      <Stack spacing={4} sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
        <LivePhotos />

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 3, md: 6 }}
          alignItems="flex-start"
        >
          <Box sx={{ flex: { md: '0 0 240px' } }}>
            <Typography
              component="h2"
              sx={{ fontWeight: 700, letterSpacing: '0.2em', fontSize: { xs: '1.5rem', md: '2rem' }, mb: 1 }}
            >
              {band.liveTitle}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)' }}>
              <Link href="#" color="inherit" onClick={(e) => e.preventDefault()} sx={{ cursor: 'default' }}>
                {band.riderHint}
              </Link>
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ mb: 2, color: 'rgba(255,255,255,0.88)' }}>{band.liveLead}</Typography>
            <Stack spacing={2}>
              {band.liveFormats.map((f) => (
                <Box key={f.name}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', mb: 0.5 }}>{f.name}</Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)' }}>{f.text}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      </Stack>
    </Box>
  )
}
