import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { statusLabels } from '../domain/rules'
import type { ScenarioId } from '../domain/types'
import { useService } from '../state/ServiceContext'
import { Alert, AssistantPanel, Breadcrumbs, PageIntro, StatusPanel, Timeline } from '../components/UI'

const scenarioOptions: { id: ScenarioId; label: string; detail: string }[] = [
  { id: 'new', label: 'New applicant', detail: 'Draft or recently submitted' },
  { id: 'correction', label: 'Correction needed', detail: 'Rejected address proof' },
  { id: 'appointment', label: 'Assessment scheduled', detail: 'Upcoming appointment' },
  { id: 'approved', label: 'Approved', detail: 'Certificate and dispatch ready' },
]

export function DashboardPage() {
  const { scenarios, activeScenario, setActiveScenario, reset } = useService()
  const app = scenarios[activeScenario]
  const attention = app.documents.filter((document) => document.status === 'CORRECTION_REQUIRED')
  return <div className="container page-section">
    <div className="demo-toolbar" aria-labelledby="demo-scenario-heading"><div><p className="eyebrow" id="demo-scenario-heading">Application view</p><p>Switch applications to see their status, timeline and next action.</p></div><select aria-label="Choose application" value={activeScenario} onChange={(e) => setActiveScenario(e.target.value as ScenarioId)}>{scenarioOptions.map((option) => <option key={option.id} value={option.id}>{option.label} — {option.detail}</option>)}</select><button className="text-button" onClick={reset}>Reset application data</button></div>
    <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Your UDID services' }]} />
    <PageIntro eyebrow={app.id} title={`Hello, ${app.applicantName}`}><p>See the current status, next action and full application history.</p></PageIntro>
    {app.mode !== 'SELF' && <p className="context-banner"><strong>Caregiver context:</strong> You are viewing {app.applicantName}'s application. Helper: {app.draft.caregiverName} ({app.draft.relationship}).</p>}
    <div className="dashboard-grid">
      <div><StatusPanel application={app} />
        <section className="dashboard-section"><div className="section-heading"><div><p className="eyebrow">Application history</p><h2>What has happened</h2></div><Link to="/applications/current/timeline">View full timeline</Link></div><Timeline events={app.timeline} compact /></section>
      </div>
      <aside className="dashboard-side">
        {attention.length > 0 && <section className="action-card"><p className="eyebrow">Action needed</p><h2>Correct {attention[0].displayName.toLowerCase()}</h2><p>The name and address were not readable. Your other documents are saved.</p><Link className="primary-button" to="/applications/correction/correct">Upload correction</Link></section>}
        {app.appointment && <section className="appointment-card"><p className="eyebrow">Upcoming appointment</p><h2>{app.appointment.date}</h2><p><strong>{app.appointment.time}</strong><br />{app.appointment.locationName}</p><Link to="/appointments/current">View appointment details</Link></section>}
        {app.currentStatus === 'CARD_DISPATCHED' && <section className="document-card"><p className="eyebrow">Document ready</p><h2>Certificate</h2><p>Open your certificate and download a copy.</p><Link className="primary-button" to="/documents/certificate">View certificate</Link></section>}
        <section className="notification-card"><div className="section-heading"><h2>Notifications</h2><span>{app.notifications.length}</span></div>{app.notifications.slice(0, 2).map((note) => <article key={note.id}><strong>{note.title}</strong><p>{note.body}</p><small>{note.createdAt}</small></article>)}</section>
      </aside>
    </div>
    <section className="dashboard-section"><h2>Your documents</h2><div className="document-list">{app.documents.map((document) => <article key={document.id}><div><strong>{document.displayName}</strong><p>Version {document.version || 'not uploaded'} {document.uploadedAt && `· ${document.uploadedAt}`}</p></div><span className={`document-status status-${document.status.toLowerCase()}`}>{document.status === 'CORRECTION_REQUIRED' ? 'Needs correction' : document.status.toLowerCase().replace('_', ' ')}</span></article>)}</div></section>
    <section className="other-services"><h2>Other services</h2><div><Link to="/renew">Renew card</Link><Link to="/replace">Replace lost card</Link><Link to="/find-help">Find help</Link></div></section>
    <AssistantPanel context="status" />
  </div>
}

export function TimelinePage() {
  const { scenarios, activeScenario } = useService()
  const app = scenarios[activeScenario]
  return <div className="container narrow page-section"><Breadcrumbs items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Application timeline' }]} /><PageIntro eyebrow={app.id} title="Application timeline"><p>Every visible status change has a dated event, explanation and next action.</p></PageIntro><StatusPanel application={app} /><section className="full-timeline"><h2>Full history</h2><Timeline events={app.timeline} /></section><Link className="secondary-button" to="/dashboard">Back to dashboard</Link></div>
}

export function CorrectionPage() {
  const { scenarios, correctDocument, setActiveScenario } = useService()
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const [complete, setComplete] = useState(false)
  const navigate = useNavigate()
  const app = scenarios.correction
  const problem = app.documents.find((document) => document.status === 'CORRECTION_REQUIRED')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!fileName) { setError('Choose a file or use the suggested filename.'); return }
    correctDocument(fileName)
    setComplete(true)
  }

  const openDashboard = () => { setActiveScenario('correction'); navigate('/dashboard') }
  return <div className="container narrow page-section"><Breadcrumbs items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Correct application' }]} /><PageIntro eyebrow={app.id} title={complete ? 'Correction submitted' : 'Your application needs a correction'}><p>{complete ? 'The corrected document is now being reviewed.' : 'Only the address proof needs attention. The rest of the application is saved.'}</p></PageIntro>
    {complete ? <><Alert type="success" title="Corrected document received">Version 2 was added and your timeline and notification were updated.</Alert><button className="primary-button" onClick={openDashboard}>View updated dashboard</button></> : <>
      <section className="rejection-panel"><p className="eyebrow">What needs attention</p><h2>Address proof could not be verified</h2><p>Please upload a clearer document where the name and address are readable. Your other documents and answers are saved.</p><dl><div><dt>Document</dt><dd>{problem?.displayName}</dd></div><div><dt>Current version</dt><dd>Version {problem?.version}</dd></div><div><dt>Reason</dt><dd>Image is too unclear to read</dd></div></dl></section>
      <form onSubmit={submit} className="correction-form"><h2>Upload corrected address proof</h2><p className="hint">PDF, JPG or PNG · maximum 2 MB.</p><input aria-label="Corrected address proof" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => { setFileName(e.target.files?.[0]?.name || ''); setError('') }} />{fileName && <p><strong>Selected:</strong> {fileName}</p>}{error && <p className="field-error" role="alert">{error}</p>}<div className="button-row"><button type="button" className="text-button" onClick={() => { setFileName('corrected-address-proof.pdf'); setError('') }}>Use suggested filename</button><button className="primary-button" type="submit">Submit corrected document</button></div></form>
      <AssistantPanel context="rejection" />
    </>}
  </div>
}

export function AppointmentPage() {
  const { scenarios, activeScenario, reschedule } = useService()
  const app = scenarios[activeScenario]
  const appointment = app.appointment || scenarios.appointment.appointment!
  const [editing, setEditing] = useState(false)
  const [date, setDate] = useState('8 September 2026')
  const [time, setTime] = useState('11:45 AM')
  const [saved, setSaved] = useState(false)
  const submit = (event: FormEvent) => { event.preventDefault(); reschedule(date, time); setSaved(true); setEditing(false) }
  return <div className="container narrow page-section"><Breadcrumbs items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Appointment details' }]} /><PageIntro title="Your assessment appointment"><p>Review the time, place, accessibility information and preparation checklist.</p></PageIntro>{saved && <Alert type="success" title="Appointment updated">The application timeline and notification centre were updated too.</Alert>}<section className="appointment-detail"><p className="eyebrow">Upcoming appointment</p><h2>{saved ? date : appointment.date} at {saved ? time : appointment.time}</h2><h3>{appointment.locationName}</h3><p>{appointment.address}</p><dl><div><dt>Accessibility</dt><dd>{appointment.accessNotes}</dd></div><div><dt>Bring</dt><dd>Appointment letter and documents used in the application</dd></div><div><dt>Arrival</dt><dd>Arrive 20 minutes early</dd></div></dl></section>{editing ? <form className="reschedule-form" onSubmit={submit}><h2>Choose another time</h2><div className="field"><label htmlFor="new-date">Date</label><select id="new-date" value={date} onChange={(e) => setDate(e.target.value)}><option>8 September 2026</option><option>10 September 2026</option></select></div><div className="field"><label htmlFor="new-time">Time</label><select id="new-time" value={time} onChange={(e) => setTime(e.target.value)}><option>11:45 AM</option><option>2:15 PM</option></select></div><div className="button-row"><button type="button" className="text-button" onClick={() => setEditing(false)}>Cancel</button><button className="primary-button">Confirm appointment</button></div></form> : <button className="secondary-button" onClick={() => setEditing(true)}>Reschedule appointment</button>}</div>
}

export function CertificatePage() {
  const { scenarios } = useService()
  const app = scenarios.approved
  const download = () => {
    const content = `UDID CERTIFICATE\n\nNot an official document\nApplication: ${app.id}\nApplicant: ${app.applicantName}\nStatus: ${statusLabels[app.currentStatus]}\n\nThis file has no legal validity.`
    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain' }))
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'udid-certificate.txt'
    anchor.click()
    URL.revokeObjectURL(url)
  }
  return <div className="container narrow page-section"><Breadcrumbs items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Certificate' }]} /><PageIntro title="Your certificate"><p>Preview and download your certificate.</p></PageIntro><Alert type="warning" title="Not an official certificate">This document has no legal validity and cannot be used for any government or identity purpose.</Alert><article className="certificate"><div className="certificate-banner">NOT AN OFFICIAL DOCUMENT</div><p className="eyebrow">UDID Saathi</p><h2>Disability certificate</h2><dl><div><dt>Applicant</dt><dd>{app.applicantName}</dd></div><div><dt>Application reference</dt><dd>{app.id}</dd></div><div><dt>Status</dt><dd>Certificate generated</dd></div><div><dt>Generated</dt><dd>26 August 2026</dd></div></dl><p className="certificate-note">This document is not issued, signed or endorsed by any government authority.</p></article><div className="button-row"><button className="primary-button" onClick={download}>Download certificate</button><Link className="secondary-button" to="/dashboard">Back to dashboard</Link></div></div>
}
