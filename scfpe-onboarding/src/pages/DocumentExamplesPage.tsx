import {
  Camera,
  FileBadge,
  FileSignature,
  FileSpreadsheet,
  Home,
  IdCard,
  Landmark,
  Receipt,
  Store,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'wouter'
import { pathTo } from '../config/routes'
import { documentExamples, setupSteps, type ExampleIcon } from '../content/documents'
import { PageHeader } from '../components/page/PageHeader'
import { RelatedPages } from '../components/page/RelatedPages'
import { Reveal } from '../components/Reveal'
import { SectionLink } from '../routing/SectionLink'
import '../components/documents/documents.css'

const icons: Record<ExampleIcon, LucideIcon> = {
  id: IdCard,
  certificate: FileBadge,
  home: Home,
  bank: Landmark,
  receipt: FileSpreadsheet,
  cheque: Receipt,
  camera: Camera,
  store: Store,
  signature: FileSignature,
}

export function DocumentExamplesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Documents"
        title="Documents With Examples"
        intro="What each mandatory document looks like, and the three steps to get started."
        trail={[{ label: 'Documents', href: pathTo('documents') }, { label: 'Documents With Examples' }]}
      />

      <section className="page-section" aria-labelledby="steps-title">
        <div className="container">
          <div className="page-section__head">
            <h2 id="steps-title" className="page-section__title">
              3 steps to follow
            </h2>
            <p className="page-section__lead">
              Get the dealer app from the{' '}
              <SectionLink section="apps">Dealer apps section</SectionLink>.
            </p>
          </div>
          <ol className="setup-steps">
            {setupSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="page-section" aria-labelledby="examples-title">
        <div className="container">
          <div className="page-section__head">
            <h2 id="examples-title" className="page-section__title">
              List of Mandatory Documents
            </h2>
            <p className="page-section__lead">
              Which of these you need depends on your business type. See the{' '}
              <Link href={pathTo('documents')}>Documents List</Link> for your checklist.
            </p>
          </div>
          <ul className="example-grid">
            {documentExamples.map((ex, i) => {
              const Icon = icons[ex.icon]
              const wide = Boolean(ex.steps)
              return (
                <Reveal
                  as="li"
                  key={ex.title}
                  delay={0.03 * (i % 3)}
                  className={wide ? 'example-grid__wide' : undefined}
                >
                  <article className={`example-card${wide ? ' example-card--wide' : ''}`}>
                    <span className="example-card__icon">
                      <Icon size={24} strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <h3 className="example-card__title">{ex.title}</h3>
                    <p className="example-card__shows">{ex.shows}</p>
                    {ex.steps && (
                      <ol className="example-card__steps" aria-label="E-sign steps">
                        {ex.steps.map((s) => (
                          <li key={s}>{s}</li>
                        ))}
                      </ol>
                    )}
                  </article>
                </Reveal>
              )
            })}
          </ul>
        </div>
      </section>

      <RelatedPages ids={['documents', 'program-workflow', 'communications']} />
    </>
  )
}
