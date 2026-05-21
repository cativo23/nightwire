import { useEffect, useState } from 'react';
import { SectionTitle, CodeBlock } from '../components/CodeBlock';
import { INTENSITY_MODES } from '../data';

export function IntensityPage() {
  const [mode, setMode] = useState<'archive' | 'operator' | 'combat'>('operator');

  useEffect(() => {
    // Apply intensity to the <html> element so the whole site reacts.
    document.documentElement.dataset.intensity = mode;
    return () => {
      // Reset to default when navigating away.
      document.documentElement.dataset.intensity = 'operator';
    };
  }, [mode]);

  return (
    <section id="intensity">
      <SectionTitle tag="強度">Intensity System</SectionTitle>
      <p style={{ color: 'var(--nw-text-dim)', fontSize: 13, margin: '8px 0 20px', lineHeight: 1.6 }}>
        A single attribute on <code style={{ color: 'var(--nw-green)' }}>&lt;html&gt;</code> reconfigures glow, motion,
        density, padding, kanji visibility, and pulse state across the whole document. Toggle below to see the
        rest of this docs site respond in real time.
      </p>

      {/* Live switcher */}
      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header">
          <span>Try it</span>
          <span className="tag">体験</span>
        </div>
        <div className="panel-body">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {INTENSITY_MODES.map(m => (
              <button
                key={m.id}
                onClick={() => setMode(m.id as typeof mode)}
                className={`btn${mode === m.id ? '' : ' btn-ghost'}`}
                style={{ minWidth: 110 }}
              >
                {m.label}
              </button>
            ))}
          </div>
          <div style={{ marginTop: 16, fontSize: 12, color: 'var(--nw-text-dim)', lineHeight: 1.6 }}>
            {INTENSITY_MODES.find(m => m.id === mode)?.desc}
          </div>
        </div>
      </div>

      {/* Knobs reference */}
      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header">
          <span>Knobs by mode</span>
          <span className="tag">変数</span>
        </div>
        <div className="panel-body" style={{ padding: 0 }}>
          <table className="nw-table">
            <thead>
              <tr>
                <th>Knob</th>
                <th>Archive</th>
                <th>Operator</th>
                <th>Combat</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const allKeys = Array.from(
                  new Set(INTENSITY_MODES.flatMap(m => Object.keys(m.knobs)))
                );
                return allKeys.map(k => (
                  <tr key={k}>
                    <td style={{ color: 'var(--nw-cyan)' }}>{k}</td>
                    {INTENSITY_MODES.map(m => (
                      <td key={m.id} style={{ color: m.id === mode ? 'var(--nw-green)' : 'var(--nw-text-dim)' }}>
                        {(m.knobs as unknown as Record<string, string>)[k] ?? '—'}
                      </td>
                    ))}
                  </tr>
                ));
              })()}
            </tbody>
          </table>
        </div>
      </div>

      {/* Usage */}
      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header">
          <span>Usage</span>
          <span className="tag">使用例</span>
        </div>
        <div className="panel-body">
          <p style={{ fontSize: 13, color: 'var(--nw-text-dim)', marginTop: 0, marginBottom: 12, lineHeight: 1.6 }}>
            Set the attribute at the root. All v2 components and any consumer that reads <code style={{ color: 'var(--nw-green)' }}>--nw-*</code> knobs will
            respond automatically.
          </p>
          <CodeBlock>{`<!-- Docs site, blog post -->
<html data-intensity="archive">

<!-- Default (same as no attribute) -->
<html data-intensity="operator">

<!-- Ops console, monitoring dashboard -->
<html data-intensity="combat">`}</CodeBlock>
        </div>
      </div>

      {/* When to use */}
      <div className="panel">
        <div className="panel-header">
          <span>When to use which</span>
          <span className="tag">指針</span>
        </div>
        <div className="panel-body" style={{ padding: 0 }}>
          <table className="nw-table">
            <thead>
              <tr>
                <th>Context</th>
                <th>Recommendation</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Blog post, portfolio, documentation</td><td><span className="tag" style={{ background: 'transparent' }}>archive</span></td></tr>
              <tr><td>Default Nightwire look</td><td><span className="tag" style={{ background: 'transparent' }}>operator</span></td></tr>
              <tr><td>Ops console, monitoring dashboard</td><td><span className="tag" style={{ background: 'transparent' }}>combat</span></td></tr>
              <tr><td>User-toggleable (let users pick)</td><td>Expose all 3 in a segmented control</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
