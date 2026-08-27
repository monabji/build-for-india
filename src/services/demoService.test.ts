import { beforeEach, describe, expect, it } from 'vitest'
import { canTransition } from '../domain/rules'
import { createSeedScenarios } from '../data/seed'
import { demoServiceForTest } from './testUtils'

describe('application state rules', () => {
  it('allows the primary submission transition', () => {
    expect(canTransition('DRAFT', 'SUBMITTED')).toBe(true)
  })

  it('prevents skipping directly from draft to approval', () => {
    expect(canTransition('DRAFT', 'APPROVED')).toBe(false)
  })
})

describe('demo service transition contract', () => {
  beforeEach(() => localStorage.clear())

  it('creates a matching event and notification on correction resubmission', () => {
    const service = demoServiceForTest()
    const before = service.getApplication('correction')
    const after = service.correctDocument('correction', 'clear-synthetic-address.pdf')

    expect(after.currentStatus).toBe('DOCUMENT_REVIEW')
    expect(after.timeline).toHaveLength(before.timeline.length + 1)
    expect(after.notifications).toHaveLength(before.notifications.length + 1)
    expect(after.documents.find((item) => item.type === 'ADDRESS')).toMatchObject({
      version: 2,
      status: 'UPLOADED',
      displayName: 'clear-synthetic-address.pdf',
    })
  })

  it('keeps the four seeded scenarios coherent after reset', () => {
    const service = demoServiceForTest()
    const scenarios = service.reset()
    expect(Object.keys(scenarios)).toEqual(['new', 'correction', 'appointment', 'approved'])
    expect(scenarios.correction.documents.some((item) => item.status === 'CORRECTION_REQUIRED')).toBe(true)
    expect(scenarios.appointment.appointment?.status).toBe('UPCOMING')
    expect(scenarios.approved.currentStatus).toBe('CARD_DISPATCHED')
  })

  it('persists a replacement request in the existing application history', () => {
    const service = demoServiceForTest()
    const before = service.getApplication('approved')
    const after = service.requestCardService('approved', 'REPLACEMENT', 'Card was lost')

    expect(after.serviceType).toBe('REPLACEMENT')
    expect(after.timeline).toHaveLength(before.timeline.length + 1)
    expect(after.timeline[0]).toMatchObject({
      title: 'Replacement request submitted',
      actorLabel: 'Applicant',
    })
    expect(after.notifications[0].title).toBe('Replacement request received')
  })

  it('marks prepared documents as uploaded when a new application is submitted', () => {
    const service = demoServiceForTest()
    const draft = createSeedScenarios().new.draft
    draft.identityDocument = 'prepared-identity.pdf'
    draft.addressDocument = 'prepared-address.pdf'
    const submitted = service.submitDraft(draft)

    expect(submitted.documents).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: 'IDENTITY', displayName: 'prepared-identity.pdf', status: 'UPLOADED', version: 1 }),
      expect.objectContaining({ type: 'ADDRESS', displayName: 'prepared-address.pdf', status: 'UPLOADED', version: 1 }),
    ]))
  })
})
