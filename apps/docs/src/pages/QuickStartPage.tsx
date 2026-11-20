import { CodeBlock } from '../components/CodeBlock';
import { PageHead } from '../components/PageHead';

export function QuickStartPage() {
  return (
    <section id="quickstart">
      <PageHead idx="02" label="Quick Start" kanji="クイック" title="QUICK START" subtitle="クイックスタート">
        Get Nightwire running in 3 steps. Works with any framework or plain HTML.
      </PageHead>

      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Step 1 — Add the CSS</span><span className="kanji">CSS読込</span></div>
        <div className="panel-body">
          <CodeBlock>{`<link rel="stylesheet" href="nightwire.css">`}</CodeBlock>
          <div style={{ fontSize: 9, color: 'var(--nw-text-dim)', marginTop: 6 }}>Or via npm: <code className="code-inline">npm install @cativo23/nightwire</code></div>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Step 2 — Load the Fonts</span><span className="kanji">書体読込</span></div>
        <div className="panel-body">
          <CodeBlock>{`<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Display:wght@700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Saira+Extra+Condensed:wght@400;600;700;800&family=Shippori+Mincho+B1:wght@500;700;800&display=swap" rel="stylesheet">`}</CodeBlock>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Step 3 — Use a Component</span><span className="kanji">使用開始</span></div>
        <div className="panel-body">
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button className="btn">Launch</button>
            <button className="btn-ghost">Cancel</button>
            <span className="tag tag-success">Online</span>
            <span className="led" data-state="ok" />
          </div>
          <CodeBlock>{`<button class="btn">Launch</button>
<button class="btn-ghost">Cancel</button>
<span class="tag tag-success">Online</span>
<span class="led" data-state="ok"></span>`}</CodeBlock>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header"><span>Tailwind Preset (Optional)</span><span className="tag">TW</span></div>
        <div className="panel-body">
          <CodeBlock>{`// tailwind.config.js
import nightwirePreset from '@cativo23/nightwire/tailwind.preset.js'
export default { presets: [nightwirePreset] }`}</CodeBlock>
        </div>
      </div>
    </section>
  );
}
