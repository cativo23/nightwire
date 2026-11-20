import { CodeBlock } from '../components/CodeBlock';
import { PageHead } from '../components/PageHead';
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
  const shown = new Set([...surfaces, ...text, ...roles, ...lines]);
  const others = LAYER2_TOKENS.filter(t => !shown.has(t));

  const renderTable = (title: string, kanji: string, rows: typeof LAYER2_TOKENS) => (
    <div className="panel" style={{ marginBottom: 2 }}>
      <div className="panel-header"><span>{title}</span><span className="kanji">{kanji}</span></div>
      <div className="panel-body" style={{ padding: 0 }}>
        <div className="docs-scroll">
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
                  <td>{r.token}</td>
                  <td>{r.maps}</td>
                  <td style={{ color: 'var(--nw-text-dim)' }}>{r.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <section id="layer2-tokens">
      <PageHead idx="09" label="Layer 2 Semantic Tokens" kanji="意味層" title="Layer 2 Semantic Tokens" />
      <p style={{ color: 'var(--nw-text-dim)', fontSize: 13, margin: '8px 0 16px', lineHeight: 1.6 }}>
        Layer 1 holds the primitives (<code className="code-inline">--nw-primary</code> is "the blue"). Layer 2
        names the roles (<code className="code-inline">--nw-chrome</code> is "the focus and accent color") and
        references Layer 1, so overriding a primitive reaches every consumer of the role automatically.
        Reach for a Layer 2 token in your own CSS; Layer 1 names stay available.
      </p>

      {renderTable('Surfaces', 'サーフェス', surfaces)}
      {renderTable('Text tiers', '文字階層', text)}
      {renderTable('Semantic roles', '役割', roles)}
      {renderTable('Lines', '線', lines)}
      {renderTable('Action, structure and effects', '効果', others)}

      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Motion vocabulary</span><span className="kanji">動き</span></div>
        <div className="panel-body" style={{ padding: 0 }}>
          <div className="docs-scroll">
            <table className="nw-table">
              <thead>
                <tr><th>Token</th><th>Value</th><th>Use</th></tr>
              </thead>
              <tbody>
                {MOTION_VOCAB.map(m => (
                  <tr key={m.token}>
                    <td>{m.token}</td>
                    <td style={{ fontSize: 11 }}>{m.value}</td>
                    <td style={{ color: 'var(--nw-text-dim)' }}>{m.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header"><span>Usage</span><span className="kanji">使用例</span></div>
        <div className="panel-body">
          <CodeBlock>{`/* Prefer semantic over primitive */
.my-button {
  background: var(--nw-chrome);
  color:      var(--nw-text-on-fill);
  transition: background var(--nw-tick);
}

.my-stat {
  color: var(--nw-data);
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
