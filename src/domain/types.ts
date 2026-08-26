export type ApplicationMode = 'SELF' | 'CAREGIVER' | 'ASSISTED'
export type ApplicationStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'DOCUMENT_REVIEW'
  | 'CORRECTION_REQUIRED'
  | 'ASSESSMENT_SCHEDULED'
  | 'MEDICAL_ASSESSMENT'
  | 'DECISION_PENDING'
  | 'APPROVED'
  | 'CERTIFICATE_GENERATED'
  | 'CARD_DISPATCHED'

export type DocumentStatus = 'MISSING' | 'UPLOADED' | 'ACCEPTED' | 'CORRECTION_REQUIRED'

export interface ApplicantDraft {
  mode: ApplicationMode
  applicantName: string
  dateOfBirth: string
  contactPreference: string
  address: string
  district: string
  state: string
  caregiverName: string
  relationship: string
  disabilityCategory: string
  supportNeeds: string
  identityDocument: string
  addressDocument: string
  authorityId: string
  consent: boolean
}

export interface DocumentRecord {
  id: string
  type: string
  displayName: string
  status: DocumentStatus
  version: number
  uploadedAt?: string
  reasonCode?: string
}

export interface StatusEvent {
  id: string
  status: ApplicationStatus
  title: string
  description: string
  occurredAt: string
  actorLabel: string
  userActionRequired: boolean
  nextAction: string
}

export interface NotificationRecord {
  id: string
  title: string
  body: string
  createdAt: string
  read: boolean
}

export interface Appointment {
  id: string
  date: string
  time: string
  locationName: string
  address: string
  accessNotes: string
  status: 'UPCOMING' | 'COMPLETED' | 'RESCHEDULE_REQUIRED'
}

export interface ApplicationRecord {
  id: string
  applicantName: string
  mode: ApplicationMode
  serviceType: 'NEW' | 'RENEWAL' | 'REPLACEMENT'
  currentStatus: ApplicationStatus
  currentNextAction: string
  completionPercent: number
  updatedAt: string
  draft: ApplicantDraft
  documents: DocumentRecord[]
  timeline: StatusEvent[]
  notifications: NotificationRecord[]
  appointment?: Appointment
}

export interface Authority {
  id: string
  name: string
  district: string
  state: string
  address: string
  accessNotes: string
  contactLabel: string
}

export type ScenarioId = 'new' | 'correction' | 'appointment' | 'approved'

