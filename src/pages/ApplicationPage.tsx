import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { authorities, emptyDraft } from '../data/seed'
import type { ApplicantDraft } from '../domain/types'
import { useService } from '../state/ServiceContext'
import { Alert, AssistantPanel, Breadcrumbs, ProgressSteps } from '../components/UI'

const steps = [
  { id: 'about', label: 'About the applicant' },
  { id: 'identity', label: 'Identity and address' },
  { id: 'caregiver', label: 'Caregiver details' },
  { id: 'disability', label: 'Disability information' },
  { id: 'documents', label: 'Documents' },
  { id: 'authority', label: 'Medical authority' },
  { id: 'review', label: 'Review and submit' },
]

const demoDraft: ApplicantDraft = {
  mode: 'CAREGIVER', applicantName: 'Aarav Demo', dateOfBirth: '2012-05-18', contactPreference: 'In-app notification',
  address: '18 Sample Street, Demo Ward', district: 'Demo District', state: 'Maharashtra',
  caregiverName: 'Kavita Demo', relationship: 'Parent', disabilityCategory: 'Locomotor disability',
  supportNeeds: 'Step-free access and a quiet waiting area', identityDocument: 'synthetic-identity-proof.pdf',
  addressDocument: 'synthetic-address-proof.pdf', authorityId: 'auth-1', consent: true,
}

type Errors = Record<string, string>

function validate(step: string, draft: ApplicantDraft): Errors {
  const errors: Errors = {}
  if (step === 'about') {
    if (!draft.applicantName.trim()) errors.applicantName = 'Enter a synthetic applicant name.'
    if (!draft.dateOfBirth) errors.dateOfBirth = 'Choose a synthetic date of birth.'
    if (!draft.contactPreference) errors.contactPreference = 'Choose how demo updates should appear.'
  }
  if (step === 'identity') {
    if (!draft.address.trim()) errors.address = 'Enter a synthetic address.'
    if (!draft.district.trim()) errors.district = 'Enter a demo district.'
    if (!draft.state) errors.state = 'Choose a demo state.'
  }
  if (step === 'caregiver' && draft.mode !== 'SELF') {
    if (!draft.caregiverName.trim()) errors.caregiverName = 'Enter a synthetic caregiver or helper name.'
    if (!draft.relationship) errors.relationship = 'Choose the relationship to the applicant.'
  }
  if (step === 'disability' && !draft.disabilityCategory) errors.disabilityCategory = 'Choose a broad category for this prototype.'
  if (step === 'documents') {
    if (!draft.identityDocument) errors.identityDocument = 'Choose or add a synthetic identity document filename.'
    if (!draft.addressDocument) errors.addressDocument = 'Choose or add a synthetic address document filename.'
  }
  if (step === 'authority' && !draft.authorityId) errors.authorityId = 'Choose a demo medical authority.'
  if (step === 'review' && !draft.consent) errors.consent = 'Confirm that all information is synthetic before submitting.'
  return errors
}

export function ApplicationPage() {
  const { step = 'about' } = useParams()
  const [searchParams] = useSearchParams()
  const { loadDraft, saveDraft, submitDraft } = useService()
  const navigate = useNavigate()
  const initial = useMemo(() => {
    const saved = loadDraft()
    const draft = saved ? { ...emptyDraft, ...saved } : { ...emptyDraft }
    const mode = searchParams.get('mode')
    if (mode === 'caregiver') draft.mode = 'CAREGIVER'
    if (mode === 'assisted') draft.mode = 'ASSISTED'
    return draft
  }, [loadDraft, searchParams])
  const [draft, setDraft] = useState<ApplicantDraft>(initial)
  const [errors, setErrors] = useState<Errors>({})
  const [saveState, setSaveState] = useState('')
  const current = Math.max(0, steps.findIndex((item) => item.id === step))

  const update = <K extends keyof ApplicantDraft>(key: K, value: ApplicantDraft[K]) => setDraft((state) => ({ ...state, [key]: value }))
  const describedBy = (id: string, hint?: boolean) => [hint ? `${id}-hint` : '', errors[id] ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined

  const saveOnly = () => {
    setSaveState('Saving…')
    saveDraft(draft)
    setSaveState('Saved on this device just now.')
  }

  const next = (event: FormEvent) => {
    event.preventDefault()
    const found = validate(step, draft)
    setErrors(found)
    if (Object.keys(found).length) {
      requestAnimationFrame(() => document.getElementById('error-summary')?.focus())
      return
    }
    saveDraft(draft)
    setSaveState('Saved on this device just now.')
    if (step === 'review') {
      submitDraft(draft)
      navigate('/apply/confirmation')
      return
    }
    navigate(`/apply/${steps[current + 1].id}`)
  }

  return <div className="container page-section">
    <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Apply', to: '/apply' }, { label: steps[current].label }]} />
    <div className="application-layout">
      <aside><ProgressSteps current={current} labels={steps.map((item) => item.label)} /></aside>
      <div className="form-column">
        <p className="context-banner"><strong>Applicant:</strong> {draft.applicantName || 'Not entered yet'} <span>·</span> <strong>Mode:</strong> {draft.mode === 'SELF' ? 'Applying for myself' : draft.mode === 'CAREGIVER' ? 'Caregiver application' : 'Assisted-service application'}</p>
        <form onSubmit={next} noValidate>
          {Object.keys(errors).length > 0 && <div id="error-summary" className="error-summary" role="alert" tabIndex={-1}><h2>Check the information below</h2><ul>{Object.entries(errors).map(([id, message]) => <li key={id}><a href={`#${id}`}>{message}</a></li>)}</ul></div>}
          {step === 'about' && <>
            <h1>About the applicant</h1><p className="lead">Tell us who this synthetic application is for and how it is being completed.</p>
            <fieldset className="choice-group"><legend>Who is completing this application?</legend>
              <label><input type="radio" name="mode" checked={draft.mode === 'SELF'} onChange={() => update('mode', 'SELF')} /> I am applying for myself</label>
              <label><input type="radio" name="mode" checked={draft.mode === 'CAREGIVER'} onChange={() => update('mode', 'CAREGIVER')} /> I am applying for my child or another person</label>
              <label><input type="radio" name="mode" checked={draft.mode === 'ASSISTED'} onChange={() => update('mode', 'ASSISTED')} /> I am helping as a service operator</label>
            </fieldset>
            <TextField id="applicantName" label="Applicant's synthetic name" value={draft.applicantName} onChange={(value) => update('applicantName', value)} error={errors.applicantName} hint="Use a made-up name. Do not enter a real person's details." describedBy={describedBy('applicantName', true)} />
            <div className="field"><label htmlFor="dateOfBirth">Synthetic date of birth</label><span id="dateOfBirth-hint" className="hint">Use a fictional date for this demonstration.</span><input id="dateOfBirth" type="date" value={draft.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} aria-describedby={describedBy('dateOfBirth', true)} aria-invalid={!!errors.dateOfBirth} />{errors.dateOfBirth && <span id="dateOfBirth-error" className="field-error">{errors.dateOfBirth}</span>}</div>
            <fieldset className="choice-group"><legend>How should demo updates appear?</legend>{['In-app notification', 'SMS preview — nothing is sent', 'Email preview — nothing is sent'].map((item) => <label key={item}><input type="radio" name="contact" checked={draft.contactPreference === item} onChange={() => update('contactPreference', item)} /> {item}</label>)}{errors.contactPreference && <span className="field-error">{errors.contactPreference}</span>}</fieldset>
          </>}
          {step === 'identity' && <>
            <h1>Identity and address</h1><p className="lead">The prototype records plain synthetic labels only. It never asks for Aadhaar, PAN or identity numbers.</p>
            <TextField id="address" label="Synthetic address" value={draft.address} onChange={(value) => update('address', value)} error={errors.address} hint="Use a made-up house, street and area." describedBy={describedBy('address', true)} multiline />
            <div className="field-row"><TextField id="district" label="Demo district" value={draft.district} onChange={(value) => update('district', value)} error={errors.district} describedBy={describedBy('district')} /><div className="field"><label htmlFor="state">Demo state</label><select id="state" value={draft.state} onChange={(e) => update('state', e.target.value)} aria-invalid={!!errors.state} aria-describedby={describedBy('state')}><option value="">Choose a state</option><option>Maharashtra</option><option>Delhi</option><option>West Bengal</option><option>Karnataka</option></select>{errors.state && <span id="state-error" className="field-error">{errors.state}</span>}</div></div>
          </>}
          {step === 'caregiver' && <>
            <h1>{draft.mode === 'SELF' ? 'Caregiver details' : 'About the person helping'}</h1>
            {draft.mode === 'SELF' ? <Alert title="No caregiver details needed">You said you are applying for yourself. Continue to the next step.</Alert> : <><p className="lead">These details stay separate from {draft.applicantName || 'the applicant'}'s information.</p><TextField id="caregiverName" label="Helper's synthetic name" value={draft.caregiverName} onChange={(value) => update('caregiverName', value)} error={errors.caregiverName} hint="Use a made-up name for this prototype." describedBy={describedBy('caregiverName', true)} /><div className="field"><label htmlFor="relationship">Relationship to applicant</label><select id="relationship" value={draft.relationship} onChange={(e) => update('relationship', e.target.value)} aria-invalid={!!errors.relationship}><option value="">Choose relationship</option><option>Parent</option><option>Guardian</option><option>Family member</option><option>Service operator</option><option>Other trusted helper</option></select>{errors.relationship && <span className="field-error">{errors.relationship}</span>}</div><Alert title="Consent in assisted use">The applicant or authorised guardian should understand what is entered and what will happen next. This prototype does not verify legal authority.</Alert></>}
          </>}
          {step === 'disability' && <>
            <h1>Disability information</h1><p className="lead">Choose a broad category only so the prototype can explain the journey. Do not enter a real diagnosis or medical record.</p>
            <div className="field"><label htmlFor="disabilityCategory">Broad prototype category</label><select id="disabilityCategory" value={draft.disabilityCategory} onChange={(e) => update('disabilityCategory', e.target.value)} aria-invalid={!!errors.disabilityCategory}><option value="">Choose a category</option><option>Locomotor disability</option><option>Visual disability</option><option>Hearing disability</option><option>Intellectual disability</option><option>Multiple disabilities</option><option>Another listed category</option></select>{errors.disabilityCategory && <span className="field-error">{errors.disabilityCategory}</span>}</div>
            <TextField id="supportNeeds" label="Access support for a demo appointment (optional)" value={draft.supportNeeds} onChange={(value) => update('supportNeeds', value)} hint="For example: step-free access, sign-language support or a quiet waiting area." describedBy={describedBy('supportNeeds', true)} multiline />
          </>}
          {step === 'documents' && <>
            <h1>Add synthetic documents</h1><p className="lead">Only filenames are stored locally. Files are not uploaded to a server.</p><Alert type="warning" title="Do not choose a real personal file">For a safe demo, use the quick-fill button below or choose a file that contains no real information.</Alert>
            <FileField id="identityDocument" label="Synthetic identity proof" value={draft.identityDocument} error={errors.identityDocument} onChange={(value) => update('identityDocument', value)} />
            <FileField id="addressDocument" label="Synthetic address proof" value={draft.addressDocument} error={errors.addressDocument} onChange={(value) => update('addressDocument', value)} />
          </>}
          {step === 'authority' && <>
            <h1>Choose a demo medical authority</h1><p className="lead">This does not book a real appointment. Locations and accessibility details are synthetic.</p>
            <fieldset className="authority-choices"><legend>Preferred demo centre</legend>{authorities.map((authority) => <label key={authority.id} className={draft.authorityId === authority.id ? 'selected' : ''}><input type="radio" name="authority" checked={draft.authorityId === authority.id} onChange={() => update('authorityId', authority.id)} /><span><strong>{authority.name}</strong><small>{authority.address}</small><small><b>Accessibility:</b> {authority.accessNotes}</small></span></label>)}{errors.authorityId && <span className="field-error">{errors.authorityId}</span>}</fieldset>
          </>}
          {step === 'review' && <Review draft={draft} errors={errors} update={update} />}
          <div className="form-actions">
            {current > 0 && <Link className="secondary-button" to={`/apply/${steps[current - 1].id}`}>Back</Link>}
            <button className="primary-button" type="submit">{step === 'review' ? 'Submit synthetic application' : 'Save and continue'}</button>
            <button className="text-button" type="button" onClick={saveOnly}>Save and come back later</button>
          </div>
          <p className="save-state" role="status">{saveState}</p>
        </form>
        {step === 'about' && <button className="demo-fill" type="button" onClick={() => { setDraft(demoDraft); setSaveState('Demo values added. Review them before continuing.') }}>Fill all steps with safe demo values</button>}
        <AssistantPanel context="application" />
      </div>
    </div>
  </div>
}

function TextField({ id, label, value, onChange, error, hint, describedBy, multiline = false }: { id: string; label: string; value: string; onChange: (value: string) => void; error?: string; hint?: string; describedBy?: string; multiline?: boolean }) {
  const props = { id, value, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value), 'aria-invalid': !!error, 'aria-describedby': describedBy }
  return <div className="field"><label htmlFor={id}>{label}</label>{hint && <span id={`${id}-hint`} className="hint">{hint}</span>}{multiline ? <textarea {...props} rows={3} /> : <input {...props} />}{error && <span id={`${id}-error`} className="field-error">{error}</span>}</div>
}

function FileField({ id, label, value, onChange, error }: { id: string; label: string; value: string; onChange: (value: string) => void; error?: string }) {
  return <div className="file-field"><label htmlFor={id}>{label}</label><p className="hint">Accepted for demonstration: PDF, JPG or PNG · maximum 2 MB. Filename only is saved.</p><input id={id} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => onChange(e.target.files?.[0]?.name || '')} aria-invalid={!!error} />{value && <p className="file-selected"><strong>Selected:</strong> {value}</p>}{error && <span className="field-error">{error}</span>}<button type="button" className="text-button" onClick={() => onChange(id === 'identityDocument' ? 'synthetic-identity-proof.pdf' : 'synthetic-address-proof.pdf')}>Use safe demo filename</button></div>
}

function Review({ draft, errors, update }: { draft: ApplicantDraft; errors: Errors; update: <K extends keyof ApplicantDraft>(key: K, value: ApplicantDraft[K]) => void }) {
  const authority = authorities.find((item) => item.id === draft.authorityId)
  const sections = [
    ['Applicant', `${draft.applicantName} · ${draft.dateOfBirth} · ${draft.mode}`],
    ['Address', `${draft.address}, ${draft.district}, ${draft.state}`],
    ['Caregiver or helper', draft.mode === 'SELF' ? 'Not applicable' : `${draft.caregiverName} · ${draft.relationship}`],
    ['Disability information', `${draft.disabilityCategory}${draft.supportNeeds ? ` · ${draft.supportNeeds}` : ''}`],
    ['Documents', `${draft.identityDocument} · ${draft.addressDocument}`],
    ['Demo medical authority', authority?.name || 'Not selected'],
  ]
  return <><h1>Review your synthetic application</h1><p className="lead">Check each answer before sending it to the mocked service layer.</p><dl className="review-list">{sections.map(([term, value], index) => <div key={term}><dt>{term}</dt><dd>{value}</dd><Link to={`/apply/${steps[index].id}`}>Change</Link></div>)}</dl><label className="consent-check"><input id="consent" type="checkbox" checked={draft.consent} onChange={(e) => update('consent', e.target.checked)} /> <span><strong>I confirm this application uses only synthetic information.</strong><small>I understand that nothing will be sent to a government service.</small></span></label>{errors.consent && <span id="consent-error" className="field-error">{errors.consent}</span>}</>
}

export function ConfirmationPage() {
  const { scenarios, setActiveScenario } = useService()
  const navigate = useNavigate()
  const app = scenarios.new
  const goDashboard = () => { setActiveScenario('new'); navigate('/dashboard') }
  return <div className="container narrow page-section"><Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Application complete' }]} /><section className="confirmation-panel"><p className="confirmation-icon" aria-hidden="true">✓</p><p className="eyebrow">Synthetic submission received</p><h1>Your demo application has been submitted</h1><p>No information was sent to the Government of India or the live UDID portal.</p><dl><div><dt>Application ID</dt><dd>{app.id}</dd></div><div><dt>Applicant</dt><dd>{app.applicantName}</dd></div><div><dt>Next step</dt><dd>{app.currentNextAction}</dd></div></dl><button className="primary-button" onClick={goDashboard}>View application dashboard</button></section></div>
}

