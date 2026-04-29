import { Waveform } from '../components/Waveform';

export function OverviewPage() {
  return (
    <section id="overview">
      <div style={{ marginBottom: 16 }}>
        <div className="compressed-title" style={{ fontSize: 36, color: 'var(--nw-primary)', lineHeight: 1 }}>NIGHTWIRE</div>
        <div style={{ fontFamily: 'var(--font-mincho)', fontSize: 16, fontWeight: 800, color: 'var(--nw-primary-dim)', marginTop: 2 }}>暗黒専用サイバーパンク設計体系</div>
        <p style={{ color: 'var(--nw-text-dim)', fontSize: 13, marginTop: 12, maxWidth: 600, lineHeight: 1.6 }}>
          A framework-agnostic, dark-mode-only UI design system optimized for AI-driven development.
          Built on the absolute void <code style={{ color: 'var(--nw-green)' }}>#000000</code> with semantic neon accents.
        </p>
      </div>

      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>System Overview</span><span className="tag">概要</span></div>
        <div className="metrics-grid">
          <div className="metric-cell"><div className="m-label">Design Tokens</div><div className="m-value">42</div><div className="m-sub">CSS custom properties</div></div>
          <div className="metric-cell"><div className="m-label">Component Classes</div><div className="m-value">24+</div><div className="m-sub">pure CSS components</div></div>
          <div className="metric-cell highlight"><div className="m-label">Surface Layers</div><div className="m-value">4</div><div className="m-sub">void → raised</div></div>
          <div className="metric-cell"><div className="m-label">Font Families</div><div className="m-value">4</div><div className="m-sub">sys, title, stamp, mincho</div></div>
          <div className="metric-cell"><div className="m-label">Border Radius</div><div className="m-value" style={{ color: 'var(--nw-red)' }}>0px</div><div className="m-sub">zero tolerance</div></div>
          <div className="metric-cell"><div className="m-label">Spacing Base</div><div className="m-value">4px</div><div className="m-sub">8-step scale</div></div>
        </div>
      </div>

      <Waveform />

      <div className="panel" style={{ marginTop: 2 }}>
        <div className="panel-header"><span>MAGI Design Principles</span><span className="tag">設計哲学</span></div>
        <div className="panel-body">
          <div className="magi-oracle">
            {[
              { id: 'MELCHIOR', name: 'Void First', value: 'Pure #000000 backgrounds. No grays, no gradients, no noise.', status: 'agree' },
              { id: 'BALTHASAR', name: 'Data Density', value: 'Every pixel conveys information. No decorative waste.', status: 'agree' },
              { id: 'CASPER', name: 'Neon Discipline', value: 'Semantic color only. Green=data, Blue=UI, Red=danger, Cyan=info.', status: 'agree' },
            ].map((p) => (
              <div className="magi-source" key={p.id}>
                <div className="ms-name">{p.id}</div>
                <div className="ms-value">{p.name}</div>
                <div className="ms-meta">{p.value}</div>
                <div className={`ms-status ${p.status}`}>{p.status.toUpperCase()}</div>
              </div>
            ))}
            <div className="magi-consensus">
              Consensus: <span style={{ color: 'var(--nw-green)' }}>UNANIMOUS — VOID-FIRST DESIGN APPROVED</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
