import { SectionTitle, CodeBlock } from '../components/CodeBlock';
import { COMPONENTS_V2 } from '../data';

const CATEGORIES = [
  { id: 'forms',    label: 'Forms',        kanji: '入力' },
  { id: 'overlays', label: 'Overlays',     kanji: '重ね' },
  { id: 'data',     label: 'Data Display', kanji: 'データ' },
  { id: 'feedback', label: 'Feedback',     kanji: '応答' },
  { id: 'variants', label: 'Variants',     kanji: '変種' },
  { id: 'layout',   label: 'Layout',       kanji: '配置' },
];

export function ComponentsV2Page() {
  return (
    <section id="components-v2">
      <SectionTitle tag="部品V2">v2 Components</SectionTitle>
      <p style={{ color: 'var(--nw-text-dim)', fontSize: 13, margin: '8px 0 20px', lineHeight: 1.6 }}>
        All v2 components are <strong>additive</strong>. v1 classes (<code style={{ color: 'var(--nw-green)' }}>.btn</code>,{' '}
        <code style={{ color: 'var(--nw-green)' }}>.panel</code>, <code style={{ color: 'var(--nw-green)' }}>.tag</code>) keep working
        unchanged. Browse below by category, or see <a href="https://github.com/cativo23/nightwire/blob/feature/v2-alpha/examples/html/workshop.html"
        target="_blank" rel="noopener noreferrer" style={{ color: 'var(--nw-primary)' }}>workshop.html</a> for a live demo
        with intensity toggle.
      </p>

      {CATEGORIES.map(cat => {
        const items = COMPONENTS_V2.filter(c => c.category === cat.id);
        if (items.length === 0) return null;
        return (
          <div key={cat.id} className="panel" style={{ marginBottom: 2 }}>
            <div className="panel-header">
              <span>{cat.label}</span>
              <span className="tag">{cat.kanji}</span>
            </div>
            <div className="panel-body" style={{ padding: 0 }}>
              <table className="nw-table">
                <thead>
                  <tr>
                    <th>Class</th>
                    <th>Description</th>
                    <th>Variants / sub-parts</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(c => (
                    <tr key={c.name}>
                      <td style={{ color: 'var(--nw-cyan)' }}>{c.name}</td>
                      <td>{c.desc}</td>
                      <td style={{ color: 'var(--nw-text-dim)', fontSize: 11 }}>{c.variants ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}

      {/* Live previews */}
      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Live · Form suite</span><span className="tag">プレビュー</span></div>
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="field">
            <label className="field-label">Node ID <span className="req">*</span></label>
            <input defaultValue="cluster-α-12" />
            <span className="field-help">Identifier of the target node</span>
          </div>
          <div className="field success">
            <label className="field-label">Region</label>
            <input defaultValue="ap-northeast-1" />
            <span className="field-help">✓ Verified · 12 nodes available</span>
          </div>
          <div className="field error">
            <label className="field-label">Replica count</label>
            <input defaultValue="9999" />
            <span className="field-help">Exceeds quota (max 512)</span>
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <label className="switch"><input type="checkbox" defaultChecked /><span className="track"></span><span className="lbl">Auto-scale</span></label>
            <label className="check"><input type="checkbox" defaultChecked /><span className="box"></span> Notify oncall</label>
            <label className="radio"><input type="radio" name="strat-v2" defaultChecked /><span className="box"></span> Rolling</label>
            <label className="radio"><input type="radio" name="strat-v2" /><span className="box"></span> Canary</label>
          </div>
          <div className="combo">
            <span className="chip">ap-northeast-1 <span className="x">×</span></span>
            <span className="chip">eu-west-2 <span className="x">×</span></span>
            <input placeholder="Add region…" />
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Live · Tags &amp; buttons</span><span className="tag">プレビュー</span></div>
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="tag tag-chrome">system</span>
            <span className="tag tag-success">healthy</span>
            <span className="tag tag-warn">degraded</span>
            <span className="tag tag-danger">offline</span>
            <span className="tag tag-info">signal</span>
            <span className="tag tag-ai">oracle</span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn">Default</button>
            <button className="btn btn-ghost">Ghost</button>
            <button className="btn btn-success">Success</button>
            <button className="btn btn-danger">Danger</button>
            <button className="btn btn-ai">AI</button>
            <button className="btn btn-loading">Loading…</button>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span className="led" data-state="ok" data-pulse></span>
            <span className="led" data-state="warn"></span>
            <span className="led" data-state="error" data-pulse></span>
            <span className="led" data-state="info"></span>
            <span className="led" data-state="ai"></span>
            <span style={{ color: 'var(--nw-text-dim)', fontSize: 11, marginLeft: 8 }}>ok / warn / error / info / ai (with data-pulse on first &amp; third)</span>
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Live · Stepper &amp; diff</span><span className="tag">プレビュー</span></div>
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="steps">
            <div className="step done"></div>
            <div className="step done"></div>
            <div className="step current"></div>
            <div className="step"></div>
            <div className="step"></div>
          </div>
          <div className="diff">
            <div className="ln"><span className="num">12</span><span className="code-content"> autoscaler:</span></div>
            <div className="ln del"><span className="num">13</span><span className="code-content"> -  replicas: 4</span></div>
            <div className="ln add"><span className="num">13</span><span className="code-content"> +  replicas: 8</span></div>
            <div className="ln del"><span className="num">14</span><span className="code-content"> -  cooldown: 60s</span></div>
            <div className="ln add"><span className="num">14</span><span className="code-content"> +  cooldown: 30s</span></div>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header"><span>Quick reference</span><span className="tag">早見表</span></div>
        <div className="panel-body">
          <CodeBlock>{`<!-- Form field with validation states -->
<div class="field success">
  <label class="field-label">Region</label>
  <input value="ap-northeast-1" />
  <span class="field-help">✓ Verified</span>
</div>

<!-- Switch -->
<label class="switch">
  <input type="checkbox" checked>
  <span class="track"></span>
  <span class="lbl">Auto-scale</span>
</label>

<!-- Multiselect combo -->
<div class="combo">
  <span class="chip">ap-northeast-1 <span class="x">×</span></span>
  <input placeholder="Add region…">
</div>

<!-- LED with state -->
<span class="led" data-state="ok" data-pulse></span>

<!-- Stat card with sparkline -->
<div class="stat">
  <span class="stat-label">Active Nodes</span>
  <span class="stat-value">487</span>
  <span class="stat-delta up">▲ 2.1%</span>
  <svg class="stat-spark" viewBox="0 0 100 24">...</svg>
</div>`}</CodeBlock>
        </div>
      </div>
    </section>
  );
}
