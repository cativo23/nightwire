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
        className="docs-copy"
        data-copied={copied || undefined}
      >
        {copied ? 'COPIED' : 'COPY'}
      </button>
    </div>
  );
}
