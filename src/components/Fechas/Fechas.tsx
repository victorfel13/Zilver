import { Box, Button, Stack, Typography } from '@mui/material'
import { useMemo, useState } from 'react'
import flyerTelequinesis from '../../assets/img/telequinesis.webp'
import coverWaiting from '../../assets/releases/cover/waiting-for-you.webp'
import { fechas, type Fecha } from '../../data/fechas'
import { waitingForYouPresave } from '../../data/presave'

const showFlyers: Record<string, string> = {
  Telequinesis: flyerTelequinesis,
}

const ACCENT = '#F5C842'
const hairline = 'rgba(255,255,255,0.14)'
const MONTHS = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']
const DAYS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']

type Filter = 'todas' | 'proximas' | 'pasadas'

/** Fecha local (sin zona) a partir de YYYY-MM-DD */
function parseDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function startOfToday() {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

function daysUntil(iso: string) {
  return Math.round((parseDate(iso).getTime() - startOfToday().getTime()) / 86_400_000)
}

function whenLabel(days: number) {
  if (days === 0) return 'HOY'
  if (days === 1) return 'MAÑANA'
  return `EN ${days} DÍAS`
}

const chipSx = {
  display: 'inline-flex',
  alignItems: 'center',
  height: 22,
  px: 1,
  fontSize: '0.6rem',
  fontWeight: 700,
  letterSpacing: '0.16em',
  whiteSpace: 'nowrap',
} as const

function Chip({ fecha, past }: { fecha: Fecha; past: boolean }) {
  if (past)
    return (
      <Box component="span" sx={{ ...chipSx, border: '1px solid rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.75)' }}>
        REALIZADO
      </Box>
    )
  if (fecha.kind === 'lanzamiento')
    return (
      <Box component="span" sx={{ ...chipSx, bgcolor: ACCENT, color: '#000' }}>
        LANZAMIENTO
      </Box>
    )
  return (
    <Box component="span" sx={{ ...chipSx, border: '1px solid rgba(255,255,255,0.5)', color: '#fff' }}>
      {fecha.kind === 'festival' ? 'FESTIVAL' : 'PRÓXIMO'}
    </Box>
  )
}

function FechaRow({ fecha }: { fecha: Fecha }) {
  const d = parseDate(fecha.date)
  const past = daysUntil(fecha.date) < 0
  const isRelease = fecha.kind === 'lanzamiento'
  const place = [fecha.venue, fecha.city].filter(Boolean).join(' · ')

  return (
    <Box
      component="li"
      sx={{
        listStyle: 'none',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        columnGap: { xs: 2, md: 3.5 },
        rowGap: 1.5,
        py: { xs: 2.25, md: 2.75 },
        px: 0.5,
        borderBottom: `1px solid ${hairline}`,
        opacity: past ? 0.6 : 1,
        transition: 'background-color 0.2s',
        '&:hover': { bgcolor: 'rgba(255,255,255,0.03)' },
      }}
    >
      <Box sx={{ flex: '0 0 84px' }}>
        <Typography
          sx={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: { xs: '2.6rem', md: '3.2rem' },
            lineHeight: 0.85,
            color: isRelease && !past ? ACCENT : '#fff',
          }}
        >
          {String(d.getDate()).padStart(2, '0')}
        </Typography>
        <Typography sx={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.75)' }}>
          {MONTHS[d.getMonth()]} · {DAYS[d.getDay()]}
        </Typography>
      </Box>

      <Box sx={{ flex: '999 1 260px', minWidth: 0 }}>
        <Stack direction="row" alignItems="center" spacing={1.25} useFlexGap sx={{ flexWrap: 'wrap', mb: 0.5 }}>
          <Typography component="h3" sx={{ fontSize: { xs: '1.05rem', md: '1.2rem' }, fontWeight: 700 }}>
            {fecha.title}
          </Typography>
          <Chip fecha={fecha} past={past} />
        </Stack>
        <Typography sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.72)' }}>{place}</Typography>
      </Box>

      <Stack direction="row" alignItems="center" spacing={2} sx={{ flex: '1 0 auto', justifyContent: 'flex-end' }}>
        {fecha.time ? (
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.75)' }}>
            {fecha.time}
          </Typography>
        ) : null}
        {fecha.url && !past ? (
          <Button
            href={fecha.url}
            target="_blank"
            rel="noopener noreferrer"
            variant={isRelease ? 'contained' : 'outlined'}
            disableElevation
            sx={{
              minHeight: 40,
              px: 2.25,
              borderRadius: '2px',
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              ...(isRelease
                ? { bgcolor: ACCENT, color: '#000', '&:hover': { bgcolor: '#ffd75e' } }
                : { color: '#fff', borderColor: 'rgba(255,255,255,0.45)' }),
            }}
          >
            {fecha.urlLabel ?? 'Boletos'}
          </Button>
        ) : null}
      </Stack>
    </Box>
  )
}

export function Fechas() {
  const [filter, setFilter] = useState<Filter>('todas')

  const sorted = useMemo(() => [...fechas].sort((a, b) => a.date.localeCompare(b.date)), [])
  const rows = useMemo(
    () =>
      sorted.filter((f) => {
        if (filter === 'todas') return true
        const past = daysUntil(f.date) < 0
        return filter === 'pasadas' ? past : !past
      }),
    [sorted, filter],
  )

  const nextShow = sorted.find((f) => f.kind !== 'lanzamiento' && daysUntil(f.date) >= 0)
  /** Show con flyer + boletos (ej. Telequinesis), aunque no sea el inmediato */
  const ticketShow =
    sorted.find(
      (f) =>
        f.kind !== 'lanzamiento' &&
        daysUntil(f.date) >= 0 &&
        Boolean(f.url) &&
        Boolean(showFlyers[f.title]),
    ) ?? null
  /** Izquierda: próximo show distinto al de boletos (si hay preventa destacada a la derecha) */
  const featuredShow =
    ticketShow && nextShow && nextShow.title === ticketShow.title
      ? sorted.find((f) => f.kind !== 'lanzamiento' && daysUntil(f.date) >= 0 && f.title !== ticketShow.title) ?? null
      : nextShow
  const release = sorted.find((f) => f.kind === 'lanzamiento')
  const releaseDays = release ? daysUntil(release.date) : -1
  const showsCount = sorted.filter((f) => f.kind !== 'lanzamiento').length

  const tabs: { id: Filter; label: string }[] = [
    { id: 'todas', label: 'Todas' },
    { id: 'proximas', label: 'Próximas' },
    { id: 'pasadas', label: 'Pasadas' },
  ]

  return (
    <Box
      id="fechas"
      component="section"
      sx={{
        py: { xs: 6, md: 10 },
        bgcolor: '#000',
        borderTop: `1px solid ${hairline}`,
        scrollMarginTop: { xs: '72px', sm: '100px' },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
        {/* Encabezado */}
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
          <Box aria-hidden sx={{ width: 32, height: '1px', bgcolor: ACCENT }} />
          <Typography sx={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.28em', color: ACCENT }}>
            TOUR 2026 · {showsCount} SHOWS
          </Typography>
        </Stack>
        <Typography
          component="h2"
          sx={{ fontWeight: 700, letterSpacing: '0.2em', fontSize: { xs: '1.75rem', md: '2.4rem' }, mb: { xs: 4, md: 5 } }}
        >
          FECHAS
        </Typography>

        {/* Destacados */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 2.5,
            mb: { xs: 6, md: 8 },
          }}
        >
          {featuredShow ? (
            <Box
              sx={{
                border: `1px solid ${hairline}`,
                bgcolor: '#0b0b0b',
                p: { xs: 2.5, md: 3.5 },
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 3,
              }}
            >
              {showFlyers[featuredShow.title] ? (
                <Box
                  component="img"
                  src={showFlyers[featuredShow.title]}
                  alt={`Flyer — ${featuredShow.title}`}
                  sx={{
                    width: { xs: '100%', sm: 180, md: 200 },
                    maxWidth: 280,
                    height: 'auto',
                    aspectRatio: '4 / 5',
                    objectFit: 'cover',
                    display: 'block',
                    mx: { xs: 'auto', sm: 0 },
                  }}
                />
              ) : null}
              <Box sx={{ flex: '1 1 220px', minWidth: 0 }}>
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.24em', color: ACCENT, mb: 1.5 }}>
                  {featuredShow.url ? 'PREVENTA' : 'PRÓXIMO SHOW'} · {whenLabel(daysUntil(featuredShow.date))}
                </Typography>
                <Stack direction="row" alignItems="flex-end" spacing={2} sx={{ mb: 1.5 }}>
                  <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: '4.5rem', md: '6rem' }, lineHeight: 0.8 }}>
                    {String(parseDate(featuredShow.date).getDate()).padStart(2, '0')}
                  </Typography>
                  <Box sx={{ pb: 0.75 }}>
                    <Typography sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '1.8rem', lineHeight: 1, letterSpacing: '0.06em' }}>
                      {MONTHS[parseDate(featuredShow.date).getMonth()]} · {DAYS[parseDate(featuredShow.date).getDay()]}
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.72)' }}>{featuredShow.time}</Typography>
                  </Box>
                </Stack>
                <Typography component="h3" sx={{ fontSize: { xs: '1.35rem', md: '1.6rem' }, fontWeight: 800, mb: 0.5 }}>
                  {featuredShow.title}
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', mb: featuredShow.url ? 2 : 0 }}>
                  {[featuredShow.venue, featuredShow.city].filter(Boolean).join(' · ')}
                </Typography>
                {featuredShow.url ? (
                  <Button
                    href={featuredShow.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    disableElevation
                    sx={{
                      bgcolor: ACCENT,
                      color: '#000',
                      borderRadius: '2px',
                      fontWeight: 800,
                      letterSpacing: '0.14em',
                      fontSize: '0.7rem',
                      px: 3,
                      py: 1.2,
                      '&:hover': { bgcolor: '#ffd75e' },
                    }}
                  >
                    {featuredShow.urlLabel ?? 'Comprar boleto'}
                  </Button>
                ) : null}
              </Box>
            </Box>
          ) : null}

          {ticketShow ? (
            <Box
              sx={{
                border: `1px solid ${ACCENT}`,
                bgcolor: '#0b0b0b',
                p: { xs: 2.5, md: 3.5 },
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                gap: 3,
              }}
            >
              {showFlyers[ticketShow.title] ? (
                <Box
                  component="img"
                  src={showFlyers[ticketShow.title]}
                  alt={`Flyer — ${ticketShow.title}`}
                  sx={{
                    width: { xs: '100%', sm: 160, md: 180 },
                    maxWidth: 260,
                    height: 'auto',
                    aspectRatio: '4 / 5',
                    objectFit: 'cover',
                    display: 'block',
                    mx: { xs: 'auto', sm: 0 },
                  }}
                />
              ) : null}
              <Box sx={{ flex: '1 1 220px', minWidth: 0 }}>
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.24em', color: ACCENT, mb: 1 }}>
                  PREVENTA · {whenLabel(daysUntil(ticketShow.date))}
                </Typography>
                <Typography
                  component="h3"
                  sx={{
                    fontFamily: '"Bebas Neue", sans-serif',
                    fontSize: { xs: '1.55rem', md: '1.85rem' },
                    lineHeight: 1.1,
                    letterSpacing: '0.03em',
                    mb: 1.25,
                  }}
                >
                  {ticketShow.headline ?? ticketShow.title}
                </Typography>
                {ticketShow.description
                  ? ticketShow.description.split('\n\n').map((p) => (
                      <Typography
                        key={p.slice(0, 28)}
                        sx={{ fontSize: '0.86rem', lineHeight: 1.55, color: 'rgba(255,255,255,0.78)', mb: 1.25 }}
                      >
                        {p}
                      </Typography>
                    ))
                  : null}
                <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', mb: 2 }}>
                  {[ticketShow.venue, ticketShow.city, ticketShow.time].filter(Boolean).join(' · ')}
                </Typography>
                {ticketShow.url ? (
                  <Button
                    href={ticketShow.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    disableElevation
                    sx={{
                      bgcolor: ACCENT,
                      color: '#000',
                      borderRadius: '2px',
                      fontWeight: 800,
                      letterSpacing: '0.14em',
                      fontSize: '0.7rem',
                      px: 3,
                      py: 1.2,
                      '&:hover': { bgcolor: '#ffd75e' },
                    }}
                  >
                    {ticketShow.urlLabel ?? 'Comprar boleto'}
                  </Button>
                ) : null}
              </Box>
            </Box>
          ) : release && releaseDays >= -14 ? (
            <Box
              sx={{
                border: `1px solid ${ACCENT}`,
                bgcolor: '#0b0b0b',
                p: { xs: 2.5, md: 3.5 },
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <Box
                component="img"
                src={coverWaiting}
                alt={`Portada de ${waitingForYouPresave.title}`}
                sx={{ width: { xs: 120, md: 160 }, height: { xs: 120, md: 160 }, objectFit: 'cover', display: 'block' }}
              />
              <Box sx={{ flex: '1 1 200px', minWidth: 0 }}>
                <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.24em', color: ACCENT, mb: 1 }}>
                  {releaseDays > 0 ? `ESTRENO · ${whenLabel(releaseDays)}` : 'YA DISPONIBLE'}
                </Typography>
                <Typography
                  component="h3"
                  sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: { xs: '2.4rem', md: '2.9rem' }, lineHeight: 0.95, letterSpacing: '0.03em', mb: 1 }}
                >
                  {waitingForYouPresave.title}
                </Typography>
                <Typography sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', mb: 2 }}>
                  {waitingForYouPresave.availableLabel}
                </Typography>
                <Button
                  href={waitingForYouPresave.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="contained"
                  disableElevation
                  sx={{
                    bgcolor: ACCENT,
                    color: '#000',
                    borderRadius: '2px',
                    fontWeight: 800,
                    letterSpacing: '0.14em',
                    fontSize: '0.7rem',
                    px: 3,
                    py: 1.2,
                    '&:hover': { bgcolor: '#ffd75e' },
                  }}
                >
                  {waitingForYouPresave.ctaLabel}
                </Button>
              </Box>
            </Box>
          ) : null}
        </Box>

        {/* Calendario */}
        <Stack
          direction="row"
          alignItems="flex-end"
          justifyContent="space-between"
          useFlexGap
          sx={{ flexWrap: 'wrap', gap: 2, mb: 2 }}
        >
          <Typography component="h3" sx={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.24em', color: 'rgba(255,255,255,0.75)' }}>
            CALENDARIO
          </Typography>
          <Stack direction="row" spacing={0.75} role="tablist" aria-label="Filtrar fechas">
            {tabs.map((t) => {
              const active = filter === t.id
              return (
                <Button
                  key={t.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(t.id)}
                  sx={{
                    minHeight: 40,
                    px: 2,
                    borderRadius: '2px',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    border: '1px solid',
                    borderColor: active ? '#fff' : 'rgba(255,255,255,0.3)',
                    bgcolor: active ? '#fff' : 'transparent',
                    color: active ? '#000' : '#fff',
                    '&:hover': { bgcolor: active ? '#fff' : 'rgba(255,255,255,0.08)' },
                  }}
                >
                  {t.label}
                </Button>
              )
            })}
          </Stack>
        </Stack>

        <Box component="ul" sx={{ m: 0, p: 0, borderTop: `1px solid ${hairline}` }}>
          {rows.map((f) => (
            <FechaRow key={`${f.date}-${f.title}`} fecha={f} />
          ))}
          {rows.length === 0 ? (
            <Typography component="li" sx={{ listStyle: 'none', py: 4, color: 'rgba(255,255,255,0.7)' }}>
              No hay fechas en esta vista.
            </Typography>
          ) : null}
        </Box>

        {/* Booking */}
        <Box
          sx={{
            mt: { xs: 5, md: 6 },
            p: { xs: 2.5, md: 3.5 },
            border: `1px solid ${hairline}`,
            bgcolor: '#0b0b0b',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: '1.05rem', mb: 0.5 }}>¿Quieres a Zilver en tu escenario?</Typography>
            <Typography sx={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.72)' }}>
              Formato individual o full band. Agenda abierta para 2026 – 2027.
            </Typography>
          </Box>
          <Button
            href="#contacto"
            variant="contained"
            disableElevation
            sx={{
              bgcolor: '#fff',
              color: '#000',
              borderRadius: '2px',
              fontWeight: 800,
              letterSpacing: '0.14em',
              fontSize: '0.7rem',
              px: 3,
              py: 1.4,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.85)' },
            }}
          >
            Booking
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
