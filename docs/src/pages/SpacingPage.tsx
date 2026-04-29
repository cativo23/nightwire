import { SectionTitle, CodeBlock } from '../components/CodeBlock';

export function SpacingPage() {
  return (
    <section id="spacing">
      <SectionTitle tag="スペーシング">Spacing Scale</SectionTitle>
      <div className="panel">
        <div className="panel-header"><span>Scale Options — 4px Base</span><span className="tag">間隔</span></div>
        <div className="panel-body" style={{ padding: 0 }}>
          <table className="nw-table">
            <thead><tr><th>Token</th><th>Value</th><th>Visual</th></tr></thead>
            <tbody>
              {[
                { token: '--sp-1', val: '4px' }, { token: '--sp-2', val: '8px' },
                { token: '--sp-3', val: '12px' }, { token: '--sp-4', val: '16px' },
                { token: '--sp-6', val: '24px' }, { token: '--sp-8', val: '32px' },
                { token: '--sp-12', val: '48px' }, { token: '--sp-16', val: '64px' },
              ].map(s => (
                <tr key={s.token}>
                  <td style={{ color: 'var(--nw-cyan)' }}>{s.token}</td>
                  <td>{s.val}</td>
                  <td><div style={{ height: 4, width: parseInt(s.val), background: 'var(--nw-green)', boxShadow: '0 0 4px rgba(122,237,122,0.3)' }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="panel" style={{ marginTop: 2 }}>
        <div className="panel-header"><span>Usage</span><span className="tag">使用例</span></div>
        <div className="panel-body">
          <CodeBlock>{`padding: var(--sp-3) var(--sp-4);  /* 12px 16px */
gap: var(--sp-2);                  /* 8px */
margin-bottom: var(--sp-6);        /* 24px */`}</CodeBlock>
        </div>
      </div>
    </section>
  );
}
