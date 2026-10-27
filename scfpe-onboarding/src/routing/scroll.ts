/**
 * Scrolls to an element by id once it exists (the target page may still be
 * rendering after a route change), then records the hash in the URL.
 * Use `instant` after a page change so the new page doesn't animate from the
 * old page's scroll position; same-page jumps keep the smooth default.
 */
export function scrollToSection(id: string, behavior: ScrollBehavior = 'auto', attempts = 30) {
  const target = document.getElementById(id)
  if (target) {
    target.scrollIntoView({ block: 'start', behavior })
    if (window.location.hash !== `#${id}`) {
      window.history.replaceState(window.history.state, '', `${window.location.pathname}#${id}`)
    }
    return
  }
  if (attempts > 0) requestAnimationFrame(() => scrollToSection(id, behavior, attempts - 1))
}
