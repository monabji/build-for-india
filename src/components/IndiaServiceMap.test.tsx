import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { IndiaServiceMap } from './IndiaServiceMap'

afterEach(() => { cleanup(); vi.unstubAllGlobals() })

describe('interactive map keyboard access', () => {
  it('selects a state with Enter and exposes the same centre details', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => ({
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: { shapeName: 'Delhi' },
          geometry: { type: 'Polygon', coordinates: [[[76.8, 28.3], [77.5, 28.3], [77.5, 29], [76.8, 29], [76.8, 28.3]]] },
        }],
      }),
    })))
    render(<MemoryRouter><IndiaServiceMap /></MemoryRouter>)
    const state = await screen.findByRole('button', { name: 'Delhi, 1 centre' })
    fireEvent.keyDown(state, { key: 'Enter' })
    expect(screen.getByRole('heading', { name: 'Delhi' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Central Delhi assessment and service centre' })).toBeInTheDocument()
  })
})
