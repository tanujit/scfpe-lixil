import { ArrowRight } from 'lucide-react'
import { Link } from 'wouter'
import { pathTo } from '../config/routes'
import { documents } from '../config/site'
import { checklistProgram } from '../content/documents'
import { PageHeader } from '../components/page/PageHeader'
import { RelatedPages } from '../components/page/RelatedPages'
import { ChecklistTabs } from '../components/documents/ChecklistTabs'
import { ResourceCard } from '../components/ResourceCard'
import { Reveal } from '../components/Reveal'
import '../components/ResourceSection.css'

const documentsList = documents.find((d) => d.id === 'documents-list')!
const brochure = documents.find((d) => d.id === 'brochure')!

export function DocumentsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Documents"
        title="List of Mandatory Documents"
        intro={`The documents required for each type of business, ${checklistProgram}.`}
        trail={[{ label: 'Documents' }, { label: 'Documents List' }]}
      />

      <section className="page-section" aria-labelledby="checklist-title">
        <div className="container">
          <div className="page-section__head">
            <h2 id="checklist-title" className="page-section__title">
              Choose your business type
            </h2>
            <p className="page-section__lead">
              The notes under each document come from the published list.
            </p>
          </div>
          <Reveal>
            <ChecklistTabs />
          </Reveal>
          <div className="page-section__actions">
            <Link href={pathTo('document-examples')} className="btn btn--outline">
              See what each document looks like
              <ArrowRight size={18} className="btn-arrow" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="page-section" aria-labelledby="downloads-title">
        <div className="container">
          <div className="page-section__head">
            <h2 id="downloads-title" className="page-section__title">
              Download the documents
            </h2>
          </div>
          <div className="resources__grid">
            <Reveal className="resources__item">
              <ResourceCard doc={documentsList} featured />
            </Reveal>
            <Reveal className="resources__item" delay={0.08}>
              <ResourceCard doc={brochure} />
            </Reveal>
          </div>
        </div>
      </section>

      <RelatedPages ids={['document-examples', 'program-workflow', 'payments']} />
    </>
  )
}
