import { useMemo, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { emptyDraft } from '../data/seed'
import { authorities, stateNames } from '../data/centres'
import type { ApplicantDraft } from '../domain/types'
import { useService } from '../state/ServiceContext'
import { Alert, AssistantPanel, Breadcrumbs } from '../components/UI'
import { readUpload, validateUpload } from '../domain/uploads'
import { JourneyRibbon } from '../components/JourneyRibbon'

const steps = [
  { id: 'about', label: 'About the applicant' },
  { id: 'identity', label: 'Identity and address' },
  { id: 'caregiver', label: 'Caregiver details' },
  { id: 'disability', label: 'Disability information' },
  { id: 'documents', label: 'Documents' },
  { id: 'authority', label: 'Medical authority' },
  { id: 'review', label: 'Review and submit' },
]

const ribbonSteps = [
  { id: 'about', label: 'Applicant' },
  { id: 'identity', label: 'Address' },
  { id: 'caregiver', label: 'Helper' },
  { id: 'disability', label: 'Disability' },
  { id: 'documents', label: 'Documents' },
  { id: 'authority', label: 'Centre' },
  { id: 'review', label: 'Review' },
]

const demoDraft: ApplicantDraft = {
  mode: 'CAREGIVER', applicantName: 'Aarav Kumar', dateOfBirth: '2012-05-18', contactPreference: 'In-app notification',
  address: '18 Sample Street, Central Ward', district: 'Central District', state: 'Maharashtra',
  caregiverName: 'Kavita Kumar', relationship: 'Parent', disabilityCategory: 'Locomotor disability',
  supportNeeds: 'Step-free access and a quiet waiting area', identityDocument: 'identity-proof.pdf',
  addressDocument: 'address-proof.pdf', authorityId: 'centre-maharashtra', consent: true,
}

type Errors = Record<string, string>

function validate(step: string, draft: ApplicantDraft): Errors {
  const errors: Errors = {}
  if (step === 'about') {
    if (!draft.applicantName.trim()) errors.applicantName = 'Enter the applicant’s name.'
    if (!draft.dateOfBirth) errors.dateOfBirth = 'Enter the applicant’s date of birth.'
    if (!draft.contactPreference) errors.contactPreference = 'Choose how updates should appear.'
  }
  if (step === 'identity') {
    if (!draft.address.trim()) errors.address = 'Enter an address.'
    if (!draft.district.trim()) errors.district = 'Enter a district.'
    if (!draft.state) errors.state = 'Choose a state.'
  }
  if (step === 'caregiver' && draft.mode !== 'SELF') {
    if (!draft.caregiverName.trim()) errors.caregiverName = 'Enter the caregiver or helper’s name.'
    if (!draft.relationship) errors.relationship = 'Choose the relationship to the applicant.'
  }
  if (step === 'disability' && !draft.disabilityCategory) errors.disabilityCategory = 'Choose a broad category.'
  if (step === 'documents') {
    if (!draft.identityDocument) errors.identityDocument = 'Choose an identity document.'
    if (!draft.addressDocument) errors.addressDocument = 'Choose an address document.'
  }
  if (step === 'authority' && !draft.authorityId) errors.authorityId = 'Choose a medical authority.'
  if (step === 'review' && !draft.consent) errors.consent = 'Confirm the information is correct before submitting.'
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
  const current = steps.findIndex((item) => item.id === step)

  if (current < 0) return <Navigate to="/apply/about" replace />
  const nextAction = step === 'review' ? 'Confirm the declaration and submit the application' : `Continue to ${steps[current + 1].label.toLowerCase()}`

  const update = <K extends keyof ApplicantDraft>(key: K, value: ApplicantDraft[K]) => setDraft((state) => ({ ...state, [key]: value }))
  const describedBy = (id: string, hint?: boolean) => [hint ? `${id}-hint` : '', errors[id] ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined

  const saveOnly = () => {
    saveDraft(draft)
    navigate('/apply?saved=true')
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
    <JourneyRibbon mode="application" stages={ribbonSteps} currentStageId={step} nextAction={nextAction} saved={saveState || 'Progress saves on this device'} />
    <div className="application-layout application-layout--ribbon">
      <div className="form-column">
        <p className="context-banner"><strong>Applicant:</strong> {draft.applicantName || 'Not entered yet'} <span>·</span> <strong>Mode:</strong> {draft.mode === 'SELF' ? 'Applying for myself' : draft.mode === 'CAREGIVER' ? 'Caregiver application' : 'Assisted-service application'}</p>
        <form onSubmit={next} noValidate>
          {Object.keys(errors).length > 0 && <div id="error-summary" className="error-summary" role="alert" tabIndex={-1}><h2>Check the information below</h2><ul>{Object.entries(errors).map(([id, message]) => <li key={id}><a href={`#${id}`}>{message}</a></li>)}</ul></div>}
          {step === 'about' && <>
            <figure className="journey-photo-card application-photo-card"><img src="/assets/service-application-documents.jpg" alt="Hands completing forms at a desk" /><figcaption><strong>Start with the information you have</strong><span>Keep your documents nearby. You can save this application and return later.</span></figcaption></figure>
            <h1>About the applicant</h1><p className="lead">Tell us who this application is for and how it is being completed.</p>
            <fieldset className="choice-group"><legend>Who is completing this application?</legend>
              <label><input type="radio" name="mode" checked={draft.mode === 'SELF'} onChange={() => update('mode', 'SELF')} /> I am applying for myself</label>
              <label><input type="radio" name="mode" checked={draft.mode === 'CAREGIVER'} onChange={() => update('mode', 'CAREGIVER')} /> I am applying for my child or another person</label>
              <label><input type="radio" name="mode" checked={draft.mode === 'ASSISTED'} onChange={() => update('mode', 'ASSISTED')} /> I am helping as a service operator</label>
            </fieldset>
            <TextField id="applicantName" label="Applicant's name" value={draft.applicantName} onChange={(value) => update('applicantName', value)} error={errors.applicantName} describedBy={describedBy('applicantName')} />
            <div className="field"><label htmlFor="dateOfBirth">Date of birth</label><input id="dateOfBirth" type="date" value={draft.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} aria-describedby={describedBy('dateOfBirth')} aria-invalid={!!errors.dateOfBirth} />{errors.dateOfBirth && <span id="dateOfBirth-error" className="field-error">{errors.dateOfBirth}</span>}</div>
            <fieldset className="choice-group"><legend>How should updates appear?</legend>{['In-app notification', 'SMS', 'Email'].map((item) => <label key={item}><input type="radio" name="contact" checked={draft.contactPreference === item} onChange={() => update('contactPreference', item)} /> {item}</label>)}{errors.contactPreference && <span className="field-error">{errors.contactPreference}</span>}</fieldset>
          </>}
          {step === 'identity' && <>
            <h1>Identity and address</h1><p className="lead">We do not ask for Aadhaar, PAN or identity numbers.</p>
            <TextField id="address" label="Address" value={draft.address} onChange={(value) => update('address', value)} error={errors.address} describedBy={describedBy('address')} multiline />
            <div className="field-row"><TextField id="district" label="District" value={draft.district} onChange={(value) => update('district', value)} error={errors.district} describedBy={describedBy('district')} /><div className="field"><label htmlFor="state">State or union territory</label><select id="state" value={draft.state} onChange={(e) => setDraft((currentDraft) => ({ ...currentDraft, state: e.target.value, authorityId: '' }))} aria-invalid={!!errors.state} aria-describedby={describedBy('state')}><option value="">Choose a state or union territory</option>{stateNames.map((stateName) => <option key={stateName}>{stateName}</option>)}</select>{errors.state && <span id="state-error" className="field-error">{errors.state}</span>}</div></div>
          </>}
          {step === 'caregiver' && <>
            <h1>{draft.mode === 'SELF' ? 'Caregiver details' : 'About the person helping'}</h1>
            {draft.mode === 'SELF' ? <Alert title="No caregiver details needed">You said you are applying for yourself. Continue to the next step.</Alert> : <><p className="lead">These details stay separate from {draft.applicantName || 'the applicant'}'s information.</p><TextField id="caregiverName" label="Helper's name" value={draft.caregiverName} onChange={(value) => update('caregiverName', value)} error={errors.caregiverName} describedBy={describedBy('caregiverName')} /><div className="field"><label htmlFor="relationship">Relationship to applicant</label><select id="relationship" value={draft.relationship} onChange={(e) => update('relationship', e.target.value)} aria-invalid={!!errors.relationship}><option value="">Choose relationship</option><option>Parent</option><option>Guardian</option><option>Family member</option><option>Service operator</option><option>Other trusted helper</option></select>{errors.relationship && <span className="field-error">{errors.relationship}</span>}</div><Alert title="Consent in assisted use">The applicant or authorised guardian should understand what is entered and what will happen next.</Alert></>}
          </>}
          {step === 'disability' && <>
            <h1>Disability information</h1><p className="lead">Choose a broad category to guide this journey. Do not enter a diagnosis or medical record.</p>
            <div className="field"><label htmlFor="disabilityCategory">Broad disability category</label><select id="disabilityCategory" value={draft.disabilityCategory} onChange={(e) => update('disabilityCategory', e.target.value)} aria-invalid={!!errors.disabilityCategory}><option value="">Choose a category</option><option>Locomotor disability</option><option>Visual disability</option><option>Hearing disability</option><option>Intellectual disability</option><option>Multiple disabilities</option><option>Another listed category</option></select>{errors.disabilityCategory && <span className="field-error">{errors.disabilityCategory}</span>}</div>
            <TextField id="supportNeeds" label="Access support for an appointment (optional)" value={draft.supportNeeds} onChange={(value) => update('supportNeeds', value)} hint="For example: step-free access, sign-language support or a quiet waiting area." describedBy={describedBy('supportNeeds', true)} multiline />
          </>}
          {step === 'documents' && <>
            <h1>Add documents</h1><p className="lead">Choose the documents needed for your application.</p>
            <FileField id="identityDocument" label="Identity proof" value={draft.identityDocument} error={errors.identityDocument} onChange={(value) => update('identityDocument', value)} />
            <FileField id="addressDocument" label="Address proof" value={draft.addressDocument} error={errors.addressDocument} onChange={(value) => update('addressDocument', value)} />
          </>}
          {step === 'authority' && <>
            <h1>Choose a medical authority</h1><p className="lead">Choose a centre that works for you.</p>
            {!draft.state ? <Alert type="warning" title="Choose your state first"><p>Return to Identity and address so we can show the relevant centre.</p><Link to="/apply/identity">Choose state or union territory</Link></Alert> : <fieldset className="authority-choices"><legend>Preferred centre in {draft.state}</legend>{authorities.filter((authority) => authority.state === draft.state).map((authority) => <label key={authority.id} className={draft.authorityId === authority.id ? 'selected' : ''}><input type="radio" name="authority" checked={draft.authorityId === authority.id} onChange={() => update('authorityId', authority.id)} /><span><strong>{authority.name}</strong><small>{authority.address}</small><small><b>Accessibility:</b> {authority.accessNotes}</small></span></label>)}{errors.authorityId && <span className="field-error">{errors.authorityId}</span>}</fieldset>}
          </>}
          {step === 'review' && <Review draft={draft} errors={errors} update={update} />}
          <div className="form-actions">
            {current > 0 && <Link className="secondary-button" to={`/apply/${steps[current - 1].id}`}>Back</Link>}
            <button className="primary-button" type="submit">{step === 'review' ? 'Submit application' : 'Save and continue'}</button>
            <button className="text-button" type="button" onClick={saveOnly}>Save and come back later</button>
          </div>
          <p className="save-state" role="status">{saveState}</p>
        </form>
        {step === 'about' && <button className="demo-fill" type="button" onClick={() => { setDraft(demoDraft); setSaveState('Information added. Review it before continuing.') }}>Fill application details</button>}
        <AssistantPanel context="application" />
      </div>
    </div>
  </div>
}

function TextField({ id, label, value, onChange, error, hint, describedBy, multiline = false }: { id: string; label: string; value: string; onChange: (value: string) => void; error?: string; hint?: string; describedBy?: string; multiline?: boolean }) {
  const props = { id, value, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value), 'aria-invalid': !!error, 'aria-describedby': describedBy }
  return <div className="field"><label htmlFor={id}>{label}</label>{hint && <span id={`${id}-hint`} className="hint">{hint}</span>}{multiline ? <textarea {...props} rows={3} /> : <input {...props} />}{error && <span id={`${id}-error`} className="field-error">{error}</span>}</div>
}

export function FileField({ id, label, value, onChange, error }: { id: string; label: string; value: string; onChange: (value: string) => void; error?: string }) {
  const [uploadError, setUploadError] = useState('')
  const [progress, setProgress] = useState(value ? 100 : 0)
  const [lastFile, setLastFile] = useState<File | null>(null)

  const process = async (file: File) => {
    setLastFile(file)
    setUploadError('')
    onChange('')
    const validationError = validateUpload(file)
    if (validationError) { setUploadError(validationError); setProgress(0); return }
    setProgress(35)
    try {
      await readUpload(file)
      setProgress(100)
      onChange(file.name)
    } catch {
      setProgress(0)
      setUploadError('The file could not be read. Check it and try again.')
    }
  }

  const selectedError = uploadError || error
  return <div className="file-field"><label htmlFor={id}>{label}</label><p id={`${id}-requirements`} className="hint">Accepted: PDF, JPG or PNG · maximum 2 MB · make sure all text and edges are visible.</p><input id={id} type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => { const file = e.target.files?.[0]; if (file) void process(file) }} aria-invalid={!!selectedError} aria-describedby={`${id}-requirements${selectedError ? ` ${id}-error` : ''}`} />{progress > 0 && progress < 100 && <div className="upload-progress" role="status"><span>Checking file…</span><progress max="100" value={progress} /></div>}{value && progress === 100 && <p className="file-selected" role="status"><strong>Ready:</strong> {value}</p>}{selectedError && <p id={`${id}-error`} className="field-error" role="alert">{selectedError}</p>}{uploadError && lastFile && <button type="button" className="text-button" onClick={() => void process(lastFile)}>Try this file again</button>}<button type="button" className="text-button" onClick={() => { setUploadError(''); setProgress(100); onChange(id === 'identityDocument' ? 'identity-proof.pdf' : 'address-proof.pdf') }}>Use prepared sample document</button></div>
}

function Review({ draft, errors, update }: { draft: ApplicantDraft; errors: Errors; update: <K extends keyof ApplicantDraft>(key: K, value: ApplicantDraft[K]) => void }) {
  const authority = authorities.find((item) => item.id === draft.authorityId)
  const sections = [
    ['Applicant', `${draft.applicantName} · ${draft.dateOfBirth} · ${draft.mode}`],
    ['Address', `${draft.address}, ${draft.district}, ${draft.state}`],
    ['Caregiver or helper', draft.mode === 'SELF' ? 'Not applicable' : `${draft.caregiverName} · ${draft.relationship}`],
    ['Disability information', `${draft.disabilityCategory}${draft.supportNeeds ? ` · ${draft.supportNeeds}` : ''}`],
    ['Documents', `${draft.identityDocument} · ${draft.addressDocument}`],
    ['Medical authority', authority?.name || 'Not selected'],
  ]
  return <><h1>Review your application</h1><p className="lead">Check each answer before submitting.</p><dl className="review-list">{sections.map(([term, value], index) => <div key={term}><dt>{term}</dt><dd>{value}</dd><Link to={`/apply/${steps[index].id}`}>Change</Link></div>)}</dl><label className="consent-check"><input id="consent" type="checkbox" checked={draft.consent} onChange={(e) => update('consent', e.target.checked)} /> <span><strong>I confirm this information is correct.</strong><small>I understand the next steps in my application.</small></span></label>{errors.consent && <span id="consent-error" className="field-error">{errors.consent}</span>}</>
}

export function ConfirmationPage() {
  const { scenarios, verifyScenario } = useService()
  const navigate = useNavigate()
  const app = scenarios.new
  if (app.currentStatus === 'DRAFT') return <Navigate to="/apply" replace />
  const goDashboard = () => { verifyScenario('new'); navigate('/dashboard') }
  return <div className="container narrow page-section"><Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Application complete' }]} /><section className="confirmation-panel"><p className="confirmation-icon" aria-hidden="true">✓</p><p className="eyebrow">Application received</p><h1>Your application has been submitted</h1><p>You can now follow its progress from your dashboard.</p><dl><div><dt>Application ID</dt><dd>{app.id}</dd></div><div><dt>Applicant</dt><dd>{app.applicantName}</dd></div><div><dt>Next step</dt><dd>{app.currentNextAction}</dd></div></dl><button className="primary-button" onClick={goDashboard}>View application dashboard</button></section></div>
}
