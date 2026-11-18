import { useState } from 'react';

export function CodeBlock({ children }: { children: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ position: 'relative' }}>
      <pre style={{ paddingRight: 64 }}>{children}</pre>
      <button
        onClick={copy}
        style={{
          position: 'absolute', top: 6, right: 6,
          fontFamily: 'var(--font-stamp)', fontSize: 9, fontWeight: 700,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: copied ? 'var(--nw-green)' : 'var(--nw-primary)',
          background: 'var(--void-raised)', border: '1px solid currentColor',
          padding: '2px 8px', cursor: 'pointer', transition: 'color 0.15s',
        }}
      >
        {copied ? 'COPIED' : 'COPY'}
      </button>
    </div>
  );
}

export function SectionTitle({ children, tag }: { children: React.ReactNode; tag: string }) {
  return (
    <div className="panel-header" style={{ background: 'var(--void)', marginTop: 0, marginBottom: 2 }}>
      <span>{children}</span>
      <span className="tag">{tag}</span>
    </div>
  );
}
