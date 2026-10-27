import { Info } from 'lucide-react'
import type { ReactNode } from 'react'

/** Small dealer-facing note, e.g. where two source figures differ. */
export function SourceNote({ children }: { children: ReactNode }) {
  return (
    <p className="source-note">
      <Info size={16} aria-hidden="true" />
      <span>{children}</span>
    </p>
  )
}
