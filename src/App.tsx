import { Route, Routes } from 'react-router-dom'
import { Shell } from './components/Shell'
import { ApplicationPage, ConfirmationPage } from './pages/ApplicationPage'
import { AppointmentPage, CertificatePage, CorrectionPage, DashboardPage, TimelinePage } from './pages/DashboardPages'
import { ApplyStartPage, FindHelpPage, GuidancePage, HelpPage, HomePage, NotFoundPage, PrototypePage, RenewPage, ReplacePage, TrackPage } from './pages/PublicPages'

export default function App() {
  return <Shell><Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/start" element={<GuidancePage />} />
    <Route path="/apply" element={<ApplyStartPage />} />
    <Route path="/apply/confirmation" element={<ConfirmationPage />} />
    <Route path="/apply/:step" element={<ApplicationPage />} />
    <Route path="/track" element={<TrackPage />} />
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/applications/:id/timeline" element={<TimelinePage />} />
    <Route path="/applications/:id/correct" element={<CorrectionPage />} />
    <Route path="/appointments/:id" element={<AppointmentPage />} />
    <Route path="/renew" element={<RenewPage />} />
    <Route path="/replace" element={<ReplacePage />} />
    <Route path="/documents/:id" element={<CertificatePage />} />
    <Route path="/find-help" element={<FindHelpPage />} />
    <Route path="/help" element={<HelpPage />} />
    <Route path="/prototype" element={<PrototypePage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes></Shell>
}

