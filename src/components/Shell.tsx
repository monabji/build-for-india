import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

export function Shell({ children }: { children: ReactNode }) {
  const location = useLocation()
  const [largeText, setLargeText] = useState(() => localStorage.getItem('udid-large-text') === 'true')
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('udid-high-contrast') === 'true')
  const [hindi, setHindi] = useState(false)

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
          <button className="utility-button" type="button" onClick={() => setHindi((value) => !value)} aria-pressed={hindi}>
            {hindi ? 'English' : 'हिन्दी'}
          </button>
          <button className="utility-button" type="button" onClick={() => setLargeText((value) => !value)} aria-pressed={largeText}>Larger text</button>
          <button className="utility-button" type="button" onClick={() => setHighContrast((value) => !value)} aria-pressed={highContrast}>High contrast</button>
          <Link to="/help">Help</Link>
        </div>
        <div className="brand-row container">
          <Link className="brand" to="/" aria-label="UDID service redesign home">
            <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
            <span>UDID Saathi <small>साथी · Citizen service redesign</small></span>
          </Link>
          <Link className="dashboard-link" to="/dashboard">View demo dashboard</Link>
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
      <footer className="site-footer">
        <div className="container footer-grid">
          <div><strong>UDID Saathi</strong><p>A warm, accessible hackathon prototype built around clear tasks and recoverable citizen journeys.</p></div>
          <nav aria-label="Footer navigation">
            <Link to="/prototype">Prototype and privacy</Link>
            <Link to="/help">Help and FAQs</Link>
            <Link to="/find-help">Find a demo centre</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
