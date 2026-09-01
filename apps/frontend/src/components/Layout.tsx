import { lazy, Suspense, useState } from 'react'
import { NavLink, Outlet, useMatch } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, FilePlus2, LayoutDashboard, LogIn, LogOut, Menu, PanelLeftOpen, Route } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { getCachedUserSnapshot, getCurrentUser, isPetugasPanelAllowed, logout, type DecodedUser } from '../lib/auth'
import { QueueAssistantLiftProvider } from '../lib/queue-assistant-lift'


const QueueAssistant = lazy(() => import('./queue-assistant/QueueAssistant'))


const BASE_NAV_ITEMS = [
  { to: '/antrean', label: 'Antrean', icon: LayoutDashboard },
  { to: '/metodologi', label: 'Metodologi', icon: Route },
  { to: '/panel-petugas', label: 'Panel Petugas', icon: PanelLeftOpen },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  onNavigate?: () => void
  navItems: typeof BASE_NAV_ITEMS
  user: DecodedUser | null
  onLogout: () => void
}

//<---------- Sidebar ------------>
function Sidebar({ collapsed, onToggle, onNavigate, navItems, user, onLogout }: SidebarProps) {
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
        {user ? (
          <>
            <div className={`flex items-center gap-3 rounded-xl px-3 py-2 ${collapsed ? 'justify-center' : ''}`} title={collapsed ? `${user.email} · ${user.peran}` : undefined}>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white uppercase">
                {user.email.charAt(0)}
              </span>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-900">{user.email}</p>
                  <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">{user.peran}</p>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                onLogout()
                onNavigate?.()
              }}
              title={collapsed ? 'Keluar' : undefined}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-black"
            >
              <LogOut className="size-5 shrink-0" />
              {!collapsed && <span>Keluar</span>}
            </button>
          </>
        ) : (
          <NavLink to="/auth" onClick={onNavigate} title={collapsed ? 'Masuk' : undefined} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-black">
            <LogIn className="size-5 shrink-0" />
            {!collapsed && <span>Masuk</span>}
          </NavLink>
        )}
      </div>
    </aside>
  )
}

//<---------- Layout ------------>
export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isAssistantLifted, setIsAssistantLifted] = useState(false)
  const reportMatch = useMatch('/laporan/:id')

  const queryClient = useQueryClient()
  const userQuery = useQuery({ queryKey: ['current-user'], queryFn: getCurrentUser, initialData: getCachedUserSnapshot })
  const navItems = BASE_NAV_ITEMS.filter((item) => item.to !== '/panel-petugas' || isPetugasPanelAllowed(userQuery.data))

  //<---------- handleLogout ------------>
  async function handleLogout() {
    await logout()
    queryClient.setQueryData(['current-user'], null)
  }

  return (
    <div className="font-display flex h-dvh overflow-hidden bg-neutral-50 text-black">
      <div className="hidden h-full shrink-0 md:block">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} navItems={navItems} user={userQuery.data} onLogout={handleLogout} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-black/10 bg-white px-4 md:hidden">
          <NavLink to="/"><img src="/aspiraku-wordmark.png" alt="Aspiraku" className="h-7" /></NavLink>
          <button type="button" onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-neutral-700 hover:bg-neutral-100" aria-label="Buka menu"><Menu className="size-5" /></button>
        </header>
        {/* overflow-x-hidden wajib eksplisit: per spec CSS, `overflow-y: auto`
            bikin sumbu X yang `visible` ikut jadi `auto`, jadi di layar sentuh
            halaman bisa digeser kanan-kiri walau lebihnya cuma sub-pixel. */}
        <main className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
          <QueueAssistantLiftProvider value={setIsAssistantLifted}>
            <Outlet />
          </QueueAssistantLiftProvider>
        </main>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[1000] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button type="button" onClick={() => setMobileOpen(false)} className="absolute inset-0 bg-black/30" aria-label="Tutup menu" />
            <motion.div
              className="relative h-full w-72 bg-white shadow-2xl"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.8 }}
            >
              <Sidebar
                collapsed={false}
                onToggle={() => setMobileOpen(false)}
                onNavigate={() => setMobileOpen(false)}
                navItems={navItems}
                user={userQuery.data}
                onLogout={handleLogout}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Suspense fallback={null}>
        <QueueAssistant reportId={reportMatch?.params.id} lifted={isAssistantLifted} />
      </Suspense>
    </div>
  )
}
