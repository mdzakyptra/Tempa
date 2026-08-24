import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Auth from './pages/Auth'
import Beranda from './pages/Beranda'
import DetailLaporan from './pages/DetailLaporan'
import LaporBaru from './pages/LaporBaru'
import Metodologi from './pages/Metodologi'
import PanelPetugas from './pages/PanelPetugas'


//<---------- App -------------->
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Beranda />} />
        <Route path="/laporan/:id" element={<DetailLaporan />} />
        <Route path="/lapor-baru" element={<LaporBaru />} />
        <Route path="/metodologi" element={<Metodologi />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/panel-petugas" element={<PanelPetugas />} />
      </Route>
    </Routes>
  )
}

export default App
