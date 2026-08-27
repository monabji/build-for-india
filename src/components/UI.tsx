import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { statusLabels } from '../domain/rules'
import type { ApplicationRecord, StatusEvent } from '../domain/types'
import { ServiceIcon, type ServiceIconName } from './ServiceIcon'

export function PageIntro({ eyebrow, title, children }: { eyebrow?: string; title: string; children: ReactNode }) {
  return <header className="page-intro">{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1><div className="lead">{children}</div></header>
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return <nav className="breadcrumbs" aria-label="Breadcrumb"><ol>{items.map((item, index) => <li key={item.label}>{item.to ? <Link to={item.to}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}{index < items.length - 1 && <span aria-hidden="true">›</span>}</li>)}</ol></nav>
}

export function TaskCard({ to, title, children, number, icon }: { to: string; title: string; children: ReactNode; number?: string; icon?: ServiceIconName }) {
  return <Link className="task-card" to={to}>{icon ? <span className="task-icon" aria-hidden="true"><ServiceIcon name={icon} /></span> : number && <span className="task-number" aria-hidden="true">{number}</span>}<span><strong>{title}</strong><small>{children}</small></span><span className="task-arrow" aria-hidden="true">→</span></Link>
}

export function Alert({ type = 'info', title, children }: { type?: 'info' | 'success' | 'warning' | 'error'; title: string; children: ReactNode }) {
  return <div className={`alert alert-${type}`} role={type === 'error' ? 'alert' : 'status'}><strong>{title}</strong><div>{children}</div></div>
}

export function StatusPanel({ application }: { application: ApplicationRecord }) {
  const actionRequired = application.currentStatus === 'CORRECTION_REQUIRED' || application.currentStatus === 'ASSESSMENT_SCHEDULED'
  const statusImage = application.currentStatus === 'CORRECTION_REQUIRED'
    ? '/assets/service-correction-path.jpg'
    : application.currentStatus === 'ASSESSMENT_SCHEDULED'
      ? '/assets/service-dashboard-consultation.jpg'
      : '/assets/service-application-documents.jpg'
  return <section className="status-panel" aria-labelledby="status-heading">
    <div className="status-panel-copy"><p className="status-kicker">Current status</p>
      <h2 id="status-heading">{statusLabels[application.currentStatus]}</h2>
      <p className="status-action"><strong>{actionRequired ? 'You need to act:' : 'What happens next:'}</strong> {application.currentNextAction}</p>
      <p className="meta">Last updated {application.updatedAt}</p>
    </div>
    <img className="status-panel-image" src={statusImage} alt="" />
  </section>
}

export function Timeline({ events, compact = false }: { events: StatusEvent[]; compact?: boolean }) {
  const visible = compact ? events.slice(0, 3) : events
  return <ol className="timeline">{visible.map((item, index) => <li key={item.id} className={index === 0 ? 'current' : ''}>
    <span className="timeline-marker" aria-hidden="true">{index === 0 ? '●' : '✓'}</span>
    <div><p className="timeline-date">{item.occurredAt}</p><h3>{item.title}</h3><p>{item.description}</p>{item.userActionRequired && <p className="action-line"><strong>Action:</strong> {item.nextAction}</p>}</div>
  </li>)}</ol>
}

const explanations: Record<string, { simple: string; hindi: string }> = {
  application: { simple: 'We ask for information in small steps. Your progress is saved after each step, and you can review everything before sending it.', hindi: 'हम जानकारी छोटे चरणों में पूछते हैं। हर चरण के बाद आपकी प्रगति सहेजी जाती है।' },
  rejection: { simple: 'Only the address proof needs to be replaced. Choose a clear file where the name and address can be read. Everything else stays saved.', hindi: 'केवल पते का प्रमाण बदलना है। बाकी जानकारी सुरक्षित है।' },
  status: { simple: 'This summary shows the latest event and the next action for the selected application.', hindi: 'यह सारांश नवीनतम घटना और अगले कदम को दिखाता है।' },
}

export function AssistantPanel({ context }: { context: keyof typeof explanations }) {
  const [answer, setAnswer] = useState<string | null>(null)
  const item = explanations[context]
  return <aside className="assistant-panel" aria-labelledby={`assistant-${context}`}>
    <h2 id={`assistant-${context}`}>Need this explained differently?</h2>
    <p>This optional assistant explains service information. It does not decide eligibility or give medical advice.</p>
    <div className="button-row">
      <button className="secondary-button" type="button" onClick={() => setAnswer(item.simple)}>Explain simply</button>
      <button className="text-button" type="button" onClick={() => setAnswer(item.hindi)}>हिन्दी में समझाएँ</button>
    </div>
    {answer && <div className="assistant-answer" role="status"><strong>Service information</strong><p>{answer}</p></div>}
  </aside>
}

export function ProgressSteps({ current, labels }: { current: number; labels: string[] }) {
  return <nav className="progress-steps" aria-label="Application progress"><p><strong>Step {current + 1} of {labels.length}</strong> — {labels[current]}</p><div className="progress-track" aria-hidden="true"><span style={{ width: `${((current + 1) / labels.length) * 100}%` }} /></div><ol>{labels.map((label, index) => <li className={index === current ? 'active' : index < current ? 'complete' : ''} key={label}><span>{index + 1}</span>{label}</li>)}</ol></nav>
}
