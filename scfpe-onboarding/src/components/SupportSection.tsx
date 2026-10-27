import { ArrowUpRight, Mail } from 'lucide-react'
import { scfpeLinks } from '../config/site'
import { ExternalAnchor } from './ExternalAnchor'
import { Reveal } from './Reveal'
import './SupportSection.css'

export function SupportSection() {
  return (
    <section id="support" className="section support" aria-labelledby="support-title">
      <div className="container">
        <Reveal className="support__card">
          <div className="support__text">
            <p className="eyebrow">Support</p>
            <h2 id="support-title" className="section-title">
              Questions about onboarding?
            </h2>
            <p className="section-lead">
              Get in touch with SCFPe through its general business contact.
            </p>
          </div>

          <div className="support__actions">
            <a href={`mailto:${scfpeLinks.email}`} className="support__email">
              <span className="support__email-icon">
                <Mail size={20} aria-hidden="true" />
              </span>
              <span className="support__email-text">
                <span className="support__email-label">Email SCFPe</span>
                <span className="support__email-address">{scfpeLinks.email}</span>
              </span>
            </a>
            <ExternalAnchor href={scfpeLinks.contact} className="btn btn--outline">
              SCFPe contact page
              <ArrowUpRight size={18} aria-hidden="true" />
            </ExternalAnchor>
            <p className="support__note">
              This is SCFPe&rsquo;s general contact, listed on scfpe.tech. It is not a dedicated
              LIXIL | GROHE helpdesk.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
