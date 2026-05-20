import { SectionTitle, CodeBlock } from '../components/CodeBlock';
import { LAYER2_TOKENS, MOTION_VOCAB } from '../data';

export function Layer2TokensPage() {
  const surfaces = LAYER2_TOKENS.filter(t => t.token.startsWith('--nw-surface'));
  const text = LAYER2_TOKENS.filter(t => t.token.startsWith('--nw-text'));
  const roles = LAYER2_TOKENS.filter(t =>
    t.token.startsWith('--nw-chrome') ||
    t.token.startsWith('--nw-data') ||
    t.token.startsWith('--nw-signal') ||
    t.token.startsWith('--nw-ai')
  );
  const lines = LAYER2_TOKENS.filter(t => t.token.startsWith('--nw-line'));

  const renderTable = (title: string, kanji: string, rows: typeof LAYER2_TOKENS) => (
    <div className="panel" style={{ marginBottom: 2 }}>
      <div className="panel-header"><span>{title}</span><span className="tag">{kanji}</span></div>
      <div className="panel-body" style={{ padding: 0 }}>
        <table className="nw-table">
          <thead>
            <tr>
              <th>Token</th>
              <th>Maps to</th>
              <th>Use</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.token}>
                <td style={{ color: 'var(--nw-cyan)' }}>{r.token}</td>
                <td style={{ color: 'var(--nw-green)' }}>{r.maps}</td>
                <td style={{ color: 'var(--nw-text-dim)' }}>{r.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <section id="layer2-tokens">
      <SectionTitle tag="意味層">Layer 2 Semantic Tokens</SectionTitle>
      <p style={{ color: 'var(--nw-text-dim)', fontSize: 13, margin: '8px 0 16px', lineHeight: 1.6 }}>
        v1 mixes primitives and semantics in one layer (<code style={{ color: 'var(--nw-green)' }}>--nw-primary</code> is both
        "the blue" and "UI chrome color"). v2 separates concerns. Layer 2 tokens reference Layer 1, so a v1 override
        propagates to v2 consumers automatically. <strong>Zero rename</strong> — Layer 1 names stay untouched.
      </p>

      {renderTable('Surfaces', 'サーフェス', surfaces)}
      {renderTable('Text tiers', '文字階層', text)}
      {renderTable('Semantic roles', '役割', roles)}
      {renderTable('Lines', '線', lines)}

      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Motion vocabulary</span><span className="tag">動き</span></div>
        <div className="panel-body" style={{ padding: 0 }}>
          <table className="nw-table">
            <thead>
              <tr><th>Token</th><th>Value</th><th>Use</th></tr>
            </thead>
            <tbody>
              {MOTION_VOCAB.map(m => (
                <tr key={m.token}>
                  <td style={{ color: 'var(--nw-cyan)' }}>{m.token}</td>
                  <td style={{ color: 'var(--nw-green)', fontSize: 11 }}>{m.value}</td>
                  <td style={{ color: 'var(--nw-text-dim)' }}>{m.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header"><span>Usage</span><span className="tag">使用例</span></div>
        <div className="panel-body">
          <CodeBlock>{`/* Prefer semantic over primitive */
.my-button {
  background: var(--nw-chrome);          /* was: var(--nw-primary)     */
  color:      var(--nw-text-on-fill);    /* was: var(--void)           */
  transition: background var(--nw-tick); /* was: 150ms ease            */
}

.my-stat {
  color: var(--nw-data);                 /* was: var(--nw-green)       */
  text-shadow: 0 0 calc(8px * var(--nw-glow)) rgba(122,237,122,.5);
}

.my-alert {
  border-left: 2px solid var(--nw-signal-error);
  color: var(--nw-signal-error);
}`}</CodeBlock>
        </div>
      </div>
    </section>
  );
}
