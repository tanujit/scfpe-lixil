import { ArrowRight, Info, Landmark } from 'lucide-react'
import { Link } from 'wouter'
import { pathTo } from '../config/routes'
import { paymentAccount, vanHeading } from '../content/payments'
import { communications } from '../content/communications'
import { parties, partnerBenefits, programFlow } from '../content/program'
import { PageHeader } from '../components/page/PageHeader'
import { RelatedPages } from '../components/page/RelatedPages'
import { DiscountPlan } from '../components/program/DiscountPlan'
import { Reveal } from '../components/Reveal'
import { VerificationNote } from '../components/VerificationNote'
import { SectionLink } from '../routing/SectionLink'
import '../components/payments/payments.css'

const paymentSteps = programFlow.filter((s) => s.step === 5 || s.step === 6)
const paymentMessages = communications.filter((c) =>
  ['Payment Confirmation', 'Cash Discount Reminder', 'Invoice Overdue Reminder'].includes(c.title),
)

export function PaymentsPage() {
  // Account details reach dealers only once confirmed; reviewers see them in dev builds.
  const showAccount = paymentAccount.verified || import.meta.env.DEV

  return (
    <>
      <PageHeader
        eyebrow="Payments"
        title="Payment Workflow"
        intro="The program’s Virtual Account Number (VAN), payment timing and the messages you receive about payments."
        trail={[{ label: 'Payments' }]}
      />

      <section className="page-section" aria-labelledby="van-title">
        <div className="container">
          <p className="payments-info">
            <Info size={18} aria-hidden="true" />
            This page is for information only. It does not take or process payments.
          </p>

          <div className="page-section__head">
            <h2 id="van-title" className="page-section__title">
              {vanHeading}
            </h2>
          </div>

          <Reveal className="van-card">
            <div className="van-card__head">
              <span className="van-card__icon">
                <Landmark size={22} aria-hidden="true" />
              </span>
              <h3 className="van-card__title">Payment account</h3>
            </div>

            {showAccount ? (
              <>
                <VerificationNote
                  status={paymentAccount.verified ? 'verified' : 'needs-review'}
                  note={paymentAccount.verifiedNote}
                />
                <dl className="van-card__fields">
                  {paymentAccount.fields.map((f) => (
                    <div key={f.label} className="van-card__field">
                      <dt>{f.label}</dt>
                      <dd>{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </>
            ) : (
              <div className="van-card__pending">
                <p>
                  The program’s payment account details are being confirmed and will be published
                  here.
                </p>
                <p>
                  For payment questions, <SectionLink section="support">contact SCFPe</SectionLink>.
                </p>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      <section className="page-section" aria-labelledby="timing-title">
        <div className="container">
          <div className="page-section__head">
            <h2 id="timing-title" className="page-section__title">
              Payment timing and discounts
            </h2>
            <p className="page-section__lead">{partnerBenefits.join('. ')}.</p>
          </div>
          <div className="split">
            <Reveal className="card">
              <h3 className="card__title">New Discount Plan</h3>
              <DiscountPlan />
            </Reveal>
            <Reveal className="card" delay={0.08}>
              <h3 className="card__title">Who pays when</h3>
              <ol className="pay-steps">
                {paymentSteps.map((s) => (
                  <li key={s.step}>
                    <strong>{s.title}</strong>
                    <span>
                      {parties[s.from]} to {parties[s.to]}
                      {s.note && `. ${s.note}`}
                    </span>
                  </li>
                ))}
              </ol>
              <Link href={pathTo('program-workflow')} className="btn btn--outline btn--sm pay-link">
                See the full program workflow
                <ArrowRight size={16} className="btn-arrow" aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="page-section" aria-labelledby="messages-title">
        <div className="container">
          <div className="page-section__head">
            <h2 id="messages-title" className="page-section__title">
              Payment messages
            </h2>
          </div>
          <ul className="pay-messages">
            {paymentMessages.map((c, i) => (
              <Reveal as="li" key={c.title} delay={0.05 * i} className="pay-message">
                <h3>{c.title}</h3>
                <p>{c.timing}</p>
              </Reveal>
            ))}
          </ul>
          <div className="page-section__actions">
            <Link href={pathTo('communications')} className="btn btn--outline">
              All communications
              <ArrowRight size={18} className="btn-arrow" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <RelatedPages ids={['program-workflow', 'program-details', 'documents']} />
    </>
  )
}
