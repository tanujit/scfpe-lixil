import { dealerApps } from '../config/site'
import { DealerAppCard } from './DealerAppCard'
import { Reveal } from './Reveal'
import './DealerAppSection.css'

export function DealerAppSection() {
  return (
    <section id="apps" className="section apps" aria-labelledby="apps-title">
      <div className="container">
        <div className="apps__panel">
          <Reveal className="section-head apps__head">
            <p className="eyebrow">Dealer apps</p>
            <h2 id="apps-title" className="section-title">
              Get the dealer app for your phone
            </h2>
            <p className="section-lead">Choose your platform to open the app store listing.</p>
          </Reveal>

          <div className="apps__grid">
            {dealerApps.map((app, i) => (
              <Reveal key={app.id} delay={0.08 * i} className="apps__item">
                <DealerAppCard app={app} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
