import { PageHead } from '../components/PageHead';
import { COMPONENTS } from '../data';

export function ComponentsPage() {
  return (
    <section id="components">
      <PageHead idx="10" label="Component Registry" kanji="UI部品" title="Component Registry" />
      <p style={{ color: 'var(--nw-text-dim)', fontSize: 12, margin: '8px 0 16px', lineHeight: 1.6 }}>
        All components are pure CSS classes. Use them in any framework.
      </p>
      <div className="panel">
        <div className="panel-header"><span>Full Registry</span><span className="kanji">登録簿</span></div>
        <div className="panel-body" style={{ padding: 0 }}>
          <div className="docs-scroll">
            <table className="nw-table">
              <thead><tr><th>Class</th><th>Description</th><th>Variants</th></tr></thead>
              <tbody>
                {COMPONENTS.map(c => (
                  <tr key={c.name}>
                    <td style={{ fontWeight: 700 }}>{c.name}</td>
                    <td style={{ color: 'var(--nw-text-dim)' }}>{c.desc}</td>
                    <td>{c.variants}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
