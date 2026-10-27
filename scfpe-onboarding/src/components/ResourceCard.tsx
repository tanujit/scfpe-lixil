import { Download, Eye } from 'lucide-react'
import type { DocumentResource } from '../config/site'
import { ExternalAnchor } from './ExternalAnchor'
import { VerificationNote } from './VerificationNote'

export function ResourceCard({ doc, featured = false }: { doc: DocumentResource; featured?: boolean }) {
  const titleId = `doc-${doc.id}-title`
  return (
    <article className={`resource-card${featured ? ' resource-card--featured' : ''}`} aria-labelledby={titleId}>
      <div className="resource-card__file" aria-hidden="true">
        <span className="resource-card__fold" />
        <span className="resource-card__type">{doc.fileType}</span>
      </div>

      <div className="resource-card__body">
        <h3 id={titleId} className="resource-card__title">
          {doc.title}
        </h3>
        <p className="resource-card__meta">
          <span className="resource-card__filename">{doc.fileName}</span>
          <span aria-hidden="true">·</span>
          <span>
            {doc.fileType}, {doc.size}
            {doc.pages ? `, ${doc.pages} pages` : ''}
          </span>
        </p>
        <p className="resource-card__desc">{doc.description}</p>
        <VerificationNote status={doc.status} note={doc.note} />
      </div>

      <div className="resource-card__actions">
        <ExternalAnchor href={doc.viewUrl} className={`btn ${featured ? 'btn--dark' : 'btn--outline'}`}>
          <Eye size={18} aria-hidden="true" />
          View PDF
          <span className="visually-hidden">: {doc.title}</span>
        </ExternalAnchor>
        {/* Same-site file: save it directly rather than opening a new tab. */}
        <a href={doc.downloadUrl} download={doc.fileName} className="btn btn--outline">
          <Download size={18} aria-hidden="true" />
          Download
          <span className="visually-hidden">
            {' '}
            {doc.title}, {doc.size}
          </span>
        </a>
      </div>
    </article>
  )
}
