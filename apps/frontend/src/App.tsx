import { lazy, Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import type { Location } from 'react-router-dom'
import Layout from './components/Layout'
import ChunkErrorBoundary from './components/ChunkErrorBoundary'

const Antrean = lazy(() => import('./pages/Antrean'))
const Auth = lazy(() => import('./pages/Auth'))
const Beranda = lazy(() => import('./pages/Beranda'))
const DetailLaporan = lazy(() => import('./pages/DetailLaporan'))
const HasilLapor = lazy(() => import('./pages/HasilLapor'))
const LaporBaru = lazy(() => import('./pages/LaporBaru'))
const Metodologi = lazy(() => import('./pages/Metodologi'))
const NotFound = lazy(() => import('./pages/NotFound'))
const PanelPetugas = lazy(() => import('./pages/PanelPetugas'))


interface NavigationState {
  backgroundLocation?: Location
}

//<---------- App ------------>
function App() {
  const location = useLocation()
  const backgroundLocation = (location.state as NavigationState | null)?.backgroundLocation

  return (
    <ChunkErrorBoundary>
      <Suspense fallback={null}>
        <Routes location={backgroundLocation ?? location}>
          <Route path="/" element={<Beranda />} />
          <Route path="/auth" element={<Auth />} />
          <Route element={<Layout />}>
            <Route path="/antrean" element={<Antrean />} />
            <Route path="/laporan/:id" element={<DetailLaporan />} />
            <Route path="/lapor-baru" element={<LaporBaru />} />
            <Route path="/lapor-baru/hasil/:id" element={<HasilLapor />} />
            <Route path="/metodologi" element={<Metodologi />} />
            <Route path="/panel-petugas" element={<PanelPetugas />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        {backgroundLocation && (
          <Routes>
            <Route path="/laporan/:id" element={<DetailLaporan isOverlay />} />
          </Routes>
        )}
      </Suspense>
    </ChunkErrorBoundary>
  )
}

export default App
