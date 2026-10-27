import { Link } from 'wouter'
import { pageRoutes } from '../config/routes'
import { brand, dealerApps, documents, scfpeLinks } from '../config/site'
import { SectionLink } from '../routing/SectionLink'
import { BrandLockup } from './BrandLockup'
import { ExternalAnchor } from './ExternalAnchor'
import './SiteFooter.css'

const year = new Date().getFullYear()

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="site-footer__top">
          <div className="site-footer__brand">
            <BrandLockup />
            <p>
              The dealer onboarding guide for the {brand.program} program. {brand.poweredBy}.
            </p>
            <ExternalAnchor href={scfpeLinks.home} className="site-footer__site">
              scfpe.tech
            </ExternalAnchor>
          </div>

          <nav className="site-footer__cols" aria-label="Footer">
            <div>
              <h2 className="site-footer__heading">Guide</h2>
              <ul>
                {pageRoutes.map((r) => (
                  <li key={r.id}>
                    <Link href={r.path}>{r.navLabel}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="site-footer__heading">Resources</h2>
              <ul>
                {documents.map((doc) => (
                  <li key={doc.id}>
                    <ExternalAnchor href={doc.viewUrl}>{doc.title}</ExternalAnchor>
                  </li>
                ))}
                {dealerApps.map((app) => (
                  <li key={app.id}>
                    <ExternalAnchor href={app.link.href}>{app.title}</ExternalAnchor>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="site-footer__heading">SCFPe</h2>
              <ul>
                <li>
                  <SectionLink section="support">Support</SectionLink>
                </li>
                <li>
                  <a href={`mailto:${scfpeLinks.email}`}>{scfpeLinks.email}</a>
                </li>
                <li>
                  <ExternalAnchor href={scfpeLinks.contact}>Contact</ExternalAnchor>
                </li>
                <li>
                  <ExternalAnchor href={scfpeLinks.linkedin}>LinkedIn</ExternalAnchor>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="site-footer__bottom">
          <p>
            © {year} {brand.legalEntity} SCFPe is the technology provider for this onboarding
            guide. LIXIL and GROHE are trademarks of their respective owners.
          </p>
          <ul className="site-footer__legal">
            <li>
              <ExternalAnchor href={scfpeLinks.privacy}>SCFPe Privacy Policy</ExternalAnchor>
            </li>
            <li>
              <ExternalAnchor href={scfpeLinks.terms}>SCFPe Terms of Service</ExternalAnchor>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
