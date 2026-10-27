import { m } from 'motion/react'
import { discountSlabs } from '../../content/program'
import './program.css'

const max = Math.max(...discountSlabs.map((s) => s.percent))

function Ordinal({ value }: { value: string }) {
  const match = value.match(/^(\d+)(st|nd|rd|th)?$/)
  if (!match) return <>{value}</>
  return (
    <>
      {match[1]}
      {match[2] && <sup>{match[2]}</sup>}
    </>
  )
}

/** "Payment Day / New Discount Plan" as an accessible bar list. */
export function DiscountPlan() {
  return (
    <figure className="discount-plan">
      <div className="discount-plan__head" aria-hidden="true">
        <span>Payment Day</span>
        <span>New Discount Plan</span>
      </div>
      <ul className="discount-plan__rows">
        {discountSlabs.map((slab, i) => (
          <li key={slab.days} className="discount-plan__row">
            <span className="discount-plan__day">
              <span className="visually-hidden">Payment day {slab.days}: </span>
              <span aria-hidden="true">
                <Ordinal value={slab.label[0]} /> - <Ordinal value={slab.label[1]} />
              </span>
            </span>
            <span className="discount-plan__track" aria-hidden="true">
              {slab.percent > 0 && (
                <m.span
                  className="discount-plan__bar"
                  style={{ width: `${(slab.percent / max) * 100}%` }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.08 * i }}
                />
              )}
            </span>
            <span className="discount-plan__value">
              {slab.percent}%<span className="visually-hidden"> discount</span>
            </span>
          </li>
        ))}
      </ul>
    </figure>
  )
}
