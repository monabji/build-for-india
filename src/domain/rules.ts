import type { ApplicationStatus } from './types'

export const statusLabels: Record<ApplicationStatus, string> = {
  DRAFT: 'Draft application',
  SUBMITTED: 'Application submitted',
  DOCUMENT_REVIEW: 'Documents being reviewed',
  CORRECTION_REQUIRED: 'Correction needed',
  ASSESSMENT_SCHEDULED: 'Medical assessment scheduled',
  MEDICAL_ASSESSMENT: 'Medical assessment completed',
  DECISION_PENDING: 'Decision in progress',
  APPROVED: 'Application approved',
  CERTIFICATE_GENERATED: 'Certificate ready',
  CARD_DISPATCHED: 'Card dispatched',
}

export const allowedTransitions: Partial<Record<ApplicationStatus, ApplicationStatus[]>> = {
  DRAFT: ['SUBMITTED'],
  SUBMITTED: ['DOCUMENT_REVIEW'],
  DOCUMENT_REVIEW: ['ASSESSMENT_SCHEDULED', 'CORRECTION_REQUIRED'],
  CORRECTION_REQUIRED: ['DOCUMENT_REVIEW'],
  ASSESSMENT_SCHEDULED: ['MEDICAL_ASSESSMENT'],
  MEDICAL_ASSESSMENT: ['DECISION_PENDING'],
  DECISION_PENDING: ['APPROVED'],
  APPROVED: ['CERTIFICATE_GENERATED'],
  CERTIFICATE_GENERATED: ['CARD_DISPATCHED'],
}

export function canTransition(from: ApplicationStatus, to: ApplicationStatus) {
  return allowedTransitions[from]?.includes(to) ?? false
}

