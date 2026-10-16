import {
  Box,
  Button,
  ButtonBase,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useCallback, useEffect, useState } from 'react'
import navLogo from '../../assets/img/zilver-logo-white.webp'

const items = [
  ['hero', 'Inicio'],
  ['estreno', 'Estreno'],
  ['bio', 'Biografía'],
  ['lanzamientos', 'Lanzamientos'],
  ['videos', 'Videos'],
  ['envivo', 'En vivo'],
  ['contacto', 'Contacto'],
] as const

type SectionId = (typeof items)[number][0]

function MenuIcon() {
  return (
    <Box component="svg" width={24} height={24} viewBox="0 0 24 24" aria-hidden sx={{ fill: 'currentColor' }}>
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </Box>
  )
}

function resolveActiveFromScroll(): SectionId {
  const offset = 120
  let current: SectionId = items[0][0]
  for (const [id] of items) {
    const el = document.getElementById(id)
    if (!el) continue
    if (el.getBoundingClientRect().top - offset <= 0) current = id
  }
  return current
}

export function Navbar() {
  const theme = useTheme()
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeId, setActiveId] = useState<SectionId>(() => {
    if (typeof window === 'undefined') return 'hero'
    const hash = window.location.hash.replace('#', '') as SectionId
    return items.some(([id]) => id === hash) ? hash : 'hero'
  })

  useEffect(() => {
    let ticking = false
    const update = () => {
      setActiveId(resolveActiveFromScroll())
      ticking = false
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const goTo = useCallback((id: SectionId) => {
    setActiveId(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    window.history.replaceState(null, '', `#${id}`)
    setMobileOpen(false)
  }, [])

  const activeNavSx = {
    bgcolor: '#fff',
    color: '#000',
    fontWeight: 700,
    '&:hover': { bgcolor: 'rgba(255,255,255,0.88)', color: '#000' },
  } as const

  return (
    <Box
      component="nav"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        bgcolor: '#000',
        borderBottom: '1px solid rgba(255,255,255,0.15)',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 1.5, sm: 2 }, py: { xs: 1.25, md: 1.5 }, gap: 1 }}
      >
        <ButtonBase
          onClick={() => goTo('hero')}
          aria-label="Zilver — inicio"
          sx={{
            borderRadius: 1,
            py: 0.25,
            px: 0.25,
            '&:focus-visible': { outline: '2px solid rgba(255,255,255,0.5)' },
          }}
        >
          <Box
            component="img"
            src={navLogo}
            alt="Zilver"
            sx={{
              height: { xs: 52, sm: 58, md: 72 },
              width: 'auto',
              display: 'block',
            }}
          />
        </ButtonBase>

        {isMdUp ? (
          <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.5} alignItems="center">
            {items.map(([id, label]) => {
              const active = activeId === id
              return (
                <Button
                  key={id}
                  size="small"
                  onClick={() => goTo(id)}
                  aria-current={active ? 'true' : undefined}
                  sx={{
                    color: '#fff',
                    fontSize: '0.65rem',
                    letterSpacing: '0.06em',
                    minWidth: 0,
                    borderRadius: 0,
                    px: 1.25,
                    py: 0.5,
                    ...(active ? activeNavSx : { '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }),
                  }}
                >
                  {label}
                </Button>
              )
            })}
          </Stack>
        ) : (
          <>
            <IconButton
              type="button"
              color="inherit"
              aria-label="Abrir menú de navegación"
              aria-expanded={mobileOpen}
              aria-controls="nav-drawer"
              onClick={() => setMobileOpen(true)}
              sx={{ color: '#fff' }}
            >
              <MenuIcon />
            </IconButton>

            <Drawer
              anchor="right"
              open={mobileOpen}
              onClose={() => setMobileOpen(false)}
              ModalProps={{ keepMounted: true }}
              PaperProps={{
                id: 'nav-drawer',
                sx: {
                  width: { xs: 'min(100%, 300px)', sm: 300 },
                  bgcolor: '#0a0a0a',
                  borderLeft: '1px solid rgba(255,255,255,0.12)',
                },
              }}
            >
              <Box sx={{ px: 2, py: 2, fontSize: '0.7rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.45)' }}>
                Menú
              </Box>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
              <List dense sx={{ py: 1 }}>
                {items.map(([id, label]) => {
                  const active = activeId === id
                  return (
                    <ListItemButton
                      key={id}
                      onClick={() => goTo(id)}
                      selected={active}
                      aria-current={active ? 'true' : undefined}
                      sx={{
                        py: 1.25,
                        mx: 1,
                        borderRadius: 0,
                        ...(active
                          ? activeNavSx
                          : { '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' } }),
                      }}
                    >
                      <ListItemText
                        primary={label}
                        primaryTypographyProps={{
                          sx: {
                            fontSize: '0.9rem',
                            letterSpacing: '0.08em',
                            color: active ? '#000' : 'rgba(255,255,255,0.92)',
                            fontWeight: active ? 700 : 400,
                          },
                        }}
                      />
                    </ListItemButton>
                  )
                })}
              </List>
            </Drawer>
          </>
        )}
      </Stack>
    </Box>
  )
}
