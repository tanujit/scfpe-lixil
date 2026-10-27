import { Fragment } from 'react'
import { m, type Variants } from 'motion/react'
import { ArrowRight, BadgeCheck, FileText, ShieldCheck, type LucideIcon } from 'lucide-react'
import { Link } from 'wouter'
import { pathTo } from '../config/routes'
import { onboardingSteps } from '../config/site'
import { Reveal } from './Reveal'
import './OnboardingWorkflow.css'

const icons: LucideIcon[] = [FileText, ShieldCheck, BadgeCheck]
const operators = ['+', '=']

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
}

const step: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

const operator: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
}

export function OnboardingWorkflow() {
  return (
    <section id="onboarding" className="section workflow" aria-labelledby="workflow-title">
      <div className="container">
        <Reveal className="section-head section-head--center">
          <p className="eyebrow">Onboarding guide</p>
          <h2 id="workflow-title" className="section-title workflow__equation">
            <span>Complete Document</span> <span className="workflow__op">+</span>{' '}
            <span>Validation</span> <span className="workflow__op">=</span>{' '}
            <span className="workflow__result">Successful Onboarding</span>
          </h2>
          <p className="section-lead">
            Onboarding comes down to two things: complete documentation and validation.
          </p>
        </Reveal>

        <m.ol
          className="workflow__steps"
          variants={list}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
        >
          {onboardingSteps.map((s, i) => {
            const Icon = icons[i]
            const isResult = i === onboardingSteps.length - 1
            return (
              <Fragment key={s.number}>
                <m.li
                  variants={step}
                  className={`workflow-step${isResult ? ' workflow-step--result' : ''}`}
                >
                  <div className="workflow-step__top">
                    <span className="workflow-step__icon">
                      <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span className="workflow-step__number" aria-hidden="true">
                      {s.number}
                    </span>
                  </div>
                  <h3 className="workflow-step__title">
                    <span className="visually-hidden">Step {i + 1}: </span>
                    {s.title}
                  </h3>
                  <p className="workflow-step__body">{s.body}</p>
                </m.li>
                {i < operators.length && (
                  <m.li variants={operator} className="workflow__connector" aria-hidden="true">
                    <span className="workflow__connector-chip">{operators[i]}</span>
                  </m.li>
                )}
              </Fragment>
            )
          })}
        </m.ol>

        <Reveal className="workflow__footer" delay={0.1}>
          <Link href={pathTo('documents')} className="btn btn--outline">
            See the documents list
            <ArrowRight size={18} className="btn-arrow" aria-hidden="true" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
