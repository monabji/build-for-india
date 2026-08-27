import { useState } from 'react'

const affiliates = [
  { name: 'National Institute for the Empowerment of Persons with Visual Disabilities', short: 'NIEPVD', image: '/assets/niepvd-logo.png', href: 'https://niepvd.nic.in/' },
  { name: 'National Institute for the Empowerment of Persons with Intellectual Disabilities', short: 'NIEPID', image: '/assets/niepid-logo.png', href: 'https://niepid.nic.in/' },
  { name: 'Artificial Limbs Manufacturing Corporation of India', short: 'ALIMCO', image: '/assets/alimco-logo.png', href: 'https://alimco.in/' },
  { name: 'Rehabilitation Council of India', short: 'RCI', image: '/assets/state-emblem.svg', href: 'https://rehabcouncil.nic.in/' },
  { name: 'National Informatics Centre', short: 'NIC', image: '/assets/nic-logo.svg', href: 'https://www.nic.in/' },
  { name: 'Digital India', short: 'Digital India', image: '/assets/digital-india-logo.svg', href: 'https://www.digitalindia.gov.in/' },
]

export function AffiliateStrip() {
  const [paused, setPaused] = useState(false)
  const repeated = [...affiliates, ...affiliates]

  return <section className="affiliate-strip" aria-labelledby="affiliate-heading">
    <div className="container affiliate-heading-row">
      <div><p className="eyebrow">Useful organisations</p><h2 id="affiliate-heading">Connected disability services</h2></div>
      <button type="button" className="marquee-control" aria-pressed={paused} onClick={() => setPaused((value) => !value)}>
        <span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span> {paused ? 'Play logos' : 'Pause logos'}
      </button>
    </div>
    <div className="affiliate-window">
      <div className={`affiliate-track ${paused ? 'is-paused' : ''}`}>
        {repeated.map((affiliate, index) => <a className="affiliate-card" href={affiliate.href} target="_blank" rel="noreferrer" key={`${affiliate.short}-${index}`} aria-hidden={index >= affiliates.length ? 'true' : undefined} tabIndex={index >= affiliates.length ? -1 : undefined}>
          <img src={affiliate.image} alt="" /><span><strong>{affiliate.short}</strong><small>{affiliate.name}</small></span>
        </a>)}
      </div>
    </div>
  </section>
}
