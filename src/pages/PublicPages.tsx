import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { authorities, stateNames } from '../data/centres'
import type { ScenarioId } from '../domain/types'
import { useService } from '../state/ServiceContext'
import { Alert, Breadcrumbs, PageIntro, TaskCard } from '../components/UI'
import { IndiaServiceMap } from '../components/IndiaServiceMap'
import { ServiceIcon } from '../components/ServiceIcon'
import { JourneyRibbon } from '../components/JourneyRibbon'

export function HomePage() {
  return <>
    <section className="home-intro home-photo-hero">
      <div className="container home-opening">
        <div className="welcome-copy">
          <p className="eyebrow">Namaste · UDID Saathi / साथी</p>
          <h1>Disability services that start with you</h1>
          <p className="lead">Apply, track an application or fix a document through one clear and accessible service.</p>
          <div className="hero-actions"><Link className="primary-button" to="/apply">Start application</Link><Link className="secondary-button hero-secondary-button" to="/track">Track or fix an existing application</Link></div>
          <p className="welcome-support-link"><Link to="/apply?mode=caregiver">I am applying for someone else</Link></p>
        </div>
      </div>
    </section>

    <section className="container home-primary-tasks" aria-labelledby="primary-task-heading">
      <div className="section-title-row home-task-heading"><div><p className="eyebrow">Choose your task</p><h2 id="primary-task-heading">Start with what you need now</h2></div><p>Each route uses plain language and shows what happens next.</p></div>
      <div className="task-grid priority-task-grid">
        <TaskCard icon="apply" to="/apply" title="Apply for a UDID card">See what you need and start one guided application.</TaskCard>
        <TaskCard icon="track" to="/track" title="Track my application">See the latest update, your next action and who can help.</TaskCard>
        <TaskCard icon="fix" to="/track?intent=correction" title="Fix my application">Replace only the document that needs attention. Everything else stays saved.</TaskCard>
      </div>
    </section>

    <section className="container problem-evidence" aria-labelledby="problem-evidence-heading">
      <div><p className="eyebrow">Why this service is designed differently</p><h2 id="problem-evidence-heading">The hard part is often knowing what happens next</h2><p>People can be left unsure about documents, a vague status, a rejected upload, caregiver roles and whether a centre will be accessible.</p></div>
      <div className="experience-compare"><article><p className="eyebrow">Current experience</p><ul><li>Unclear preparation and document rules</li><li>Statuses without a practical next action</li><li>Corrections that feel like starting over</li></ul></article><article><p className="eyebrow">Saathi journey</p><ul><li>Plain-language checklist before each task</li><li>Timeline with the next action made visible</li><li>Replace one document while preserving progress</li></ul></article></div>
    </section>

    <div className="container page-section home-content-flow">
      <section className="guidance-strip home-guided-choice" aria-labelledby="unsure-heading">
        <div><p className="eyebrow">Help choosing a service</p><h2 id="unsure-heading">Not sure which service you need?</h2><p>Answer two plain-language questions. We will suggest a route without making an eligibility decision.</p></div>
        <Link className="secondary-button" to="/start">Help me choose</Link>
      </section>

      <section className="secondary-services" aria-labelledby="secondary-services-heading">
        <div className="section-title-row"><div><p className="eyebrow">Continue your UDID journey</p><h2 id="secondary-services-heading">Cards and certificates</h2></div><p>Use these routes when you already have a card or issued document.</p></div>
        <div className="task-grid supporting-task-grid">
          <TaskCard icon="renew" to="/renew" title="Renew my card">Check the requirements and start a renewal.</TaskCard>
          <TaskCard icon="replace" to="/replace" title="Replace a lost or damaged card">Get a clear replacement route without starting over.</TaskCard>
          <TaskCard icon="certificate" to="/track?intent=certificate" title="Download my certificate">Open your certificate and save a copy.</TaskCard>
        </div>
      </section>

      <div className="information-grid home-information-section">
        <section className="notice-board" aria-labelledby="notices-heading">
          <div className="panel-title"><span><ServiceIcon name="notice" /></span><div><p className="eyebrow">Important guidance</p><h2 id="notices-heading">Notices and circulars</h2></div></div>
          <ol className="notice-list">
            <li><time dateTime="2026-08-27">27 Aug 2026</time><Link to="/help">Document upload guidance and accepted file checks</Link><span>Guidance</span></li>
            <li><time dateTime="2026-08-21">21 Aug 2026</time><Link to="/find-help">Accessibility information for visiting service centres</Link><span>Service update</span></li>
            <li><time dateTime="2026-08-12">12 Aug 2026</time><Link to="/track?intent=correction">How to correct an application without starting again</Link><span>Circular</span></li>
          </ol>
          <Link className="panel-link" to="/help">View all guidance <span aria-hidden="true">→</span></Link>
        </section>
        <section className="document-preview-panel" aria-labelledby="document-preview-heading">
          <div><p className="eyebrow">Know your document</p><h2 id="document-preview-heading">What a UDID certificate contains</h2><p>See where identity, disability-category and issuing-authority information appears before you download a document.</p><Link to="/track?intent=certificate">Open certificate area <span aria-hidden="true">→</span></Link></div>
          <div className="certificate-preview" role="img" aria-label="A visual preview of a UDID certificate showing the State Emblem of India, certificate title, photograph area and key information fields">
            <div className="certificate-preview-head"><img src="/assets/state-emblem.svg" alt="" /><span><strong>Unique Disability ID</strong><small>Government of India</small></span></div>
            <div className="certificate-preview-body"><div className="photo-placeholder" aria-hidden="true"><ServiceIcon name="certificate" /></div><dl><div><dt>Name</dt><dd>•••• ••••</dd></div><div><dt>UDID number</dt><dd>•••• •••• ••••</dd></div><div><dt>Issue date</dt><dd>•• / •• / ••••</dd></div></dl></div>
            <div className="certificate-preview-foot"><span>UDID certificate</span><i aria-hidden="true" /></div>
          </div>
        </section>
      </div>

      <section className="home-centre-discovery" aria-label="Find support near you">
        <IndiaServiceMap compact />
      </section>

      <section className="support-grid home-assisted-routes" aria-labelledby="other-help-heading">
        <p className="eyebrow">Help that respects each person’s role</p>
        <h2 id="other-help-heading">Applying with or for someone else</h2>
        <p>Saathi keeps applicant, caregiver and service-operator details separate throughout the journey.</p>
        <TaskCard to="/apply?mode=caregiver" title="I am applying for someone else">Start with clear consent and keep the applicant’s identity at the centre.</TaskCard>
        <TaskCard to="/apply?mode=assisted" title="I am helping at a service centre">Use larger controls and a printable preparation checklist.</TaskCard>
      </section>

      <section className="link-cluster home-help-links" aria-label="More help">
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
    if (need === 'rejected') return { to: '/track?intent=correction', title: 'Fix the application', detail: 'Verify the application, then replace the problem document without restarting.' }
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
  const { loadDraft, loadDraftStep } = useService()
  const mode = searchParams.get('mode')
  const saved = searchParams.get('saved') === 'true'
  const startTarget = mode === 'caregiver' || mode === 'assisted' ? `/apply/about?mode=${mode}` : '/apply/about'
  const resumeTarget = loadDraft() ? `/apply/${loadDraftStep()}?resume=true` : '/apply/about?resume=true'
  return <div className="container narrow page-section">
    <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Apply' }]} />
    <PageIntro eyebrow="New application" title="Apply for a disability certificate and UDID card"><p>Complete one guided application. We do not ask for Aadhaar, medical records or identity numbers.</p></PageIntro>
    <figure className="journey-photo-card service-page-photo application-photo-card"><img src="/assets/service-application-documents.jpg" alt="Hands completing forms at a desk" /><figcaption><strong>Start with the information you have</strong><span>Keep your documents nearby. You can save this application and return later.</span></figcaption></figure>
    {saved && <Alert type="success" title="Draft saved"><p>Your progress is saved on this device. Come back here anytime to continue.</p><Link to={resumeTarget}>Resume saved application</Link></Alert>}
    <div className="info-columns"><section><h2>What you will need</h2><ul className="check-list"><li>Applicant and address information</li><li>Identity and address documents</li><li>General disability category — no diagnosis</li><li>A preferred medical centre</li></ul></section><section><h2>What happens next</h2><ol><li>Complete 7 short steps</li><li>Review all answers</li><li>Receive an application ID</li></ol></section></div>
    <div className="button-row"><Link className="primary-button" to={startTarget}>Start application</Link><Link className="text-button" to={resumeTarget}>Resume saved draft</Link></div>
  </div>
}

export function TrackPage() {
  const { scenarios, verifyScenario, reset } = useService()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const intent = searchParams.get('intent')
  const [reference, setReference] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [demoMessage, setDemoMessage] = useState('')
  const clearError = (field: string) => setErrors((currentErrors) => {
    if (!currentErrors[field]) return currentErrors
    const remaining = { ...currentErrors }
    delete remaining[field]
    return remaining
  })
  const openScenario = (id: ScenarioId) => {
    verifyScenario(id)
    const app = scenarios[id]
    if (id === 'correction') navigate(`/applications/${app.id}/correct`)
    else if (id === 'approved') navigate(`/documents/${app.id}`)
    else navigate('/dashboard')
  }
  const submit = (event: FormEvent) => {
    event.preventDefault()
    const required: Record<string, string> = {}
    if (!reference.trim()) required.reference = 'Enter an application reference.'
    if (!dateOfBirth) required.dateOfBirth = 'Enter the applicant’s date of birth.'
    if (Object.keys(required).length) {
      setErrors(required)
      requestAnimationFrame(() => document.getElementById('tracking-error-summary')?.focus())
      return
    }
    const match = (Object.entries(scenarios) as [ScenarioId, typeof scenarios[ScenarioId]][]).find(([, app]) => app.id.toUpperCase() === reference.trim().toUpperCase() && app.draft.dateOfBirth === dateOfBirth)
    if (!match) { setErrors({ lookup: 'We could not match that reference and date of birth. Check both entries and try again.' }); return }
    verifyScenario(match[0])
    if (intent === 'correction' && match[0] === 'correction') navigate(`/applications/${match[1].id}/correct`)
    else if (intent === 'certificate' && match[0] === 'approved') navigate(`/documents/${match[1].id}`)
    else navigate('/dashboard')
  }
  const sample = intent === 'correction' ? scenarios.correction : intent === 'certificate' ? scenarios.approved : scenarios.appointment
  return <div className="container page-section">
    <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Track an application' }]} />
    <PageIntro eyebrow="Simulated tracking" title={intent === 'correction' ? 'Verify the application before making a correction' : intent === 'certificate' ? 'Verify the application before opening a certificate' : 'Track an application'}><p>Enter two matching details before any personal information or application status is shown.</p></PageIntro>
    <figure className="journey-photo-card service-page-photo tracking-photo-card"><img src="/assets/udid-hero-woman-wheelchair.jpg" alt="Indian woman using a wheelchair outside an accessible service building" /><figcaption><strong>See progress with confidence</strong><span>Once verified, your timeline shows the latest update, the next action and who can help.</span></figcaption></figure>
    <div className="secure-lookup-grid"><form className="lookup-form" onSubmit={submit} noValidate><h2>Find your application</h2>{Object.keys(errors).length > 0 && <div id="tracking-error-summary" className="error-summary" role="alert" tabIndex={-1}><h3>Check the information below</h3><ul>{Object.entries(errors).map(([field, message]) => <li key={field}>{field === 'reference' ? <a href="#tracking-reference">{message}</a> : field === 'dateOfBirth' ? <a href="#tracking-dob">{message}</a> : message}</li>)}</ul></div>}<div className="field"><label htmlFor="tracking-reference">Application reference</label><input id="tracking-reference" value={reference} onChange={(event) => { setReference(event.target.value); clearError('reference'); clearError('lookup') }} autoComplete="off" aria-invalid={!!errors.reference} aria-describedby={errors.reference ? 'tracking-reference-error' : undefined} placeholder={`For example, ${sample.id}`} />{errors.reference && <span id="tracking-reference-error" className="field-error">{errors.reference}</span>}</div><div className="field"><label htmlFor="tracking-dob">Applicant’s date of birth</label><input id="tracking-dob" type="date" value={dateOfBirth} onChange={(event) => { setDateOfBirth(event.target.value); clearError('dateOfBirth'); clearError('lookup') }} aria-invalid={!!errors.dateOfBirth} aria-describedby={errors.dateOfBirth ? 'tracking-dob-error' : undefined} />{errors.dateOfBirth && <span id="tracking-dob-error" className="field-error">{errors.dateOfBirth}</span>}</div>{errors.lookup && <Alert type="error" title="Application not found"><p>{errors.lookup}</p></Alert>}<button className="primary-button" type="submit">{intent === 'correction' ? 'Continue to correction' : intent === 'certificate' ? 'Open certificate' : 'View application status'}</button></form><aside className="sample-credentials"><p className="eyebrow">Guaranteed sample journey</p><h2>Try a complete workflow</h2><p>These buttons use synthetic data and take you directly to a safe, repeatable scenario.</p><div className="sample-actions"><button type="button" className="secondary-button" onClick={() => openScenario('approved')}>Try approved sample</button><button type="button" className="secondary-button" onClick={() => openScenario('correction')}>Try correction sample</button><button type="button" className="text-button" onClick={() => openScenario('appointment')}>Try appointment sample</button></div><p className="hint">Manual check: <strong>{sample.id}</strong> and 14 June 1992.</p><button type="button" className="text-button" onClick={() => { reset(); setReference(''); setDateOfBirth(''); setErrors({}); setDemoMessage('Demo data reset. All sample journeys are ready again.') }}>Reset demo data</button>{demoMessage && <p className="success-message" role="status">{demoMessage}</p>}</aside></div>
  </div>
}

function ServiceTaskPage({ kind }: { kind: 'renew' | 'replace' }) {
  const { scenarios, requestCardService } = useService()
  const [step, setStep] = useState(0)
  const [reference, setReference] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [reason, setReason] = useState('')
  const [addressConfirmed, setAddressConfirmed] = useState(false)
  const [error, setError] = useState('')
  const renewal = kind === 'renew'
  const verifiedEntry = (Object.entries(scenarios) as [ScenarioId, typeof scenarios[ScenarioId]][]).find(([, app]) => app.id.toUpperCase() === reference.trim().toUpperCase() && app.draft.dateOfBirth === dateOfBirth)
  const verified = verifiedEntry?.[1]
  const verify = (event: FormEvent) => { event.preventDefault(); if (!verified) { setError('The reference and date of birth do not match.'); return } setError(''); setStep(1) }
  const create = (event: FormEvent) => { event.preventDefault(); if (!reason || !addressConfirmed || !verifiedEntry) { setError('Choose a reason and confirm the current address before continuing.'); return } requestCardService(verifiedEntry[0], renewal ? 'RENEWAL' : 'REPLACEMENT', reason); setError(''); setStep(2) }
  return <div className="container narrow page-section">
    <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: renewal ? 'Renew' : 'Replace card' }]} />
    <PageIntro eyebrow={renewal ? 'Renewal service' : 'Replacement service'} title={renewal ? 'Renew your UDID card' : 'Replace a lost or damaged card'}><p>{renewal ? 'Start a renewal while keeping your existing application history.' : 'Request a replacement without completing the full application again.'}</p></PageIntro>
    <figure className="journey-photo-card service-page-photo card-service-photo"><img src="/assets/service-centre-accessibility.jpg" alt="Wheelchair user using a ramp at an accessible Indian service centre" /><figcaption><strong>{renewal ? 'Keep your record moving forward' : 'Replace only what is needed'}</strong><span>{renewal ? 'Review your existing details and request the next stage without losing your history.' : 'A clear, focused request keeps your existing application history connected.'}</span></figcaption></figure>
    <JourneyRibbon mode="application" heading={renewal ? 'Renewal journey' : 'Replacement journey'} stages={[{ id: 'verify', label: 'Verify card' }, { id: 'details', label: 'Request details' }, { id: 'confirmation', label: 'Confirmation' }]} currentStageId={['verify', 'details', 'confirmation'][step]} nextAction={step === 0 ? 'Verify the existing card securely' : step === 1 ? 'Choose a reason and confirm the address' : 'Follow the request from your dashboard'} saved="Existing history stays preserved" />
    {step === 0 && <form onSubmit={verify} className="service-wizard"><h2>Verify the existing card</h2><div className="field"><label htmlFor={`${kind}-reference`}>Application or UDID reference</label><input id={`${kind}-reference`} value={reference} onChange={(event) => { setReference(event.target.value); setError('') }} /></div><div className="field"><label htmlFor={`${kind}-dob`}>Card holder’s date of birth</label><input id={`${kind}-dob`} type="date" value={dateOfBirth} onChange={(event) => { setDateOfBirth(event.target.value); setError('') }} /></div><p className="hint">Sample: UDID-53906 and 14 June 1992.</p>{error && <p className="field-error" role="alert">{error}</p>}<button className="primary-button">Verify and continue</button></form>}
    {step === 1 && verified && <form onSubmit={create} className="service-wizard"><Alert type="success" title="Existing record found"><p>{verified.applicantName} · {verified.id}. Existing application history will be preserved.</p></Alert><fieldset className="choice-group"><legend>{renewal ? 'Why is renewal needed?' : 'Why is a replacement needed?'}</legend>{(renewal ? ['Card validity is ending', 'Certificate details were updated', 'A renewal was requested by the service'] : ['Card was lost', 'Card was damaged', 'Card was not delivered']).map((item) => <label key={item}><input type="radio" name={`${kind}-reason`} checked={reason === item} onChange={() => { setReason(item); setError('') }} /> {item}</label>)}</fieldset><label className="consent-check"><input type="checkbox" checked={addressConfirmed} onChange={(event) => { setAddressConfirmed(event.target.checked); setError('') }} /><span><strong>Current address confirmed</strong><small>{verified.draft.address}, {verified.draft.state}</small></span></label>{error && <p className="field-error" role="alert">{error}</p>}<div className="button-row"><button type="button" className="secondary-button" onClick={() => setStep(0)}>Back</button><button className="primary-button">Submit request</button></div></form>}
    {step === 2 && <Alert type="success" title={`${renewal ? 'Renewal' : 'Replacement'} request submitted`}><p>Reference: <strong>{renewal ? 'RENEW-118' : 'REPLACE-226'}</strong>.</p><p>The request is linked to {reference.toUpperCase()}. You can keep this reference and follow updates from the dashboard.</p><Link to="/dashboard">Return to dashboard</Link></Alert>}
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
    <PageIntro eyebrow="Demo centre data" title="Find a medical centre"><p>Browse locations and accessibility details to find a centre that works for you. Verify the details with the official authority before travelling.</p></PageIntro>
    <figure className="journey-photo-card centre-photo-card"><img src="/assets/service-centre-accessibility.jpg" alt="A wheelchair user approaching a building through an accessible ramp" /><figcaption><strong>Accessibility starts at the entrance</strong><span>Check step-free access, arrival details and support information before you visit.</span></figcaption></figure>
    <div className="field compact-field"><label htmlFor="state-filter">Filter by state</label><select id="state-filter" value={state} onChange={(e) => setState(e.target.value)}><option>All</option>{stateNames.map((item) => <option key={item}>{item}</option>)}</select></div>
    {filtered.length ? <div className="authority-grid">{filtered.map((authority) => <article className="authority-card" key={authority.id}><p className="eyebrow">{authority.district}, {authority.state}</p><h2>{authority.name}</h2><p>{authority.address}</p><h3>Accessibility</h3><p>{authority.accessNotes}</p><dl className="centre-contact"><div><dt>Phone</dt><dd>{authority.phone}</dd></div><div><dt>Directions</dt><dd>{authority.directions}</dd></div><div><dt>Last checked</dt><dd>{authority.verifiedAt}</dd></div></dl><p className="meta">{authority.contactLabel}</p></article>)}</div> : <div className="empty-state"><span aria-hidden="true">⌁</span><h2>No centres in this state yet</h2><p>Choose another state or continue with the normal application route.</p><button className="secondary-button" onClick={() => setState('All')}>Show all centres</button></div>}
  </div>
}

export function HelpPage() {
  const [caseReference, setCaseReference] = useState('')
  const [category, setCategory] = useState('')
  const [contact, setContact] = useState('')
  const [message, setMessage] = useState('')
  const [supportErrors, setSupportErrors] = useState<Record<string, string>>({})
  const clearSupportError = (field: string) => setSupportErrors((currentErrors) => { if (!currentErrors[field]) return currentErrors; const remaining = { ...currentErrors }; delete remaining[field]; return remaining })
  const submitSupport = (event: FormEvent) => { event.preventDefault(); const errors: Record<string, string> = {}; if (!category) errors.category = 'Choose a help topic.'; if (!contact.trim()) errors.contact = 'Enter an email address or mobile number for a reply.'; if (message.trim().length < 20) errors.message = 'Describe the problem in at least 20 characters.'; if (Object.keys(errors).length) { setSupportErrors(errors); requestAnimationFrame(() => document.getElementById('support-error-summary')?.focus()); return } setSupportErrors({}); setCaseReference(`HELP-${String(Date.now()).slice(-6)}`) }
  return <div className="container narrow page-section">
    <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Help and FAQs' }]} />
    <PageIntro title="Help with your UDID journey"><p>Plain-language answers and a support route when an answer is not enough.</p></PageIntro>
    <div className="faq-list">{[
      ['Who can apply?', 'A person seeking a disability certificate and UDID card can begin the application. The designated medical authority makes assessment and eligibility decisions.'],
      ['Which documents can I upload?', 'Use a clear PDF, JPG or PNG up to 2 MB. Identity and address proofs should show all edges and readable text. Do not upload passwords or OTPs.'],
      ['What happens during medical assessment?', 'The selected medical authority reviews the application and arranges an assessment when required. Appointment details and accessibility information appear in the application timeline.'],
      ['How long is a certificate valid?', 'Validity depends on the certificate issued by the medical authority. Check the validity shown on your issued certificate before requesting renewal.'],
      ['Can I use DigiLocker?', 'Issued UDID documents may be available through supported government document services. This website does not connect to DigiLocker or claim that a document has been issued.'],
      ['How will my card be delivered?', 'Once generated, dispatch information appears in the application timeline. Keep the address current and use the tracking reference instead of sharing personal data with support.'],
      ['Why is my application taking longer?', 'Document checks, correction requests and assessment availability can affect timing. Open the timeline to see the latest event and whether you need to act.'],
      ['What happens if a document needs correction?', 'Only the affected document needs to be replaced. The corrected version is recorded while other answers and accepted documents remain saved.'],
      ['Can a caregiver apply for someone else?', 'Yes. Caregiver mode keeps the applicant and helper identities separate and asks for confirmation that the applicant or authorised guardian understands the submission.'],
      ['How do I change an appointment?', 'Open the appointment from the application dashboard, choose Reschedule, and confirm an available date and time. The change is added to the timeline.'],
    ].map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
    <section className="help-panel"><h2>Still need help?</h2><p>Send a support request and keep the case reference. For in-person assistance, use <Link to="/find-help">Find a medical centre</Link>.</p>{caseReference ? <Alert type="success" title="Support request received"><p>Case <strong>{caseReference}</strong> has been created. A response will use the contact method you entered.</p><p>For a real service, this confirmation would include a response time, contact channel and escalation route. Do not share passwords, OTPs, bank details or medical records in follow-up messages.</p></Alert> : <form className="support-form" onSubmit={submitSupport} noValidate>{Object.keys(supportErrors).length > 0 && <div id="support-error-summary" className="error-summary" role="alert" tabIndex={-1}><h3>Check the support request</h3><ul>{Object.entries(supportErrors).map(([field, error]) => <li key={field}><a href={`#support-${field}`}>{error}</a></li>)}</ul></div>}<div className="field"><label htmlFor="support-category">What do you need help with?</label><select id="support-category" value={category} onChange={(event) => { setCategory(event.target.value); clearSupportError('category') }} aria-invalid={!!supportErrors.category} aria-describedby={supportErrors.category ? 'support-category-error' : undefined}><option value="">Choose a topic</option><option>Application status</option><option>Documents or correction</option><option>Appointment</option><option>Renewal or replacement</option><option>Accessibility support</option></select>{supportErrors.category && <span id="support-category-error" className="field-error">{supportErrors.category}</span>}</div><div className="field"><label htmlFor="support-contact">Email or mobile number for a reply</label><input id="support-contact" value={contact} onChange={(event) => { setContact(event.target.value); clearSupportError('contact') }} autoComplete="email" aria-invalid={!!supportErrors.contact} aria-describedby={supportErrors.contact ? 'support-contact-error' : undefined} />{supportErrors.contact && <span id="support-contact-error" className="field-error">{supportErrors.contact}</span>}</div><div className="field"><label htmlFor="support-message">Describe the problem</label><textarea id="support-message" rows={5} value={message} onChange={(event) => { setMessage(event.target.value); clearSupportError('message') }} aria-invalid={!!supportErrors.message} aria-describedby={`support-message-hint${supportErrors.message ? ' support-message-error' : ''}`} /><span id="support-message-hint" className="hint">Do not include Aadhaar, passwords, OTPs, medical records or payment information.</span>{supportErrors.message && <span id="support-message-error" className="field-error">{supportErrors.message}</span>}</div><button className="secondary-button">Create support request</button></form>}</section>
  </div>
}

export function PrototypePage() {
  return <div className="container narrow page-section">
    <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Privacy and service information' }]} />
    <PageIntro eyebrow="Independent prototype" title="Privacy and service information"><p>This is a student-built prototype using synthetic data. It is not connected to any government system, and no information is submitted anywhere.</p></PageIntro>
    <section className="prototype-explainer"><h2>What this prototype simulates</h2><div className="experience-compare"><article><p className="eyebrow">In this prototype</p><ul><li>Browser-only, synthetic applications and documents</li><li>Sample tracking, appointment and certificate journeys</li><li>Centre locations and contact details marked as demo data</li></ul></article><article><p className="eyebrow">In a production service</p><ul><li>Authenticated, encrypted government integrations</li><li>Consent, audit logs, role-based access and retention controls</li><li>Verified authority data and live notification channels</li></ul></article></div></section>
    <section><h2>Your privacy</h2><p>Keep personal, identity, medical, disability and financial information secure. Do not share passwords, OTPs or payment details through support channels.</p></section>
    <section><h2>Service support</h2><p>Use the help route if you need assistance with documents, appointments, renewals, replacement, or tracking an application.</p></section>
  </div>
}

export function NotFoundPage() {
  return <div className="container narrow page-section"><PageIntro title="Page not found"><p>The page may have moved or the address may be incomplete.</p></PageIntro><Link className="primary-button" to="/">Return to task selection</Link></div>
}
