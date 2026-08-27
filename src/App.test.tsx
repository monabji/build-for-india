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
  it('redirects direct dashboard access to secure tracking', async () => {
    renderRoute('/dashboard')
    expect(await screen.findByLabelText('Application reference')).toBeInTheDocument()
    expect(screen.queryByText('Meena Das')).not.toBeInTheDocument()
  })

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

  it('does not expose a personal timeline from an unverified URL', async () => {
    renderRoute('/applications/UDID-31842/timeline')
    expect(await screen.findByLabelText('Application reference')).toBeInTheDocument()
    expect(screen.queryByText('Rohan Verma')).not.toBeInTheDocument()
  })

  it('opens the correction matched by its reference after verification', async () => {
    renderRoute('/track?intent=correction')
    fireEvent.change(screen.getByLabelText('Application reference'), { target: { value: 'UDID-31842' } })
    fireEvent.change(screen.getByLabelText('Applicant’s date of birth'), { target: { value: '1992-06-14' } })
    fireEvent.click(screen.getByRole('button', { name: 'Continue to correction' }))
    expect(await screen.findByRole('heading', { name: 'Fix one document — keep everything else' })).toBeInTheDocument()
  })

  it('provides a linked error summary for keyboard users', async () => {
    renderRoute('/apply/about')
    fireEvent.click(screen.getByRole('button', { name: 'Save and continue' }))
    await waitFor(() => expect(screen.getByRole('alert')).toHaveFocus())
    expect(screen.getByRole('link', { name: 'Enter the applicant’s name.' })).toHaveAttribute('href', '#applicantName')
  })
})
