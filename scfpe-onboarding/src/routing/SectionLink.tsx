import type { AnchorHTMLAttributes, MouseEvent } from 'react'
import { useLocation } from 'wouter'
import { homeAnchor, homeHref, type SectionId } from '../config/site'
import { scrollToSection } from './scroll'

interface SectionLinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  section: SectionId
}

/**
 * Link to a section of the home page that works from any route: it moves to
 * "/" client-side if needed, then scrolls to the section.
 */
export function SectionLink({ section, onClick, children, ...rest }: SectionLinkProps) {
  const [location, navigate] = useLocation()

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event)
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }
    event.preventDefault()
    if (location === '/') {
      scrollToSection(section)
    } else {
      // RouteEffects sees the hash after the home page renders and scrolls to it.
      navigate(homeAnchor(section))
    }
  }

  return (
    <a href={homeHref(section)} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}
