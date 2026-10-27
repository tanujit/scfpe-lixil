/// <reference types="node" />
import { describe, expect, it, vi, afterEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { memoryLocation } from 'wouter/memory-location'
import App from '../App'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { LEGACY_SITE, legacyAliases, pageRoutes } from '../config/routes'
import { documents } from '../config/site'

const headings: Record<string, RegExp> = {
  '/': /a simpler path to/i,
  '/program-workflow': /^program workflow$/i,
  '/program-details': /more details on the program & stakeholders/i,
  '/documents': /list of mandatory documents/i,
  '/documents/examples': /documents with examples/i,
  '/payments': /payment workflow/i,
  '/communications': /important communications/i,
}

function renderAt(path: string) {
  const location = memoryLocation({ path, record: true })
  const utils = render(<App hook={location.hook} />)
  return { ...utils, location }
}

afterEach(() => vi.unstubAllEnvs())

describe('routes', () => {
  it.each(pageRoutes.map((r) => r.path))('renders the right page at %s', (path) => {
    renderAt(path)
    expect(screen.getByRole('heading', { level: 1, name: headings[path] })).toBeInTheDocument()
  })

  it.each(pageRoutes.map((r) => r.path))('has no links back to the legacy Google Site at %s', (path) => {
    const { container } = renderAt(path)
    const hrefs = [...container.querySelectorAll('a[href]')].map((a) => a.getAttribute('href') ?? '')
    expect(hrefs.filter((h) => h.startsWith(LEGACY_SITE))).toEqual([])
    expect(hrefs.filter((h) => h === '#' || h === '')).toEqual([])
  })

  it.each(legacyAliases)('redirects legacy slug $from to $to', ({ from, to }) => {
    const { location } = renderAt(from)
    expect(location.history?.at(-1)).toBe(to)
    expect(screen.getByRole('heading', { level: 1, name: headings[to] })).toBeInTheDocument()
  })

  it('drops a trailing slash added by static hosts', () => {
    const { location } = renderAt('/payments/')
    expect(location.history?.at(-1)).toBe('/payments')
    expect(screen.getByRole('heading', { level: 1, name: headings['/payments'] })).toBeInTheDocument()
  })

  it('shows a not-found page with links to every page', () => {
    renderAt('/no-such-page')
    expect(screen.getByRole('heading', { level: 1, name: /couldn’t find that page/i })).toBeInTheDocument()
    const main = screen.getByRole('main')
    for (const r of pageRoutes) {
      expect(within(main).getByRole('link', { name: r.title })).toHaveAttribute('href', r.path)
    }
  })
})

describe('navigation journeys', () => {
  it('moves between pages from the header, related cards and breadcrumbs', async () => {
    const user = userEvent.setup()
    const { location } = renderAt('/')
    const primary = screen.getByRole('navigation', { name: 'Primary' })

    // Home → Payments (header link)
    await user.click(within(primary).getByRole('link', { name: 'Payments' }))
    expect(screen.getByRole('heading', { level: 1, name: headings['/payments'] })).toBeInTheDocument()
    expect(within(primary).getByRole('link', { name: 'Payments' })).toHaveAttribute('aria-current', 'page')

    // Payments → Documents list (related card)
    const related = screen.getByRole('region', { name: 'Continue with' })
    await user.click(within(related).getByRole('link', { name: /documents list/i }))
    expect(screen.getByRole('heading', { level: 1, name: headings['/documents'] })).toBeInTheDocument()

    // Documents → Program workflow (header dropdown)
    await user.click(within(primary).getByRole('button', { name: 'Program' }))
    await user.click(within(primary).getByRole('link', { name: /program workflow/i }))
    expect(screen.getByRole('heading', { level: 1, name: headings['/program-workflow'] })).toBeInTheDocument()

    // Program workflow → Home (breadcrumb)
    const crumbs = screen.getByRole('navigation', { name: 'Breadcrumb' })
    await user.click(within(crumbs).getByRole('link', { name: 'Home' }))
    expect(screen.getByRole('heading', { level: 1, name: headings['/'] })).toBeInTheDocument()

    expect(location.history).toEqual(['/', '/payments', '/documents', '/program-workflow', '/'])
  })

  it('links home-page program cards to local routes', () => {
    renderAt('/')
    const section = screen.getByRole('region', { name: /program details, documents and payments/i })
    const hrefs = within(section)
      .getAllByRole('link')
      .map((a) => a.getAttribute('href'))
    expect(hrefs).toEqual(pageRoutes.filter((r) => r.id !== 'home').map((r) => r.path))
  })

  it('sends home-section links from inner pages to the home page', async () => {
    // Uses jsdom's real history, since the hash is split off by the browser location hook.
    window.history.replaceState(null, '', '/communications')
    const user = userEvent.setup()
    render(<App />)
    const primary = screen.getByRole('navigation', { name: 'Primary' })
    await user.click(within(primary).getByRole('link', { name: 'Support' }))
    expect(window.location.pathname).toBe('/')
    expect(window.location.hash).toBe('#support')
    expect(screen.getByRole('heading', { level: 1, name: headings['/'] })).toBeInTheDocument()

    // Browser back returns to the inner page.
    window.history.back()
    await screen.findByRole('heading', { level: 1, name: headings['/communications'] })
    expect(window.location.pathname).toBe('/communications')
  })
})

describe('page content', () => {
  it('switches document checklists by business type with the keyboard', async () => {
    const user = userEvent.setup()
    renderAt('/documents')
    const tabs = screen.getAllByRole('tab')
    expect(tabs.map((t) => t.textContent)).toEqual([
      'Proprietorship',
      'Partnership Firm / LLP',
      'Private Limited Company',
    ])
    expect(screen.getByText('Owner’s Aadhaar Card')).toBeInTheDocument()

    await user.click(tabs[0])
    await user.keyboard('{ArrowRight}{ArrowRight}')
    expect(tabs[2]).toHaveAttribute('aria-selected', 'true')
    expect(await screen.findByText('MOA & AOA, COI')).toBeInTheDocument()
  })

  it('publishes the confirmed payment account in production builds', () => {
    vi.stubEnv('DEV', false)
    renderAt('/payments')
    const card = screen.getByRole('heading', { name: 'Payment account' }).closest('.van-card') as HTMLElement
    for (const value of ['India Sanitary Solutions', 'ICICI', 'ESCROWXURTI2IND99000', 'CMS', 'ICIC0000104']) {
      expect(within(card).getByText(value)).toBeInTheDocument()
    }
    expect(within(card).queryByText(/being confirmed/i)).not.toBeInTheDocument()
    expect(within(card).queryByText(/review before release/i)).not.toBeInTheDocument()
  })

  it('shows no review note on the confirmed account in development builds', () => {
    vi.stubEnv('DEV', true)
    renderAt('/payments')
    const card = screen.getByRole('heading', { name: 'Payment account' }).closest('.van-card') as HTMLElement
    expect(within(card).getByText('ESCROWXURTI2IND99000')).toBeInTheDocument()
    expect(within(card).queryByText(/review before release/i)).not.toBeInTheDocument()
  })

  it('links document cards to the rebranded PDFs served by the site', () => {
    renderAt('/documents')
    for (const doc of documents) {
      const base = import.meta.env.BASE_URL
      expect(doc.viewUrl.startsWith(`${base}files/`)).toBe(true)
      expect(existsSync(join(process.cwd(), 'public', doc.viewUrl.slice(base.length)))).toBe(true)
      const card = screen.getByRole('article', { name: doc.title })
      const download = within(card).getByRole('link', { name: /download/i })
      expect(download).toHaveAttribute('href', doc.downloadUrl)
      expect(download).toHaveAttribute('download', doc.fileName)
    }
  })

  it('shows no visible Xuriti branding on any page in production builds', () => {
    vi.stubEnv('DEV', false)
    for (const r of pageRoutes) {
      const { container, unmount } = renderAt(r.path)
      expect(container.textContent ?? '').not.toMatch(/xuriti/i)
      unmount()
    }
  })
})
