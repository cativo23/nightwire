import { SectionTitle } from '../components/CodeBlock';
import { NewBadge } from '../components/NewBadge';

export function ExamplesPage() {
  return (
    <section id="examples">
      <SectionTitle tag="デモ">Live Examples</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>

        <div className="panel">
          <div className="panel-header"><span>Alchemix V3 Dashboard</span><span className="tag">デモ</span></div>
          <div className="node-card">
            <div className="nc-id">Dashboard Demo</div>
            <div className="nc-name">錬金術V3運用パネル</div>
            <div className="nc-row"><span className="lbl">Three.js</span><span className="val">3D Globe</span></div>
            <div className="nc-row"><span className="lbl">Metrics</span><span className="val">Live Grid</span></div>
            <div className="nc-row"><span className="lbl">Events</span><span className="val">Streaming Log</span></div>
            <div className="nc-row"><span className="lbl">Waveform</span><span className="val">Canvas 2D</span></div>
            <div className="nc-row"><span className="lbl">MAGI</span><span className="val">Oracle Panel</span></div>
            <div style={{ marginTop: 8 }}>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); window.open('/examples/html/dashboard.html', '_blank'); }}
                className="btn btn-sm"
                style={{ fontSize: 9 }}
              >Open Demo</a>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel-header"><span>Neural-Ops Center</span><span className="tag">デモ</span></div>
          <div className="node-card">
            <div className="nc-id">Neural Ops Demo</div>
            <div className="nc-name">神経制御システム</div>
            <div className="nc-row"><span className="lbl">Three.js</span><span className="val">Neural Network</span></div>
            <div className="nc-row"><span className="lbl">Heatmap</span><span className="val">Attention Grid</span></div>
            <div className="nc-row"><span className="lbl">Layers</span><span className="val">Activation Bars</span></div>
            <div className="nc-row"><span className="lbl">GPU</span><span className="val">Power Grid</span></div>
            <div style={{ marginTop: 8 }}>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); window.open('/examples/html/neural-ops.html', '_blank'); }}
                className="btn btn-sm"
                style={{ fontSize: 9 }}
              >Open Demo</a>
            </div>
          </div>
        </div>

        {/* v2 — Workshop */}
        <div className="panel" style={{ boxShadow: 'inset 2px 0 0 var(--nw-purple)' }}>
          <div className="panel-header">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              Workshop — Operator Console <NewBadge />
            </span>
            <span className="tag">部品</span>
          </div>
          <div className="node-card">
            <div className="nc-id">v2 Operator Console</div>
            <div className="nc-name">部品工房 — 強度切替</div>
            <div className="nc-row"><span className="lbl">Intensity</span><span className="val">Archive · Operator · Combat</span></div>
            <div className="nc-row"><span className="lbl">Forms</span><span className="val">.field · .switch · .combo</span></div>
            <div className="nc-row"><span className="lbl">Overlays</span><span className="val">Drawer · Cmd K · Modal</span></div>
            <div className="nc-row"><span className="lbl">Data</span><span className="val">Stat · Diff · Code</span></div>
            <div className="nc-row"><span className="lbl">AI</span><span className="val">.ai-block · .tag-ai</span></div>
            <div style={{ marginTop: 8, display: 'flex', gap: 6, alignItems: 'center' }}>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); window.open('/examples/html/workshop.html', '_blank'); }}
                className="btn btn-ai btn-sm"
                style={{ fontSize: 9 }}
              >Open Workshop</a>
              <span style={{ fontSize: 9, color: 'var(--nw-text-dim)' }}>⌘K · live intensity toggle · debug HUD</span>
            </div>
          </div>
        </div>

      </div>

      {/* v2 in-place preview — a compact composition that runs INSIDE this page */}
      <div className="panel" style={{ marginTop: 2 }}>
        <div className="panel-header">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            Inline composition — Fleet Pulse <NewBadge />
          </span>
          <span className="tag">構成例</span>
        </div>
        <div className="panel-body" style={{ padding: 0 }}>
          {/* Stat strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }}>
            <div className="stat">
              <span className="stat-label">Active Nodes</span>
              <span className="stat-value tabular">487<span style={{ fontSize: '.5em', color: 'var(--nw-text-mute)' }}> / 512</span></span>
              <span className="stat-delta up">▲ 2.1% · 24h</span>
              <svg className="stat-spark" viewBox="0 0 100 24" preserveAspectRatio="none">
                <path className="area" d="M0,18 L24,12 L48,11 L72,5 L100,2 L100,24 L0,24 Z" />
                <path d="M0,18 L24,12 L48,11 L72,5 L100,2" />
              </svg>
            </div>
            <div className="stat">
              <span className="stat-label">Throughput</span>
              <span className="stat-value tabular">1.42M</span>
              <span className="stat-delta up">▲ 12.4% · 1h</span>
              <svg className="stat-spark" viewBox="0 0 100 24" preserveAspectRatio="none">
                <path className="area" d="M0,14 L24,15 L48,8 L72,7 L100,2 L100,24 L0,24 Z" />
                <path d="M0,14 L24,15 L48,8 L72,7 L100,2" />
              </svg>
            </div>
            <div className="stat">
              <span className="stat-label">p99 Latency</span>
              <span className="stat-value tabular">42<span style={{ fontSize: '.5em', color: 'var(--nw-text-mute)' }}> ms</span></span>
              <span className="stat-delta down">▼ 0.8 ms · 1h</span>
              <svg className="stat-spark" viewBox="0 0 100 24" preserveAspectRatio="none">
                <path className="area" d="M0,8 L24,12 L48,11 L72,14 L100,15 L100,24 L0,24 Z" />
                <path d="M0,8 L24,12 L48,11 L72,14 L100,15" />
              </svg>
            </div>
            <div className="stat">
              <span className="stat-label">Error Rate</span>
              <span className="stat-value tabular" style={{ color: 'var(--nw-yellow)' }}>0.21<span style={{ fontSize: '.5em', color: 'var(--nw-text-mute)' }}> %</span></span>
              <span className="stat-delta up" style={{ color: 'var(--nw-yellow)' }}>▲ 0.04 pp · breached SLO</span>
              <svg className="stat-spark" viewBox="0 0 100 24" preserveAspectRatio="none">
                <path className="area" style={{ fill: 'var(--nw-yellow)', opacity: 0.14 }} d="M0,18 L24,15 L48,14 L72,10 L100,6 L100,24 L0,24 Z" />
                <path style={{ stroke: 'var(--nw-yellow)' }} d="M0,18 L24,15 L48,14 L72,10 L100,6" />
              </svg>
            </div>
          </div>

          {/* AI suggestion strip */}
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
        <div style={{ padding: 12, fontSize: 11, color: 'var(--nw-text-dim)', borderTop: '1px solid var(--nw-line)' }}>
          Real-world dashboard composition using v2 primitives: <code className="code-inline">.stat</code>, <code className="code-inline">.stat-spark</code>, <code className="code-inline">.ai-block</code>, <code className="code-inline">.led[data-state="ai"][data-pulse]</code>. The full standalone version with intensity toggle and command palette lives at <code className="code-inline">examples/html/workshop.html</code>.
        </div>
      </div>
    </section>
  );
}
