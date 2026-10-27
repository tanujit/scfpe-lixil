import { useEffect, useRef } from 'react'
import { useLocation } from 'wouter'
import { pageRoutes, SITE_TITLE_SUFFIX } from '../config/routes'
import { scrollToSection } from './scroll'

/**
 * Per-navigation side effects: page title, scroll position and focus.
 * On a real route change, focus moves to <main> so screen readers announce
 * the new page; the first render keeps the browser's own focus and scroll.
 */
export function RouteEffects() {
  const [location] = useLocation()
  const first = useRef(true)

  useEffect(() => {
    const route = pageRoutes.find((r) => r.path === location)
    document.title = route && route.id !== 'home' ? `${route.title} | ${SITE_TITLE_SUFFIX}` : SITE_TITLE_SUFFIX

    const hash = window.location.hash.slice(1)
    if (first.current) {
      first.current = false
      if (hash) scrollToSection(hash, 'instant')
      return
    }
    if (hash) {
      scrollToSection(hash, 'instant')
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [location])

  return null
}
