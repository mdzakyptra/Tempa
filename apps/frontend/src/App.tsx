import { Route, Routes, useLocation } from 'react-router-dom'
import type { Location } from 'react-router-dom'
import Layout from './components/Layout'
import Antrean from './pages/Antrean'
import Auth from './pages/Auth'
import Beranda from './pages/Beranda'
import DetailLaporan from './pages/DetailLaporan'
import HasilLapor from './pages/HasilLapor'
import LaporBaru from './pages/LaporBaru'
import Metodologi from './pages/Metodologi'
import NotFound from './pages/NotFound'
import PanelPetugas from './pages/PanelPetugas'


interface NavigationState {
  backgroundLocation?: Location
}

//<---------- App ------------>
function App() {
  const location = useLocation()
  const backgroundLocation = (location.state as NavigationState | null)?.backgroundLocation

  return (
    <>
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
    </>
  )
}

export default App
