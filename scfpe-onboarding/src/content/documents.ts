/**
 * "List of Mandatory Documents ... for Lixil credit program - 2023", transcribed
 * from Lixil_List of documents.pdf (the file embedded on the Documents List page).
 * Bracketed notes from the PDF are kept as `note`. Where the PDF named Xuriti as
 * the provider, PROVIDER is used instead (audit item B3).
 */
import { brand } from '../config/site'

const PROVIDER = brand.provider

export interface RequiredDocument {
  name: string
  note?: string
}

export interface DocumentGroup {
  heading: string
  items: RequiredDocument[]
}

export interface BusinessTypeChecklist {
  id: 'proprietorship' | 'partnership' | 'private-limited'
  label: string
  groups: DocumentGroup[]
}

const ADDRESS_NOTE = 'Rental agreement or Any utility bill - document not older than 1 month'
const SIGNED = 'Digital & Photocopy Signed'
const UDYAM_NOTE = `If not available, ${PROVIDER} will create for no cost`
const BANK_NOTE = 'Sanction letter required in case of OD/CC a/c'
const CHEQUE_NOTE = 'Required post credit assessment'

export const checklistProgram = 'for Lixil credit program - 2023'

export const checklists: BusinessTypeChecklist[] = [
  {
    id: 'proprietorship',
    label: 'Proprietorship',
    groups: [
      {
        heading: 'Basic KYC',
        items: [
          { name: 'Owner’s Aadhaar Card', note: SIGNED },
          { name: 'Owner’s Pan Card', note: SIGNED },
          { name: 'GST Certificate' },
          { name: 'Business Address Proof', note: ADDRESS_NOTE },
          { name: 'Residence Address Proof', note: ADDRESS_NOTE },
          { name: 'Udyam Aadhaar', note: UDYAM_NOTE },
        ],
      },
      {
        heading: 'Financial',
        items: [
          { name: 'GSTR-3B of recent 1 year or GSTR Filing Documents' },
          { name: 'Bank statement of recent 1 year (PDF only)', note: BANK_NOTE },
          { name: 'Audited Financial Statements (Recent 2 years)' },
          { name: '3 Security Cheques in the name of', note: CHEQUE_NOTE },
          { name: 'eNACH', note: `${PROVIDER} to initiate the process online, dealer to complete` },
        ],
      },
      {
        heading: 'Photos',
        items: [
          { name: 'Owner’s photo' },
          { name: 'Business name board photo' },
          { name: 'Relevant Inventory photo' },
        ],
      },
    ],
  },
  {
    id: 'partnership',
    label: 'Partnership Firm / LLP',
    groups: [
      {
        heading: 'Basic KYC',
        items: [
          { name: 'GST Certificate' },
          { name: 'Partnership Deed / Limited Liability Agreement' },
          { name: 'All partners’ Aadhaar Card', note: SIGNED },
          { name: 'All partners’ Pan Card', note: SIGNED },
          { name: 'Firm Pan Card', note: SIGNED },
          { name: 'Business Address Proof', note: ADDRESS_NOTE },
          { name: 'All partners’ Residence Address Proof', note: ADDRESS_NOTE },
          { name: 'Udyam Aadhaar', note: UDYAM_NOTE },
        ],
      },
      {
        heading: 'Financials',
        items: [
          { name: 'GSTR-3B of recent 1 year or GSTR Filing Documents' },
          { name: 'Bank statement of recent 1 year (PDF only)', note: BANK_NOTE },
          { name: 'Audited Financial Statements (Recent 2 years)' },
          { name: 'eNACH', note: `${PROVIDER} will initiate the process post credit assessment` },
          { name: '3 Security Cheques in the name of', note: CHEQUE_NOTE },
        ],
      },
      {
        heading: 'Photos',
        items: [
          { name: 'All partners’ photo' },
          { name: 'Business name board photo' },
          { name: 'Relevant Inventory photo' },
        ],
      },
    ],
  },
  {
    id: 'private-limited',
    label: 'Private Limited Company',
    groups: [
      {
        heading: 'Basic KYC',
        items: [
          { name: 'GST Certificate' },
          { name: 'Aadhaar Card of all directors', note: SIGNED },
          { name: 'PAN Card of all directors', note: SIGNED },
          { name: 'Firm Pan Card', note: 'Digital & Photocopy signed' },
          { name: 'Business Address Proof', note: ADDRESS_NOTE },
          { name: 'Residence Address Proof of all directors', note: ADDRESS_NOTE },
          { name: 'Udyam Aadhaar', note: UDYAM_NOTE },
          { name: 'Board resolution', note: 'Signatory Authority' },
          { name: 'MOA & AOA, COI' },
        ],
      },
      {
        heading: 'Financials',
        items: [
          { name: 'GSTR-3B of recent 1 year or GSTR Filing Documents' },
          { name: 'Bank statement of recent 1 year (PDF only)', note: BANK_NOTE },
          { name: 'Audited Financial Statements (Recent 2 years)' },
          { name: 'eNACH', note: `${PROVIDER} will initiate the process post credit assessment` },
          { name: '3 Security Cheques in the name of', note: CHEQUE_NOTE },
        ],
      },
      {
        heading: 'Photos',
        items: [
          { name: 'All directors’ photo' },
          { name: 'Business name board photo' },
          { name: 'Relevant Inventory photo' },
        ],
      },
    ],
  },
]

/**
 * "List of Mandatory Documents" page (Documents With Example). The original
 * shows one example image per item; the images were not migrated (audit item G2),
 * so each card describes what the example showed.
 */
export const setupSteps = ['Download the dealer mobile app', 'Create an account', 'Verify GST']

export type ExampleIcon = 'id' | 'certificate' | 'home' | 'bank' | 'receipt' | 'cheque' | 'camera' | 'store' | 'signature'

export interface DocumentExample {
  title: string
  shows: string
  icon: ExampleIcon
  steps?: string[]
}

export const documentExamples: DocumentExample[] = [
  { title: 'PAN Card', shows: 'An Income Tax Department PAN card with the Permanent Account Number, photo and signature.', icon: 'id' },
  { title: 'Aadhaar Card', shows: 'The front and back of an Aadhaar card issued by the Unique Identification Authority of India.', icon: 'id' },
  { title: 'GST Certificate', shows: 'A GST Registration Certificate (Form GST REG-06) with the registration number, legal name and constitution of business.', icon: 'certificate' },
  { title: 'Udyam Aadhaar', shows: 'A Udyam Registration Certificate from the Ministry of Micro, Small and Medium Enterprises.', icon: 'certificate' },
  { title: 'Address Proof', shows: 'Three accepted examples: an electricity bill, a water bill and a rental agreement.', icon: 'home' },
  { title: 'Bank Statement', shows: 'A bank statement showing the statement period, account number and transactions.', icon: 'bank' },
  { title: 'GSTR-3B', shows: 'A Form GSTR-3B return with tax on outward supplies and inter-state supplies.', icon: 'receipt' },
  { title: 'Security Cheque', shows: 'A blank cheque leaf marked with where the customer signs.', icon: 'cheque' },
  { title: 'Owner’s Photo', shows: 'A photo of the business owner at their desk.', icon: 'camera' },
  { title: 'Business Name Board Photo', shows: 'A photo of the shop front with the business name board visible.', icon: 'store' },
  { title: 'Relevant Inventory Photo', shows: 'A photo of the showroom with sanitaryware inventory on display.', icon: 'store' },
  {
    title: 'E-sign Agreement',
    shows: 'The agreement is signed online through SignDesk, using Aadhaar and an OTP.',
    icon: 'signature',
    steps: ['Open the invitation to sign', 'Owner’s Name', 'Enter Aadhar No.', 'Enter OTP', 'Document signed'],
  },
]
