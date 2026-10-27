import { Link } from 'wouter'
import { pageRoutes } from '../config/routes'
import { PageHeader } from '../components/page/PageHeader'

export function NotFoundPage() {
  return (
    <>
      <PageHeader
        eyebrow="Page not found"
        title="We couldn’t find that page"
        intro="The address may be mistyped, or the page may have moved. These are the pages in this guide:"
        trail={[{ label: 'Page not found' }]}
      />
      <section className="page-section">
        <div className="container">
          <ul className="not-found__list">
            {pageRoutes.map((r) => (
              <li key={r.id}>
                <Link href={r.path}>{r.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
