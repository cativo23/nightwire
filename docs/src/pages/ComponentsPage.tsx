import { SectionTitle } from '../components/CodeBlock';
import { COMPONENTS } from '../data';

export function ComponentsPage() {
  return (
    <section id="components">
      <SectionTitle tag="UI部品">Component Registry</SectionTitle>
      <p style={{ color: 'var(--nw-text-dim)', fontSize: 12, margin: '8px 0 16px', lineHeight: 1.6 }}>
        All components are pure CSS classes. Use them in any framework.
      </p>
      <div className="panel">
        <div className="panel-header"><span>Full Registry</span><span className="tag">登録簿</span></div>
        <div className="panel-body" style={{ padding: 0 }}>
          <table className="nw-table">
            <thead><tr><th>Class</th><th>Description</th><th>Variants</th></tr></thead>
            <tbody>
              {COMPONENTS.map(c => (
                <tr key={c.name}>
                  <td style={{ color: 'var(--nw-cyan)', fontWeight: 700 }}>{c.name}</td>
                  <td style={{ color: 'var(--nw-text-dim)' }}>{c.desc}</td>
                  <td>{c.variants}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
