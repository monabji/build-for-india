import { useEffect, useId, useState } from 'react'

export type JourneyStageState = 'complete' | 'current' | 'upcoming'

export interface JourneyStage {
  id: string
  label: string
}

export interface JourneyRibbonLabels {
  applicationHeading: string
  serviceHeading: string
  applicationProgress: string
  serviceProgress: string
  currentStep: string
  currentStage: string
  nextAction: string
  saved: string
  owner: string
  lastUpdated: string
  nextUpdate: string
  complete: string
  current: string
  upcoming: string
  viewAllSteps: string
  hideSteps: string
}

interface JourneyRibbonBaseProps {
  stages: readonly JourneyStage[]
  currentStageId: string
  nextAction: string
  heading?: string
  labels?: Partial<JourneyRibbonLabels>
  className?: string
}

export interface ApplicationJourneyRibbonProps extends JourneyRibbonBaseProps {
  mode: 'application'
  saved: string
}

export interface ServiceStatusJourneyRibbonProps extends JourneyRibbonBaseProps {
  mode: 'service-status'
  owner: string
  lastUpdated?: string
  nextUpdate?: string
}

export type JourneyRibbonProps =
  | ApplicationJourneyRibbonProps
  | ServiceStatusJourneyRibbonProps

const defaultLabels: JourneyRibbonLabels = {
  applicationHeading: 'Your application journey',
  serviceHeading: 'Your service journey',
  applicationProgress: 'Application progress',
  serviceProgress: 'Service progress',
  currentStep: 'You are here',
  currentStage: 'Current stage',
  nextAction: 'What happens next',
  saved: 'Saved',
  owner: 'Who has it',
  lastUpdated: 'Last updated',
  nextUpdate: 'Next update',
  complete: 'Complete',
  current: 'Current',
  upcoming: 'Upcoming',
  viewAllSteps: 'View all steps',
  hideSteps: 'Hide steps',
}

const compactQuery = '(max-width: 760px)'
const isCompactViewport = () => typeof window !== 'undefined' && Boolean(window.matchMedia?.(compactQuery).matches)

function stageState(index: number, currentIndex: number): JourneyStageState {
  if (index < currentIndex) return 'complete'
  if (index === currentIndex) return 'current'
  return 'upcoming'
}

/**
 * Keeps application progress and service status understandable without relying
 * on colour. Styling hooks are intentionally BEM-like so the ribbon can become
 * a compact horizontal path on wide screens and a linear summary on mobile.
 */
export function JourneyRibbon(props: JourneyRibbonProps) {
  const headingId = useId()
  const [compact, setCompact] = useState(isCompactViewport)
  const [expanded, setExpanded] = useState(() => !isCompactViewport())
  const labels = { ...defaultLabels, ...props.labels }
  const currentIndex = props.stages.findIndex((stage) => stage.id === props.currentStageId)

  useEffect(() => {
    const media = window.matchMedia?.(compactQuery)
    if (!media) return
    const update = (event: MediaQueryListEvent | MediaQueryList) => {
      setCompact(event.matches)
      setExpanded(!event.matches)
    }
    update(media)
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])

  if (currentIndex === -1) {
    throw new Error(`JourneyRibbon could not find current stage "${props.currentStageId}".`)
  }

  const currentStage = props.stages[currentIndex]
  const heading = props.heading ?? (
    props.mode === 'application' ? labels.applicationHeading : labels.serviceHeading
  )
  const progressLabel = props.mode === 'application'
    ? labels.applicationProgress
    : labels.serviceProgress
  const rootClassName = ['journey-ribbon', `journey-ribbon--${props.mode}`, props.className]
    .filter(Boolean)
    .join(' ')

  return (
    <section className={rootClassName} aria-labelledby={headingId}>
      <h2 className="journey-ribbon__heading" id={headingId}>{heading}</h2>

      <dl className="journey-ribbon__summary">
        <div className="journey-ribbon__summary-item">
          <dt>{props.mode === 'application' ? labels.currentStep : labels.currentStage}</dt>
          <dd>{currentStage.label}</dd>
        </div>

        {props.mode === 'service-status' && (
          <div className="journey-ribbon__summary-item">
            <dt>{labels.owner}</dt>
            <dd>{props.owner}</dd>
          </div>
        )}

        <div className="journey-ribbon__summary-item journey-ribbon__summary-item--action">
          <dt>{labels.nextAction}</dt>
          <dd>{props.nextAction}</dd>
        </div>

        {props.mode === 'application' ? (
          <div className="journey-ribbon__summary-item">
            <dt>{labels.saved}</dt>
            <dd>{props.saved}</dd>
          </div>
        ) : (
          <>
            {props.lastUpdated && (
              <div className="journey-ribbon__summary-item">
                <dt>{labels.lastUpdated}</dt>
                <dd>{props.lastUpdated}</dd>
              </div>
            )}
            {props.nextUpdate && (
              <div className="journey-ribbon__summary-item">
                <dt>{labels.nextUpdate}</dt>
                <dd>{props.nextUpdate}</dd>
              </div>
            )}
          </>
        )}
      </dl>

      <div className="journey-ribbon__progress" role="group" aria-label={progressLabel}>
        {compact && <button className="journey-ribbon__progress-toggle" type="button" aria-expanded={expanded} onClick={() => setExpanded((value) => !value)}>{expanded ? labels.hideSteps : labels.viewAllSteps} ({props.stages.length})</button>}
        {expanded && <ol className="journey-ribbon__stages">
          {props.stages.map((stage, index) => {
            const state = stageState(index, currentIndex)
            return (
              <li
                className={`journey-ribbon__stage journey-ribbon__stage--${state}`}
                data-state={state}
                key={stage.id}
                aria-current={state === 'current' ? 'step' : undefined}
              >
                <span className="journey-ribbon__marker" aria-hidden="true">
                  {state === 'complete' ? '✓' : index + 1}
                </span>
                <span className="journey-ribbon__stage-copy">
                  <span className="journey-ribbon__stage-label">{stage.label}</span>
                  <span className="journey-ribbon__stage-state">{labels[state]}</span>
                </span>
              </li>
            )
          })}
        </ol>}
      </div>
    </section>
  )
}
