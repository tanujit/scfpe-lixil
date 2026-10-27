import {
  BadgePercent,
  CalendarClock,
  Gauge,
  Megaphone,
  PiggyBank,
  Smartphone,
  Trophy,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'wouter'
import { pathTo } from '../config/routes'
import {
  creditNoteExample,
  flyerBenefits,
  flyerBrands,
  programIntro,
  sampleCalculationOnInvoice,
} from '../content/program'
import { PageHeader } from '../components/page/PageHeader'
import { DataTable } from '../components/page/DataTable'
import { RelatedPages } from '../components/page/RelatedPages'
import { SourceNote } from '../components/page/SourceNote'
import { DiscountPlan } from '../components/program/DiscountPlan'
import { Reveal } from '../components/Reveal'

const benefitIcons: LucideIcon[] = [CalendarClock, BadgePercent, PiggyBank, Gauge, Smartphone, Trophy, Megaphone]

export function ProgramDetailsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Program"
        title="More details on the Program & Stakeholders"
        intro={programIntro}
        trail={[{ label: 'Program' }, { label: 'Program Details' }]}
        aside={
          <ul className="brand-list" aria-label="Brands in the program">
            {flyerBrands.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        }
      />

      <section className="page-section" aria-labelledby="benefits-title">
        <div className="container">
          <div className="page-section__head">
            <h2 id="benefits-title" className="page-section__title">
              What the program offers dealers
            </h2>
          </div>
          <ul className="feature-grid">
            {flyerBenefits.map((b, i) => {
              const Icon = benefitIcons[i]
              return (
                <Reveal as="li" key={b.title} delay={0.04 * i} className="feature-card">
                  <span className="feature-card__icon">
                    <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <p>
                    <strong>{b.title}</strong> {b.detail}
                  </p>
                </Reveal>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="page-section" aria-labelledby="slabs-title">
        <div className="container split">
          <Reveal className="card">
            <h2 id="slabs-title" className="card__title">
              Discount Slabs
            </h2>
            <DiscountPlan />
          </Reveal>
          <Reveal className="card" delay={0.08}>
            <h2 className="card__title">Discount on invoice value</h2>
            <p className="card__text">
              The program flyer shows the discount applied to the invoice value before GST. For the
              same example with the discount on the gross value, see the{' '}
              <Link href={pathTo('program-workflow')}>Program Workflow</Link> sample calculations.
            </p>
          </Reveal>
        </div>
        <div className="container page-section__stack">
          <Reveal>
            <DataTable
              caption="Sample discount on invoice value, by payment day"
              columns={sampleCalculationOnInvoice.columns}
              rows={sampleCalculationOnInvoice.rows}
              highlightColumn={6}
            />
          </Reveal>
          <SourceNote>
            The two published examples calculate the discount differently (on invoice value here,
            on gross value on the Program Workflow page), so the amounts payable differ. Check with
            your program contact which applies to your account.
          </SourceNote>
        </div>
      </section>

      <section className="page-section" aria-labelledby="cn-title">
        <div className="container">
          <div className="page-section__head">
            <h2 id="cn-title" className="page-section__title">
              Credit note adjustment
            </h2>
            <p className="page-section__lead">
              Outstanding Amount is the Gross Value (A) minus the Credit Note (B).
            </p>
          </div>
          <Reveal>
            <DataTable
              caption="Outstanding amount with and without a credit note"
              columns={creditNoteExample.columns}
              rows={creditNoteExample.rows}
              highlightColumn={5}
            />
          </Reveal>
        </div>
      </section>

      <RelatedPages ids={['program-workflow', 'payments', 'communications']} />
    </>
  )
}
