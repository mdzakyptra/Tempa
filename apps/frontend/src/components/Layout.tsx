import { NavLink, Outlet } from 'react-router-dom'


const navItems = [
  { to: '/antrean', label: 'Antrean' },
  { to: '/lapor-baru', label: 'Lapor Baru' },
  { to: '/metodologi', label: 'Metodologi' },
  { to: '/auth', label: 'Masuk' },
]

//<---------- Layout -------------->
export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-gray-200 px-4 py-4 sm:px-6">
        <span className="font-semibold">Antrean Kota</span>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                isActive ? 'font-medium text-purple-600' : 'text-gray-600'
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
