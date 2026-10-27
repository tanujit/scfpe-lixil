import type { RouteId } from './routes'

/**
 * Central configuration for every destination and piece of program content
 * on the page. Change links here, never inside components.
 *
 * Verification notes (checked 2026-10-23) are kept beside each value.
 * See VERIFICATION.md for the full list of open items.
 */

export type VerificationStatus = 'verified' | 'needs-review'

export interface ExternalLink {
  label: string
  href: string
  status: VerificationStatus
  note?: string
}

export interface DocumentResource {
  id: string
  title: string
  fileName: string
  description: string
  fileType: 'PDF'
  size: string
  pages?: number
  viewUrl: string
  downloadUrl: string
  status: VerificationStatus
  note?: string
}

export interface DealerApp {
  id: 'android' | 'ios'
  platform: string
  title: string
  description: string
  storeLabel: string
  link: ExternalLink
}

export type SectionId = 'onboarding' | 'resources' | 'apps' | 'support'

/** Sections on the home page, used for in-page links and the active-section marker. */
export const homeSections: { id: SectionId; label: string }[] = [
  { id: 'onboarding', label: 'Onboarding steps' },
  { id: 'resources', label: 'Resources' },
  { id: 'apps', label: 'Dealer apps' },
  { id: 'support', label: 'Support' },
]

export const brand = {
  provider: 'SCFPe',
  program: 'LIXIL | GROHE',
  programLong: 'LIXIL | GROHE Dealer Onboarding',
  poweredBy: 'Powered by SCFPe',
  legalEntity: 'Spacempact Consulting Pvt Ltd.',
} as const

export type NavEntry =
  | { kind: 'page'; route: RouteId }
  | { kind: 'group'; label: string; routes: RouteId[] }

/** Header and mobile navigation. Every entry is a local route. */
export const primaryNav: NavEntry[] = [
  { kind: 'page', route: 'home' },
  { kind: 'group', label: 'Program', routes: ['program-workflow', 'program-details'] },
  { kind: 'group', label: 'Documents', routes: ['documents', 'document-examples'] },
  { kind: 'page', route: 'payments' },
  { kind: 'page', route: 'communications' },
]

/** Home-page anchor as a router path (the router adds the site base path). */
export const homeAnchor = (id: SectionId) => `/#${id}`

/** Home-page anchor as a full href, including the base path (e.g. /scfpe-lixil.github.io/#apps). */
export const homeHref = (id: SectionId) => `${import.meta.env.BASE_URL}#${id}`

export const scfpeLinks = {
  home: 'https://scfpe.tech/',
  contact: 'https://scfpe.tech/contact-us',
  privacy: 'https://scfpe.tech/privacy',
  terms: 'https://scfpe.tech/terms-of-service',
  linkedin: 'https://www.linkedin.com/company/scfpe',
  // Listed on scfpe.tech as the general business contact, not a dedicated
  // LIXIL/GROHE helpdesk. The phone number on scfpe.tech is shown as one
  // number but dials another, so it is intentionally left out.
  email: 'customer@scfpe.tech',
} as const

export const onboardingSteps = [
  {
    number: '01',
    title: 'Complete Documentation',
    body: 'Prepare the required documentation using the approved onboarding material.',
  },
  {
    number: '02',
    title: 'Validation',
    body: 'Complete the required validation process.',
  },
  {
    number: '03',
    title: 'Successful Onboarding',
    body: 'Proceed through the established onboarding process.',
  },
] as const

/** Short descriptions of each migrated page, used on cards and in related links. */
export const pageSummaries: Record<Exclude<RouteId, 'home'>, string> = {
  'program-workflow': 'Discount plan, partner benefits, sample calculations and how the program works.',
  'program-details': 'More details on the program and stakeholders, including discount slabs and credit notes.',
  documents: 'Mandatory documents for each business type, with the downloadable list.',
  'document-examples': 'What each mandatory document looks like, and the three steps to get started.',
  payments: 'The Virtual Account Number (VAN) used for program payments.',
  communications: 'The reminders and notifications dealers receive, when, and on which channels.',
}

// SCFPe-rebranded copies, served from public/files. The originals on Google Drive
// (still Xuriti-branded) are no longer linked; see MIGRATION_AUDIT.md.
const file = (name: string) => `${import.meta.env.BASE_URL}files/${name}`

export const documents: DocumentResource[] = [
  {
    id: 'brochure',
    title: 'LIXIL-GROHE Program Brochure',
    fileName: 'Lixil-Grohe_Brochure.pdf',
    description: 'The program brochure, including frequently asked questions from dealers.',
    fileType: 'PDF',
    size: '3.3 MB',
    pages: 2,
    viewUrl: file('Lixil-Grohe_Brochure.pdf'),
    downloadUrl: file('Lixil-Grohe_Brochure.pdf'),
    status: 'verified',
    note: 'SCFPe-rebranded copy of the brochure from the original Google Site.',
  },
  {
    id: 'documents-list',
    title: 'List of Mandatory Documents',
    fileName: 'Lixil_List_of_documents.pdf',
    description:
      'Mandatory documents for Proprietorship, Partnership Firm / LLP and Private Limited Company.',
    fileType: 'PDF',
    size: '97 KB',
    pages: 3,
    viewUrl: file('Lixil_List_of_documents.pdf'),
    downloadUrl: file('Lixil_List_of_documents.pdf'),
    status: 'verified',
    note: 'SCFPe-rebranded copy of the PDF embedded on the original Documents List page.',
  },
]

export const dealerApps: DealerApp[] = [
  {
    id: 'android',
    platform: 'Android',
    title: 'Dealer Android App',
    description: 'For Android phones and tablets.',
    storeLabel: 'Google Play',
    link: {
      label: 'Get the Android app',
      href: 'https://rb.gy/6dstl',
      status: 'needs-review',
      note: 'Redirects to play.google.com/store/apps/details?id=com.xuriti.app, which returned "Not Found" on 2026-10-23.',
    },
  },
  {
    id: 'ios',
    platform: 'iOS',
    title: 'Dealer iOS App',
    description: 'For iPhone.',
    storeLabel: 'App Store',
    link: {
      label: 'Get the iOS app',
      href: 'https://rb.gy/zu51h',
      status: 'needs-review',
      note: 'Redirects to apps.apple.com/in/app/xuriti-buyer/id6446220214, which showed an error page on 2026-10-23.',
    },
  },
]

