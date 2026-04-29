import { CodeBlock } from '../components/CodeBlock';

export function QuickStartPage() {
  return (
    <section id="quickstart">
      <div style={{ marginBottom: 16 }}>
        <div className="compressed-title" style={{ fontSize: 28, color: 'var(--nw-green)', lineHeight: 1 }}>QUICK START</div>
        <div style={{ fontFamily: 'var(--font-mincho)', fontSize: 13, fontWeight: 800, color: 'var(--nw-green-dim)', marginTop: 2 }}>クイックスタート</div>
        <p style={{ color: 'var(--nw-text-dim)', fontSize: 13, marginTop: 10, lineHeight: 1.6 }}>
          Get Nightwire running in 3 steps. Works with any framework or plain HTML.
        </p>
      </div>

      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Step 1 — Add the CSS</span><span className="tag">CSS読込</span></div>
        <div className="panel-body">
          <CodeBlock>{`<link rel="stylesheet" href="nightwire.css">`}</CodeBlock>
          <div style={{ fontSize: 9, color: 'var(--nw-text-dim)', marginTop: 6 }}>Or via npm: <code style={{ color: 'var(--nw-cyan)' }}>npm install nightwire-css</code></div>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Step 2 — Load the Fonts</span><span className="tag">書体読込</span></div>
        <div className="panel-body">
          <CodeBlock>{`<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Display:wght@700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Saira+Extra+Condensed:wght@400;600;700;800&family=Shippori+Mincho+B1:wght@500;700;800&display=swap" rel="stylesheet">`}</CodeBlock>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Step 3 — Use a Component</span><span className="tag">使用開始</span></div>
        <div className="panel-body">
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button className="btn">Launch</button>
            <button className="btn-ghost">Cancel</button>
            <span className="tag tag-success">Online</span>
            <span className="led green" />
          </div>
          <CodeBlock>{`<button class="btn">Launch</button>
<button class="btn-ghost">Cancel</button>
<span class="tag tag-success">Online</span>
<span class="led green"></span>`}</CodeBlock>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header"><span>Tailwind Preset (Optional)</span><span className="tag">TW</span></div>
        <div className="panel-body">
          <CodeBlock>{`// tailwind.config.js
import nightwirePreset from 'nightwire/tailwind.preset.js'
export default { presets: [nightwirePreset] }`}</CodeBlock>
        </div>
      </div>
    </section>
  );
}
