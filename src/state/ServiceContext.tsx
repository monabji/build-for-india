import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { ApplicantDraft, ApplicationRecord, ScenarioId } from '../domain/types'
import { DemoService } from '../services/demoService'

interface ServiceContextValue {
  scenarios: Record<ScenarioId, ApplicationRecord>
  activeScenario: ScenarioId
  setActiveScenario: (id: ScenarioId) => void
  saveDraft: (draft: ApplicantDraft) => ApplicantDraft
  loadDraft: () => ApplicantDraft | null
  submitDraft: (draft: ApplicantDraft) => ApplicationRecord
  correctDocument: (id: ScenarioId, fileName: string) => ApplicationRecord
  reschedule: (id: ScenarioId, date: string, time: string) => ApplicationRecord
  reset: () => void
}

const ServiceContext = createContext<ServiceContextValue | null>(null)

export function ServiceProvider({ children }: { children: ReactNode }) {
  const service = useMemo(() => new DemoService(), [])
  const [scenarios, setScenarios] = useState(service.listScenarios())
  const [activeScenario, setActiveScenario] = useState<ScenarioId>('appointment')

  const refresh = () => setScenarios(service.listScenarios())
  const value: ServiceContextValue = {
    scenarios,
    activeScenario,
    setActiveScenario,
    saveDraft: (draft) => service.saveDraft(draft),
    loadDraft: () => service.loadDraft(),
    submitDraft: (draft) => { const app = service.submitDraft(draft); refresh(); setActiveScenario('new'); return app },
    correctDocument: (id, fileName) => { const app = service.correctDocument(id, fileName); refresh(); return app },
    reschedule: (id, date, time) => { const app = service.rescheduleAppointment(id, date, time); refresh(); return app },
    reset: () => { setScenarios(service.reset()); setActiveScenario('appointment') },
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
