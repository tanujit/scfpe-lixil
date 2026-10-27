/**
 * Page migration map: every page of the original Google Site and its route in
 * this site. Plain data with no React imports, so vite.config.ts and the tests
 * can use it too.
 */

export const LEGACY_SITE = 'https://sites.google.com/xuriti.com/lixilgrohe'

export type RouteId =
  | 'home'
  | 'program-workflow'
  | 'program-details'
  | 'documents'
  | 'document-examples'
  | 'payments'
  | 'communications'

export interface PageRoute {
  id: RouteId
  path: string
  /** Browser tab title (the site suffix is added automatically). */
  title: string
  /** Short label used in navigation. */
  navLabel: string
  /** Original Google Sites page this route replaces. */
  legacyUrl: string
  /** Original page title on the Google Site. */
  legacyTitle: string
  /** Old slug, kept working as an alias that redirects here. */
  legacySlug: string
}

export const pageRoutes: PageRoute[] = [
  {
    id: 'home',
    path: '/',
    title: 'Dealer Onboarding',
    navLabel: 'Home',
    legacyUrl: `${LEGACY_SITE}/home`,
    legacyTitle: 'Onboarding guide',
    legacySlug: 'home',
  },
  {
    id: 'program-workflow',
    path: '/program-workflow',
    title: 'Program Workflow',
    navLabel: 'Program workflow',
    legacyUrl: `${LEGACY_SITE}/program-workflow`,
    legacyTitle: 'Onboarding guide - Program Workflow',
    legacySlug: 'program-workflow',
  },
  {
    id: 'program-details',
    path: '/program-details',
    title: 'Program Details',
    navLabel: 'Program details',
    legacyUrl: `${LEGACY_SITE}/more-details`,
    legacyTitle: 'Onboarding guide - More Details',
    legacySlug: 'more-details',
  },
  {
    id: 'documents',
    path: '/documents',
    title: 'Documents List',
    navLabel: 'Documents list',
    legacyUrl: `${LEGACY_SITE}/documents-list`,
    legacyTitle: 'Onboarding guide - Documents List',
    legacySlug: 'documents-list',
  },
  {
    id: 'document-examples',
    path: '/documents/examples',
    title: 'Documents With Examples',
    navLabel: 'Document examples',
    legacyUrl: `${LEGACY_SITE}/documents-with-example`,
    legacyTitle: 'Onboarding guide - Documents With Example',
    legacySlug: 'documents-with-example',
  },
  {
    id: 'payments',
    path: '/payments',
    title: 'Payment Workflow',
    navLabel: 'Payments',
    legacyUrl: `${LEGACY_SITE}/payment-workflow`,
    legacyTitle: 'Onboarding guide - Payment Workflow',
    legacySlug: 'payment-workflow',
  },
  {
    id: 'communications',
    path: '/communications',
    title: 'Communications',
    navLabel: 'Communications',
    legacyUrl: `${LEGACY_SITE}/communications`,
    legacyTitle: 'Onboarding guide - Communications',
    legacySlug: 'communications',
  },
]

export const routeById = Object.fromEntries(pageRoutes.map((r) => [r.id, r])) as Record<
  RouteId,
  PageRoute
>

export const pathTo = (id: RouteId) => routeById[id].path

/** Old Google Sites slugs that differ from the new path, e.g. /more-details → /program-details. */
export const legacyAliases = pageRoutes
  .filter((r) => `/${r.legacySlug}` !== r.path)
  .map((r) => ({ from: `/${r.legacySlug}`, to: r.path }))

export const SITE_TITLE_SUFFIX = 'LIXIL | GROHE Dealer Onboarding | SCFPe'
