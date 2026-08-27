import { createSeedScenarios } from '../data/seed'
import { canTransition } from '../domain/rules'
import type { ApplicantDraft, ApplicationRecord, ApplicationStatus, ScenarioId, StatusEvent } from '../domain/types'

const STORAGE_KEY = 'udid-redesign-demo-v1'
const DRAFT_KEY = 'udid-redesign-draft-v1'
const DRAFT_STEP_KEY = 'udid-redesign-draft-step-v1'

function nowLabel() {
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'long', timeStyle: 'short' }).format(new Date())
}

export class DemoService {
  private scenarios = createSeedScenarios()

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try { this.scenarios = JSON.parse(saved) as Record<ScenarioId, ApplicationRecord> } catch { this.persist() }
    }
  }

  private persist() { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.scenarios)) }

  listScenarios() { return structuredClone(this.scenarios) }

  getApplication(id: ScenarioId) { return structuredClone(this.scenarios[id]) }

  saveDraft(draft: ApplicantDraft, step = 'about') {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft))
    localStorage.setItem(DRAFT_STEP_KEY, step)
    return structuredClone(draft)
  }

  loadDraft() {
    const value = localStorage.getItem(DRAFT_KEY)
    if (!value) return null
    try { return JSON.parse(value) as ApplicantDraft } catch { return null }
  }

  loadDraftStep() {
    return localStorage.getItem(DRAFT_STEP_KEY) || 'about'
  }

  submitDraft(draft: ApplicantDraft) {
    if (this.scenarios.new.currentStatus !== 'DRAFT') {
      this.scenarios.new = createSeedScenarios().new
    }
    const record = this.scenarios.new
    record.applicantName = draft.applicantName
    record.draft = structuredClone(draft)
    record.mode = draft.mode
    this.transition('new', 'SUBMITTED', 'Application submitted', 'Your application has been received.', 'Document review will begin next.')
    record.completionPercent = 100
    localStorage.removeItem(DRAFT_KEY)
    localStorage.removeItem(DRAFT_STEP_KEY)
    this.persist()
    return structuredClone(record)
  }

  transition(id: ScenarioId, to: ApplicationStatus, title: string, description: string, nextAction: string) {
    const app = this.scenarios[id]
    if (!canTransition(app.currentStatus, to)) throw new Error(`Invalid transition: ${app.currentStatus} to ${to}`)
    const timestamp = nowLabel()
    const event: StatusEvent = {
      id: `event-${Date.now()}`, status: to, title, description, occurredAt: timestamp,
      actorLabel: 'Service team', userActionRequired: to === 'CORRECTION_REQUIRED', nextAction,
    }
    app.currentStatus = to
    app.currentNextAction = nextAction
    app.updatedAt = timestamp
    app.timeline.unshift(event)
    app.notifications.unshift({ id: `note-${Date.now()}`, title, body: nextAction, createdAt: timestamp, read: false })
    this.persist()
    return structuredClone(app)
  }

  correctDocument(id: ScenarioId, fileName: string) {
    const app = this.scenarios[id]
    if (app.currentStatus !== 'CORRECTION_REQUIRED') throw new Error('This application does not need a correction.')
    const document = app.documents.find((item) => item.status === 'CORRECTION_REQUIRED')
    if (!document) throw new Error('No document requires correction.')
    document.displayName = fileName || 'Corrected address proof.pdf'
    document.status = 'UPLOADED'
    document.version += 1
    document.uploadedAt = nowLabel()
    delete document.reasonCode
    return this.transition(id, 'DOCUMENT_REVIEW', 'Corrected document submitted', 'Version 2 was received. Your other application information was preserved.', 'No action is needed while the document is reviewed.')
  }

  rescheduleAppointment(id: ScenarioId, date: string, time: string) {
    const app = this.scenarios[id]
    if (!app.appointment) throw new Error('No appointment is available.')
    app.appointment.date = date
    app.appointment.time = time
    app.updatedAt = nowLabel()
    app.timeline.unshift({
      id: `event-${Date.now()}`, status: app.currentStatus, title: 'Appointment rescheduled',
      description: `The appointment is now ${date} at ${time}.`, occurredAt: app.updatedAt,
      actorLabel: 'Applicant', userActionRequired: true, nextAction: `Attend the appointment on ${date} at ${time}.`,
    })
    app.currentNextAction = `Attend the appointment on ${date} at ${time}.`
    app.notifications.unshift({ id: `note-${Date.now()}`, title: 'Appointment updated', body: app.currentNextAction, createdAt: app.updatedAt, read: false })
    this.persist()
    return structuredClone(app)
  }

  requestCardService(id: ScenarioId, serviceType: 'RENEWAL' | 'REPLACEMENT', reason: string) {
    const app = this.scenarios[id]
    const timestamp = nowLabel()
    const serviceLabel = serviceType === 'RENEWAL' ? 'Renewal' : 'Replacement'
    app.serviceType = serviceType
    app.updatedAt = timestamp
    app.currentNextAction = `The ${serviceLabel.toLowerCase()} request is being reviewed. No action is needed right now.`
    app.timeline.unshift({
      id: `event-${Date.now()}`,
      status: app.currentStatus,
      title: `${serviceLabel} request submitted`,
      description: `Reason: ${reason}. The existing application history was preserved.`,
      occurredAt: timestamp,
      actorLabel: 'Applicant',
      userActionRequired: false,
      nextAction: app.currentNextAction,
    })
    app.notifications.unshift({
      id: `note-${Date.now()}`,
      title: `${serviceLabel} request received`,
      body: app.currentNextAction,
      createdAt: timestamp,
      read: false,
    })
    this.persist()
    return structuredClone(app)
  }

  reset() {
    this.scenarios = createSeedScenarios()
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(DRAFT_KEY)
    localStorage.removeItem(DRAFT_STEP_KEY)
    this.persist()
    return this.listScenarios()
  }
}
