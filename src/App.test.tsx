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

  it('provides one-click synthetic journeys and can reset them', async () => {
    renderRoute('/track')
    fireEvent.click(screen.getByRole('button', { name: 'Try correction sample' }))
    expect(await screen.findByRole('heading', { name: 'Fix one document — keep everything else' })).toBeInTheDocument()
  })

  it('downloads the clearly labelled sample certificate and confirms it', async () => {
    const createObjectURL = vi.fn(() => 'blob:sample-certificate')
    const revokeObjectURL = vi.fn()
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    vi.stubGlobal('URL', { createObjectURL, revokeObjectURL })
    renderRoute('/track')
    fireEvent.click(screen.getByRole('button', { name: 'Try approved sample' }))
    expect(await screen.findByRole('heading', { name: 'Your certificate' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Download certificate' }))
    expect(createObjectURL).toHaveBeenCalledOnce()
    expect(await screen.findByText('Sample certificate downloaded. This file is not an official government document.')).toBeInTheDocument()
    click.mockRestore()
    vi.unstubAllGlobals()
  })

  it('distinguishes missing tracking details from an unmatched lookup', async () => {
    renderRoute('/track')
    fireEvent.click(screen.getByRole('button', { name: 'View application status' }))
    expect((await screen.findAllByText('Enter an application reference.')).length).toBeGreaterThan(0)
    expect(screen.getByLabelText('Application reference')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.queryByText('Application not found')).not.toBeInTheDocument()
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
    await waitFor(() => expect(screen.getByLabelText("Applicant's name")).toHaveFocus())
    expect(screen.getByRole('link', { name: 'Enter the applicant’s name.' })).toHaveAttribute('href', '#applicantName')
  })

  it('saves the draft and returns to the application start page', async () => {
    renderRoute('/apply/authority')
    fireEvent.click(screen.getByRole('button', { name: 'Save and come back later' }))
    expect(await screen.findByRole('heading', { name: 'Apply for a disability certificate and UDID card' })).toBeInTheDocument()
    expect(screen.getByText('Draft saved')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Resume saved application' })).toHaveAttribute('href', '/apply/authority?resume=true')
    expect(localStorage.getItem('udid-redesign-draft-v1')).not.toBeNull()
  })

  it('shows field-specific validation in the support request', async () => {
    renderRoute('/help')
    fireEvent.click(screen.getByRole('button', { name: 'Create support request' }))
    expect((await screen.findAllByText('Choose a help topic.')).length).toBeGreaterThan(0)
    expect(screen.getByLabelText('What do you need help with?')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText('Email or mobile number for a reply')).toHaveAttribute('aria-invalid', 'true')
  })
})
