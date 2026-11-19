import { CodeBlock } from '../components/CodeBlock';
import { SectionTitle } from '../components/CodeBlock';

export function InstallPage() {
  return (
    <section id="install">
      <SectionTitle kanji="導入">Installation</SectionTitle>
      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>AI Skill (Recommended)</span><span className="kanji">推奨</span></div>
        <div className="panel-body">
          <CodeBlock>npx @cativo23/nightwire install</CodeBlock>
        </div>
      </div>
      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>CSS Import</span><span className="tag">CSS</span></div>
        <div className="panel-body">
          <CodeBlock>{"@import '@cativo23/nightwire/nightwire.css';"}</CodeBlock>
        </div>
      </div>
      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Tailwind Preset</span><span className="tag">TW</span></div>
        <div className="panel-body">
          <CodeBlock>{`import nightwirePreset from '@cativo23/nightwire/tailwind.preset.js'
export default { presets: [nightwirePreset] }`}</CodeBlock>
        </div>
      </div>
      <div className="panel">
        <div className="panel-header"><span>Load Fonts</span><span className="kanji">書体</span></div>
        <div className="panel-body">
          <CodeBlock>{`<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Display:wght@700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Saira+Extra+Condensed:wght@400;600;700;800&family=Shippori+Mincho+B1:wght@500;700;800&display=swap" rel="stylesheet">`}</CodeBlock>
        </div>
      </div>
    </section>
  );
}
