import { geoMercator, geoPath } from 'd3-geo'
import { useEffect, useMemo, useState, type KeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import type { Feature, FeatureCollection, Geometry } from 'geojson'
import { ServiceIcon } from './ServiceIcon'
import { centresByState } from '../data/centres'
import type { Authority } from '../domain/types'

type StateProperties = { shapeName: string; shapeType?: string }
type StateFeature = Feature<Geometry, StateProperties>
type MapData = FeatureCollection<Geometry, StateProperties>
const regionByState: Record<string, string> = {
  Delhi: 'North', Haryana: 'North', 'Himachal Pradesh': 'North', 'Jammu and Kashmir': 'North', Ladakh: 'North', Punjab: 'North', Rajasthan: 'North', Uttarakhand: 'North', 'Uttar Pradesh': 'North', Chandigarh: 'North',
  Bihar: 'East', Jharkhand: 'East', Odisha: 'East', 'West Bengal': 'East',
  'Arunachal Pradesh': 'North East', Assam: 'North East', Manipur: 'North East', Meghalaya: 'North East', Mizoram: 'North East', Nagaland: 'North East', Sikkim: 'North East', Tripura: 'North East',
  Goa: 'West', Gujarat: 'West', Maharashtra: 'West', 'Dadra and Nagar Haveli and Daman and Diu': 'West',
  'Andhra Pradesh': 'South', Karnataka: 'South', Kerala: 'South', 'Tamil Nadu': 'South', Telangana: 'South', Puducherry: 'South', Lakshadweep: 'South', 'Andaman and Nicobar Islands': 'South',
  Chhattisgarh: 'Central', 'Madhya Pradesh': 'Central',
}

const languageByState: Record<string, string> = {
  Maharashtra: 'Marathi, Hindi, English', Delhi: 'Hindi, English', 'West Bengal': 'Bengali, Hindi, English', Karnataka: 'Kannada, English, Hindi', Telangana: 'Telugu, Urdu, English', 'Tamil Nadu': 'Tamil, English', Assam: 'Assamese, Hindi, English', 'Uttar Pradesh': 'Hindi, Urdu, English', Gujarat: 'Gujarati, Hindi, English', Kerala: 'Malayalam, English', Punjab: 'Punjabi, Hindi, English', Odisha: 'Odia, Hindi, English',
}

const canonicalName = (value: string) => value.normalize('NFD').replace(/\p{Diacritic}/gu, '')

function rewindForD3(data: MapData): MapData {
  return {
    ...data,
    features: data.features.map((feature) => {
      if (feature.geometry.type === 'Polygon') {
        return { ...feature, geometry: { ...feature.geometry, coordinates: feature.geometry.coordinates.map((ring) => [...ring].reverse()) } }
      }
      if (feature.geometry.type === 'MultiPolygon') {
        return { ...feature, geometry: { ...feature.geometry, coordinates: feature.geometry.coordinates.map((polygon) => polygon.map((ring) => [...ring].reverse())) } }
      }
      return feature
    }),
  }
}

function centreCount(stateName: string) {
  return centresByState(stateName).length
}

export function IndiaServiceMap({ compact = false }: { compact?: boolean }) {
  const [mapData, setMapData] = useState<MapData | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [selectedName, setSelectedName] = useState<string | null>(null)
  const [selectedCentre, setSelectedCentre] = useState<Authority | null>(null)
  const [view, setView] = useState<'map' | 'list'>(() => typeof window !== 'undefined' && window.matchMedia?.('(max-width: 600px)').matches ? 'list' : 'map')
  const [announcement, setAnnouncement] = useState('Choose a state or union territory to see nearby centres.')

  useEffect(() => {
    const controller = new AbortController()
    fetch('/data/india-states.geojson', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Map could not be loaded')
        return response.json() as Promise<MapData>
      })
      .then((data) => setMapData(rewindForD3(data)))
      .catch((error: unknown) => {
        if ((error as { name?: string }).name !== 'AbortError') setLoadError(true)
      })
    return () => controller.abort()
  }, [])

  const features = useMemo(() => mapData?.features.slice().sort((a, b) => canonicalName(a.properties.shapeName).localeCompare(canonicalName(b.properties.shapeName))) ?? [], [mapData])
  const selectedFeature = useMemo(() => features.find((feature) => canonicalName(feature.properties.shapeName) === selectedName) ?? null, [features, selectedName])
  const centres = useMemo(() => selectedFeature ? centresByState(selectedName ?? '') : [], [selectedFeature, selectedName])

  const { path, projection } = useMemo(() => {
    if (!mapData) return { path: null, projection: null }
    const nextProjection = geoMercator().fitExtent([[42, 28], [618, 555]], mapData)
    return { projection: nextProjection, path: geoPath(nextProjection) }
  }, [mapData])

  const zoom = useMemo(() => {
    if (!path || !selectedFeature) return { scale: 1, x: 0, y: 0 }
    const [[x0, y0], [x1, y1]] = path.bounds(selectedFeature)
    const width = Math.max(1, x1 - x0)
    const height = Math.max(1, y1 - y0)
    const scale = Math.min(5.2, Math.max(1.55, Math.min(430 / width, 390 / height)))
    return { scale, x: 330 - ((x0 + x1) / 2) * scale, y: 292 - ((y0 + y1) / 2) * scale }
  }, [path, selectedFeature])

  const choose = (feature: StateFeature) => {
    const name = canonicalName(feature.properties.shapeName)
    const available = centresByState(name)
    setSelectedName(name)
    setSelectedCentre(available[0] ?? null)
    setView('map')
    setAnnouncement(`${name} selected. ${centreCount(name)} ${available.length === 1 ? 'centre' : 'centres'} available. ${available[0]?.name ?? ''} highlighted.`)
  }

  const resetMap = () => {
    setSelectedName(null)
    setSelectedCentre(null)
    setAnnouncement('Showing all of India. Choose a state or union territory.')
  }

  const activateState = (event: KeyboardEvent<SVGGElement>, feature: StateFeature) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      choose(feature)
    }
  }

  const chooseFromSelect = (name: string) => {
    const feature = features.find((item) => canonicalName(item.properties.shapeName) === name)
    if (feature) choose(feature)
  }

  return <section className={`india-finder ${compact ? 'india-finder-compact' : ''}`} aria-labelledby="india-finder-title">
    <div className="finder-heading">
      <div><p className="eyebrow"><ServiceIcon name="map" /> Demo centre data · start with where you live</p><h2 id="india-finder-title">Explore services across India</h2><p>Select a state or union territory. The map will move in smoothly, reveal centre markers, and let you open each centre’s details. Verify information with the official authority before visiting.</p></div>
      <div className="view-switch" aria-label="Map display">
        <button type="button" aria-pressed={view === 'map'} onClick={() => setView('map')}>Map</button>
        <button type="button" aria-pressed={view === 'list'} onClick={() => setView('list')}>List</button>
      </div>
    </div>
    <div className="map-tools">
      <div className="state-select field"><label htmlFor={compact ? 'home-state' : 'finder-state'}>Search or choose a state</label><select id={compact ? 'home-state' : 'finder-state'} value={selectedName ?? ''} onChange={(event) => chooseFromSelect(event.target.value)}><option value="">Choose a state or union territory</option>{features.map((feature) => { const name = canonicalName(feature.properties.shapeName); return <option key={name} value={name}>{name}</option> })}</select></div>
      {selectedName && <button type="button" className="map-reset" onClick={resetMap}>← View all India</button>}
    </div>
    <p className="visually-hidden" aria-live="polite">{announcement}</p>
    <div className="finder-body">
      {view === 'map' ? <div className="map-stage">
        {loadError && <div className="map-error" role="alert"><strong>The map could not be loaded.</strong><p>Use the state list to continue.</p><button className="secondary-button" type="button" onClick={() => setView('list')}>Open state list</button></div>}
        {!mapData && !loadError && <p className="map-loading" role="status">Loading state boundaries…</p>}
        {mapData && path && projection && <svg className="india-map" viewBox="0 0 660 590" role="group" aria-labelledby="map-title map-description">
          <title id="map-title">Interactive map of India with state and union territory boundaries</title>
          <desc id="map-description">Select a boundary to zoom into that area and reveal service-centre markers. The state list provides the same controls.</desc>
          <g className="map-zoom-layer" style={{ transform: `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.scale})` }}>
            {features.map((feature) => {
              const name = canonicalName(feature.properties.shapeName)
              const isSelected = name === selectedName
              const count = centreCount(name)
              return <g key={name} className={`state-shape ${isSelected ? 'selected' : ''} ${selectedName && !isSelected ? 'muted' : ''}`} role="button" tabIndex={0} aria-label={`${name}, ${count} ${count === 1 ? 'centre' : 'centres'}`} aria-current={isSelected ? 'true' : undefined} onClick={() => choose(feature)} onKeyDown={(event) => activateState(event, feature)}>
                <path d={path(feature) ?? ''} vectorEffect="non-scaling-stroke" />
              </g>
            })}
            {selectedFeature && centres.map((centre) => {
              const point = projection(centre.coordinates)
              if (!point) return null
              const active = selectedCentre?.id === centre.id
              return <g key={centre.id} className={`centre-marker ${active ? 'active' : ''}`} role="button" tabIndex={0} aria-label={`Open ${centre.name}`} style={{ transform: `translate(${point[0]}px, ${point[1]}px) scale(${1 / zoom.scale})` }} onClick={(event) => { event.stopPropagation(); setSelectedCentre(centre); setAnnouncement(`${centre.name} selected.`) }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedCentre(centre) } }}>
                <circle className="marker-halo" r="16" /><circle className="marker-dot" r="7" /><path d="M-2.5 0h5M0-2.5v5" />
              </g>
            })}
          </g>
        </svg>}
        <p className="map-note">36 states and union territories · click a boundary to explore</p>
      </div> : <div className="state-list" aria-label="States and union territories">{features.map((feature) => { const name = canonicalName(feature.properties.shapeName); const count = centreCount(name); return <button key={name} type="button" className={selectedName === name ? 'selected' : ''} aria-pressed={selectedName === name} onClick={() => choose(feature)}><span><strong>{name}</strong><small>{regionByState[name] ?? 'India'} region</small></span><span>{count} {count === 1 ? 'centre' : 'centres'}</span></button> })}</div>}
      <aside className={`state-result ${selectedName ? 'has-selection' : ''}`} aria-live="polite">
        {!selectedName ? <div className="map-prompt"><ServiceIcon name="map" /><p className="result-region">Explore by location</p><h3>Choose a state</h3><p>Click the map or use the accessible state list. Centre markers and visit information will appear here.</p></div> : <>
          <p className="result-region">{regionByState[selectedName] ?? 'India'} region</p>
          <h3>{selectedName}</h3>
          <p className="centre-count"><strong>{centreCount(selectedName)}</strong> service {centreCount(selectedName) === 1 ? 'centre' : 'centres'}</p>
          <p className="result-language"><strong>Service languages:</strong> {languageByState[selectedName] ?? 'Regional language, Hindi and English'}</p>
          <div className="centre-selector" aria-label={`Featured centres in ${selectedName}`}>{centres.map((centre) => <button key={centre.id} type="button" className={selectedCentre?.id === centre.id ? 'active' : ''} aria-pressed={selectedCentre?.id === centre.id} onClick={() => setSelectedCentre(centre)}><span aria-hidden="true">●</span>{centre.name}</button>)}</div>
          {selectedCentre && <article className="centre-detail" key={selectedCentre.id}><p className="centre-district">{selectedCentre.district}</p><h4>{selectedCentre.name}</h4><dl><div><dt>Location</dt><dd>{selectedCentre.address}</dd></div><div><dt>Visiting hours</dt><dd>{selectedCentre.hours}</dd></div><div><dt>Accessibility</dt><dd>{selectedCentre.accessNotes}</dd></div><div><dt>Phone</dt><dd>{selectedCentre.phone}</dd></div><div><dt>Directions</dt><dd>{selectedCentre.directions}</dd></div><div><dt>Last checked</dt><dd>{selectedCentre.verifiedAt}</dd></div></dl></article>}
          <Link className="primary-button" to={`/find-help?state=${encodeURIComponent(selectedName)}`}>View all centres in {selectedName}</Link>
        </>}
      </aside>
    </div>
    <p className="map-source">Boundary data: geoBoundaries (DataMeet India / Election Commission of India), simplified for this interface. Official map reference: Survey of India.</p>
  </section>
}
