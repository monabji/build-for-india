export const MAX_UPLOAD_BYTES = 2 * 1024 * 1024
export const ACCEPTED_UPLOAD_TYPES = ['application/pdf', 'image/jpeg', 'image/png']

export function validateUpload(file: Pick<File, 'name' | 'size' | 'type'>): string | null {
  const extensionAccepted = /\.(pdf|jpe?g|png)$/i.test(file.name)
  if (!ACCEPTED_UPLOAD_TYPES.includes(file.type) || !extensionAccepted) return 'Choose a PDF, JPG or PNG file.'
  if (file.size === 0) return 'This file is empty. Choose another file.'
  if (file.size > MAX_UPLOAD_BYTES) return 'This file is larger than 2 MB. Choose a smaller file.'
  return null
}

export async function readUpload(file: File) {
  await file.arrayBuffer()
  return file.name
}
