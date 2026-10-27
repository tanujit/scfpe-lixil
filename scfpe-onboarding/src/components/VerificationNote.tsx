import { TriangleAlert } from 'lucide-react'
import type { VerificationStatus } from '../config/site'

/**
 * Shows a reviewer-facing note for destinations that still need checking.
 * Rendered in development builds only, so dealers never see internal notes.
 */
export function VerificationNote({ status, note }: { status: VerificationStatus; note?: string }) {
  if (!import.meta.env.DEV || status === 'verified' || !note) return null
  return (
    <p className="status-note">
      <TriangleAlert size={14} aria-hidden="true" />
      <span>
        <strong>Review before release:</strong> {note}
      </span>
    </p>
  )
}
