import { SectionTitle } from '../components/CodeBlock';
import { FONTS } from '../data';

export function TypographyPage() {
  return (
    <section id="typography">
      <SectionTitle tag="タイポグラフィ">Typography Stack</SectionTitle>
      <p style={{ color: 'var(--nw-text-dim)', fontSize: 12, margin: '8px 0 16px', lineHeight: 1.6 }}>
        Four distinct font families form the visual hierarchy. Helvetica is not permitted.
      </p>
      {FONTS.map(f => (
        <div className="panel" style={{ marginBottom: 2 }} key={f.name}>
          <div className="panel-header"><span>{f.name}</span><span className="tag">{f.role}</span></div>
          <div className="node-card">
            <div className="nc-id" style={{ fontSize: 14 }}>{f.name}</div>
            <div className="nc-name" style={{ fontFamily: `var(${f.variable})`, fontSize: 22 }}>{f.sample}</div>
            <div className="nc-row"><span className="lbl">Variable</span><span className="val">{f.variable}</span></div>
            <div className="nc-row"><span className="lbl">Role</span><span className="val">{f.role}</span></div>
            <div className="nc-row"><span className="lbl">Preview</span><span className="val" style={{ fontFamily: `var(${f.variable})` }}>AaBbCc 012 設計体系</span></div>
          </div>
        </div>
      ))}
    </section>
  );
}
