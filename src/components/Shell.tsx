import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AffiliateStrip } from './AffiliateStrip'

export function Shell({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [largeText, setLargeText] = useState(() => localStorage.getItem('udid-large-text') === 'true')
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('udid-high-contrast') === 'true')

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
      <div className="prototype-bar" role="note">
        <div className="container"><strong>Prototype using synthetic data.</strong> This is not an official government portal.</div>
      </div>
      <header className="site-header">
        <div className="utility container" aria-label="Accessibility options">
          <button className="utility-button" type="button" onClick={() => setLargeText((value) => !value)} aria-pressed={largeText}>Larger text</button>
          <button className="utility-button" type="button" onClick={() => setHighContrast((value) => !value)} aria-pressed={highContrast}>High contrast</button>
          <Link to="/help">Help</Link>
        </div>
        <div className="brand-row container">
          <div className="government-identity">
            <img className="state-emblem" src="/assets/state-emblem.svg" alt="State Emblem of India" />
            <Link className="brand" to="/" aria-label="UDID Saathi home">
              <span>UDID Saathi <small>साथी · A clearer citizen service</small></span>
            </Link>
          </div>
          <img className="swavlamban-logo" src="/assets/swavlamban-logo.png" alt="Swavlamban — Unique Disability ID" />
          <Link className="dashboard-link" to="/dashboard">View my dashboard</Link>
        </div>
        <nav className="primary-nav" aria-label="Main navigation">
          <div className="container nav-list">
            <NavLink to="/apply">Apply</NavLink>
            <NavLink to="/track">Track</NavLink>
            <NavLink to="/renew">Renew or replace</NavLink>
            <NavLink to="/find-help">Get help</NavLink>
          </div>
        </nav>
      </header>
      <main id="main-content" className="main-content" tabIndex={-1}>{children}</main>
      <AffiliateStrip />
      <footer className="site-footer">
        <div className="container footer-grid">
          <section><h2>About UDID Saathi</h2><p>A warm, accessible route through applications, corrections, certificates and support.</p><Link to="/prototype">Privacy and service information</Link></section>
          <nav aria-label="Quick access"><h2>Quick access</h2><Link to="/">Home</Link><Link to="/apply">Apply for a UDID card</Link><Link to="/track">Track an application</Link><Link to="/find-help">Find a medical centre</Link></nav>
          <section><h2>Accessibility</h2><p>Use the controls at the top of every page for larger text and high contrast.</p><Link to="/help">Help and FAQs</Link></section>
        </div>
        <div className="container footer-bottom"><p>© 2026 UDID Saathi service concept</p><nav aria-label="Policy links"><Link to="/prototype">Privacy</Link><Link to="/prototype">Accessibility statement</Link><Link to="/help">Contact support</Link></nav></div>
      </footer>
    </div>
  )
}
