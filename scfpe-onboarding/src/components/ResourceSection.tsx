import { documents } from '../config/site'
import { Reveal } from './Reveal'
import { ResourceCard } from './ResourceCard'
import './ResourceSection.css'

export function ResourceSection() {
  return (
    <section id="resources" className="section resources" aria-labelledby="resources-title">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">Onboarding resources</p>
          <h2 id="resources-title" className="section-title">
            Program documents
          </h2>
          <p className="section-lead">
            Open the brochure and the documents list in your browser, or download them to keep.
          </p>
        </Reveal>

        <div className="resources__grid">
          {documents.map((doc, i) => (
            <Reveal key={doc.id} delay={0.08 * i} className="resources__item">
              <ResourceCard doc={doc} featured={i === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
