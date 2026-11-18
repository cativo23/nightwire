import { SectionTitle, CodeBlock } from '../components/CodeBlock';

export function TokensPage() {
  return (
    <section id="tokens">
      <SectionTitle tag="設計変数">Design Tokens</SectionTitle>
      <p style={{ color: 'var(--nw-text-dim)', fontSize: 12, margin: '8px 0 16px', lineHeight: 1.6 }}>
        All styles are defined by CSS variables. Framework-agnostic and easy to consume for AI agents.
      </p>
      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Token Registry</span><span className="tag">全変数</span></div>
        <div className="panel-body" style={{ padding: 0 }}>
          <table className="nw-table">
            <thead><tr><th>Token</th><th>Value</th><th>Usage</th></tr></thead>
            <tbody>
              {[
                { t: '--sp-1', v: '4px', u: 'Minimum gap' }, { t: '--sp-2', v: '8px', u: 'Base spacing' },
                { t: '--sp-4', v: '16px', u: 'Standard padding' }, { t: '--sp-8', v: '32px', u: 'Large section gap' },
                { t: '--text-xs', v: '11px', u: 'Tiny metadata' }, { t: '--text-sm', v: '12px', u: 'Small labels' },
                { t: '--text-base', v: '14px', u: 'Base body text' }, { t: '--text-xl', v: '20px', u: 'Large metrics' },
                { t: '--ls-wide', v: '0.06em', u: 'Wide letter spacing' }, { t: '--ls-ultra', v: '0.2em', u: 'Title tracking' },
              ].map(r => (
                <tr key={r.t}>
                  <td style={{ color: 'var(--nw-cyan)' }}>{r.t}</td>
                  <td>{r.v}</td>
                  <td style={{ color: 'var(--nw-text-dim)' }}>{r.u}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="panel">
        <div className="panel-header"><span>Usage</span><span className="tag">使用例</span></div>
        <div className="panel-body">
          <CodeBlock>{`/* Reference tokens in your CSS */
.my-component {
  padding: var(--sp-3) var(--sp-4);
  font-size: var(--text-sm);
  color: var(--nw-primary);
  background: var(--void-warm);
  letter-spacing: var(--ls-wide);
}`}</CodeBlock>
        </div>
      </div>
    </section>
  );
}
