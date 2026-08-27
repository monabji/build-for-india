import { describe, expect, it } from 'vitest'
import { authorities, centresByState, stateNames } from './centres'

describe('shared centre catalogue', () => {
  it('covers every state and union territory shown by the map', () => {
    expect(stateNames).toHaveLength(36)
    expect(stateNames.every((state) => centresByState(state).length > 0)).toBe(true)
  })

  it('keeps identifiers and state references coherent', () => {
    expect(new Set(authorities.map((centre) => centre.id)).size).toBe(authorities.length)
    expect(authorities.every((centre) => stateNames.includes(centre.state))).toBe(true)
  })

  it('provides multiple service points in larger service regions', () => {
    expect(authorities.length).toBeGreaterThan(50)
    expect(centresByState('Maharashtra')).toHaveLength(3)
    expect(centresByState('Uttar Pradesh')).toHaveLength(3)
  })
})
