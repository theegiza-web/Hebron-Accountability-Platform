import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DebugPanel } from './components/DebugPanel';

import { HomePage } from './pages/Home';
import { AboutPage } from './pages/About';
import { TimelinePage } from './pages/Timeline';
import { IssuesPage } from './pages/Issues';
import { ResponsesPage } from './pages/Responses';
import { ResourcesPage } from './pages/Resources';
import { ContactPage } from './pages/Contact';
import { PetitionPage } from './pages/Petition';
import { AdminIssuesPage } from './pages/AdminIssues';
import { EvidenceListPage } from './pages/EvidenceList';
import { EvidenceDetailPage } from './pages/EvidenceDetail';
import { PetitionDashboardPage } from './pages/PetitionDashboard';
import { RaiseIssuePage } from './pages/RaiseIssue';
import { StrategyFrameworkPage } from './pages/StrategyFramework';


function App() {
  return (
    <Router>
      <Routes>
        {/* Admin route (no layout) */}
        <Route path="/admin" element={<AdminIssuesPage />} />
        <Route path="/admin/issues" element={<AdminIssuesPage />} />
        <Route path="/admin/responses" element={<AdminIssuesPage />} />

        {/* Public routes (with layout) */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/petition" element={<PetitionPage />} />

          <Route path="/about" element={<AboutPage />} />
          <Route path="/evidence" element={<EvidenceListPage />} />
          <Route path="/evidence/:id" element={<EvidenceDetailPage />} />

          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/issues" element={<IssuesPage />} />
          <Route path="/responses" element={<ResponsesPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/strategy" element={<StrategyFrameworkPage />} />
          <Route path="/raise-issue" element={<RaiseIssuePage />} />


          <Route path="/petition-dashboard" element={<PetitionDashboardPage />} />
        </Route>
      </Routes>
      <DebugPanel />
    </Router>
  );
}

export default App;
