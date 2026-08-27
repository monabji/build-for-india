import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { authorities } from '../data/seed'
import { statusLabels } from '../domain/rules'
import type { ScenarioId } from '../domain/types'
import { useService } from '../state/ServiceContext'
import { Alert, Breadcrumbs, PageIntro, TaskCard } from '../components/UI'
import { IndiaServiceMap } from '../components/IndiaServiceMap'

export function HomePage() {
  return <>
    <section className="home-intro"><div className="container welcome-grid">
      <div className="welcome-copy"><p className="eyebrow">Namaste — we’ll guide you</p>
        <h1>How can we help you today?</h1>
        <p className="lead">Tell us what has happened. Saathi will take you to the right UDID task without department language or guesswork.</p>
        <div className="welcome-actions"><Link className="primary-button" to="/apply">Start a new application</Link><Link to="/start">I’m not sure what I need</Link></div>
      </div>
      <aside className="journey-glance" aria-label="A clear path through the service">
        <p className="eyebrow">Your path stays visible</p>
        <ol><li><span>1</span><div><strong>Tell us your situation</strong><small>Choose a task in plain language</small></div></li><li><span>2</span><div><strong>Move one step at a time</strong><small>Your progress is saved</small></div></li><li><span>3</span><div><strong>Always know what’s next</strong><small>Status, action and help together</small></div></li></ol>
      </aside>
    </div></section>
    <div className="container page-section">
      <div className="section-title-row"><div><p className="eyebrow">Choose your task</p><h2>What would you like to do?</h2></div><p>Each route keeps your place and explains what happens next.</p></div>
      <div className="task-grid" aria-label="Choose a task">
        <TaskCard number="01" to="/apply" title="Apply for a UDID card">See what you need and start a guided application.</TaskCard>
        <TaskCard number="02" to="/track" title="Track my application">See the latest status, next action and timeline.</TaskCard>
        <TaskCard number="03" to="/applications/correction/correct" title="Fix a rejected application">Understand the problem and replace only what is needed.</TaskCard>
        <TaskCard number="04" to="/renew" title="Renew my card">Check the demo requirements and start a renewal.</TaskCard>
        <TaskCard number="05" to="/replace" title="Replace a lost or damaged card">Get a clear replacement route without starting over.</TaskCard>
        <TaskCard number="06" to="/documents/certificate" title="Download my certificate">Open a synthetic certificate and save a copy.</TaskCard>
      </div>
      <section className="guidance-strip" aria-labelledby="unsure-heading">
        <div><h2 id="unsure-heading">Not sure what to do?</h2><p>Answer two plain-language questions and we will point you to the right prototype service.</p></div>
        <Link className="secondary-button" to="/start">Help me choose</Link>
      </section>
      <section className="support-grid" aria-labelledby="other-help-heading">
        <h2 id="other-help-heading">Applying with or for someone else</h2>
        <TaskCard to="/apply?mode=caregiver" title="I am applying for someone else">Keep the applicant and caregiver details clearly separated.</TaskCard>
        <TaskCard to="/apply?mode=assisted" title="I am helping at a service centre">Use larger controls and a printable preparation checklist.</TaskCard>
      </section>
      <IndiaServiceMap compact />
      <section className="link-cluster" aria-label="More help">
        <Link to="/find-help">Find a demo medical centre</Link>
        <Link to="/help">Understand the process</Link>
        <Link to="/prototype">How this prototype works</Link>
      </section>
    </div>
  </>
}

export function GuidancePage() {
  const [hasApplication, setHasApplication] = useState<string>('')
  const [need, setNeed] = useState<string>('')
  const result = useMemo(() => {
    if (!hasApplication) return null
    if (hasApplication === 'no') return { to: '/apply', title: 'Start a new application', detail: 'We will explain the requirements before asking for information.' }
    if (need === 'rejected') return { to: '/applications/correction/correct', title: 'Fix the application', detail: 'Replace the problem document without restarting.' }
    if (need === 'lost') return { to: '/replace', title: 'Replace the card', detail: 'Use the replacement service for a lost or damaged card.' }
    if (need === 'expired') return { to: '/renew', title: 'Renew the card', detail: 'Review the renewal requirements and continue.' }
    if (need === 'status') return { to: '/track', title: 'Track the application', detail: 'See what happened and what to do next.' }
    return null
  }, [hasApplication, need])

  return <div className="container narrow page-section">
    <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Help me choose' }]} />
    <PageIntro title="Which service do you need?"><p>Choose the answer that best matches your situation. This guidance uses fixed prototype rules, not AI or eligibility decisions.</p></PageIntro>
    <fieldset className="choice-group"><legend>Do you already have an application or card?</legend>
      <label><input type="radio" name="has-application" value="no" checked={hasApplication === 'no'} onChange={(e) => setHasApplication(e.target.value)} /> No, I want to apply for the first time</label>
      <label><input type="radio" name="has-application" value="yes" checked={hasApplication === 'yes'} onChange={(e) => setHasApplication(e.target.value)} /> Yes, I have an application or card</label>
    </fieldset>
    {hasApplication === 'yes' && <fieldset className="choice-group"><legend>What do you need help with?</legend>
      {[['status', 'I want to know what is happening'], ['rejected', 'I was asked to correct something'], ['expired', 'My card needs renewal'], ['lost', 'My card is lost or damaged']].map(([value, label]) => <label key={value}><input type="radio" name="need" value={value} checked={need === value} onChange={(e) => setNeed(e.target.value)} /> {label}</label>)}
    </fieldset>}
    {result && <section className="recommendation" aria-live="polite"><p className="eyebrow">Recommended next step</p><h2>{result.title}</h2><p>{result.detail}</p><Link className="primary-button" to={result.to}>Continue</Link></section>}
  </div>
}

export function ApplyStartPage() {
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode')
  const startTarget = mode === 'caregiver' || mode === 'assisted' ? `/apply/about?mode=${mode}` : '/apply/about'
  return <div className="container narrow page-section">
    <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Apply' }]} />
    <PageIntro eyebrow="New application" title="Apply for a disability certificate and UDID card"><p>Complete one guided application using synthetic information. This prototype does not connect to Aadhaar, medical records or the official UDID service.</p></PageIntro>
    <div className="info-columns"><section><h2>What you will need</h2><ul className="check-list"><li>Basic applicant and address information</li><li>Two synthetic document filenames</li><li>General disability category — no diagnosis</li><li>A preferred demo medical centre</li></ul></section><section><h2>What happens next</h2><ol><li>Complete 7 short steps</li><li>Review all answers</li><li>Receive a synthetic application ID</li></ol></section></div>
    <Alert title="Use synthetic information only">Do not enter real identity numbers, medical records, phone numbers or government document data.</Alert>
    <div className="button-row"><Link className="primary-button" to={startTarget}>Start application</Link><Link className="text-button" to="/apply/about?resume=true">Resume saved draft</Link></div>
  </div>
}

export function TrackPage() {
  const { scenarios, setActiveScenario } = useService()
  const navigate = useNavigate()
  const openScenario = (id: ScenarioId) => { setActiveScenario(id); navigate('/dashboard') }
  return <div className="container page-section">
    <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Track an application' }]} />
    <PageIntro title="Track a demo application"><p>Select a synthetic application. No identity number, phone number or sign-in is required for this prototype.</p></PageIntro>
    <div className="scenario-list">{(Object.entries(scenarios) as [ScenarioId, typeof scenarios[ScenarioId]][]).map(([id, app]) => <article key={id} className="scenario-card">
      <div><p className="eyebrow">{app.id}</p><h2>{app.applicantName}</h2><p><strong>{statusLabels[app.currentStatus]}</strong></p><p>{app.currentNextAction}</p></div>
      <button className="secondary-button" onClick={() => openScenario(id)}>View this application</button>
    </article>)}</div>
  </div>
}

function ServiceTaskPage({ kind }: { kind: 'renew' | 'replace' }) {
  const [created, setCreated] = useState(false)
  const renewal = kind === 'renew'
  return <div className="container narrow page-section">
    <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: renewal ? 'Renew' : 'Replace card' }]} />
    <PageIntro eyebrow={renewal ? 'Renewal service' : 'Replacement service'} title={renewal ? 'Renew your UDID card' : 'Replace a lost or damaged card'}><p>{renewal ? 'Start a demo renewal while keeping your existing application history.' : 'Request a prototype replacement without completing the full application again.'}</p></PageIntro>
    <section><h2>Before you start</h2><ul className="check-list"><li>Your synthetic application reference</li><li>{renewal ? 'The reason for renewal' : 'Whether the card was lost or damaged'}</li><li>A current synthetic address confirmation</li></ul></section>
    <Alert type="warning" title="This does not create an official request">The action below creates only an in-page prototype confirmation.</Alert>
    {!created ? <button className="primary-button" onClick={() => setCreated(true)}>Start demo {renewal ? 'renewal' : 'replacement'}</button> : <Alert type="success" title={`${renewal ? 'Renewal' : 'Replacement'} request created`}><p>Reference: {renewal ? 'RENEW-DEMO-118' : 'REPLACE-DEMO-226'}. No information was sent to a government system.</p><Link to="/dashboard">Return to dashboard</Link></Alert>}
  </div>
}

export const RenewPage = () => <ServiceTaskPage kind="renew" />
export const ReplacePage = () => <ServiceTaskPage kind="replace" />

export function FindHelpPage() {
  const [searchParams] = useSearchParams()
  const requestedState = searchParams.get('state')
  const [state, setState] = useState(requestedState || 'All')
  const filtered = state === 'All' ? authorities : authorities.filter((item) => item.state === state)
  return <div className="container page-section">
    <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Find help' }]} />
    <PageIntro title="Find a demo medical centre"><p>Browse synthetic locations and accessibility details. These are not real facilities or appointments.</p></PageIntro>
    <div className="field compact-field"><label htmlFor="state-filter">Filter by demo state</label><select id="state-filter" value={state} onChange={(e) => setState(e.target.value)}><option>All</option>{[...new Set(authorities.map((item) => item.state))].map((item) => <option key={item}>{item}</option>)}</select></div>
    {filtered.length ? <div className="authority-grid">{filtered.map((authority) => <article className="authority-card" key={authority.id}><p className="eyebrow">{authority.district}, {authority.state}</p><h2>{authority.name}</h2><p>{authority.address}</p><h3>Accessibility</h3><p>{authority.accessNotes}</p><p className="meta">{authority.contactLabel}</p></article>)}</div> : <div className="empty-state"><span aria-hidden="true">⌁</span><h2>No synthetic centres in this state yet</h2><p>The map is a progressive demo. Choose another state or continue with the normal application route.</p><button className="secondary-button" onClick={() => setState('All')}>Show all demo centres</button></div>}
  </div>
}

export function HelpPage() {
  const [caseCreated, setCaseCreated] = useState(false)
  return <div className="container narrow page-section">
    <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Help and FAQs' }]} />
    <PageIntro title="Help with your UDID journey"><p>Plain-language answers for the prototype journey, with a synthetic support route when an answer is not enough.</p></PageIntro>
    <div className="faq-list">
      <details><summary>Do I need a disability certificate and a UDID card?</summary><p>This prototype guides first-time applicants through one combined journey. Official requirements can vary; check the official UDID service before acting.</p></details>
      <details><summary>What happens if a document is rejected?</summary><p>You can see exactly which document needs attention, upload a corrected synthetic version and keep all other answers.</p></details>
      <details><summary>Can a caregiver apply for someone else?</summary><p>Yes. Choose caregiver mode when starting. The interface keeps the applicant and caregiver identities visibly separate.</p></details>
      <details><summary>Is any information sent to the government?</summary><p>No. All names, application IDs, locations, documents and decisions in this build are synthetic.</p></details>
    </div>
    <section className="help-panel"><h2>Still need help?</h2><p>Create a synthetic support case linked to the current demo session. It does not contact a real support team.</p>{caseCreated ? <Alert type="success" title="Demo support case created">Case HELP-DEMO-731 is acknowledged in this browser only.</Alert> : <button className="secondary-button" onClick={() => setCaseCreated(true)}>Create demo support case</button>}</section>
  </div>
}

export function PrototypePage() {
  return <div className="container narrow page-section">
    <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Prototype and privacy' }]} />
    <PageIntro title="About this prototype"><p>This independent redesign concept demonstrates how a citizen-facing UDID journey could be clearer, more accessible and easier to recover.</p></PageIntro>
    <Alert title="Not an official service">This project is not connected to or endorsed by the Government of India, the live UDID portal, Aadhaar, medical boards or dispatch providers.</Alert>
    <section><h2>What is mocked</h2><ul className="check-list"><li>Demo identity and session</li><li>Applicant profiles and documents</li><li>Medical centres and appointments</li><li>Status transitions and notifications</li><li>Certificate and card downloads</li><li>Assistant explanations and translations</li></ul></section>
    <section><h2>Privacy boundary</h2><p>Do not enter real personal, identity, medical, disability, financial or government information. Draft data is stored only in this browser's local storage and can be cleared with the demo reset.</p></section>
    <section><h2>What production would replace</h2><p>A real implementation would require approved identity, secure document storage, verified medical-authority scheduling, official rules, governed notifications, role-based workflows and signed document generation.</p></section>
  </div>
}

export function NotFoundPage() {
  return <div className="container narrow page-section"><PageIntro title="Page not found"><p>The page may have moved or the address may be incomplete.</p></PageIntro><Link className="primary-button" to="/">Return to task selection</Link></div>
}
