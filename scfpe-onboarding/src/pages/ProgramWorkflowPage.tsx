import { CheckCircle2, Sparkles } from 'lucide-react'
import { onboardingOverview, partnerBenefits, sampleCalculationOnGross } from '../content/program'
import { PageHeader } from '../components/page/PageHeader'
import { DataTable } from '../components/page/DataTable'
import { RelatedPages } from '../components/page/RelatedPages'
import { DiscountPlan } from '../components/program/DiscountPlan'
import { ProgramFlow } from '../components/program/ProgramFlow'
import { Reveal } from '../components/Reveal'

export function ProgramWorkflowPage() {
  return (
    <>
      <PageHeader
        eyebrow="Program"
        title="Program Workflow"
        intro="The discount plan, partner benefits, sample calculations, and how invoices, approvals and payments move through the program."
        trail={[{ label: 'Program' }, { label: 'Program Workflow' }]}
      />

      <section className="page-section" aria-labelledby="plan-title">
        <div className="container split">
          <Reveal className="card">
            <h2 id="plan-title" className="card__title">
              New Discount Plan
            </h2>
            <DiscountPlan />
          </Reveal>
          <Reveal className="card" delay={0.08}>
            <h2 className="card__title">Benefits for Partners</h2>
            <ul className="benefit-list">
              {partnerBenefits.map((b) => (
                <li key={b}>
                  <span className="benefit-list__icon">
                    <Sparkles size={18} aria-hidden="true" />
                  </span>
                  <span className="benefit-list__text">{b}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section className="page-section" aria-labelledby="calc-title">
        <div className="container">
          <div className="page-section__head">
            <h2 id="calc-title" className="page-section__title">
              Sample Calculations
            </h2>
            <p className="page-section__lead">
              For an invoice value of 1,00,000 with 18,000 GST, by payment day. The discount
              percentage applies to the gross value.
            </p>
          </div>
          <Reveal>
            <DataTable
              caption="Sample calculations by payment day, discount on gross value"
              columns={sampleCalculationOnGross.columns}
              rows={sampleCalculationOnGross.rows}
              highlightColumn={6}
            />
          </Reveal>
        </div>
      </section>

      <section className="page-section" aria-labelledby="flow-title">
        <div className="container">
          <div className="page-section__head">
            <h2 id="flow-title" className="page-section__title">
              How does the program work?
            </h2>
          </div>
          <ProgramFlow />
        </div>
      </section>

      <section className="page-section" aria-labelledby="overview-title">
        <div className="container">
          <div className="page-section__head">
            <h2 id="overview-title" className="page-section__title">
              Dealer Onboarding Overview
            </h2>
          </div>
          <ul className="actor-grid">
            {onboardingOverview.map((group, i) => (
              <Reveal as="li" key={group.actor} delay={0.06 * i} className="actor-card">
                <h3 className="actor-card__name">{group.actor}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={16} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <RelatedPages ids={['program-details', 'documents', 'payments']} />
    </>
  )
}
