import { SectionTitle, CodeBlock } from '../components/CodeBlock';
import { NewBadge } from '../components/NewBadge';

export function DataPage() {
  return (
    <section id="data">
      <SectionTitle tag="データ">Data Display</SectionTitle>

      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Metrics Grid</span><span className="tag">指標</span></div>
        <div className="metrics-grid">
          <div className="metric-cell"><div className="m-label">Sync Ratio</div><div className="m-value">48.2%</div><div className="m-sub">Unit-01</div></div>
          <div className="metric-cell highlight"><div className="m-label">Buffer</div><div className="m-value">93.0%</div><div className="m-sub">Nominal</div></div>
          <div className="metric-cell"><div className="m-label">Response Time</div><div className="m-value">12.4ms</div><div className="m-sub">p99 latency</div></div>
          <div className="metric-cell"><div className="m-label">Throughput</div><div className="m-value" style={{ color: 'var(--nw-cyan)' }}>847K</div><div className="m-sub">tokens/sec</div></div>
        </div>
        <CodeBlock>{`<div class="metrics-grid">
  <div class="metric-cell">
    <div class="m-label">Sync Ratio</div>
    <div class="m-value">48.2%</div>
    <div class="m-sub">Unit-01</div>
  </div>
  <div class="metric-cell highlight">
    <div class="m-label">Buffer</div>
    <div class="m-value">93.0%</div>
    <div class="m-sub">Nominal</div>
  </div>
</div>`}</CodeBlock>
      </div>

      <div className="grid-2" style={{ gap: 2 }}>
        <div className="panel">
          <div className="panel-header"><span>Key-Value</span><span className="tag">KV対</span></div>
          <div className="panel-body">
            <div className="kv-row"><span className="kv-label">System</span><span className="kv-value">Nightwire v1.0</span></div>
            <div className="kv-row"><span className="kv-label">Status</span><span className="kv-value" style={{ color: 'var(--nw-green)' }}>Operational</span></div>
            <div className="kv-row"><span className="kv-label">Framework</span><span className="kv-value">Agnostic</span></div>
            <div className="kv-row"><span className="kv-label">Theme</span><span className="kv-value" style={{ color: 'var(--nw-red)' }}>Dark Only</span></div>
          </div>
          <CodeBlock>{`<div class="kv-row">
  <span class="kv-label">Status</span>
  <span class="kv-value">Operational</span>
</div>`}</CodeBlock>
        </div>

        <div className="panel">
          <div className="panel-header"><span>Progress Bars</span><span className="tag">進捗</span></div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
            <div><div style={{ fontSize: 10, color: 'var(--nw-primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>Loading: 72%</div><div className="nw-progress"><div className="fill" style={{ width: '72%' }} /></div></div>
            <div><div style={{ fontSize: 10, color: 'var(--nw-primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>Sync: 45%</div><div className="nw-progress"><div className="fill" style={{ width: '45%', background: 'var(--nw-primary)' }} /></div></div>
            <div><div style={{ fontSize: 10, color: 'var(--nw-primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>Critical: 91%</div><div className="nw-progress"><div className="fill" style={{ width: '91%', background: 'var(--nw-red)' }} /></div></div>
          </div>
          <CodeBlock>{`<div class="nw-progress">
  <div class="fill" style="width: 72%"></div>
</div>`}</CodeBlock>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 2, marginTop: 2 }}>
        <div className="panel-header">
          <span>Stat Card with Sparkline <NewBadge /></span>
          <span className="tag">指標カード</span>
        </div>
        <div className="panel-body" style={{ padding: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
            <div className="stat">
              <span className="stat-label">Active Nodes</span>
              <span className="stat-value tabular">487<span style={{ fontSize: '.5em', color: 'var(--nw-text-mute)' }}> / 512</span></span>
              <span className="stat-delta up">▲ 2.1% · 24h</span>
              <svg className="stat-spark" viewBox="0 0 100 24" preserveAspectRatio="none">
                <path className="area" d="M0,18 L24,12 L48,11 L72,5 L100,2 L100,24 L0,24 Z" />
                <path d="M0,18 L24,12 L48,11 L72,5 L100,2" />
              </svg>
            </div>
            <div className="stat">
              <span className="stat-label">Throughput</span>
              <span className="stat-value tabular">1.42M</span>
              <span className="stat-delta up">▲ 12.4% · 1h</span>
              <svg className="stat-spark" viewBox="0 0 100 24" preserveAspectRatio="none">
                <path className="area" d="M0,14 L24,15 L48,8 L72,7 L100,2 L100,24 L0,24 Z" />
                <path d="M0,14 L24,15 L48,8 L72,7 L100,2" />
              </svg>
            </div>
            <div className="stat">
              <span className="stat-label">Error Rate</span>
              <span className="stat-value tabular" style={{ color: 'var(--nw-yellow)' }}>0.21<span style={{ fontSize: '.5em', color: 'var(--nw-text-mute)' }}> %</span></span>
              <span className="stat-delta up" style={{ color: 'var(--nw-yellow)' }}>▲ 0.04 pp</span>
              <svg className="stat-spark" viewBox="0 0 100 24" preserveAspectRatio="none">
                <path className="area" style={{ fill: 'var(--nw-yellow)', opacity: 0.14 }} d="M0,18 L24,15 L48,14 L72,10 L100,6 L100,24 L0,24 Z" />
                <path style={{ stroke: 'var(--nw-yellow)' }} d="M0,18 L24,15 L48,14 L72,10 L100,6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header">
          <span>Code Block with Syntax Tokens <NewBadge /></span>
          <span className="tag">コード</span>
        </div>
        <div className="panel-body">
          <pre className="code-block" style={{ margin: 0 }}>
{``}<span className="tok-c">{`// reconcile fleet state`}</span>{`
`}<span className="tok-k">{`async function`}</span>{` `}<span className="tok-fn">{`reconcile`}</span>{`(nodes) {
  `}<span className="tok-k">{`const`}</span>{` drift = nodes.`}<span className="tok-fn">{`filter`}</span>{`(n => n.lag > `}<span className="tok-n">{`3`}</span>{`);
  `}<span className="tok-k">{`return`}</span>{` drift.`}<span className="tok-fn">{`map`}</span>{`(`}<span className="tok-fn">{`scaleOut`}</span>{`);
}`}
          </pre>
          <div style={{ fontSize: 11, color: 'var(--nw-text-dim)', marginTop: 8 }}>
            Inline code: <code className="code-inline">npx @cativo23/nightwire install</code> · keyboard: <span className="kbd">⌘K</span>
          </div>
          <CodeBlock>{`<pre class="code-block">
  <span class="tok-c">// comment</span>
  <span class="tok-k">async function</span> <span class="tok-fn">reconcile</span>(...)
</pre>

<code class="code-inline">npx install</code>
<span class="kbd">⌘K</span>`}</CodeBlock>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <span>Diff View <NewBadge /></span>
          <span className="tag">差分</span>
        </div>
        <div className="panel-body">
          <div className="diff" style={{ marginBottom: 12 }}>
            <div className="ln"><span className="num">12</span><span className="code-content"> autoscaler:</span></div>
            <div className="ln del"><span className="num">13</span><span className="code-content"> -  replicas: 4</span></div>
            <div className="ln add"><span className="num">13</span><span className="code-content"> +  replicas: 8</span></div>
            <div className="ln del"><span className="num">14</span><span className="code-content"> -  cooldown: 60s</span></div>
            <div className="ln add"><span className="num">14</span><span className="code-content"> +  cooldown: 30s</span></div>
            <div className="ln"><span className="num">15</span><span className="code-content"> region: ap-northeast-1</span></div>
          </div>
          <CodeBlock>{`<div class="diff">
  <div class="ln"><span class="num">12</span><span class="code-content">...</span></div>
  <div class="ln del"><span class="num">13</span><span class="code-content"> -  replicas: 4</span></div>
  <div class="ln add"><span class="num">13</span><span class="code-content"> +  replicas: 8</span></div>
</div>`}</CodeBlock>
        </div>
      </div>
    </section>
  );
}
