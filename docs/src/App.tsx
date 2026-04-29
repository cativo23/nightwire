import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import { MoreComponentsPage } from './pages/MoreComponentsPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { ExamplesPage } from './pages/ExamplesPage';

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="console-wrapper">
      {/* Top Nav */}
      <nav className="nw-nav">
        {/* Hamburger — mobile only */}
        <button
          onClick={() => setMobileOpen(true)}
          style={{
            display: 'none',
            background: 'none', border: '1px solid var(--nw-primary-dim)',
            color: 'var(--nw-primary)', cursor: 'pointer',
            padding: '4px 8px', fontFamily: 'var(--font-sys)', fontSize: 12,
            marginRight: 12, flexShrink: 0,
          }}
          className="nw-hamburger"
          aria-label="Open navigation"
        >
          ☰
        </button>
        <div className="org-mark">
          <span style={{ color: 'var(--nw-text)' }}>Nightwire</span>
          <span className="sub" style={{ color: 'var(--nw-primary)' }}>Dark Cyberpunk UI Design System — Documentation</span>
        </div>
        <span className="jp-sub">設計体系文書</span>
        <div className="nav-links">
          <a href="https://github.com/cativo23/nightwire" target="_blank" rel="noopener noreferrer">Github</a>
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
          borderRight: '1px solid var(--nw-primary-dim)',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
          display: 'none',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px 12px', borderBottom: '1px solid var(--nw-text-faint)' }}>
          <button
            onClick={() => setMobileOpen(false)}
            style={{ background: 'none', border: 'none', color: 'var(--nw-text-dim)', cursor: 'pointer', fontSize: 16 }}
          >✕</button>
        </div>
        <Sidebar onNavigate={() => setMobileOpen(false)} />
      </div>

      {/* Main layout */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* Desktop sidebar */}
        <div className="nw-sidebar-desktop" style={{ width: 220, flexShrink: 0, borderRight: '1px solid var(--nw-text-faint)' }}>
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
              <Route path="/more-components" element={<MoreComponentsPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/examples" element={<ExamplesPage />} />
            </Routes>
          </div>
        </main>
      </div>

      <StatusBar />
    </div>
  );
}
