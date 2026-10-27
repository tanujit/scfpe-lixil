import type { ReactNode } from 'react'
import { Link } from 'wouter'
import { ChevronRight } from 'lucide-react'
import { m } from 'motion/react'
import { pathTo } from '../../config/routes'
import './page.css'

interface PageHeaderProps {
  eyebrow: string
  title: string
  intro?: ReactNode
  /** Breadcrumb trail after Home, last item is the current page. */
  trail: { label: string; href?: string }[]
  aside?: ReactNode
}

export function PageHeader({ eyebrow, title, intro, trail, aside }: PageHeaderProps) {
  return (
    <header className="page-header">
      <div className="container">
        <div className="page-header__panel">
          <div className="page-header__backdrop" aria-hidden="true" />
          <nav aria-label="Breadcrumb" className="breadcrumb">
            <ol>
              <li>
                <Link href={pathTo('home')}>Home</Link>
              </li>
              {trail.map((crumb, i) => (
                <li key={crumb.label}>
                  <ChevronRight size={14} aria-hidden="true" />
                  {i === trail.length - 1 ? (
                    <span aria-current="page">{crumb.label}</span>
                  ) : crumb.href ? (
                    <Link href={crumb.href}>{crumb.label}</Link>
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <div className="page-header__body">
            <m.div
              className="page-header__text"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="page-header__eyebrow">{eyebrow}</p>
              <h1 className="page-header__title">{title}</h1>
              {intro && <p className="page-header__intro">{intro}</p>}
            </m.div>
            {aside && <div className="page-header__aside">{aside}</div>}
          </div>
        </div>
      </div>
    </header>
  )
}
