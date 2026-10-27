import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import { Link, useLocation } from 'wouter'
import { routeById, type RouteId } from '../config/routes'
import { pageSummaries } from '../config/site'

/**
 * Disclosure-style dropdown for a group of pages in the desktop header.
 * Opens on click (and keyboard), closes on Escape, outside click or navigation.
 */
export function NavDropdown({ label, routes }: { label: string; routes: RouteId[] }) {
  const [location] = useLocation()
  // Remembers the route it was opened on, so navigating closes it.
  const [openAt, setOpenAt] = useState<string | null>(null)
  const open = openAt === location
  const setOpen = (value: boolean) => setOpenAt(value ? location : null)
  const rootRef = useRef<HTMLLIElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()
  const isActive = routes.some((id) => routeById[id].path === location)

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpenAt(null)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenAt(null)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <li
      ref={rootRef}
      className="site-nav__group"
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node)) setOpen(false)
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className={`site-nav__link site-nav__trigger${isActive ? ' is-active' : ''}`}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(!open)}
      >
        {label}
        <ChevronDown size={16} aria-hidden="true" className="site-nav__chevron" />
      </button>
      <AnimatePresence>
        {open && (
          <m.ul
            id={menuId}
            className="site-nav__menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
          >
            {routes.map((id) => {
              const route = routeById[id]
              const current = route.path === location
              return (
                <li key={id}>
                  <Link
                    href={route.path}
                    className="site-nav__menu-link"
                    aria-current={current ? 'page' : undefined}
                  >
                    <span className="site-nav__menu-label">{route.navLabel}</span>
                    <span className="site-nav__menu-desc">{id !== 'home' && pageSummaries[id]}</span>
                  </Link>
                </li>
              )
            })}
          </m.ul>
        )}
      </AnimatePresence>
    </li>
  )
}
