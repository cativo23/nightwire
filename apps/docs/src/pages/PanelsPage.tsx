import { SectionTitle, CodeBlock } from '../components/CodeBlock';

export function PanelsPage() {
  return (
    <section id="panels">
      <SectionTitle tag="構造">Panel Anatomy</SectionTitle>
      <p style={{ color: 'var(--nw-text-dim)', fontSize: 12, margin: '8px 0 16px', lineHeight: 1.6 }}>
        Panels are the primary structural element. 8px uppercase headers, Japanese stylistic tags, and 2px gaps are standard.
      </p>

      <div className="grid-2" style={{ gap: 2, marginBottom: 2 }}>
        <div className="panel">
          <div className="panel-header"><span>Standard Panel</span><span className="tag">日本語タグ</span></div>
          <div className="panel-body">
            <div style={{ color: 'var(--nw-text-dim)', fontSize: 11 }}>
              Standard panel body. 8px font header, Japanese tags, 2px gaps between panels.
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">Card Component</div>
          <div className="card-body">
            <div style={{ color: 'var(--nw-text-dim)', fontSize: 11 }}>
              Cards have a border-radius and are intended for isolated content blocks.
            </div>
          </div>
          <div className="card-footer" style={{ fontSize: 9, color: 'var(--nw-text-dim)' }}>Card Footer</div>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Panel HTML</span><span className="tag">HTML</span></div>
        <div className="panel-body">
          <CodeBlock>{`<div class="panel">
  <div class="panel-header">
    <span>Title</span>
    <span class="tag">日本語タグ</span>
  </div>
  <div class="panel-body">Content</div>
</div>`}</CodeBlock>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Node Card</span><span className="tag">ノード</span></div>
        <div className="node-card">
          <div className="nc-id">Cluster-Alpha — H100 x 512</div>
          <div className="nc-name">深層学習訓練クラスタ</div>
          <div className="nc-row"><span className="lbl">Model</span><span className="val">CORTEX-7B v4.2</span></div>
          <div className="nc-row"><span className="lbl">Status</span><span className="val">Training</span></div>
          <div className="nc-row"><span className="lbl">GPU Util</span><span className="val">96.8%</span></div>
          <div className="nc-status" style={{ color: 'var(--nw-green)' }}><span className="led green" /> Operational</div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header"><span>Node Card HTML</span><span className="tag">HTML</span></div>
        <div className="panel-body">
          <CodeBlock>{`<div class="panel">
  <div class="panel-header"><span>Title</span><span class="tag">タグ</span></div>
  <div class="node-card">
    <div class="nc-id">ID — Subtitle</div>
    <div class="nc-name">日本語名称</div>
    <div class="nc-row">
      <span class="lbl">Label</span>
      <span class="val">Value</span>
    </div>
    <div class="nc-status"><span class="led green"></span> Status</div>
  </div>
</div>`}</CodeBlock>
        </div>
      </div>
    </section>
  );
}
