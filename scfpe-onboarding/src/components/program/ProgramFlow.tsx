import { ArrowRight } from 'lucide-react'
import { directFlows, parties, programFlow, type Party } from '../../content/program'
import { Reveal } from '../Reveal'
import './program.css'

function PartyChip({ party }: { party: Party }) {
  return <span className={`party-chip party-chip--${party}`}>{parties[party]}</span>
}

/** "How does the program work?" diagram, rebuilt as ordered steps. */
export function ProgramFlow() {
  return (
    <div className="program-flow">
      <ul className="program-flow__parties" aria-label="Parties in the program">
        {(Object.keys(parties) as Party[]).map((p) => (
          <li key={p}>
            <PartyChip party={p} />
          </li>
        ))}
      </ul>

      <div className="program-flow__direct card">
        <h3 className="program-flow__subhead">Between LIXIL | GROHE and the dealer</h3>
        <ul>
          {directFlows.map((f) => (
            <li key={f.title}>
              <PartyChip party={f.from} />
              <ArrowRight size={16} aria-label="to" />
              <PartyChip party={f.to} />
              <span className="program-flow__direct-title">{f.title}</span>
            </li>
          ))}
        </ul>
      </div>

      <ol className="program-flow__steps">
        {programFlow.map((s, i) => (
          <Reveal as="li" key={s.step} delay={0.05 * i} className="program-flow__step">
            <span className="program-flow__num" aria-hidden="true">
              {s.step}
            </span>
            <div className="program-flow__body">
              <h3 className="program-flow__title">
                <span className="visually-hidden">Step {s.step}: </span>
                {s.title}
              </h3>
              {s.note && <p className="program-flow__note">{s.note}</p>}
              <p className="program-flow__route">
                <PartyChip party={s.from} />
                <ArrowRight size={16} aria-label="to" />
                <PartyChip party={s.to} />
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
    </div>
  )
}
