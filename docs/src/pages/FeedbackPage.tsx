import { useState, useCallback, useEffect } from 'react';
import { SectionTitle, CodeBlock } from '../components/CodeBlock';
import { NewBadge } from '../components/NewBadge';
import { makeEvent, type EventEntry } from '../data';

type ToastKind = 'success' | 'info' | 'warning' | 'danger';
type Toast = { id: number; kind: ToastKind; head: string; body: string };

export function FeedbackPage() {
  const [events] = useState<EventEntry[]>(() => Array.from({ length: 15 }, makeEvent));
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cmdkOpen, setCmdkOpen] = useState(false);

  const pushToast = useCallback((kind: ToastKind, head: string, body: string) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, kind, head, body }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  }, []);

  // ⌘K / Esc bindings — only active on this page
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdkOpen(true);
      }
      if (e.key === 'Escape') {
        setCmdkOpen(false);
        setModalOpen(false);
        setDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <section id="feedback">
      <SectionTitle tag="応答">Feedback & Status</SectionTitle>

      {/* Toasts — interactive */}
      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Toasts</span><span className="tag">通知</span></div>
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
          <div className="toast toast-success">System synchronization complete. All nodes connected.</div>
          <div className="toast toast-warning">High memory utilization detected. Consider optimizing operations.</div>
          <div className="toast toast-danger">Connection to core server lost. Attempting reconnection.</div>
        </div>
        <div style={{ fontSize: 10, color: 'var(--nw-primary)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '12px 0 6px' }}>
          Live trigger <NewBadge />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          <button className="btn btn-success" onClick={() => pushToast('success', 'Operation complete', '12 nodes synced')}>Success</button>
          <button className="btn btn-ghost" style={{ color: 'var(--nw-cyan)', borderColor: 'var(--nw-cyan-dim)' }} onClick={() => pushToast('info', 'Heads up', 'New build is ready')}>Info</button>
          <button className="btn btn-ghost" style={{ color: 'var(--nw-yellow)', borderColor: 'var(--nw-yellow-dim)' }} onClick={() => pushToast('warning', 'Capacity 84%', 'Consider scaling out')}>Warn</button>
          <button className="btn btn-ghost" style={{ color: 'var(--nw-red)', borderColor: 'var(--nw-red-dim)' }} onClick={() => pushToast('danger', 'Deploy failed', 'Build #482 · auth error')}>Error</button>
        </div>
        <CodeBlock>{`<div class="toast toast-success">Success message</div>
<div class="toast toast-warning">Warning message</div>
<div class="toast toast-danger">Error message</div>
<div class="toast toast-info">Info message</div>`}</CodeBlock>
      </div>

      {/* Banner — v2 */}
      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Banner <NewBadge /></span><span className="tag">告知</span></div>
        <div className="banner" style={{ marginBottom: 12 }}>
          <span className="banner-tag">Notice</span>
          Scheduled maintenance on edge nodes <span className="data tabular" style={{ color: 'var(--nw-green)' }}>2026-05-20 22:00 UTC</span> · expected 12m downtime.
          <span style={{ marginLeft: 'auto', color: 'var(--nw-text-dim)' }}>Dismiss <span className="kbd">esc</span></span>
        </div>
        <CodeBlock>{`<div class="banner">
  <span class="banner-tag">Notice</span>
  Scheduled maintenance — expected 12m downtime.
</div>`}</CodeBlock>
      </div>

      {/* Stepper — v2 */}
      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Stepper <NewBadge /></span><span className="tag">段階</span></div>
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 11, color: 'var(--nw-text-dim)' }}>Multi-step progress — 3 of 5 complete</div>
          <div className="steps">
            <div className="step done" />
            <div className="step done" />
            <div className="step current" />
            <div className="step" />
            <div className="step" />
          </div>
          <CodeBlock>{`<div class="steps">
  <div class="step done"></div>
  <div class="step done"></div>
  <div class="step current"></div>
  <div class="step"></div>
  <div class="step"></div>
</div>`}</CodeBlock>
        </div>
      </div>

      {/* Empty state — v2 */}
      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Empty State <NewBadge /></span><span className="tag">空</span></div>
        <div className="panel-body">
          <div className="empty" style={{ background: 'var(--nw-surface-1)', border: '1px solid var(--nw-line)' }}>
            <div className="glyph">⌬</div>
            <div className="head">No active query</div>
            <div className="sub">Ask the operator's intelligence layer. Anomalies, forecasts, summaries — grounded in live telemetry.</div>
            <button className="btn btn-ai" style={{ marginTop: 8 }}>Start session <span className="kbd">⌘ /</span></button>
          </div>
          <CodeBlock>{`<div class="empty">
  <div class="glyph">⌬</div>
  <div class="head">No active query</div>
  <div class="sub">Helpful explanation</div>
  <button class="btn btn-ai">Start session</button>
</div>`}</CodeBlock>
        </div>
      </div>

      {/* AI block — v2 */}
      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>AI Block <NewBadge /></span><span className="tag">予言</span></div>
        <div className="panel-body" style={{ padding: 0 }}>
          <div className="ai-block">
            <div className="ai-block-head">
              <span className="led" data-state="ai" data-pulse /> suggested
            </div>
            <div className="ai-block-body">
              <em>edge-eu-19</em> CPU climbed steadily over 4 windows. Consider <em>scaling out</em> before the 14:45 traffic peak.
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <button className="btn btn-ghost btn-sm">Apply</button>
                <button className="btn btn-sm">Defer</button>
              </div>
            </div>
          </div>
        </div>
        <div className="panel-body" style={{ paddingTop: 0 }}>
          <CodeBlock>{`<div class="ai-block">
  <div class="ai-block-head">
    <span class="led" data-state="ai" data-pulse></span> suggested
  </div>
  <div class="ai-block-body">
    <em>edge-eu-19</em> CPU climbed steadily. Consider <em>scaling out</em>.
  </div>
</div>`}</CodeBlock>
        </div>
      </div>

      {/* Modal / Drawer / Cmd K — v2 interactive */}
      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Overlays — Modal · Drawer · Cmd K <NewBadge /></span><span className="tag">重ね</span></div>
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-ghost" onClick={() => setModalOpen(true)}>Open modal</button>
            <button className="btn btn-ghost" onClick={() => setDrawerOpen(true)}>Open drawer</button>
            <button className="btn btn-ghost" onClick={() => setCmdkOpen(true)}>Open Cmd K <span className="kbd">⌘K</span></button>
          </div>
          <div style={{ fontSize: 11, color: 'var(--nw-text-dim)' }}>
            Press <span className="kbd">Esc</span> to dismiss any overlay. <span className="kbd">⌘K</span> opens the palette globally on this page.
          </div>
          <CodeBlock>{`<!-- Modal -->
<div class="modal-backdrop" data-open="true">
  <div class="modal">...</div>
</div>

<!-- Drawer (slide-from-right) -->
<aside class="drawer" data-open="true">
  <div class="drawer-header">...</div>
  <div class="drawer-body">...</div>
</aside>

<!-- Cmd K -->
<div class="cmdk-backdrop" data-open="true">
  <div class="cmdk">
    <input placeholder="Type a command…">
    <div class="cmdk-section">Navigate</div>
    <div class="cmdk-item">Go to Fleet <span class="kbd">g</span><span class="kbd">f</span></div>
  </div>
</div>`}</CodeBlock>
        </div>
      </div>

      {/* Event log — existing */}
      <div className="event-log" style={{ height: 300 }}>
        <div className="el-header">
          <span>Event Log Example</span>
          <span className="el-count">{events.length} entries</span>
        </div>
        <div className="el-body">
          {events.map((ev, i) => (
            <div key={i} className="ev">
              <span className="ev-time">{ev.time}</span>
              <span className={`ev-type ${ev.type}`}>{ev.type}</span>
              <span className="ev-detail">{ev.detail}</span>
              <span className="ev-metric">{ev.metric}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Toast stack — fixed top-right */}
      <div
        style={{
          position: 'fixed', right: 16, top: 80,
          display: 'flex', flexDirection: 'column', gap: 8,
          zIndex: 60, width: 320, pointerEvents: 'none',
        }}
      >
        {toasts.map(t => (
          <div
            key={t.id}
            className={`toast toast-${t.kind}`}
            style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'flex-start', gap: 10 }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-stamp)', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--nw-chrome)', marginBottom: 2 }}>
                {t.head}
              </div>
              <div>{t.body}</div>
            </div>
            <button
              onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
              style={{ cursor: 'pointer', color: 'var(--nw-text-mute)', background: 'none', border: 0, fontSize: 14 }}
              aria-label="Dismiss"
            >×</button>
          </div>
        ))}
      </div>

      {/* Modal */}
      <div className="modal-backdrop" data-open={modalOpen} onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
        <div className="modal">
          <div className="modal-header">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className="tag tag-ai">oracle</span>
              <span className="modal-title">Start session</span>
            </div>
            <button className="btn btn-ghost btn-icon" onClick={() => setModalOpen(false)} aria-label="Close">×</button>
          </div>
          <div className="modal-body">
            <div className="field">
              <label className="field-label">Query</label>
              <textarea defaultValue="Forecast traffic peaks for the next 6 hours." style={{ minHeight: 60 }} />
            </div>
            <label className="switch" style={{ marginTop: 12 }}>
              <input type="checkbox" defaultChecked />
              <span className="track" />
              <span className="lbl">Ground responses in live telemetry</span>
            </label>
          </div>
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-ai" onClick={() => { setModalOpen(false); pushToast('info', 'Session started', 'Querying live telemetry…'); }}>Start</button>
          </div>
        </div>
      </div>

      {/* Drawer */}
      <div className="drawer-backdrop" data-open={drawerOpen} onClick={() => setDrawerOpen(false)} />
      <aside className="drawer" data-open={drawerOpen}>
        <div className="drawer-header">
          <div>
            <div className="modal-title">Node detail</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
              <span className="led" data-state="ok" data-pulse />
              <span style={{ color: 'var(--nw-chrome)' }}>edge-eu-19</span>
              <span className="tag tag-success">healthy</span>
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={() => setDrawerOpen(false)} aria-label="Close">×</button>
        </div>
        <div className="drawer-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
            <div style={{ background: 'var(--nw-surface-2)', border: '1px solid var(--nw-line)', padding: 10 }}>
              <div style={{ fontSize: 10, color: 'var(--nw-chrome-mute)', letterSpacing: '.14em', textTransform: 'uppercase' }}>CPU</div>
              <div style={{ fontSize: 20, color: 'var(--nw-data)' }}>63<span style={{ fontSize: 10, color: 'var(--nw-text-mute)' }}>%</span></div>
            </div>
            <div style={{ background: 'var(--nw-surface-2)', border: '1px solid var(--nw-line)', padding: 10 }}>
              <div style={{ fontSize: 10, color: 'var(--nw-chrome-mute)', letterSpacing: '.14em', textTransform: 'uppercase' }}>Mem</div>
              <div style={{ fontSize: 20, color: 'var(--nw-data)' }}>12.8<span style={{ fontSize: 10, color: 'var(--nw-text-mute)' }}>GB</span></div>
            </div>
          </div>
          <div style={{ fontSize: 10, color: 'var(--nw-chrome-mute)', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 8 }}>Sync history</div>
          <div className="steps" style={{ marginBottom: 14 }}>
            <div className="step done" /><div className="step done" /><div className="step done" />
            <div className="step current" /><div className="step" /><div className="step" />
          </div>
          <div style={{ fontSize: 10, color: 'var(--nw-chrome-mute)', letterSpacing: '.14em', textTransform: 'uppercase', marginBottom: 8 }}>Quick actions</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn btn-ghost btn-sm">Restart</button>
            <button className="btn btn-ghost btn-sm">Drain</button>
            <button className="btn btn-ghost btn-sm">Logs</button>
            <button className="btn btn-danger btn-sm">Decommission</button>
          </div>
        </div>
      </aside>

      {/* Cmd K */}
      <div className="cmdk-backdrop" data-open={cmdkOpen} onClick={(e) => { if (e.target === e.currentTarget) setCmdkOpen(false); }}>
        <div className="cmdk" role="dialog" aria-label="Command palette">
          <input autoFocus placeholder="Type a command or search…" />
          <div className="cmdk-section">Navigate</div>
          <div className="cmdk-item active">
            <span>Go to Components</span>
            <div style={{ display: 'flex', gap: 4 }}><span className="kbd">g</span><span className="kbd">c</span></div>
          </div>
          <div className="cmdk-item">
            <span>Go to Incidents</span>
            <div style={{ display: 'flex', gap: 4 }}><span className="kbd">g</span><span className="kbd">i</span></div>
          </div>
          <div className="cmdk-section">Actions</div>
          <div className="cmdk-item">
            <span>Deploy current branch</span>
            <div style={{ display: 'flex', gap: 4 }}><span className="kbd">⌘</span><span className="kbd">↵</span></div>
          </div>
          <div className="cmdk-item">
            <span>Ask Oracle…</span>
            <div style={{ display: 'flex', gap: 4 }}><span className="kbd">⌘</span><span className="kbd">/</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
