import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { ServiceProvider } from './state/ServiceContext'
import App from './App'

function renderRoute(route: string) {
  return render(<MemoryRouter initialEntries={[route]}><ServiceProvider><App /></ServiceProvider></MemoryRouter>)
}

beforeEach(() => {
  localStorage.clear()
  window.scrollTo = vi.fn()
})

afterEach(() => cleanup())

describe('privacy-safe tracking journey', () => {
  it('does not reveal applicant records before verification', () => {
    renderRoute('/track')
    expect(screen.queryByText('Meena Das')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Application reference')).toBeInTheDocument()
    expect(screen.getByLabelText('Applicant’s date of birth')).toBeInTheDocument()
  })

  it('opens the matching dashboard after both values are verified', async () => {
    renderRoute('/track')
    fireEvent.change(screen.getByLabelText('Application reference'), { target: { value: 'UDID-42715' } })
    fireEvent.change(screen.getByLabelText('Applicant’s date of birth'), { target: { value: '1992-06-14' } })
    fireEvent.click(screen.getByRole('button', { name: 'View application status' }))
    expect(await screen.findByRole('heading', { name: 'Hello, Meena Das' })).toBeInTheDocument()
  })
})

describe('route and form accessibility', () => {
  it('redirects an unknown application step to the first valid step', async () => {
    renderRoute('/apply/not-a-real-step')
    expect(await screen.findByRole('heading', { name: 'About the applicant' })).toBeInTheDocument()
  })

  it('does not show a confirmation before an application is submitted', async () => {
    renderRoute('/apply/confirmation')
    expect(await screen.findByRole('heading', { name: 'Apply for a disability certificate and UDID card' })).toBeInTheDocument()
  })

  it('uses the URL application ID to load the correct timeline', () => {
    renderRoute('/applications/UDID-31842/timeline')
    expect(screen.getByText('UDID-31842')).toBeInTheDocument()
    expect(screen.getByText('Address proof needs a correction')).toBeInTheDocument()
  })

  it('provides a linked error summary for keyboard users', async () => {
    renderRoute('/apply/about')
    fireEvent.click(screen.getByRole('button', { name: 'Save and continue' }))
    await waitFor(() => expect(screen.getByRole('alert')).toHaveFocus())
    expect(screen.getByRole('link', { name: 'Enter the applicant’s name.' })).toHaveAttribute('href', '#applicantName')
  })
})

