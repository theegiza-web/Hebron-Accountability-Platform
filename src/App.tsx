import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/Home';
import { AboutPage } from './pages/About';
import { EvidencePage } from './pages/Evidence';
import { TimelinePage } from './pages/Timeline';
import { IssuesPage } from './pages/Issues';
import { ResourcesPage } from './pages/Resources';
import { ContactPage } from './pages/Contact';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/evidence" element={<EvidencePage />} />
          <Route path="/evidence/:id" element={<EvidencePage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/issues" element={<IssuesPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
