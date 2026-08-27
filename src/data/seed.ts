import type { ApplicantDraft, ApplicationRecord, Authority, ScenarioId, StatusEvent } from '../domain/types'

const baseDraft = (name: string): ApplicantDraft => ({
  mode: 'SELF',
  applicantName: name,
  dateOfBirth: '1992-06-14',
  contactPreference: 'In-app notification',
  address: '42 Example Road, Central Ward',
  district: 'Central District',
  state: 'Maharashtra',
  caregiverName: '',
  relationship: '',
  disabilityCategory: 'Locomotor disability',
  supportNeeds: 'Step-free access requested',
  identityDocument: 'Identity proof.pdf',
  addressDocument: 'Address proof.pdf',
  authorityId: 'auth-1',
  consent: true,
})

const event = (
  id: string,
  status: StatusEvent['status'],
  title: string,
  description: string,
  occurredAt: string,
  userActionRequired = false,
  nextAction = 'No action is needed right now.',
): StatusEvent => ({
  id,
  status,
  title,
  description,
  occurredAt,
  actorLabel: userActionRequired ? 'Applicant' : 'Service team',
  userActionRequired,
  nextAction,
})

export const authorities: Authority[] = [
  {
    id: 'auth-1',
    name: 'District Medical Centre — Central',
    district: 'Central District',
    state: 'Maharashtra',
    address: '12 Service Road, Central, 400001',
    accessNotes: 'Step-free entrance, accessible toilet and sign-language support by request.',
    contactLabel: 'Contact support for assistance',
  },
  {
    id: 'auth-2',
    name: 'Community Assessment Centre — North',
    district: 'North District',
    state: 'Delhi',
    address: '8 Citizen Avenue, North District, 110001',
    accessNotes: 'Ramp access, quiet waiting area and wheelchair available.',
    contactLabel: 'Contact support for assistance',
  },
  {
    id: 'auth-3',
    name: 'Regional Medical Board — East',
    district: 'East District',
    state: 'West Bengal',
    address: '25 Public Service Lane, East District, 700001',
    accessNotes: 'Lift access and an assisted-service desk near reception.',
    contactLabel: 'Contact support for assistance',
  },
]

export const createSeedScenarios = (): Record<ScenarioId, ApplicationRecord> => {
  const newDraft = baseDraft('Anita Sharma')
  newDraft.address = ''
  newDraft.district = ''
  newDraft.state = ''

  const caregiverDraft = baseDraft('Rohan Verma')
  caregiverDraft.mode = 'CAREGIVER'
  caregiverDraft.caregiverName = 'Priya Verma'
  caregiverDraft.relationship = 'Parent'

  return {
    new: {
      id: 'UDID-20481', applicantName: 'Anita Sharma', mode: 'SELF', serviceType: 'NEW',
      currentStatus: 'DRAFT', currentNextAction: 'Complete identity and address details.', completionPercent: 28,
      updatedAt: '27 August 2026, 09:15', draft: newDraft,
      documents: [
        { id: 'doc-new-id', type: 'IDENTITY', displayName: 'Identity proof', status: 'MISSING', version: 0 },
        { id: 'doc-new-address', type: 'ADDRESS', displayName: 'Address proof', status: 'MISSING', version: 0 },
      ],
      timeline: [event('new-1', 'DRAFT', 'Draft application started', 'Your progress is saved on this device.', '27 August 2026, 09:15', true, 'Complete identity and address details.')],
      notifications: [{ id: 'note-new', title: 'Draft saved', body: 'Continue your application when you are ready.', createdAt: '27 August 2026, 09:15', read: false }],
    },
    correction: {
      id: 'UDID-31842', applicantName: 'Rohan Verma', mode: 'CAREGIVER', serviceType: 'NEW',
      currentStatus: 'CORRECTION_REQUIRED', currentNextAction: 'Upload a clearer address proof.', completionPercent: 86,
      updatedAt: '26 August 2026, 16:20', draft: caregiverDraft,
      documents: [
        { id: 'doc-correct-id', type: 'IDENTITY', displayName: 'Identity proof', status: 'ACCEPTED', version: 1, uploadedAt: '21 August 2026' },
        { id: 'doc-correct-address', type: 'ADDRESS', displayName: 'Address proof', status: 'CORRECTION_REQUIRED', version: 1, uploadedAt: '21 August 2026', reasonCode: 'UNREADABLE_ADDRESS' },
      ],
      timeline: [
        event('cor-3', 'CORRECTION_REQUIRED', 'Address proof needs a correction', 'The name and address were not readable. Your other information is saved.', '26 August 2026, 16:20', true, 'Upload a clearer address proof.'),
        event('cor-2', 'DOCUMENT_REVIEW', 'Document review started', 'The reviewing office began checking the documents.', '23 August 2026, 11:10'),
        event('cor-1', 'SUBMITTED', 'Application submitted', 'The application was received.', '21 August 2026, 14:05'),
      ],
      notifications: [{ id: 'note-cor', title: 'Action needed: replace address proof', body: 'Upload a clearer copy. All other application details remain saved.', createdAt: '26 August 2026, 16:20', read: false }],
    },
    appointment: {
      id: 'UDID-42715', applicantName: 'Meena Das', mode: 'SELF', serviceType: 'NEW',
      currentStatus: 'ASSESSMENT_SCHEDULED', currentNextAction: 'Attend the assessment appointment.', completionPercent: 92,
      updatedAt: '25 August 2026, 10:30', draft: baseDraft('Meena Das'),
      documents: [
        { id: 'doc-appt-id', type: 'IDENTITY', displayName: 'Identity proof', status: 'ACCEPTED', version: 1, uploadedAt: '16 August 2026' },
        { id: 'doc-appt-address', type: 'ADDRESS', displayName: 'Address proof', status: 'ACCEPTED', version: 1, uploadedAt: '16 August 2026' },
      ],
      appointment: { id: 'APT-104', date: '4 September 2026', time: '10:30 AM', locationName: 'District Medical Centre — Central', address: '12 Service Road, Central, 400001', accessNotes: 'Step-free entrance. Arrive 20 minutes early.', status: 'UPCOMING' },
      timeline: [
        event('apt-3', 'ASSESSMENT_SCHEDULED', 'Medical assessment scheduled', 'An appointment has been added to this application.', '25 August 2026, 10:30', true, 'Attend the appointment on 4 September at 10:30 AM.'),
        event('apt-2', 'DOCUMENT_REVIEW', 'Documents checked', 'The submitted documents passed review.', '22 August 2026, 15:40'),
        event('apt-1', 'SUBMITTED', 'Application submitted', 'The application was received.', '16 August 2026, 12:10'),
      ],
      notifications: [{ id: 'note-apt', title: 'Assessment appointment scheduled', body: 'Your appointment is on 4 September at 10:30 AM.', createdAt: '25 August 2026, 10:30', read: false }],
    },
    approved: {
      id: 'UDID-53906', applicantName: 'Imran Khan', mode: 'SELF', serviceType: 'NEW',
      currentStatus: 'CARD_DISPATCHED', currentNextAction: 'Download the certificate or view card dispatch details.', completionPercent: 100,
      updatedAt: '27 August 2026, 08:45', draft: baseDraft('Imran Khan'),
      documents: [
        { id: 'doc-approved-id', type: 'IDENTITY', displayName: 'Identity proof', status: 'ACCEPTED', version: 1, uploadedAt: '2 August 2026' },
        { id: 'doc-approved-address', type: 'ADDRESS', displayName: 'Address proof', status: 'ACCEPTED', version: 1, uploadedAt: '2 August 2026' },
      ],
      timeline: [
        event('app-6', 'CARD_DISPATCHED', 'Card dispatched', 'A dispatch reference has been created.', '27 August 2026, 08:45'),
        event('app-5', 'CERTIFICATE_GENERATED', 'Certificate ready', 'The certificate is available to download.', '26 August 2026, 17:30'),
        event('app-4', 'APPROVED', 'Application approved', 'A decision has been recorded.', '26 August 2026, 14:00'),
        event('app-3', 'MEDICAL_ASSESSMENT', 'Assessment completed', 'The medical assessment stage was completed.', '22 August 2026, 13:00'),
        event('app-2', 'DOCUMENT_REVIEW', 'Documents checked', 'The documents passed review.', '8 August 2026, 11:20'),
        event('app-1', 'SUBMITTED', 'Application submitted', 'The application was received.', '2 August 2026, 09:10'),
      ],
      notifications: [{ id: 'note-approved', title: 'Certificate ready', body: 'You can now download your certificate.', createdAt: '26 August 2026, 17:30', read: false }],
    },
  }
}

export const emptyDraft: ApplicantDraft = {
  mode: 'SELF', applicantName: '', dateOfBirth: '', contactPreference: '', address: '', district: '', state: '',
  caregiverName: '', relationship: '', disabilityCategory: '', supportNeeds: '', identityDocument: '', addressDocument: '', authorityId: '', consent: false,
}
