import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { JourneyRibbon, type JourneyStage } from './JourneyRibbon'

afterEach(() => cleanup())

const applicationStages: JourneyStage[] = [
  { id: 'about', label: 'About' },
  { id: 'documents', label: 'Documents' },
  { id: 'centre', label: 'Medical centre' },
  { id: 'review', label: 'Review' },
]

describe('JourneyRibbon', () => {
  it('presents application progress and save metadata with structured states', () => {
    render(
      <JourneyRibbon
        mode="application"
        stages={applicationStages}
        currentStageId="documents"
        nextAction="Choose a medical centre"
        saved="Just now"
      />,
    )

    expect(screen.getByRole('heading', { name: 'Your application journey' })).toBeInTheDocument()
    expect(screen.getByText('You are here').nextElementSibling).toHaveTextContent('Documents')
    expect(screen.getByText('What happens next').nextElementSibling).toHaveTextContent('Choose a medical centre')
    expect(screen.getByText('Saved').nextElementSibling).toHaveTextContent('Just now')

    const progress = screen.getByRole('group', { name: 'Application progress' })
    const stages = within(progress).getAllByRole('listitem')
    expect(stages).toHaveLength(4)
    expect(stages[0]).toHaveAttribute('data-state', 'complete')
    expect(stages[0]).toHaveTextContent('Complete')
    expect(stages[1]).toHaveAttribute('data-state', 'current')
    expect(stages[1]).toHaveAttribute('aria-current', 'step')
    expect(stages[1]).toHaveTextContent('Current')
    expect(stages[2]).toHaveAttribute('data-state', 'upcoming')
    expect(stages[2]).toHaveTextContent('Upcoming')
  })

  it('presents the responsible owner and update metadata in service-status mode', () => {
    render(
      <JourneyRibbon
        mode="service-status"
        stages={[
          { id: 'submitted', label: 'Submitted' },
          { id: 'document-review', label: 'Document review' },
          { id: 'assessment', label: 'Medical assessment' },
        ]}
        currentStageId="document-review"
        owner="District medical authority"
        nextAction="No action is needed from you right now"
        lastUpdated="27 August 2026"
        nextUpdate="After document review"
      />,
    )

    expect(screen.getByText('Current stage').nextElementSibling).toHaveTextContent('Document review')
    expect(screen.getByText('Who has it').nextElementSibling).toHaveTextContent('District medical authority')
    expect(screen.getByText('What happens next').nextElementSibling).toHaveTextContent('No action is needed')
    expect(screen.getByText('Last updated').nextElementSibling).toHaveTextContent('27 August 2026')
    expect(screen.getByText('Next update').nextElementSibling).toHaveTextContent('After document review')
    expect(screen.getByRole('group', { name: 'Service progress' })).toBeInTheDocument()
  })

  it('supports translated labels without changing its semantic structure', () => {
    render(
      <JourneyRibbon
        mode="application"
        stages={applicationStages.slice(0, 2)}
        currentStageId="about"
        nextAction="दस्तावेज़ जोड़ें"
        saved="अभी"
        labels={{
          applicationHeading: 'आपकी आवेदन यात्रा',
          applicationProgress: 'आवेदन की प्रगति',
          currentStep: 'आप यहाँ हैं',
          nextAction: 'अगला कदम',
          saved: 'सहेजा गया',
          current: 'वर्तमान',
          upcoming: 'आगामी',
        }}
      />,
    )

    expect(screen.getByRole('heading', { name: 'आपकी आवेदन यात्रा' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'आवेदन की प्रगति' })).toBeInTheDocument()
    expect(screen.getByText('आप यहाँ हैं').nextElementSibling).toHaveTextContent('About')
    expect(screen.getByText('वर्तमान')).toBeInTheDocument()
    expect(screen.getByText('आगामी')).toBeInTheDocument()
  })
})
