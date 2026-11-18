import { CodeBlock } from '../components/CodeBlock';
import { SectionTitle } from '../components/CodeBlock';
import { COLORS } from '../data';

export function ColorsPage() {
  return (
    <section id="colors">
      <SectionTitle tag="パレット">Color Palette</SectionTitle>
      <p style={{ color: 'var(--nw-text-dim)', fontSize: 12, margin: '8px 0 16px', lineHeight: 1.6 }}>
        Semantic neon color system. Every color has a strict role. Pure decorative usage is strictly prohibited.
      </p>
      <div className="panel">
        <div className="panel-header"><span>Full Palette</span><span className="tag">色彩</span></div>
        <div className="panel-body">
          {COLORS.map(c => (
            <div className="color-swatch" key={c.name}>
              <div className="swatch-chip" style={{ background: c.hex }} />
              <span className="swatch-name">{c.name}</span>
              <span className="swatch-hex">{c.hex}</span>
              <span className="swatch-var">{c.variable}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="panel" style={{ marginTop: 2 }}>
        <div className="panel-header"><span>Color Metrics</span><span className="tag">指標</span></div>
        <div className="metrics-grid">
          {COLORS.filter(c => !c.name.startsWith('void')).map(c => (
            <div className="metric-cell" key={c.name}>
              <div className="m-label">{c.name}</div>
              <div className="m-value" style={{ color: c.hex, textShadow: `0 0 6px ${c.hex}40` }}>{c.hex}</div>
              <div className="m-sub">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="panel" style={{ marginTop: 2 }}>
        <div className="panel-header"><span>Usage Example</span><span className="tag">使用例</span></div>
        <div className="panel-body">
          <CodeBlock>{`/* Use semantic variables, never raw hex */
color: var(--nw-primary);      /* headers, links, focus */
color: var(--nw-green);        /* data values, success */
color: var(--nw-red);          /* errors, danger actions */
background: var(--nw-primary-fill); /* subtle tinted bg */`}</CodeBlock>
        </div>
      </div>
    </section>
  );
}
