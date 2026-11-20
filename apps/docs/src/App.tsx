import { useState } from 'react';
import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { Ticker } from './components/Ticker';
import { StatusBar } from './components/StatusBar';
import { Sidebar } from './components/Sidebar';
import { OverviewPage } from './pages/OverviewPage';
import { QuickStartPage } from './pages/QuickStartPage';
import { InstallPage } from './pages/InstallPage';
import { TokensPage } from './pages/TokensPage';
import { ColorsPage } from './pages/ColorsPage';
import { TypographyPage } from './pages/TypographyPage';
import { SurfacesPage } from './pages/SurfacesPage';
import { SpacingPage } from './pages/SpacingPage';
import { ComponentsPage } from './pages/ComponentsPage';
import { ButtonsPage } from './pages/ButtonsPage';
import { DataPage } from './pages/DataPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { PanelsPage } from './pages/PanelsPage';
import { PiecesPage } from './pages/PiecesPage';
import { MoreComponentsPage } from './pages/MoreComponentsPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { ExamplesPage } from './pages/ExamplesPage';
import { IntensityPage } from './pages/IntensityPage';
import { Layer2TokensPage } from './pages/Layer2TokensPage';

// Top-bar labels: a short list of the pages most read; the sidebar stays the full index.
const NAV_LABELS = [
  { id: 'tokens', label: 'Tokens' },
  { id: 'components', label: 'Components' },
  { id: 'templates', label: 'Templates' },
  { id: 'examples', label: 'Examples' },
];

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="console-wrapper">
      {/* Top Nav */}
      <nav className="nw-nav" aria-label="Site">
        {/* Hamburger: mobile only */}
        <button
          onClick={() => setMobileOpen(true)}
          className="nw-chip nw-hamburger"
          aria-label="Open navigation"
        >
          ☰
        </button>
        <NavLink to="/overview" className="brand" aria-label="Nightwire overview">
          <span className="kanji">夜</span> nightwire
        </NavLink>
        <div className="nav-labels">
          {NAV_LABELS.map(item => (
            <NavLink key={item.id} to={`/${item.id}`}>{item.label}</NavLink>
          ))}
        </div>
        <div className="nav-links">
          <span className="nw-chip"><span className="led" data-state="ok" />v{__NW_VERSION__}</span>
          <a className="nw-chip nw-chip-github" href="https://github.com/cativo23/nightwire" target="_blank" rel="noopener noreferrer"><span className="star">★</span>github</a>
          <NavLink className="nw-chip nw-chip-solid" to="/install">INSTALL</NavLink>
        </div>
      </nav>

      <Ticker />

      {/* Mobile drawer backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
            zIndex: 200, display: 'none',
          }}
          className="nw-backdrop"
        />
      )}

      {/* Mobile drawer */}
      <div
        className="nw-drawer"
        style={{
          position: 'fixed', top: 0, left: 0, bottom: 0, width: 260,
          zIndex: 201, background: 'var(--void-warm)',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
          display: 'none',
        }}
      >
        <div className="nw-drawer-bar">
          <button
            onClick={() => setMobileOpen(false)}
            className="nw-chip nw-drawer-close"
            aria-label="Close navigation"
          >✕</button>
        </div>
        <Sidebar onNavigate={() => setMobileOpen(false)} />
      </div>

      {/* Main layout */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Desktop sidebar */}
        <div className="nw-sidebar-desktop" style={{ width: 220, flexShrink: 0 }}>
          <Sidebar />
        </div>

        {/* Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px 48px 64px' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/overview" replace />} />
              <Route path="/overview" element={<OverviewPage />} />
              <Route path="/quickstart" element={<QuickStartPage />} />
              <Route path="/install" element={<InstallPage />} />
              <Route path="/tokens" element={<TokensPage />} />
              <Route path="/colors" element={<ColorsPage />} />
              <Route path="/typography" element={<TypographyPage />} />
              <Route path="/surfaces" element={<SurfacesPage />} />
              <Route path="/spacing" element={<SpacingPage />} />
              <Route path="/components" element={<ComponentsPage />} />
              <Route path="/buttons" element={<ButtonsPage />} />
              <Route path="/data" element={<DataPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/panels" element={<PanelsPage />} />
              <Route path="/pieces" element={<PiecesPage />} />
              <Route path="/more-components" element={<MoreComponentsPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/examples" element={<ExamplesPage />} />
              {/* Cross-cutting docs */}
              <Route path="/intensity" element={<IntensityPage />} />
              <Route path="/layer2-tokens" element={<Layer2TokensPage />} />
            </Routes>
          </div>
        </main>
      </div>

      <StatusBar />
    </div>
  );
}
