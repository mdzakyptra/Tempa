import { useState } from 'react'
import { NavLink, Outlet, useMatch } from 'react-router-dom'
import { ChevronLeft, ChevronRight, FilePlus2, LayoutDashboard, LogIn, Menu, PanelLeftOpen, Route, X } from 'lucide-react'
import { QueueAssistant } from './queue-assistant'


const navItems = [
  { to: '/antrean', label: 'Antrean', icon: LayoutDashboard },
  { to: '/metodologi', label: 'Metodologi', icon: Route },
  { to: '/panel-petugas', label: 'Panel Petugas', icon: PanelLeftOpen },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  onNavigate?: () => void
}

//<---------- Sidebar ------------>
function Sidebar({ collapsed, onToggle, onNavigate }: SidebarProps) {
  return (
    <aside className={`flex h-full flex-col border-r border-black/10 bg-white transition-[width] duration-300 ${collapsed ? 'w-[76px]' : 'w-64'}`}>
      <div className="flex h-20 items-center border-b border-black/10 px-4">
        <NavLink to="/" onClick={onNavigate} className="min-w-0 flex-1 overflow-hidden">
          <img src="/aspiraku-wordmark.png" alt="Aspiraku" className="h-7 w-auto max-w-none" />
        </NavLink>
        <button type="button" onClick={onToggle} className="rounded-lg p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-black" aria-label={collapsed ? 'Buka sidebar' : 'Tutup sidebar'}>
          {collapsed ? <ChevronRight className="size-5" /> : <ChevronLeft className="size-5" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-3" aria-label="Navigasi utama">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} onClick={onNavigate} title={collapsed ? label : undefined} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${isActive ? 'bg-black text-white shadow-lg shadow-black/10' : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'}`}>
            <Icon className="size-5 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-2 border-t border-black/10 p-3">
        <NavLink to="/lapor-baru" onClick={onNavigate} title={collapsed ? 'Tambah laporan' : undefined} className="flex items-center gap-3 rounded-xl bg-black px-3 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800">
          <FilePlus2 className="size-5 shrink-0" />
          {!collapsed && <span>Tambah laporan</span>}
        </NavLink>
        <NavLink to="/auth" onClick={onNavigate} title={collapsed ? 'Masuk' : undefined} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-black">
          <LogIn className="size-5 shrink-0" />
          {!collapsed && <span>Masuk</span>}
        </NavLink>
      </div>
    </aside>
  )
}

//<---------- Layout ------------>
export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const reportMatch = useMatch('/laporan/:id')

  return (
    <div className="flex h-dvh overflow-hidden bg-neutral-50 text-black">
      <div className="hidden h-full shrink-0 md:block"><Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} /></div>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-black/10 bg-white px-4 md:hidden">
          <NavLink to="/"><img src="/aspiraku-wordmark.png" alt="Aspiraku" className="h-7" /></NavLink>
          <button type="button" onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-neutral-700 hover:bg-neutral-100" aria-label="Buka menu"><Menu className="size-5" /></button>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto"><Outlet /></main>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <button type="button" onClick={() => setMobileOpen(false)} className="absolute inset-0 bg-black/30" aria-label="Tutup menu" />
          <div className="relative h-full w-72 bg-white shadow-2xl">
            <button type="button" onClick={() => setMobileOpen(false)} className="absolute right-3 top-5 rounded-lg p-2 text-neutral-600 hover:bg-neutral-100" aria-label="Tutup menu"><X className="size-5" /></button>
            <Sidebar collapsed={false} onToggle={() => setMobileOpen(false)} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
      <QueueAssistant reportId={reportMatch?.params.id} />
    </div>
  )
}
