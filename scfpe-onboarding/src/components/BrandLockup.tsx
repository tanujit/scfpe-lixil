import { Link } from 'wouter'
import logo from '../assets/scfpe-logo.svg'
// Official LIXIL and GROHE logos, taken from the original program PDFs (see ../pdf-rebrand).
import lixilLogo from '../assets/lixil-logo.png'
import groheLogo from '../assets/grohe-logo.png'
import { pathTo } from '../config/routes'
import './BrandLockup.css'

/** SCFPe logo co-branded with the LIXIL | GROHE onboarding program. Links home. */
export function BrandLockup() {
  return (
    <Link href={pathTo('home')} className="brand-lockup" aria-label="SCFPe, LIXIL GROHE Dealer Onboarding, home">
      <img src={logo} alt="" width={109} height={28} className="brand-lockup__logo" />
      <span className="brand-lockup__divider" aria-hidden="true" />
      <span className="brand-lockup__program" aria-hidden="true">
        <img src={lixilLogo} alt="" width={47} height={16} className="brand-lockup__lixil" />
        <span className="brand-lockup__program-sub">Dealer Onboarding</span>
        <img src={groheLogo} alt="" width={44} height={34} className="brand-lockup__grohe" />
      </span>
    </Link>
  )
}
