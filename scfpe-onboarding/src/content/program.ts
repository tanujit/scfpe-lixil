/**
 * Program content transcribed from the original Google Site images
 * (Program Workflow and More Details pages), checked 2026-10-23.
 * Figures are copied exactly; see MIGRATION_AUDIT.md for source notes.
 *
 * Where the source named Xuriti as the technology provider, the text uses
 * PROVIDER instead. That substitution needs business sign-off (audit item B3).
 */
import { brand } from '../config/site'

const PROVIDER = brand.provider

export interface DiscountSlab {
  days: string
  /** Rendered with ordinal superscripts, e.g. 8th - 15th. */
  label: [string, string]
  percent: number
}

/** "Payment Day / New Discount Plan" chart. */
export const discountSlabs: DiscountSlab[] = [
  { days: '0 - 7', label: ['0', '7th'], percent: 2.5 },
  { days: '8 - 15', label: ['8th', '15th'], percent: 2 },
  { days: '16 - 30', label: ['16th', '30th'], percent: 1 },
  { days: '31 - 45', label: ['31st', '45th'], percent: 0 },
]

/** "Benefits for Partners" (Program Workflow page). */
export const partnerBenefits = [
  'Interest-Free credit for 45 days',
  'Discounts available till 30th day',
  'Partial payments are eligible for discounts',
]

/** "Sample Calculations" table (Program Workflow page): discount % on gross value. */
export const sampleCalculationOnGross = {
  columns: [
    'Payment Day',
    'Invoice Value',
    'GST (Input Credit Available)',
    'Gross Value',
    'Discount % (on Gross)',
    'Discount Amount',
    'Amount Payable',
  ],
  rows: [
    ['0 - 7', '1,00,000', '18,000', '1,18,000', '2.5%', '2,950', '1,15,050'],
    ['8 - 15', '1,00,000', '18,000', '1,18,000', '2%', '2,360', '1,15,640'],
    ['16 - 30', '1,00,000', '18,000', '1,18,000', '1%', '1,180', '1,16,820'],
    ['31 - 45', '1,00,000', '18,000', '1,18,000', '0%', '0', '1,18,000'],
  ],
}

/** Sample table from the program flyer (More Details page): discount % on invoice value. */
export const sampleCalculationOnInvoice = {
  columns: [
    'Payment Day',
    'Invoice Value',
    'Discount %',
    'Discount Amount',
    'After Discount',
    'GST (Input Credit available)',
    'Amount Payable',
  ],
  rows: [
    ['0 - 7 days', '1,00,000', '2.5%', '2500', '97,500', '18,000', '1,15,500'],
    ['8 - 15 days', '1,00,000', '2%', '2000', '98,000', '18,000', '1,16,000'],
    ['16 - 30 days', '1,00,000', '1%', '1000', '99,000', '18,000', '1,17,000'],
    ['31 - 45 days', '1,00,000', '0%', '0', '1,00,000', '18,000', '1,18,000'],
  ],
}

/** Credit note example (More Details page). */
export const creditNoteExample = {
  columns: ['Scenario', 'Invoice Value', 'GST', 'Gross Value (A)', 'Credit Note (B)', 'Outstanding Amount (A) - (B)'],
  rows: [
    ['Regular Invoice', '100,000', '18,000', '118,000', '0', '118,000'],
    ['CN Adjusted', '100,000', '18,000', '118,000', '50,000', '68,000'],
  ],
}

export type Party = 'manufacturer' | 'platform' | 'dealer' | 'financier'

export const parties: Record<Party, string> = {
  manufacturer: 'LIXIL | GROHE',
  platform: `${PROVIDER} Platform`,
  dealer: 'Dealer',
  financier: 'Financing Partner',
}

/** "How does the program work?" diagram, as numbered steps. */
export const programFlow: { step: number; from: Party; to: Party; title: string; note?: string }[] = [
  { step: 1, from: 'manufacturer', to: 'platform', title: 'Invoice pushed' },
  { step: 2, from: 'platform', to: 'dealer', title: 'Invoice shown in app' },
  { step: 3, from: 'platform', to: 'financier', title: 'Payment approval' },
  { step: 4, from: 'manufacturer', to: 'platform', title: 'POD pushed' },
  { step: 5, from: 'financier', to: 'manufacturer', title: 'Payment on 7th day', note: 'Gross Invoice - 2.5%' },
  {
    step: 6,
    from: 'dealer',
    to: 'financier',
    title: 'Payment before 45th day',
    note: 'Discount calculated on Net Invoice value',
  },
]

/** Lines drawn directly between LIXIL and the dealer in the same diagram. */
export const directFlows = [
  { from: 'manufacturer' as Party, to: 'dealer' as Party, title: 'Ships Invoice, Material' },
  { from: 'dealer' as Party, to: 'manufacturer' as Party, title: 'POD' },
]

/** "Dealer Onboarding Overview" diagram, grouped by who does what. */
export const onboardingOverview: { actor: string; items: string[] }[] = [
  { actor: 'LIXIL', items: ['Dealer data', 'Data validation', 'Educate dealers and convince them to join the program'] },
  { actor: PROVIDER, items: ['Program Education through telecalling and digital campaigns'] },
  { actor: 'Dealer', items: ['Completes KYC Digitally', 'E-sign Agreement'] },
  {
    actor: 'Financing Partner',
    items: ['Document verification', 'Customer Point Verification (CPV)', 'Credit assessment', 'Assign credit limit'],
  },
]

/** Program flyer (More Details page). */
export const programIntro = `LIXIL introduces its new dealer - friendly credit program in partnership with ${PROVIDER} to help dealers to grow their business`

export const flyerBenefits: { title: string; detail: string }[] = [
  { title: 'Interest-free credit up to 45 days', detail: '' },
  { title: 'Enjoy discounts till the 30th day', detail: '' },
  { title: 'Even part payments are', detail: 'eligible for discounts' },
  { title: 'Dynamic credit limits', detail: 'Quick turnaround on ad hoc limit increases' },
  { title: 'Simple easy-to-use payment interfaces,', detail: 'via WhatsApp and mobile app' },
  { title: 'Earn loyalty points', detail: 'and rewards' },
  { title: 'Build your business through', detail: 'digital marketing support for star performers' },
]

export const flyerBrands = ['GROHE', 'American Standard', 'Part of LIXIL']
