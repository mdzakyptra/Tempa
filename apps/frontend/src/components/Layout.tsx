import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { motion } from 'motion/react'


const navItems = [
  { to: '/antrean', label: 'Antrean' },
  { to: '/metodologi', label: 'Metodologi' },
  { to: '/panel-petugas', label: 'Panel Petugas' },
]

//<---------- Layout -------------->
export default function Layout() {
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY

    function onScroll() {
      const y = window.scrollY
      const delta = y - lastY

      if (y < 40) {
        setHidden(false)
      } else if (delta > 0) {
        setHidden(true)
      } else if (delta < 0) {
        setHidden(false)
      }

      lastY = y
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <motion.header
        animate={{ y: hidden ? -96 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50 border-b border-black/10 bg-white/80 backdrop-blur-xl"
      >
        <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4 sm:px-6">
          <NavLink to="/" className="shrink-0">
            <img src="/aspiraku-wordmark.png" alt="Aspiraku" className="h-7 w-auto" />
          </NavLink>

          <ul className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-2">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `group relative text-sm transition-colors ${isActive ? 'font-semibold text-black' : 'text-neutral-600 hover:text-black'}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      <span
                        className={`absolute -bottom-1 left-0 h-px bg-black transition-all duration-300 ${
                          isActive ? 'w-full' : 'w-0 group-hover:w-full'
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex shrink-0 items-center gap-2">
            <NavLink
              to="/lapor-baru"
              className="rounded-full border border-black/15 px-5 py-2 text-sm font-semibold text-black transition-colors hover:border-black/40 hover:bg-black/5"
            >
              Tambah Laporan
            </NavLink>
            <NavLink
              to="/auth"
              className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition-transform hover:scale-105"
            >
              Masuk
            </NavLink>
          </div>
        </nav>
      </motion.header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
