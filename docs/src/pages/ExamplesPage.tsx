import { SectionTitle } from '../components/CodeBlock';

export function ExamplesPage() {
  return (
    <section id="examples">
      <SectionTitle tag="デモ">Live Examples</SectionTitle>
      <div className="grid-2" style={{ gap: 2 }}>
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
      </div>
    </section>
  );
}
