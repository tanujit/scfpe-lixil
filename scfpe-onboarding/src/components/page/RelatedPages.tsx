import { Link } from 'wouter'
import { ArrowRight } from 'lucide-react'
import { routeById, type RouteId } from '../../config/routes'
import { pageSummaries } from '../../config/site'

type PageId = Exclude<RouteId, 'home'>

/** "Continue with" links to related migrated pages. */
export function RelatedPages({ ids, title = 'Continue with' }: { ids: PageId[]; title?: string }) {
  return (
    <section className="related" aria-labelledby="related-title">
      <div className="container">
        <h2 id="related-title" className="related__title">
          {title}
        </h2>
        <ul className="related__grid">
          {ids.map((id) => (
            <li key={id}>
              <Link href={routeById[id].path} className="related-card">
                <span className="related-card__text">
                  <span className="related-card__label">{routeById[id].navLabel}</span>
                  <span className="related-card__desc">{pageSummaries[id]}</span>
                </span>
                <ArrowRight size={20} className="related-card__arrow" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
