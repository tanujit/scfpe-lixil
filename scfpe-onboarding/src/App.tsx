import { Redirect, Route, Router, Switch, useLocation, type BaseLocationHook } from 'wouter'
import { legacyAliases, pathTo } from './config/routes'
import { SiteHeader } from './components/SiteHeader'
import { SiteFooter } from './components/SiteFooter'
import { RouteEffects } from './routing/RouteEffects'
import { HomePage } from './pages/HomePage'
import { ProgramWorkflowPage } from './pages/ProgramWorkflowPage'
import { ProgramDetailsPage } from './pages/ProgramDetailsPage'
import { DocumentsPage } from './pages/DocumentsPage'
import { DocumentExamplesPage } from './pages/DocumentExamplesPage'
import { PaymentsPage } from './pages/PaymentsPage'
import { CommunicationsPage } from './pages/CommunicationsPage'
import { NotFoundPage } from './pages/NotFoundPage'

export function AppRoutes() {
  const [location] = useLocation()
  // Static hosts such as GitHub Pages redirect /payments to /payments/ (it is a
  // folder with an index.html). Drop the slash so titles and active states match.
  if (location.length > 1 && location.endsWith('/')) {
    return <Redirect to={location.replace(/\/+$/, '') + window.location.search + window.location.hash} replace />
  }
  return (
    <Switch>
      <Route path={pathTo('home')} component={HomePage} />
      <Route path={pathTo('program-workflow')} component={ProgramWorkflowPage} />
      <Route path={pathTo('program-details')} component={ProgramDetailsPage} />
      <Route path={pathTo('documents')} component={DocumentsPage} />
      <Route path={pathTo('document-examples')} component={DocumentExamplesPage} />
      <Route path={pathTo('payments')} component={PaymentsPage} />
      <Route path={pathTo('communications')} component={CommunicationsPage} />
      {/* Old Google Sites slugs keep working, e.g. /more-details → /program-details. */}
      {legacyAliases.map((a) => (
        <Route key={a.from} path={a.from}>
          <Redirect to={a.to} replace />
        </Route>
      ))}
      <Route component={NotFoundPage} />
    </Switch>
  )
}

export function AppShell() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <RouteEffects />
      <SiteHeader />
      <main id="main" tabIndex={-1}>
        <AppRoutes />
      </main>
      <SiteFooter />
    </>
  )
}

// The site may be served from a sub-path (GitHub Pages project sites), e.g.
// /scfpe-lixil/. Vite's base becomes the router base, without its trailing slash.
const routerBase = import.meta.env.BASE_URL.replace(/\/$/, '')

/** `hook` lets tests render any route with wouter's memory location. */
export default function App({ hook }: { hook?: BaseLocationHook }) {
  return (
    <Router hook={hook} base={hook ? '' : routerBase}>
      <AppShell />
    </Router>
  )
}
