import { Box } from '@mui/material'
import { Bio } from './components/Bio/Bio'
import { Contacto } from './components/Contacto/Contacto'
import { EnVivo } from './components/EnVivo/EnVivo'
import { Footer } from './components/Footer/Footer'
import { GlobalPlayer } from './components/GlobalPlayer/GlobalPlayer'
import { Hero } from './components/Hero/Hero'
import { Lanzamientos } from './components/Lanzamientos/Lanzamientos'
import { Navbar } from './components/Navbar/Navbar'
import { Videos } from './components/Videos/Videos'
import { PlaybackProvider } from './context/PlaybackContext'

function AppContent() {
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
