import { m } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'wouter'
import { pageRoutes } from '../config/routes'
import { pageSummaries } from '../config/site'
import { Reveal } from './Reveal'
import './ProgramGuideSection.css'

const guidePages = pageRoutes.filter((r) => r.id !== 'home')

export function ProgramGuideSection() {
  return (
    <section id="program" className="section program" aria-labelledby="program-title">
      <div className="container">
        <Reveal className="program__head">
          <div className="section-head">
            <p className="eyebrow">Program guide</p>
            <h2 id="program-title" className="section-title">
              Program details, documents and payments
            </h2>
            <p className="section-lead">
              Everything about the program, from the discount plan to the documents you need and
              how payments work.
            </p>
          </div>
        </Reveal>

        <ul className="program__grid">
          {guidePages.map((page, i) => (
            <m.li
              key={page.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.04 * i }}
            >
              <Link href={page.path} className="program-card">
                <span className="program-card__index" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="program-card__text">
                  <span className="program-card__title">{page.title}</span>
                  <span className="program-card__desc">
                    {pageSummaries[page.id as Exclude<typeof page.id, 'home'>]}
                  </span>
                </span>
                <ArrowRight className="program-card__arrow" size={20} aria-hidden="true" />
              </Link>
            </m.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
