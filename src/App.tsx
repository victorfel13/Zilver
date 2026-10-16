import { Box } from '@mui/material'
import { useEffect } from 'react'
import { Bio } from './components/Bio/Bio'
import { Contacto } from './components/Contacto/Contacto'
import { EnVivo } from './components/EnVivo/EnVivo'
import { Footer } from './components/Footer/Footer'
import { GlobalPlayer } from './components/GlobalPlayer/GlobalPlayer'
import { Hero } from './components/Hero/Hero'
import { Lanzamientos } from './components/Lanzamientos/Lanzamientos'
import { Navbar } from './components/Navbar/Navbar'
import { PreSave } from './components/PreSave/PreSave'
import { Videos } from './components/Videos/Videos'
import { PlaybackProvider } from './context/PlaybackContext'

function wantsEstrenoLanding() {
  const path = window.location.pathname.replace(/\/$/, '')
  const q = new URLSearchParams(window.location.search)
  return window.location.hash === '#estreno' || path === '/estreno' || q.get('s') === 'estreno'
}

function scrollToEstreno() {
  document.getElementById('estreno')?.scrollIntoView({ behavior: 'auto', block: 'start' })
}

function AppContent() {
  /** /estreno, ?s=estreno o #estreno → scrollea a la sección (con reintentos por layout). */
  useEffect(() => {
    if (!wantsEstrenoLanding()) return

    if (window.location.hash !== '#estreno' || window.location.pathname !== '/') {
      window.history.replaceState(null, '', '/#estreno')
    }

    scrollToEstreno()
    const raf = requestAnimationFrame(scrollToEstreno)
    const delays = [50, 150, 300, 600, 1200, 2000].map((ms) => window.setTimeout(scrollToEstreno, ms))
    window.addEventListener('load', scrollToEstreno)

    return () => {
      cancelAnimationFrame(raf)
      delays.forEach(clearTimeout)
      window.removeEventListener('load', scrollToEstreno)
    }
  }, [])

  return (
    <Box
      sx={{
        bgcolor: '#000',
        color: '#fff',
        minHeight: '100vh',
        pb: { xs: 'calc(118px + env(safe-area-inset-bottom, 0px))', sm: 'calc(96px + env(safe-area-inset-bottom, 0px))' },
      }}
    >
      <Navbar />
      <Hero />
      <PreSave />
      <Bio />
      <Lanzamientos />
      <Videos />
      <EnVivo />
      <Contacto />
      <Footer />
      <GlobalPlayer />
    </Box>
  )
}

export default function App() {
  return (
    <PlaybackProvider>
      <AppContent />
    </PlaybackProvider>
  )
}
