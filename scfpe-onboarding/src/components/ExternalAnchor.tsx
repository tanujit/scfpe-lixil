import type { AnchorHTMLAttributes } from 'react'

/** Link that opens in a new tab with safe rel attributes and a screen-reader hint. */
export function ExternalAnchor({ children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  )
}
