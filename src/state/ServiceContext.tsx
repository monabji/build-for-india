import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { ApplicantDraft, ApplicationRecord, ScenarioId } from '../domain/types'
import { DemoService } from '../services/demoService'

interface ServiceContextValue {
  scenarios: Record<ScenarioId, ApplicationRecord>
  activeScenario: ScenarioId
  verifiedScenario: ScenarioId | null
  setActiveScenario: (id: ScenarioId) => void
  verifyScenario: (id: ScenarioId) => void
  saveDraft: (draft: ApplicantDraft, step?: string, completedStep?: string) => ApplicantDraft
  loadDraft: () => ApplicantDraft | null
  loadDraftStep: () => string
  submitDraft: (draft: ApplicantDraft) => ApplicationRecord
  correctDocument: (id: ScenarioId, fileName: string) => ApplicationRecord
  reschedule: (id: ScenarioId, date: string, time: string) => ApplicationRecord
  requestCardService: (id: ScenarioId, serviceType: 'RENEWAL' | 'REPLACEMENT', reason: string) => ApplicationRecord
  reset: () => void
}

const ServiceContext = createContext<ServiceContextValue | null>(null)

export function ServiceProvider({ children }: { children: ReactNode }) {
  const service = useMemo(() => new DemoService(), [])
  const [scenarios, setScenarios] = useState(service.listScenarios())
  const [activeScenario, setActiveScenario] = useState<ScenarioId>('appointment')
  const [verifiedScenario, setVerifiedScenario] = useState<ScenarioId | null>(null)

  const refresh = () => setScenarios(service.listScenarios())
  const value: ServiceContextValue = {
    scenarios,
    activeScenario,
    verifiedScenario,
    setActiveScenario,
    verifyScenario: (id) => { setActiveScenario(id); setVerifiedScenario(id) },
    saveDraft: (draft, step, completedStep) => service.saveDraft(draft, step, completedStep),
    loadDraft: () => service.loadDraft(),
    loadDraftStep: () => service.loadDraftStep(),
    submitDraft: (draft) => { const app = service.submitDraft(draft); refresh(); setActiveScenario('new'); setVerifiedScenario('new'); return app },
    correctDocument: (id, fileName) => { const app = service.correctDocument(id, fileName); refresh(); return app },
    reschedule: (id, date, time) => { const app = service.rescheduleAppointment(id, date, time); refresh(); return app },
    requestCardService: (id, serviceType, reason) => { const app = service.requestCardService(id, serviceType, reason); refresh(); setActiveScenario(id); setVerifiedScenario(id); return app },
    reset: () => { setScenarios(service.reset()); setActiveScenario('appointment'); setVerifiedScenario(null) },
  }

  return <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>
}

// Context and hook intentionally live together to keep the demo state boundary explicit.
// eslint-disable-next-line react-refresh/only-export-components
export function useService() {
  const context = useContext(ServiceContext)
  if (!context) throw new Error('useService must be used within ServiceProvider')
  return context
}
