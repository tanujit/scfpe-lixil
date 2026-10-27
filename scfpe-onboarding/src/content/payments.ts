/**
 * "Payment Workflow" page. The original shows one heading,
 * "What is Virtual Account Number [ VAN ]", and an image of bank details.
 *
 * The account is an escrow whose number contains "XURTI" (the previous
 * provider). The project owner confirmed on 2026-10-23 that it is still the
 * program's current collection account (audit item B1), so it is published.
 * If it changes, update the values here; set `VERIFIED = false` to hide the
 * details from dealers again (and compile them out of production builds).
 */

export interface PaymentAccount {
  verified: boolean
  verifiedNote: string
  fields: { label: string; value: string }[]
}

export const vanHeading = 'What is Virtual Account Number [ VAN ]'

const VERIFIED = true

export const paymentAccount: PaymentAccount = {
  verified: VERIFIED,
  verifiedNote:
    'Transcribed from the original Payment Workflow page and confirmed current by the project owner on 2026-10-23.',
  // Unverified details are compiled out of production builds entirely.
  fields: !VERIFIED && !import.meta.env.DEV ? [] : [
    { label: 'Name', value: 'India Sanitary Solutions' },
    { label: 'Bank', value: 'ICICI' },
    { label: 'A/C No', value: 'ESCROWXURTI2IND99000' },
    { label: 'Branch', value: 'CMS' },
    { label: 'IFSC Code', value: 'ICIC0000104' },
    { label: 'Brand Address', value: 'Mumbai' },
    { label: 'Location', value: 'Mumbai' },
  ],
}
