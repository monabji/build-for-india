import { beforeEach, describe, expect, it } from 'vitest'
import { canTransition } from '../domain/rules'
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
})

