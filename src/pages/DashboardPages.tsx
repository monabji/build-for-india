import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { statusLabels } from '../domain/rules'
import type { ScenarioId } from '../domain/types'
import { useService } from '../state/ServiceContext'
import { Alert, AssistantPanel, Breadcrumbs, PageIntro, StatusPanel, Timeline } from '../components/UI'
import type { ApplicationRecord } from '../domain/types'
import { FileField } from './ApplicationPage'
import { JourneyRibbon } from '../components/JourneyRibbon'

function resolveApplication(scenarios: Record<ScenarioId, ApplicationRecord>, id?: string) {
  if (!id) return null
  return (Object.entries(scenarios) as [ScenarioId, ApplicationRecord][]).find(([scenarioId, app]) => scenarioId === id || app.id.toLowerCase() === id.toLowerCase()) ?? null
}

const serviceStages = [
  { id: 'started', label: 'Started' },
  { id: 'review', label: 'Document review' },
  { id: 'assessment', label: 'Assessment' },
  { id: 'decision', label: 'Decision' },
  { id: 'certificate', label: 'Certificate' },
  { id: 'dispatch', label: 'Card dispatch' },
]

function journeyStageFor(app: ApplicationRecord) {
  if (app.currentStatus === 'DRAFT' || app.currentStatus === 'SUBMITTED') return 'started'
  if (['DOCUMENT_REVIEW', 'CORRECTION_REQUIRED'].includes(app.currentStatus)) return 'review'
  if (['ASSESSMENT_SCHEDULED', 'MEDICAL_ASSESSMENT'].includes(app.currentStatus)) return 'assessment'
  if (['DECISION_PENDING', 'APPROVED'].includes(app.currentStatus)) return 'decision'
  if (app.currentStatus === 'CERTIFICATE_GENERATED') return 'certificate'
  return 'dispatch'
}

function journeyOwnerFor(app: ApplicationRecord) {
  if (app.currentStatus === 'DRAFT' || app.currentStatus === 'CORRECTION_REQUIRED') return 'You or your authorised helper'
  if (['DOCUMENT_REVIEW', 'SUBMITTED'].includes(app.currentStatus)) return 'Document review team'
  if (['ASSESSMENT_SCHEDULED', 'MEDICAL_ASSESSMENT'].includes(app.currentStatus)) return 'Selected medical authority'
  if (['DECISION_PENDING', 'APPROVED'].includes(app.currentStatus)) return 'Medical authority decision stage'
  return 'Certificate and card service'
}

function ServiceJourney({ app }: { app: ApplicationRecord }) {
  return <JourneyRibbon mode="service-status" stages={serviceStages} currentStageId={journeyStageFor(app)} owner={journeyOwnerFor(app)} nextAction={app.currentNextAction} lastUpdated={app.updatedAt} nextUpdate="After the current stage is completed" />
}

function dashboardActionFor(app: ApplicationRecord) {
  switch (app.currentStatus) {
    case 'DRAFT':
      return { required: true, title: app.currentNextAction, detail: 'Your saved answers are ready when you are.', label: 'Continue application', to: '/apply/identity' }
    case 'CORRECTION_REQUIRED':
      return { required: true, title: app.currentNextAction, detail: 'Only the document marked for correction needs to change. Everything else remains saved.', label: 'Fix this document', to: `/applications/${app.id}/correct` }
    case 'ASSESSMENT_SCHEDULED':
      return { required: true, title: app.currentNextAction, detail: app.appointment ? `${app.appointment.date} at ${app.appointment.time} · ${app.appointment.locationName}` : 'Open the appointment to review what to bring.', label: 'View appointment details', to: `/appointments/${app.id}` }
    case 'CERTIFICATE_GENERATED':
    case 'CARD_DISPATCHED':
      return { required: true, title: app.currentNextAction, detail: 'Your certificate is available from this service.', label: 'View certificate', to: `/documents/${app.id}` }
    default:
      return { required: false, title: 'No action is needed from you right now.', detail: app.currentNextAction, label: 'View application timeline', to: `/applications/${app.id}/timeline` }
  }
}

export function DashboardPage() {
  const { scenarios, activeScenario, verifiedScenario } = useService()
  if (!verifiedScenario || verifiedScenario !== activeScenario) return <Navigate to="/track" replace />
  const app = scenarios[activeScenario]
  const attention = app.documents.filter((document) => document.status === 'CORRECTION_REQUIRED')
  const primaryAction = dashboardActionFor(app)
  return <div className="container page-section dashboard-page">
    <div className="demo-toolbar" aria-label="Verified application"><div><p className="eyebrow">Verified application</p><p>{app.id} · Personal information is shown only for this matched reference.</p></div><Link className="text-button" to="/track">Track another application</Link></div>
    <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Your UDID services' }]} />
    <PageIntro eyebrow={app.id} title="What do you need to do today?"><h2 className="visually-hidden">Hello, {app.applicantName}</h2><p className="dashboard-greeting">Welcome back, {app.applicantName}. Your latest application information is below.</p></PageIntro>
    {app.mode !== 'SELF' && <p className="context-banner"><strong>Caregiver context:</strong> You are viewing {app.applicantName}'s application. Helper: {app.draft.caregiverName} ({app.draft.relationship}).</p>}
    <section className={`dashboard-primary-action ${primaryAction.required ? 'dashboard-primary-action-required' : 'dashboard-primary-action-waiting'}`} aria-labelledby="dashboard-primary-action-heading">
      <div className="dashboard-primary-action-copy">
        <p className="eyebrow">{primaryAction.required ? 'Your next action' : 'Your application is moving'}</p>
        <h2 id="dashboard-primary-action-heading">{primaryAction.title}</h2>
        <p>{primaryAction.detail}</p>
        <p className="dashboard-primary-action-status"><strong>Current status:</strong> {statusLabels[app.currentStatus]} · Updated {app.updatedAt}</p>
      </div>
      <Link className="primary-button dashboard-primary-action-link" to={primaryAction.to}>{primaryAction.label}</Link>
    </section>
    <ServiceJourney app={app} />
    <div className="dashboard-grid">
      <div><StatusPanel application={app} />
        <section className="dashboard-section"><div className="section-heading"><div><p className="eyebrow">Application history</p><h2>What has happened</h2></div><Link to={`/applications/${app.id}/timeline`}>View full timeline</Link></div><Timeline events={app.timeline} compact /></section>
      </div>
      <aside className="dashboard-side">
        {attention.length > 0 && <section className="action-card"><p className="eyebrow">Action needed</p><h2>Correct {attention[0].displayName.toLowerCase()}</h2><p>The name and address were not readable. Your other documents are saved.</p><Link className="primary-button" to={`/applications/${app.id}/correct`}>Upload correction</Link></section>}
        {app.appointment && <section className="appointment-card"><p className="eyebrow">Upcoming appointment</p><h2>{app.appointment.date}</h2><p><strong>{app.appointment.time}</strong><br />{app.appointment.locationName}</p><Link to={`/appointments/${app.id}`}>View appointment details</Link></section>}
        {app.currentStatus === 'CARD_DISPATCHED' && <section className="document-card"><p className="eyebrow">Document ready</p><h2>Certificate</h2><p>Open your certificate and download a copy.</p><Link className="primary-button" to={`/documents/${app.id}`}>View certificate</Link></section>}
        <section className="notification-card"><div className="section-heading"><h2>Notifications</h2><span>{app.notifications.length}</span></div>{app.notifications.slice(0, 2).map((note) => <article key={note.id}><strong>{note.title}</strong><p>{note.body}</p><small>{note.createdAt}</small></article>)}</section>
      </aside>
    </div>
    <section className="dashboard-section"><h2>Your documents</h2><div className="document-list">{app.documents.map((document) => <article key={document.id}><div><strong>{document.displayName}</strong><p>Version {document.version || 'not uploaded'} {document.uploadedAt && `· ${document.uploadedAt}`}</p></div><span className={`document-status status-${document.status.toLowerCase()}`}>{document.status === 'CORRECTION_REQUIRED' ? 'Needs correction' : document.status.toLowerCase().replace('_', ' ')}</span></article>)}</div></section>
    <section className="other-services"><h2>Other services</h2><div><Link to="/renew">Renew card</Link><Link to="/replace">Replace lost card</Link><Link to="/find-help">Find help</Link></div></section>
    <AssistantPanel context="status" />
  </div>
}

export function TimelinePage() {
  const { scenarios, verifiedScenario } = useService()
  const { id } = useParams()
  const resolved = resolveApplication(scenarios, id)
  if (!resolved || verifiedScenario !== resolved[0]) return <Navigate to="/track" replace />
  const [, app] = resolved
  return <div className="container page-section"><Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Dashboard', to: '/dashboard' }, { label: 'Application timeline' }]} /><PageIntro eyebrow={app.id} title="Application timeline"><p>Every visible status change has a dated event, explanation and next action.</p></PageIntro><ServiceJourney app={app} /><div className="narrow"><StatusPanel application={app} /><section className="full-timeline"><h2>Full history</h2><Timeline events={app.timeline} /></section><Link className="secondary-button" to="/dashboard">Back to dashboard</Link></div></div>
}

export function CorrectionPage() {
  const { scenarios, correctDocument, verifyScenario, verifiedScenario } = useService()
  const { id } = useParams()
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const [complete, setComplete] = useState(false)
  const [submittedVersion, setSubmittedVersion] = useState<number | null>(null)
  const navigate = useNavigate()
  const resolved = resolveApplication(scenarios, id)
  if (!resolved || verifiedScenario !== resolved[0]) return <Navigate to="/track?intent=correction" replace />
  const [scenarioId, app] = resolved
  if (!complete && app.currentStatus !== 'CORRECTION_REQUIRED') return <Navigate to="/track" replace />
  const problem = app.documents.find((document) => document.status === 'CORRECTION_REQUIRED')
  const safeDocuments = app.documents.filter((document) => document.status !== 'CORRECTION_REQUIRED')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!fileName) { setError('Choose a file or use the suggested filename.'); return }
    const updated = correctDocument(scenarioId, fileName)
    const correctedDocument = updated.documents.find((document) => document.id === problem?.id)
    setSubmittedVersion(correctedDocument?.version ?? null)
    setComplete(true)
  }

  const openDashboard = () => { verifyScenario(scenarioId); navigate('/dashboard') }
  return <div className="container page-section"><Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Dashboard', to: '/dashboard' }, { label: 'Correct application' }]} /><PageIntro eyebrow={app.id} title={complete ? 'Correction submitted' : 'Fix one document — keep everything else'}><p>{complete ? 'The corrected document is now being reviewed.' : 'You do not need to restart or complete the application again.'}</p></PageIntro><ServiceJourney app={app} /><div className="narrow">
    {complete ? <><Alert type="success" title="Corrected document received">{submittedVersion ? `Version ${submittedVersion} was added. ` : 'A new version was added. '}The application is back in document review; all other documents and answers were preserved. Your timeline and notifications were updated.</Alert><section className="correction-next-state" aria-labelledby="correction-next-state-heading"><p className="eyebrow">What changes now</p><h2 id="correction-next-state-heading">The reviewing office will check only the replacement</h2><p>No further action is needed unless the service contacts you. You can follow the review from your dashboard.</p></section><button className="primary-button" onClick={openDashboard}>View updated dashboard</button></> : <>
      <section className="correction-safety-summary" aria-labelledby="correction-safety-heading">
        <p className="eyebrow">Your progress is protected</p>
        <h2 id="correction-safety-heading">{safeDocuments.length} of {app.documents.length} documents are safe</h2>
        <div className="correction-safety-items">
          <p><strong>Safe:</strong> {safeDocuments.map((document) => document.displayName).join(', ')} and all your application answers.</p>
          <p><strong>Needs attention:</strong> Only {problem?.displayName.toLowerCase()}.</p>
          <p><strong>After you upload:</strong> The application returns to document review without restarting.</p>
        </div>
      </section>
      <figure className="journey-photo-card correction-photo-card"><img src="/assets/service-correction-path.jpg" alt="An accessible ramp leading along a clear path" /><figcaption><strong>There is a clear way forward</strong><span>Only the document marked for correction needs to change.</span></figcaption></figure>
      <section className="rejection-panel"><p className="eyebrow">One document needs attention</p><h2>{problem?.displayName} could not be verified</h2><p>Upload a clearer copy where the applicant's name and address can be read. Only this file will be replaced.</p><dl><div><dt>Document</dt><dd>{problem?.displayName}</dd></div><div><dt>Current version</dt><dd>Version {problem?.version}</dd></div><div><dt>Reason</dt><dd>The image is too unclear to read the name and address</dd></div><div><dt>Everything else</dt><dd>Saved and unchanged</dd></div></dl></section>
      <section className="correction-after-resubmission" aria-labelledby="correction-after-heading"><p className="eyebrow">What happens after resubmission</p><h2 id="correction-after-heading">Your correction goes straight back to review</h2><ol><li>The clearer file is saved as a new document version.</li><li>The medical authority reviews the replacement.</li><li>Your dashboard, timeline and notification are updated.</li></ol></section>
      <form onSubmit={submit} className="correction-form"><h2>Upload corrected address proof</h2><p className="correction-upload-guidance">Use a PDF, JPG or PNG up to 2 MB. Make sure the full document is visible, well lit and not blurred.</p><FileField id="correctedAddressDocument" label="Corrected address proof" value={fileName} onChange={(value) => { setFileName(value); setError('') }} error={error} /><button className="primary-button" type="submit">Upload corrected document</button></form>
      <AssistantPanel context="rejection" />
    </>}
  </div></div>
}

export function AppointmentPage() {
  const { scenarios, reschedule, verifiedScenario } = useService()
  const { id } = useParams()
  const [editing, setEditing] = useState(false)
  const [date, setDate] = useState('8 September 2026')
  const [time, setTime] = useState('11:45 AM')
  const [saved, setSaved] = useState(false)
  const resolved = resolveApplication(scenarios, id)
  if (!resolved || verifiedScenario !== resolved[0] || !resolved[1].appointment) return <Navigate to="/track" replace />
  const [scenarioId, app] = resolved
  const appointment = app.appointment!
  const submit = (event: FormEvent) => { event.preventDefault(); reschedule(scenarioId, date, time); setSaved(true); setEditing(false) }
  return <div className="container page-section"><Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Dashboard', to: '/dashboard' }, { label: 'Appointment details' }]} /><PageIntro eyebrow="Sample appointment" title="Your assessment appointment"><p>Review the time, place, accessibility information and preparation checklist.</p></PageIntro><ServiceJourney app={app} /><div className="narrow">{saved && <Alert type="success" title="Appointment updated">The application timeline and notification centre were updated too.</Alert>}<section className="appointment-detail"><p className="eyebrow">Upcoming sample appointment</p><h2>{saved ? date : appointment.date} at {saved ? time : appointment.time}</h2><h3>{appointment.locationName}</h3><p>{appointment.address}</p><dl><div><dt>Accessibility</dt><dd>{appointment.accessNotes}</dd></div><div><dt>Bring</dt><dd>Appointment letter and documents used in the application</dd></div><div><dt>Arrival</dt><dd>Arrive 20 minutes early</dd></div></dl></section>{editing ? <form className="reschedule-form" onSubmit={submit}><h2>Choose another time</h2><div className="field"><label htmlFor="new-date">Date</label><select id="new-date" value={date} onChange={(e) => setDate(e.target.value)}><option>8 September 2026</option><option>10 September 2026</option></select></div><div className="field"><label htmlFor="new-time">Time</label><select id="new-time" value={time} onChange={(e) => setTime(e.target.value)}><option>11:45 AM</option><option>2:15 PM</option></select></div><div className="button-row"><button type="button" className="text-button" onClick={() => setEditing(false)}>Cancel</button><button className="primary-button">Confirm appointment</button></div></form> : <button className="secondary-button" onClick={() => setEditing(true)}>Reschedule appointment</button>}</div></div>
}

export function CertificatePage() {
  const { scenarios, verifiedScenario } = useService()
  const { id } = useParams()
  const [downloaded, setDownloaded] = useState(false)
  const resolved = resolveApplication(scenarios, id)
  if (!resolved || verifiedScenario !== resolved[0] || !['CERTIFICATE_GENERATED', 'CARD_DISPATCHED'].includes(resolved[1].currentStatus)) return <Navigate to="/track?intent=certificate" replace />
  const [, app] = resolved
  const download = () => {
    const content = `ILLUSTRATIVE MOCK CERTIFICATE\n\nNot official and has no legal validity.\n\nApplicant name: ${app.applicantName}\nSynthetic UDID number: ${app.id}\nIssue date: 26 August 2026\nCertificate status: ${statusLabels[app.currentStatus]}\n\nThis is a sample certificate for a design prototype. It is not issued, signed or endorsed by any government authority.`
    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'udid-certificate.txt'
    anchor.click()
    URL.revokeObjectURL(url)
    setDownloaded(true)
  }
  return <div className="container page-section"><Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Dashboard', to: '/dashboard' }, { label: 'Certificate' }]} /><PageIntro eyebrow="Sample certificate" title="Your certificate"><p>Preview and download an illustrative sample certificate.</p></PageIntro><ServiceJourney app={app} /><div className="narrow"><Alert type="warning" title="Not an official certificate">This document has no legal validity and cannot be used for any government or identity purpose.</Alert><article className="certificate"><div className="certificate-banner">ILLUSTRATIVE MOCK CERTIFICATE · NOT OFFICIAL</div><p className="eyebrow">UDID Saathi</p><h2>Disability certificate</h2><dl><div><dt>Applicant</dt><dd>{app.applicantName}</dd></div><div><dt>Synthetic UDID number</dt><dd>{app.id}</dd></div><div><dt>Certificate status</dt><dd>Certificate generated</dd></div><div><dt>Issue date</dt><dd>26 August 2026</dd></div></dl><p className="certificate-note">This document is not issued, signed or endorsed by any government authority. It is not official and has no legal validity.</p></article><div className="button-row"><button className="primary-button" onClick={download}>Download certificate</button><Link className="secondary-button" to="/dashboard">Back to dashboard</Link></div>{downloaded && <p className="success-message" role="status">Sample certificate downloaded. This file is not an official government document.</p>}</div></div>
}
