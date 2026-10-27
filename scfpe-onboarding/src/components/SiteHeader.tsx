import { useCallback, useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, useLocation } from 'wouter'
import { routeById } from '../config/routes'
import { brand, primaryNav } from '../config/site'
import { SectionLink } from '../routing/SectionLink'
import { BrandLockup } from './BrandLockup'
import { MobileNavigation } from './MobileNavigation'
import { NavDropdown } from './NavDropdown'
import './SiteHeader.css'

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [location] = useLocation()
  // The menu remembers the route it was opened on, so navigating closes it.
  const [menuOpenAt, setMenuOpenAt] = useState<string | null>(null)
  const menuOpen = menuOpenAt === location
  const closeMenu = useCallback(() => setMenuOpenAt(null), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className={`site-header${scrolled || menuOpen ? ' is-raised' : ''}`}>
        <div className="container site-header__inner">
          <BrandLockup />

          <nav className="site-nav" aria-label="Primary">
            <ul>
              {primaryNav.map((entry) =>
                entry.kind === 'page' ? (
                  <li key={entry.route}>
                    <Link
                      href={routeById[entry.route].path}
                      className="site-nav__link"
                      aria-current={location === routeById[entry.route].path ? 'page' : undefined}
                    >
                      {routeById[entry.route].navLabel}
                    </Link>
                  </li>
                ) : (
                  <NavDropdown key={entry.label} label={entry.label} routes={entry.routes} />
                ),
              )}
              <li>
                <SectionLink section="support" className="site-nav__link">
                  Support
                </SectionLink>
              </li>
            </ul>
          </nav>

          <div className="site-header__actions">
            <SectionLink section="apps" className="btn btn--dark btn--sm site-header__cta">
              Get the dealer app
            </SectionLink>
            <button
              type="button"
              className="menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpenAt(menuOpen ? null : location)}
            >
              {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* Outside <header>: its backdrop-filter would trap fixed-position children. */}
      <MobileNavigation
        id="mobile-navigation"
        open={menuOpen}
        onClose={closeMenu}
        label={`${brand.programLong} pages`}
      />
    </>
  )
}
