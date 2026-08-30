import { Route, Routes } from 'react-router-dom'
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


//<---------- App -------------->
function App() {
  return (
    <Routes>
      <Route path="/" element={<Beranda />} />
      <Route element={<Layout />}>
        <Route path="/antrean" element={<Antrean />} />
        <Route path="/laporan/:id" element={<DetailLaporan />} />
        <Route path="/lapor-baru" element={<LaporBaru />} />
        <Route path="/lapor-baru/hasil/:id" element={<HasilLapor />} />
        <Route path="/metodologi" element={<Metodologi />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/panel-petugas" element={<PanelPetugas />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
