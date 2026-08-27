import { useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'

type StateInfo = {
  name: string
  x: number
  y: number
  region: string
  centres: number
  languages: string
  guidance: string
}

const states: StateInfo[] = [
  { name: 'Jammu and Kashmir', x: 174, y: 70, region: 'North', centres: 3, languages: 'English, Hindi, Urdu', guidance: 'Assisted-service desks are available in this region.' },
  { name: 'Punjab', x: 145, y: 123, region: 'North', centres: 5, languages: 'Punjabi, Hindi, English', guidance: 'Choose a district to see accessible assessment centres.' },
  { name: 'Rajasthan', x: 112, y: 195, region: 'West', centres: 8, languages: 'Hindi, English', guidance: 'Low-bandwidth application support is available.' },
  { name: 'Gujarat', x: 76, y: 267, region: 'West', centres: 7, languages: 'Gujarati, Hindi, English', guidance: 'A caregiver can begin and save an application.' },
  { name: 'Maharashtra', x: 145, y: 300, region: 'West', centres: 12, languages: 'Marathi, Hindi, English', guidance: 'Three centres include step-free access information.' },
  { name: 'Karnataka', x: 150, y: 365, region: 'South', centres: 9, languages: 'Kannada, English, Hindi', guidance: 'Appointment and document guidance is available.' },
  { name: 'Kerala', x: 170, y: 434, region: 'South', centres: 6, languages: 'Malayalam, English', guidance: 'View centres by accessibility support and district.' },
  { name: 'Tamil Nadu', x: 218, y: 420, region: 'South', centres: 10, languages: 'Tamil, English', guidance: 'Service guidance is available in Tamil and English.' },
  { name: 'Telangana', x: 205, y: 326, region: 'South', centres: 7, languages: 'Telugu, Urdu, English', guidance: 'Find a centre or start a guided application.' },
  { name: 'Uttar Pradesh', x: 225, y: 186, region: 'North', centres: 16, languages: 'Hindi, Urdu, English', guidance: 'Assisted application and correction routes are highlighted.' },
  { name: 'West Bengal', x: 300, y: 272, region: 'East', centres: 9, languages: 'Bengali, English, Hindi', guidance: 'Assessment-centre and document guidance is available.' },
  { name: 'Assam', x: 347, y: 184, region: 'North East', centres: 6, languages: 'Assamese, English, Hindi', guidance: 'Use the list route when map connectivity is limited.' },
]

export function IndiaServiceMap({ compact = false }: { compact?: boolean }) {
  const [selected, setSelected] = useState<StateInfo>(states[4])
  const [view, setView] = useState<'map' | 'list'>('map')
  const [announcement, setAnnouncement] = useState('Maharashtra selected. 12 centres available.')

  const choose = (state: StateInfo) => {
    setSelected(state)
    setAnnouncement(`${state.name} selected. ${state.centres} centres available.`)
  }

  const activateFromKeyboard = (event: KeyboardEvent<SVGGElement>, state: StateInfo) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      choose(state)
    }
  }

  return <section className={`india-finder ${compact ? 'india-finder-compact' : ''}`} aria-labelledby="india-finder-title">
    <div className="finder-heading">
      <div><p className="eyebrow">Start with where you live</p><h2 id="india-finder-title">Find services across India</h2><p>Select a state to see service availability, language support and the next useful action.</p></div>
      <div className="view-switch" aria-label="Map display">
        <button type="button" aria-pressed={view === 'map'} onClick={() => setView('map')}>Map</button>
        <button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')}>List</button>
      </div>
    </div>
    <div className="state-select field"><label htmlFor={compact ? 'home-state' : 'finder-state'}>Search or choose a state</label><select id={compact ? 'home-state' : 'finder-state'} value={selected.name} onChange={(event) => choose(states.find((state) => state.name === event.target.value) ?? states[0])}>{states.map((state) => <option key={state.name}>{state.name}</option>)}</select></div>
    <p className="visually-hidden" aria-live="polite">{announcement}</p>
    <div className="finder-body">
      {view === 'map' ? <div className="map-stage">
        <svg className="india-map" viewBox="0 0 420 520" role="img" aria-labelledby="map-title map-description">
          <title id="map-title">Interactive map of India</title>
          <desc id="map-description">Choose one of twelve states. A standard select and list provide the same actions.</desc>
          <path className="india-outline" d="M165 24 L205 31 L232 52 L248 82 L271 106 L259 132 L286 154 L317 142 L341 155 L370 145 L397 164 L381 187 L347 190 L323 207 L310 247 L289 273 L278 311 L252 342 L240 381 L218 430 L197 482 L180 453 L167 411 L145 383 L118 361 L102 329 L72 308 L48 280 L55 251 L31 229 L59 202 L77 171 L105 146 L96 116 L119 89 L141 67 Z" />
          <path className="map-river" d="M223 145 C207 205 228 249 214 314 C207 348 198 379 197 430" />
          {states.map((state) => <g key={state.name} className={`state-node ${selected.name === state.name ? 'selected' : ''}`} role="button" tabIndex={0} aria-label={`${state.name}, ${state.centres} centres`} aria-current={selected.name === state.name ? 'true' : undefined} onClick={() => choose(state)} onKeyDown={(event) => activateFromKeyboard(event, state)}>
            <path className="state-target" d={`M ${state.x - 14} ${state.y} a 14 14 0 1 0 28 0 a 14 14 0 1 0 -28 0`} />
            <circle cx={state.x} cy={state.y} r="4" />
            <text x={state.x} y={state.y - 20} textAnchor="middle">{state.name}</text>
          </g>)}
        </svg>
        <p className="map-note">Illustrative map · use the state list for the complete accessible route</p>
      </div> : <div className="state-list" aria-label="States">{states.map((state) => <button key={state.name} type="button" className={selected.name === state.name ? 'selected' : ''} aria-pressed={selected.name === state.name} onClick={() => choose(state)}><span><strong>{state.name}</strong><small>{state.region} · {state.languages}</small></span><span>{state.centres} centres</span></button>)}</div>}
      <aside className="state-result" key={selected.name} aria-labelledby="selected-state-title">
        <p className="result-region">{selected.region} region</p>
        <h3 id="selected-state-title">{selected.name}</h3>
        <p className="centre-count"><strong>{selected.centres}</strong> service centres</p>
        <dl><div><dt>Languages</dt><dd>{selected.languages}</dd></div><div><dt>Guidance</dt><dd>{selected.guidance}</dd></div></dl>
        <Link className="primary-button" to={`/find-help?state=${encodeURIComponent(selected.name)}`}>Find a centre in {selected.name}</Link>
        <Link className="state-apply-link" to="/apply">Or start a new application</Link>
      </aside>
    </div>
  </section>
}
