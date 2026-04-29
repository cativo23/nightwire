import { SectionTitle, CodeBlock } from '../components/CodeBlock';

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
    </section>
  );
}
