import { ArrowUpRight, Smartphone, TabletSmartphone } from 'lucide-react'
import type { DealerApp } from '../config/site'
import { ExternalAnchor } from './ExternalAnchor'
import { VerificationNote } from './VerificationNote'

export function DealerAppCard({ app }: { app: DealerApp }) {
  const Icon = app.id === 'android' ? TabletSmartphone : Smartphone
  const titleId = `app-${app.id}-title`
  return (
    <article className="app-card" aria-labelledby={titleId}>
      <div className="app-card__head">
        <span className="app-card__icon">
          <Icon size={24} strokeWidth={1.75} aria-hidden="true" />
        </span>
        <span className="app-card__platform">{app.platform}</span>
      </div>
      <h3 id={titleId} className="app-card__title">
        {app.title}
      </h3>
      <p className="app-card__desc">{app.description}</p>
      <VerificationNote status={app.link.status} note={app.link.note} />
      <ExternalAnchor
        href={app.link.href}
        className="btn btn--dark app-card__cta"
        aria-label={`${app.link.label} on ${app.storeLabel} (opens in a new tab)`}
      >
        <span className="app-card__cta-text" aria-hidden="true">
          <span className="app-card__cta-kicker">Get it on</span>
          <span className="app-card__cta-store">{app.storeLabel}</span>
        </span>
        <ArrowUpRight size={20} className="app-card__cta-arrow" aria-hidden="true" />
      </ExternalAnchor>
    </article>
  )
}
