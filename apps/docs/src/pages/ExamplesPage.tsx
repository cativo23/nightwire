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
        <div className="panel">
          <div className="panel-header">
            <span>Workshop — Operator Console</span>
            <span style={{ display: 'inline-flex', gap: 4 }}><NewBadge /><span className="tag">部品</span></span>
          </div>
          <div className="node-card">
            <div className="nc-id">v2 Operator Console</div>
            <div className="nc-name">部品工房 — 強度切替</div>
            <div className="nc-row"><span className="lbl">Intensity</span><span className="val">Archive · Operator · Combat</span></div>
            <div className="nc-row"><span className="lbl">Forms</span><span className="val">.field · .switch · .combo</span></div>
            <div className="nc-row"><span className="lbl">Overlays</span><span className="val">Drawer · Cmd K · Modal</span></div>
            <div className="nc-row"><span className="lbl">Data</span><span className="val">Stat · Diff · Code</span></div>
            <div className="nc-row"><span className="lbl">AI</span><span className="val">.ai-block · .tag-ai</span></div>
            <div style={{ marginTop: 8 }}>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); window.open('/examples/html/workshop.html', '_blank'); }}
                className="btn btn-sm"
                style={{ fontSize: 9 }}
              >Open Workshop</a>
            </div>
          </div>
        </div>

        {/* v2.0.1 — SYNAPSE */}
        <div className="panel">
          <div className="panel-header">
            <span>SYNAPSE — Neural Intelligence</span>
            <span style={{ display: 'inline-flex', gap: 4 }}><NewBadge /><span className="tag">デモ</span></span>
          </div>
          <div className="node-card">
            <div className="nc-id">v2 Ops Center</div>
            <div className="nc-name">神経監視センター</div>
            <div className="nc-row"><span className="lbl">Intensity</span><span className="val">Archive · Operator · Combat</span></div>
            <div className="nc-row"><span className="lbl">Live</span><span className="val">SVG Waveform · Metrics</span></div>
            <div className="nc-row"><span className="lbl">Stream</span><span className="val">Event Log · Ticker</span></div>
            <div className="nc-row"><span className="lbl">Command</span><span className="val">Cmd K Palette</span></div>
            <div className="nc-row"><span className="lbl">AI</span><span className="val">.ai-block Oracle</span></div>
            <div style={{ marginTop: 8 }}>
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); window.open('/examples/html/synapse-ops.html', '_blank'); }}
                className="btn btn-sm"
                style={{ fontSize: 9 }}
              >Open Demo</a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
