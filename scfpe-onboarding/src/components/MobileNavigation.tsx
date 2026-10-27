import { useEffect, useRef } from 'react'
import { AnimatePresence, m } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { Link, useLocation } from 'wouter'
import { routeById, type RouteId } from '../config/routes'
import { primaryNav } from '../config/site'
import { SectionLink } from '../routing/SectionLink'

interface MobileNavigationProps {
  id: string
  open: boolean
  label: string
  onClose: () => void
}

function MobileLink({ route, onClose }: { route: RouteId; onClose: () => void }) {
  const [location] = useLocation()
  const r = routeById[route]
  return (
    <Link
      href={r.path}
      className="mobile-nav__link"
      aria-current={location === r.path ? 'page' : undefined}
      onClick={onClose}
    >
      {r.navLabel}
      <ArrowRight size={18} aria-hidden="true" />
    </Link>
  )
}

export function MobileNavigation({ id, open, label, onClose }: MobileNavigationProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    document.body.classList.add('menu-open')
    const toggle = document.querySelector<HTMLButtonElement>('[aria-controls="' + id + '"]')
    panelRef.current?.querySelector<HTMLAnchorElement>('a')?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        toggle?.focus()
      }
    }
    // Close if the viewport grows past the mobile breakpoint.
    const media = window.matchMedia('(min-width: 1260px)')
    const onMedia = () => media.matches && onClose()

    document.addEventListener('keydown', onKey)
    media.addEventListener('change', onMedia)
    return () => {
      document.body.classList.remove('menu-open')
      document.removeEventListener('keydown', onKey)
      media.removeEventListener('change', onMedia)
    }
  }, [open, id, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <m.div
            key="backdrop"
            className="mobile-nav__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <m.div
            key="panel"
            ref={panelRef}
            id={id}
            className="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav aria-label={label}>
              <ul>
                {primaryNav.map((entry) =>
                  entry.kind === 'page' ? (
                    <li key={entry.route}>
                      <MobileLink route={entry.route} onClose={onClose} />
                    </li>
                  ) : (
                    <li key={entry.label} className="mobile-nav__group">
                      <p className="mobile-nav__group-label">{entry.label}</p>
                      <ul>
                        {entry.routes.map((r) => (
                          <li key={r}>
                            <MobileLink route={r} onClose={onClose} />
                          </li>
                        ))}
                      </ul>
                    </li>
                  ),
                )}
                <li>
                  <SectionLink section="support" className="mobile-nav__link" onClick={onClose}>
                    Support
                    <ArrowRight size={18} aria-hidden="true" />
                  </SectionLink>
                </li>
              </ul>
            </nav>
            <SectionLink section="apps" className="btn btn--dark mobile-nav__cta" onClick={onClose}>
              Get the dealer app
            </SectionLink>
          </m.div>
        </>
      )}
    </AnimatePresence>
  )
}
