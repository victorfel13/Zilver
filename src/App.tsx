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

function AppContent() {
  /** Solo si la URL trae #estreno (sticker / QR), scrollea a esa sección. */
  useEffect(() => {
    if (window.location.hash !== '#estreno') return

    const go = () => document.getElementById('estreno')?.scrollIntoView({ behavior: 'auto', block: 'start' })
    go()
    requestAnimationFrame(go)
    // Por si el layout tarda (imágenes / sticky nav)
    const t = window.setTimeout(go, 100)
    return () => window.clearTimeout(t)
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
