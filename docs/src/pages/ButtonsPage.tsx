import { useState } from 'react';
import { SectionTitle, CodeBlock } from '../components/CodeBlock';
import { NewBadge } from '../components/NewBadge';

export function ButtonsPage() {
  const [segMode, setSegMode] = useState('day');
  return (
    <section id="buttons">
      <SectionTitle tag="操作">Buttons & Actions</SectionTitle>

      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Button Variants</span><span className="tag">ボタン</span></div>
        <div className="panel-body">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            <button className="btn">Primary</button>
            <button className="btn-ghost">Ghost</button>
            <button className="btn-danger">Danger</button>
            <button className="btn btn-sm">Small</button>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <button className="btn btn-success">Success</button><NewBadge tight />
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <button className="btn btn-ai">AI</button><NewBadge tight />
            </span>
          </div>
          <CodeBlock>{`<button class="btn">Primary</button>
<button class="btn-ghost">Ghost</button>
<button class="btn-danger">Danger</button>
<button class="btn btn-sm">Small</button>
<button class="btn btn-success">Success</button>  <!-- new -->
<button class="btn btn-ai">AI</button>            <!-- new -->`}</CodeBlock>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header">
          <span>Sizes & States <NewBadge /></span>
          <span className="tag">寸法</span>
        </div>
        <div className="panel-body">
          <div style={{ fontSize: 10, color: 'var(--nw-primary)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Sizes</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
            <button className="btn btn-chrome btn-xs">XS</button>
            <button className="btn btn-chrome btn-sm">SM</button>
            <button className="btn btn-chrome">MD</button>
            <button className="btn btn-chrome btn-lg">LG</button>
          </div>
          <div style={{ fontSize: 10, color: 'var(--nw-primary)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>States</div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
            <button className="btn btn-chrome btn-loading">Loading…</button>
            <button className="btn btn-chrome" disabled>Disabled</button>
            <button className="btn btn-ghost btn-icon">⚙</button>
            <button className="btn btn-chrome">Save <span className="kbd">⌘S</span></button>
          </div>
          <CodeBlock>{`<button class="btn btn-chrome btn-xs">XS</button>
<button class="btn btn-chrome btn-lg">LG</button>
<button class="btn btn-chrome btn-loading">Loading…</button>
<button class="btn btn-ghost btn-icon">⚙</button>`}</CodeBlock>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header">
          <span>Segmented Control <NewBadge /></span>
          <span className="tag">区分</span>
        </div>
        <div className="panel-body">
          <div className="seg" role="group" aria-label="Range" style={{ marginBottom: 12 }}>
            {(['day', 'week', 'month'] as const).map(m => (
              <button
                key={m}
                onClick={() => setSegMode(m)}
                aria-pressed={segMode === m}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>
          <div style={{ fontSize: 11, color: 'var(--nw-text-dim)', marginBottom: 12 }}>
            Active: <span style={{ color: 'var(--nw-data)' }}>{segMode}</span>
          </div>
          <CodeBlock>{`<div class="seg" role="group">
  <button aria-pressed="true">Day</button>
  <button aria-pressed="false">Week</button>
  <button aria-pressed="false">Month</button>
</div>`}</CodeBlock>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Tags & Badges</span><span className="tag">標識</span></div>
        <div className="panel-body">
          <div style={{ fontSize: 10, color: 'var(--nw-primary)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Status Tags</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            <span className="tag tag-success">Operational</span>
            <span className="tag tag-danger">Offline</span>
            <span className="tag tag-warning">Degraded</span>
            <span className="tag tag-info">Metadata</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span className="tag tag-chrome">System</span><NewBadge tight />
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span className="tag tag-warn">Warn</span><NewBadge tight />
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span className="tag tag-ai">Oracle</span><NewBadge tight />
            </span>
          </div>
          <CodeBlock>{`<span class="tag tag-success">Operational</span>
<span class="tag tag-danger">Offline</span>
<span class="tag tag-warning">Degraded</span>
<span class="tag tag-info">Metadata</span>
<span class="tag tag-chrome">System</span>   <!-- new -->
<span class="tag tag-warn">Warn</span>       <!-- new (alias of warning) -->
<span class="tag tag-ai">Oracle</span>       <!-- new -->`}</CodeBlock>
          <div style={{ fontSize: 10, color: 'var(--nw-primary)', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '12px 0 6px' }}>Badges</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            <span className="badge">Default</span>
            <span className="badge badge-success">Success</span>
            <span className="badge badge-danger">Danger</span>
            <span className="badge badge-warning">Warning</span>
          </div>
          <CodeBlock>{`<span class="badge">Default</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-danger">Danger</span>
<span class="badge badge-warning">Warning</span>`}</CodeBlock>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header"><span>Status LEDs</span><span className="tag">LED</span></div>
        <div className="panel-body">
          <div style={{ fontSize: 10, color: 'var(--nw-primary)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>v1 — color classes</div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
            <span><span className="led green" /> Green</span>
            <span><span className="led blue" /> Blue</span>
            <span><span className="led red" /> Red</span>
            <span><span className="led yellow" /> Yellow</span>
            <span><span className="led green blink" /> Blinking</span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--nw-primary)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>
            data-state attribute <NewBadge />
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
            <span><span className="led" data-state="ok" /> ok</span>
            <span><span className="led" data-state="warn" /> warn</span>
            <span><span className="led" data-state="error" /> error</span>
            <span><span className="led" data-state="info" /> info</span>
            <span><span className="led" data-state="ai" /> ai</span>
            <span><span className="led" data-state="ok" data-pulse /> pulse</span>
          </div>
          <CodeBlock>{`<!-- v1 (still works) -->
<span class="led green"></span>
<span class="led green blink"></span>

<!-- v2 — state-driven, includes 'ai' for purple oracle surfaces -->
<span class="led" data-state="ok"></span>
<span class="led" data-state="error" data-pulse></span>`}</CodeBlock>
        </div>
      </div>
    </section>
  );
}
