import { SectionTitle, CodeBlock } from '../components/CodeBlock';

export function TemplatesPage() {
  return (
    <section id="templates">
      <SectionTitle tag="型紙">Layout Templates</SectionTitle>
      <p style={{ color: 'var(--nw-text-dim)', fontSize: 13, margin: '8px 0 16px', lineHeight: 1.6 }}>
        The core <code style={{ color: 'var(--nw-cyan)' }}>nightwire.css</code> is layout-agnostic — it works for portfolios, blogs, and standard sites.
        For a dense, full-viewport <strong>Operations Console</strong> (like our demos), use this template.
      </p>

      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Operations Console CSS</span><span className="tag">構造CSS</span></div>
        <div className="panel-body">
          <CodeBlock>{`.console-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.nw-nav {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: var(--void);
  border-bottom: 1px solid var(--nw-primary-dim);
  flex-shrink: 0;
}

.dashboard {
  display: flex;
  gap: 2px; /* signature 2px gap */
  flex: 1;
  padding: 2px;
  min-height: 0;
}

.dash-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}

.dash-right {
  width: 370px;
  min-width: 370px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dash-row { display: grid; gap: 2px; flex-shrink: 0; }
.dash-row.r1 { grid-template-columns: 1.2fr 1fr; min-height: 360px; }
.dash-row.r2 { grid-template-columns: 1fr 1fr; }`}</CodeBlock>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header"><span>HTML Structure</span><span className="tag">構造HTML</span></div>
        <div className="panel-body">
          <CodeBlock>{`<div class="console-wrapper">
  <nav class="nw-nav">...</nav>
  <div class="dashboard">
    <div class="dash-left">
      <div class="dash-row r1">
        <div class="panel">...</div>
        <div class="panel">...</div>
      </div>
    </div>
    <div class="dash-right">
      <div class="panel">...</div>
    </div>
  </div>
</div>`}</CodeBlock>
        </div>
      </div>
    </section>
  );
}
