import { m, type Variants } from 'motion/react'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { brand } from '../config/site'
import { HeroVisual } from './HeroVisual'
import './HeroSection.css'

const group: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container">
        <div className="hero__panel">
          <div className="hero__backdrop" aria-hidden="true" />

          <m.div className="hero__content" variants={group} initial="hidden" animate="show">
            <m.p className="hero__badge" variants={item}>
              <span className="hero__badge-program">{brand.programLong}</span>
              <span className="hero__badge-sep" aria-hidden="true" />
              <span>{brand.poweredBy}</span>
            </m.p>

            <m.h1 id="hero-title" className="hero__title" variants={item}>
              A simpler path to <span className="hero__title-accent">successful dealer onboarding.</span>
            </m.h1>

            <m.p className="hero__lead" variants={item}>
              Complete your onboarding documentation, validate your details, and access the
              resources you need to get started.
            </m.p>

            <m.div className="hero__actions" variants={item}>
              <a href="#onboarding" className="btn btn--primary on-dark">
                View Onboarding Steps
                <ArrowDown size={18} aria-hidden="true" />
              </a>
              <a href="#resources" className="btn btn--ghost-dark">
                Access Resources
                <ArrowRight size={18} className="btn-arrow" aria-hidden="true" />
              </a>
            </m.div>
          </m.div>

          <m.div
            className="hero__visual"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            <HeroVisual />
          </m.div>
        </div>
      </div>
    </section>
  )
}
