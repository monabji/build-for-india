import { describe, expect, it } from 'vitest'
import { MAX_UPLOAD_BYTES, validateUpload } from './uploads'

describe('document upload validation', () => {
  it('accepts supported non-empty documents', () => {
    expect(validateUpload({ name: 'address.pdf', size: 2400, type: 'application/pdf' })).toBeNull()
    expect(validateUpload({ name: 'identity.png', size: 2400, type: 'image/png' })).toBeNull()
  })

  it('rejects unsafe, empty, and oversized files with specific guidance', () => {
    expect(validateUpload({ name: 'notes.exe', size: 100, type: 'application/octet-stream' })).toMatch(/PDF, JPG or PNG/)
    expect(validateUpload({ name: 'blank.pdf', size: 0, type: 'application/pdf' })).toMatch(/empty/)
    expect(validateUpload({ name: 'large.pdf', size: MAX_UPLOAD_BYTES + 1, type: 'application/pdf' })).toMatch(/larger than 2 MB/)
  })
})

