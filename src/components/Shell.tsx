import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AffiliateStrip } from './AffiliateStrip'
import { useService } from '../state/ServiceContext'

export function Shell({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [largeText, setLargeText] = useState(() => localStorage.getItem('udid-large-text') === 'true')
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('udid-high-contrast') === 'true')
  const [menuOpen, setMenuOpen] = useState(false)
  const { verifiedScenario } = useService()
  const journeyRoots = ['/start', '/apply', '/track', '/dashboard', '/applications', '/appointments', '/renew', '/replace', '/documents', '/find-help']
  const isJourneyRoute = journeyRoots.some((root) => location.pathname === root || location.pathname.startsWith(`${root}/`))
  const isRenewOrReplaceRoute = location.pathname === '/renew' || location.pathname === '/replace'

  useEffect(() => {
    document.documentElement.classList.toggle('large-text', largeText)
    document.documentElement.classList.toggle('high-contrast', highContrast)
    localStorage.setItem('udid-large-text', String(largeText))
    localStorage.setItem('udid-high-contrast', String(highContrast))
  }, [largeText, highContrast])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }, [location.pathname])

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <div className="prototype-bar" id="prototype-disclosure" role="note">
        <div className="container"><strong>Prototype using synthetic data.</strong> This is not an official government portal.</div>
      </div>
      <header className={`site-header ${isJourneyRoute ? 'site-header--journey' : 'site-header--public'}`} aria-describedby="prototype-disclosure">
        <div className="utility container" aria-label="Accessibility options">
          <button className="utility-button" type="button" onClick={() => setLargeText((value) => !value)} aria-pressed={largeText} aria-label={`${largeText ? 'Turn off' : 'Turn on'} larger text`}>Larger text</button>
          <button className="utility-button" type="button" onClick={() => setHighContrast((value) => !value)} aria-pressed={highContrast} aria-label={`${highContrast ? 'Turn off' : 'Turn on'} high contrast`}>High contrast</button>
          <Link to="/help">Help</Link>
        </div>
        <div className="brand-row container">
          <div className="government-identity">
            <img className="state-emblem" src="/assets/state-emblem.svg" alt="State Emblem of India" />
            <Link className="brand" to="/" aria-label="UDID Saathi home">
              <span className="brand-copy">
                <span className="brand-title">UDID Saathi <span className="brand-hindi" lang="hi">/ साथी</span></span>
                <small className="brand-context">Saathi Path · Accessible UDID services</small>
              </span>
            </Link>
          </div>
          <img className="swavlamban-logo" src="/assets/swavlamban-logo.png" alt="Swavlamban — Unique Disability ID" />
          <Link className="dashboard-link" to={verifiedScenario ? '/dashboard' : '/track'}>{verifiedScenario ? 'My application' : 'Track application'}</Link>
        </div>
        <nav className="primary-nav" aria-label="Citizen services">
          <div className="container nav-shell">
            <button className="mobile-menu-button" type="button" aria-expanded={menuOpen} aria-controls="citizen-navigation" onClick={() => setMenuOpen((value) => !value)}><span>{menuOpen ? 'Close services' : 'Open services'}</span><b aria-hidden="true">{menuOpen ? '×' : '☰'}</b></button>
            <div id="citizen-navigation" className={`nav-list ${menuOpen ? 'nav-list--open' : ''}`} onClick={(event) => { if ((event.target as Element).closest('a')) setMenuOpen(false) }}>
              <NavLink to="/apply" aria-label="Apply for a UDID card">Apply</NavLink>
              <NavLink to="/track" aria-label="Track an application">Track</NavLink>
              <NavLink to="/renew" className={({ isActive }) => isActive || isRenewOrReplaceRoute ? 'active' : undefined}>Renew or replace</NavLink>
              <NavLink to="/find-help">Find help</NavLink>
            </div>
          </div>
        </nav>
      </header>
      <main id="main-content" className="main-content" tabIndex={-1}>{children}</main>
      {location.pathname === '/' && <AffiliateStrip />}
      <footer className={`site-footer ${isJourneyRoute ? 'site-footer--compact' : 'site-footer--full'}`}>
        {!isJourneyRoute && <div className="container footer-grid">
          <section><h2>UDID Saathi <span lang="hi">/ साथी</span></h2><p>An accessible guide for navigating applications, corrections, certificates and support.</p><Link to="/prototype">Privacy and service information</Link></section>
          <nav aria-label="Quick access"><h2>Citizen services</h2><Link to="/apply">Apply for a UDID card</Link><Link to="/track">Track an application</Link><Link to="/renew">Renew or replace a card</Link><Link to="/find-help">Find a medical centre</Link></nav>
          <section><h2>Accessibility and help</h2><p>Use the controls at the top of every page for larger text and high contrast.</p><Link to="/help">Help, FAQs and support</Link></section>
        </div>}
        <div className="container footer-bottom">
          <p><strong>UDID Saathi <span lang="hi">/ साथी</span></strong> · Accessible citizen application service.</p>
          <nav aria-label="Service information"><Link to="/">Home</Link><Link to="/prototype">Privacy and accessibility</Link><Link to="/help">Contact support</Link></nav>
        </div>
      </footer>
    </div>
  )
}
