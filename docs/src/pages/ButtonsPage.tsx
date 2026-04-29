import { SectionTitle, CodeBlock } from '../components/CodeBlock';

export function ButtonsPage() {
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
          </div>
          <CodeBlock>{`<button class="btn">Primary</button>
<button class="btn-ghost">Ghost</button>
<button class="btn-danger">Danger</button>
<button class="btn btn-sm">Small</button>`}</CodeBlock>
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
          </div>
          <CodeBlock>{`<span class="tag tag-success">Operational</span>
<span class="tag tag-danger">Offline</span>
<span class="tag tag-warning">Degraded</span>
<span class="tag tag-info">Metadata</span>`}</CodeBlock>
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
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
            <span><span className="led green" /> Green</span>
            <span><span className="led blue" /> Blue</span>
            <span><span className="led red" /> Red</span>
            <span><span className="led yellow" /> Yellow</span>
            <span><span className="led green blink" /> Blinking</span>
          </div>
          <CodeBlock>{`<span class="led green"></span>
<span class="led blue"></span>
<span class="led red"></span>
<span class="led yellow"></span>
<span class="led green blink"></span>`}</CodeBlock>
        </div>
      </div>
    </section>
  );
}
