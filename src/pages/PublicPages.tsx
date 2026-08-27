import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { authorities } from '../data/seed'
import { statusLabels } from '../domain/rules'
import type { ScenarioId } from '../domain/types'
import { useService } from '../state/ServiceContext'
import { Alert, Breadcrumbs, PageIntro, TaskCard } from '../components/UI'
import { IndiaServiceMap } from '../components/IndiaServiceMap'
import { ServiceIcon } from '../components/ServiceIcon'

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
        <TaskCard icon="apply" to="/apply" title="Apply for a UDID card">See what you need and start a guided application.</TaskCard>
        <TaskCard icon="track" to="/track" title="Track my application">See the latest status, next action and timeline.</TaskCard>
        <TaskCard icon="fix" to="/applications/correction/correct" title="Fix a rejected application">Understand the problem and replace only what is needed.</TaskCard>
        <TaskCard icon="renew" to="/renew" title="Renew my card">Check the requirements and start a renewal.</TaskCard>
        <TaskCard icon="replace" to="/replace" title="Replace a lost or damaged card">Get a clear replacement route without starting over.</TaskCard>
        <TaskCard icon="certificate" to="/documents/certificate" title="Download my certificate">Open your certificate and save a copy.</TaskCard>
      </div>
      <div className="information-grid">
        <section className="notice-board" aria-labelledby="notices-heading">
          <div className="panel-title"><span><ServiceIcon name="notice" /></span><div><p className="eyebrow">Announcements</p><h2 id="notices-heading">Notices and circulars</h2></div></div>
          <ol className="notice-list">
            <li><time dateTime="2026-08-27">27 Aug 2026</time><Link to="/help">Document upload guidance and accepted file checks</Link><span>Guidance</span></li>
            <li><time dateTime="2026-08-21">21 Aug 2026</time><Link to="/find-help">Accessibility information for visiting service centres</Link><span>Service update</span></li>
            <li><time dateTime="2026-08-12">12 Aug 2026</time><Link to="/applications/correction/correct">How to correct an application without starting again</Link><span>Circular</span></li>
          </ol>
          <Link className="panel-link" to="/help">View all notices <span aria-hidden="true">→</span></Link>
        </section>
        <section className="document-preview-panel" aria-labelledby="document-preview-heading">
          <div><p className="eyebrow">Know your document</p><h2 id="document-preview-heading">What a UDID certificate contains</h2><p>Your digital certificate brings identity, disability-category and issuing-authority information together in one document.</p><Link to="/documents/certificate">Open certificate area <span aria-hidden="true">→</span></Link></div>
          <div className="certificate-preview" role="img" aria-label="A visual preview of a UDID certificate showing the State Emblem of India, certificate title, photograph area and key information fields">
            <div className="certificate-preview-head"><img src="/assets/state-emblem.svg" alt="" /><span><strong>Unique Disability ID</strong><small>Government of India</small></span></div>
            <div className="certificate-preview-body"><div className="photo-placeholder" aria-hidden="true"><ServiceIcon name="certificate" /></div><dl><div><dt>Name</dt><dd>•••• ••••</dd></div><div><dt>UDID number</dt><dd>•••• •••• ••••</dd></div><div><dt>Issue date</dt><dd>•• / •• / ••••</dd></div></dl></div>
            <div className="certificate-preview-foot"><span>UDID certificate</span><i aria-hidden="true" /></div>
          </div>
        </section>
      </div>
      <section className="guidance-strip" aria-labelledby="unsure-heading">
        <div><h2 id="unsure-heading">Not sure what to do?</h2><p>Answer two plain-language questions and we will point you to the right service.</p></div>
        <Link className="secondary-button" to="/start">Help me choose</Link>
      </section>
      <section className="support-grid" aria-labelledby="other-help-heading">
        <h2 id="other-help-heading">Applying with or for someone else</h2>
        <TaskCard to="/apply?mode=caregiver" title="I am applying for someone else">Keep the applicant and caregiver details clearly separated.</TaskCard>
        <TaskCard to="/apply?mode=assisted" title="I am helping at a service centre">Use larger controls and a printable preparation checklist.</TaskCard>
      </section>
      <IndiaServiceMap compact />
      <section className="link-cluster" aria-label="More help">
        <Link to="/find-help">Find a medical centre</Link>
        <Link to="/help">Understand the process</Link>
        <Link to="/prototype">Privacy and service information</Link>
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
    <PageIntro title="Which service do you need?"><p>Choose the answer that best matches your situation. This guidance does not make eligibility decisions.</p></PageIntro>
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
    <PageIntro eyebrow="New application" title="Apply for a disability certificate and UDID card"><p>Complete one guided application. We do not ask for Aadhaar, medical records or identity numbers.</p></PageIntro>
    <div className="info-columns"><section><h2>What you will need</h2><ul className="check-list"><li>Applicant and address information</li><li>Identity and address documents</li><li>General disability category — no diagnosis</li><li>A preferred medical centre</li></ul></section><section><h2>What happens next</h2><ol><li>Complete 7 short steps</li><li>Review all answers</li><li>Receive an application ID</li></ol></section></div>
    <div className="button-row"><Link className="primary-button" to={startTarget}>Start application</Link><Link className="text-button" to="/apply/about?resume=true">Resume saved draft</Link></div>
  </div>
}

export function TrackPage() {
  const { scenarios, setActiveScenario } = useService()
  const navigate = useNavigate()
  const openScenario = (id: ScenarioId) => { setActiveScenario(id); navigate('/dashboard') }
  return <div className="container page-section">
    <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Track an application' }]} />
    <PageIntro title="Track an application"><p>Select an application to view its current status, next step and full history.</p></PageIntro>
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
    <PageIntro eyebrow={renewal ? 'Renewal service' : 'Replacement service'} title={renewal ? 'Renew your UDID card' : 'Replace a lost or damaged card'}><p>{renewal ? 'Start a renewal while keeping your existing application history.' : 'Request a replacement without completing the full application again.'}</p></PageIntro>
    <section><h2>Before you start</h2><ul className="check-list"><li>Your application reference</li><li>{renewal ? 'The reason for renewal' : 'Whether the card was lost or damaged'}</li><li>A current address confirmation</li></ul></section>
    {!created ? <button className="primary-button" onClick={() => setCreated(true)}>Start {renewal ? 'renewal' : 'replacement'}</button> : <Alert type="success" title={`${renewal ? 'Renewal' : 'Replacement'} request created`}><p>Reference: {renewal ? 'RENEW-118' : 'REPLACE-226'}.</p><Link to="/dashboard">Return to dashboard</Link></Alert>}
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
    <PageIntro title="Find a medical centre"><p>Browse locations and accessibility details to find a centre that works for you.</p></PageIntro>
    <div className="field compact-field"><label htmlFor="state-filter">Filter by state</label><select id="state-filter" value={state} onChange={(e) => setState(e.target.value)}><option>All</option>{[...new Set(authorities.map((item) => item.state))].map((item) => <option key={item}>{item}</option>)}</select></div>
    {filtered.length ? <div className="authority-grid">{filtered.map((authority) => <article className="authority-card" key={authority.id}><p className="eyebrow">{authority.district}, {authority.state}</p><h2>{authority.name}</h2><p>{authority.address}</p><h3>Accessibility</h3><p>{authority.accessNotes}</p><p className="meta">{authority.contactLabel}</p></article>)}</div> : <div className="empty-state"><span aria-hidden="true">⌁</span><h2>No centres in this state yet</h2><p>Choose another state or continue with the normal application route.</p><button className="secondary-button" onClick={() => setState('All')}>Show all centres</button></div>}
  </div>
}

export function HelpPage() {
  const [caseCreated, setCaseCreated] = useState(false)
  return <div className="container narrow page-section">
    <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Help and FAQs' }]} />
    <PageIntro title="Help with your UDID journey"><p>Plain-language answers and a support route when an answer is not enough.</p></PageIntro>
    <div className="faq-list">
      <details><summary>Do I need a disability certificate and a UDID card?</summary><p>This service guides first-time applicants through one combined journey. Requirements can vary, so check the relevant guidance before acting.</p></details>
      <details><summary>What happens if a document is rejected?</summary><p>You can see exactly which document needs attention, upload a corrected version and keep all other answers.</p></details>
      <details><summary>Can a caregiver apply for someone else?</summary><p>Yes. Choose caregiver mode when starting. The interface keeps the applicant and caregiver identities visibly separate.</p></details>
      <details><summary>How do I get support?</summary><p>Use the support route below for help with your application.</p></details>
    </div>
    <section className="help-panel"><h2>Still need help?</h2><p>Create a support case linked to your application.</p>{caseCreated ? <Alert type="success" title="Support case created">Case HELP-731 has been acknowledged.</Alert> : <button className="secondary-button" onClick={() => setCaseCreated(true)}>Create support case</button>}</section>
  </div>
}

export function PrototypePage() {
  return <div className="container narrow page-section">
    <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Privacy and service information' }]} />
    <PageIntro title="Privacy and service information"><p>Understand how your information is used and where to find support.</p></PageIntro>
    <section><h2>Your privacy</h2><p>Keep personal, identity, medical, disability and financial information secure. Do not share passwords, OTPs or payment details through support channels.</p></section>
    <section><h2>Service support</h2><p>Use the help route if you need assistance with documents, appointments, renewals, replacement, or tracking an application.</p></section>
  </div>
}

export function NotFoundPage() {
  return <div className="container narrow page-section"><PageIntro title="Page not found"><p>The page may have moved or the address may be incomplete.</p></PageIntro><Link className="primary-button" to="/">Return to task selection</Link></div>
}
