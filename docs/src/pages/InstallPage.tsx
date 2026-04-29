import { CodeBlock } from '../components/CodeBlock';
import { SectionTitle } from '../components/CodeBlock';

export function InstallPage() {
  return (
    <section id="install">
      <SectionTitle tag="導入">Installation</SectionTitle>
      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>AI Skill (Recommended)</span><span className="tag">推奨</span></div>
        <div className="panel-body">
          <CodeBlock>npx nightwire-cli install</CodeBlock>
        </div>
      </div>
      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>CSS Import</span><span className="tag">CSS</span></div>
        <div className="panel-body">
          <CodeBlock>{"@import 'nightwire/nightwire.css';"}</CodeBlock>
        </div>
      </div>
      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Tailwind Preset</span><span className="tag">TW</span></div>
        <div className="panel-body">
          <CodeBlock>{'presets: [require("nightwire/tailwind.preset")]'}</CodeBlock>
        </div>
      </div>
      <div className="panel">
        <div className="panel-header"><span>Load Fonts</span><span className="tag">書体</span></div>
        <div className="panel-body">
          <CodeBlock>{`<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Display:wght@700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Saira+Extra+Condensed:wght@400;600;700;800&family=Shippori+Mincho+B1:wght@500;700;800&display=swap" rel="stylesheet">`}</CodeBlock>
        </div>
      </div>
    </section>
  );
}
