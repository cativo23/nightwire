import { useState, useEffect, useRef } from 'react';

const COLORS = [
  { name: 'void', hex: '#000000', variable: '--void', desc: 'Primary background — absolute void' },
  { name: 'void-warm', hex: '#0a0a0a', variable: '--void-warm', desc: 'Panel fill' },
  { name: 'void-panel', hex: '#111111', variable: '--void-panel', desc: 'Inset surfaces & inputs' },
  { name: 'void-raised', hex: '#1a1a1a', variable: '--void-raised', desc: 'Elevated elements' },
  { name: 'primary', hex: '#6699ff', variable: '--nw-primary', desc: 'Headers & focus rings' },
  { name: 'green', hex: '#7aed7a', variable: '--nw-green', desc: 'Data & success states' },
  { name: 'cyan', hex: '#66ddff', variable: '--nw-cyan', desc: 'Wireframes & info' },
  { name: 'red', hex: '#ff6688', variable: '--nw-red', desc: 'Alerts & critical errors' },
  { name: 'yellow', hex: '#e8993a', variable: '--nw-yellow', desc: 'Warnings & degraded states' },
  { name: 'purple', hex: '#b266e0', variable: '--nw-purple', desc: 'Accents & AI elements' },
];

const FONTS = [
  { name: 'JetBrains Mono', variable: '--font-sys', role: 'System & Data', sample: 'SYNC_RATIO: 48.2%' },
  { name: 'Noto Serif Display', variable: '--font-title', role: 'Compressed Titles', sample: 'NIGHTWIRE' },
  { name: 'Saira Extra Condensed', variable: '--font-stamp', role: 'Tags & Stamps', sample: 'OPERATIONAL' },
  { name: 'Shippori Mincho B1', variable: '--font-mincho', role: 'Japanese Accents', sample: '設計体系文書' },
];

const COMPONENTS = [
  { name: '.btn', desc: 'Primary button', variants: '.btn-ghost, .btn-danger, .btn-sm' },
  { name: '.panel', desc: 'Base container', variants: '.panel-header, .panel-body' },
  { name: '.card', desc: 'Rounded container', variants: '.card-header, .card-body, .card-footer' },
  { name: '.metrics-grid', desc: '2-col data grid', variants: '.metric-cell, .m-label, .m-value, .m-sub' },
  { name: '.nw-table', desc: 'Data table', variants: 'th, td, td.lbl' },
  { name: '.badge', desc: 'Inline badge', variants: '.badge-success, .badge-danger, .badge-warning' },
  { name: '.tag', desc: 'Status tag', variants: '.tag-success, .tag-danger, .tag-warning, .tag-info' },
  { name: '.led', desc: 'Status indicator', variants: '.green, .blue, .red, .yellow, .blink' },
  { name: '.toast', desc: 'Notification', variants: '.toast-success, .toast-danger, .toast-warning' },
  { name: '.sidebar', desc: 'Side navigation', variants: '.sidebar-header, .sidebar-section, .sidebar-item' },
  { name: '.tabs', desc: 'Tab bar', variants: '.tab, .tab.active, .tab-panel' },
  { name: '.nw-progress', desc: 'Progress bar', variants: '.fill' },
  { name: '.modal', desc: 'Dialog overlay', variants: '.modal-backdrop, .modal-header, .modal-body' },
  { name: '.kv-row', desc: 'Key-value pair', variants: '.kv-label, .kv-value' },
  { name: '.skeleton', desc: 'Loading state', variants: '.skeleton-text, .skeleton-heading, .skeleton-block' },
  { name: '.compressed-title', desc: 'scaleX(0.82) serif', variants: 'standalone class' },
];

const SIDEBAR_ITEMS = [
  { id: 'overview', label: 'Overview', kanji: '概要' },
  { id: 'quickstart', label: 'Quick Start', kanji: 'クイック' },
  { id: 'install', label: 'Installation', kanji: '導入' },
  { id: 'tokens', label: 'Design Tokens', kanji: '設計変数' },
  { id: 'colors', label: 'Color Palette', kanji: 'パレット' },
  { id: 'typography', label: 'Typography', kanji: 'タイポ' },
  { id: 'surfaces', label: 'Surface Hierarchy', kanji: 'サーフェス' },
  { id: 'spacing', label: 'Spacing Scale', kanji: 'スペース' },
  { id: 'components', label: 'Component Registry', kanji: 'UI部品' },
  { id: 'buttons', label: 'Buttons & Actions', kanji: '操作' },
  { id: 'data', label: 'Data Display', kanji: 'データ' },
  { id: 'feedback', label: 'Feedback & Status', kanji: '応答' },
  { id: 'panels', label: 'Panel Anatomy', kanji: '構造' },
  { id: 'more-components', label: 'More Components', kanji: '追加部品' },
  { id: 'templates', label: 'Layout Templates', kanji: '型紙' },
  { id: 'examples', label: 'Live Examples', kanji: 'デモ' },
];

type EventEntry = { time: string; type: string; detail: string; metric: string };

function makeEvent(): EventEntry {
  const types = ['system', 'render', 'token', 'build', 'warning'];
  const details = [
    'Component tree reconciled', 'Token palette validated', 'Panel layout recalculated',
    'Waveform buffer flushed', 'Metrics grid recomputed', 'Font stack loaded: 4/4',
    'CSS custom properties: 42 active', 'Design token sync complete', 'Surface hierarchy verified',
    'Glow shader compiled', 'DOM elements mounted'
  ];
  const t = types[Math.floor(Math.random() * types.length)];
  const d = details[Math.floor(Math.random() * details.length)];
  const now = new Date();
  const ts = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const ms = String(now.getMilliseconds()).padStart(3, '0');
  return { time: `${ts}.${ms}`, type: t, detail: d, metric: `${(Math.random() * 100).toFixed(1)}ms` };
}

function useTime() {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(id); }, []);
  return time;
}

function Ticker() {
  return (
    <div className="ticker">
      <div className="scroll">
        NIGHTWIRE DESIGN SYSTEM v1.0 &nbsp;│&nbsp; 設計体系運用中 &nbsp;│&nbsp;
        VOID: #000000 &nbsp;│&nbsp; PRIMARY: #6699FF &nbsp;│&nbsp; GREEN: #7AED7A &nbsp;│&nbsp;
        CYAN: #66DDFF &nbsp;│&nbsp; RED: #FF6688 &nbsp;│&nbsp; YELLOW: #E8993A &nbsp;│&nbsp; PURPLE: #B266E0 &nbsp;│&nbsp;
        COMPONENTS: 24+ &nbsp;│&nbsp; TOKENS: 42 &nbsp;│&nbsp;
        FONTS: JETBRAINS MONO ◆ NOTO SERIF DISPLAY ◆ SAIRA EXTRA CONDENSED ◆ SHIPPORI MINCHO B1 &nbsp;│&nbsp;
        FRAMEWORK AGNOSTIC &nbsp;│&nbsp; AI-FIRST DESIGN &nbsp;│&nbsp; DARK MODE ONLY &nbsp;│&nbsp;
        BORDER-RADIUS: 0 &nbsp;│&nbsp; NO DECORATIVE WASTE &nbsp;│&nbsp; 情報密度最大化 &nbsp;│&nbsp;
      </div>
    </div>
  );
}

function StatusBar() {
  const time = useTime();
  return (
    <div className="status-bar">
      <span><span className="led green" /> NIGHTWIRE DOCS — ONLINE</span>
      <span>COMPONENTS: 24 &nbsp;│&nbsp; TOKENS: 42 &nbsp;│&nbsp; CSS CLASSES: 60+</span>
      <span>{time.toLocaleTimeString('en-US', { hour12: false })} JST</span>
    </div>
  );
}

function Waveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [readout, setReadout] = useState('0.00');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let t = 0;
    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w; canvas.height = h;
      ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, w, h);
      const waves = [
        { color: 'rgba(122,237,122,0.7)', freq: 0.02, amp: 0.25, speed: 0.03, phase: 0 },
        { color: 'rgba(102,221,255,0.5)', freq: 0.015, amp: 0.2, speed: 0.02, phase: 2 },
        { color: 'rgba(102,153,255,0.4)', freq: 0.025, amp: 0.15, speed: 0.04, phase: 4 },
      ];
      for (const wave of waves) {
        ctx.beginPath(); ctx.strokeStyle = wave.color; ctx.lineWidth = 1.5;
        for (let x = 0; x < w; x++) {
          const y = h / 2 + Math.sin(x * wave.freq + t * wave.speed + wave.phase) * h * wave.amp
            + Math.sin(x * wave.freq * 2.3 + t * wave.speed * 1.7) * h * wave.amp * 0.3;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(102,153,255,0.06)'; ctx.lineWidth = 1;
      for (let y = 0; y < h; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      t++;
      setReadout((Math.sin(t * 0.03) * 50 + 50).toFixed(1));
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="waveform-wrap" style={{ height: 120 }}>
      <canvas ref={canvasRef} />
      <span className="readout-label">Signal Analysis — 信号解析</span>
      <span className="readout">{readout}%</span>
      <span className="timecode">LIVE</span>
      <div className="legend">
        <span style={{ color: 'var(--nw-green)' }}>&#9679; design</span>
        <span style={{ color: 'var(--nw-cyan)' }}>&#9679; tokens</span>
        <span style={{ color: 'var(--nw-primary)' }}>&#9679; layout</span>
      </div>
    </div>
  );
}

function SectionTitle({ children, tag }: { children: React.ReactNode; tag: string }) {
  return (
    <div className="panel-header" style={{ background: 'var(--void)', marginTop: 0, marginBottom: 2 }}>
      <span>{children}</span>
      <span className="tag">{tag}</span>
    </div>
  );
}

function QuickStartSection() {
  return (
    <section id="quickstart">
      <div style={{ marginBottom: 16 }}>
        <div className="compressed-title" style={{ fontSize: 28, color: 'var(--nw-green)', lineHeight: 1 }}>QUICK START</div>
        <div style={{ fontFamily: 'var(--font-mincho)', fontSize: 13, fontWeight: 800, color: 'var(--nw-green-dim)', marginTop: 2 }}>クイックスタート</div>
        <p style={{ color: 'var(--nw-text-dim)', fontSize: 13, marginTop: 10, lineHeight: 1.6 }}>
          Get Nightwire running in 3 steps. Works with any framework or plain HTML.
        </p>
      </div>

      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Step 1 — Add the CSS</span><span className="tag">CSS読込</span></div>
        <div className="panel-body">
          <pre>{`<link rel="stylesheet" href="nightwire.css">`}</pre>
          <div style={{ fontSize: 9, color: 'var(--nw-text-dim)', marginTop: 6 }}>Or via npm: <code style={{ color: 'var(--nw-cyan)' }}>npm install nightwire-css</code></div>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Step 2 — Load the Fonts</span><span className="tag">書体読込</span></div>
        <div className="panel-body">
          <pre>{`<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+Display:wght@700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Saira+Extra+Condensed:wght@400;600;700;800&family=Shippori+Mincho+B1:wght@500;700;800&display=swap" rel="stylesheet">`}</pre>
        </div>
      </div>

      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Step 3 — Use a Component</span><span className="tag">使用開始</span></div>
        <div className="panel-body">
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button className="btn">Launch</button>
            <button className="btn-ghost">Cancel</button>
            <span className="tag tag-success">Online</span>
            <span className="led green" />
          </div>
          <pre>{`<button class="btn">Launch</button>
<button class="btn-ghost">Cancel</button>
<span class="tag tag-success">Online</span>
<span class="led green"></span>`}</pre>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header"><span>Tailwind Preset (Optional)</span><span className="tag">TW</span></div>
        <div className="panel-body">
          <pre>{`// tailwind.config.js
import nightwirePreset from 'nightwire/tailwind.preset.js'
export default { presets: [nightwirePreset] }`}</pre>
        </div>
      </div>
    </section>
  );
}

function OverviewSection() {
  return (
    <section id="overview">
      <div style={{ marginBottom: 16 }}>
        <div className="compressed-title" style={{ fontSize: 36, color: 'var(--nw-primary)', lineHeight: 1 }}>NIGHTWIRE</div>
        <div style={{ fontFamily: 'var(--font-mincho)', fontSize: 16, fontWeight: 800, color: 'var(--nw-primary-dim)', marginTop: 2 }}>暗黒専用サイバーパンク設計体系</div>
        <p style={{ color: 'var(--nw-text-dim)', fontSize: 13, marginTop: 12, maxWidth: 600, lineHeight: 1.6 }}>
          A framework-agnostic, dark-mode-only UI design system optimized for AI-driven development.
          Built on the absolute void <code style={{ color: 'var(--nw-green)' }}>#000000</code> with semantic neon accents.
        </p>
      </div>

      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>System Overview</span><span className="tag">概要</span></div>
        <div className="metrics-grid">
          <div className="metric-cell">
            <div className="m-label">Design Tokens</div>
            <div className="m-value">42</div>
            <div className="m-sub">CSS custom properties</div>
          </div>
          <div className="metric-cell">
            <div className="m-label">Component Classes</div>
            <div className="m-value">24+</div>
            <div className="m-sub">pure CSS components</div>
          </div>
          <div className="metric-cell highlight">
            <div className="m-label">Surface Layers</div>
            <div className="m-value">4</div>
            <div className="m-sub">void → raised</div>
          </div>
          <div className="metric-cell">
            <div className="m-label">Font Families</div>
            <div className="m-value">4</div>
            <div className="m-sub">sys, title, stamp, mincho</div>
          </div>
          <div className="metric-cell">
            <div className="m-label">Border Radius</div>
            <div className="m-value" style={{ color: 'var(--nw-red)' }}>0px</div>
            <div className="m-sub">zero tolerance</div>
          </div>
          <div className="metric-cell">
            <div className="m-label">Spacing Base</div>
            <div className="m-value">4px</div>
            <div className="m-sub">8-step scale</div>
          </div>
        </div>
      </div>

      <Waveform />

      <div className="panel" style={{ marginTop: 2 }}>
        <div className="panel-header"><span>MAGI Design Principles</span><span className="tag">設計哲学</span></div>
        <div className="panel-body">
          <div className="magi-oracle">
            {[
              { id: 'MELCHIOR', name: 'Void First', value: 'Pure #000000 backgrounds. No grays, no gradients, no noise.', status: 'agree' },
              { id: 'BALTHASAR', name: 'Data Density', value: 'Every pixel conveys information. No decorative waste.', status: 'agree' },
              { id: 'CASPER', name: 'Neon Discipline', value: 'Semantic color only. Green=data, Blue=UI, Red=danger, Cyan=info.', status: 'agree' },
            ].map((p) => (
              <div className="magi-source" key={p.id}>
                <div className="ms-name">{p.id}</div>
                <div className="ms-value">{p.name}</div>
                <div className="ms-meta">{p.value}</div>
                <div className={`ms-status ${p.status}`}>{p.status.toUpperCase()}</div>
              </div>
            ))}
            <div className="magi-consensus">
              Consensus: <span style={{ color: 'var(--nw-green)' }}>UNANIMOUS — VOID-FIRST DESIGN APPROVED</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TokensSection() {
  return (
    <section id="tokens">
      <SectionTitle tag="設計変数">Design Tokens</SectionTitle>
      <p style={{ color: 'var(--nw-text-dim)', fontSize: 12, margin: '8px 0 16px', lineHeight: 1.6 }}>
        All styles are defined by CSS variables. This makes the system framework-agnostic and easy to consume for AI agents.
      </p>
      <div className="panel">
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
    </section>
  );
}

function ColorsSection() {
  return (
    <section id="colors">
      <SectionTitle tag="パレット">Color Palette</SectionTitle>
      <p style={{ color: 'var(--nw-text-dim)', fontSize: 12, margin: '8px 0 16px', lineHeight: 1.6 }}>
        Semantic neon color system. Every color has a strict role. Pure decorative usage is strictly prohibited.
      </p>
      <div className="panel">
        <div className="panel-header"><span>Full Palette</span><span className="tag">色彩</span></div>
        <div className="panel-body">
          {COLORS.map(c => (
            <div className="color-swatch" key={c.name}>
              <div className="swatch-chip" style={{ background: c.hex }} />
              <span className="swatch-name">{c.name}</span>
              <span className="swatch-hex">{c.hex}</span>
              <span className="swatch-var">{c.variable}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="panel" style={{ marginTop: 2 }}>
        <div className="panel-header"><span>Color Metrics</span><span className="tag">指標</span></div>
        <div className="metrics-grid">
          {COLORS.filter(c => !c.name.startsWith('void')).map(c => (
            <div className="metric-cell" key={c.name}>
              <div className="m-label">{c.name}</div>
              <div className="m-value" style={{ color: c.hex, textShadow: `0 0 6px ${c.hex}40` }}>{c.hex}</div>
              <div className="m-sub">{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TypographySection() {
  return (
    <section id="typography">
      <SectionTitle tag="タイポグラフィ">Typography Stack</SectionTitle>
      <p style={{ color: 'var(--nw-text-dim)', fontSize: 12, margin: '8px 0 16px', lineHeight: 1.6 }}>
        Four distinct font families form the visual hierarchy. Helvetica is not permitted.
      </p>
      {FONTS.map(f => (
        <div className="panel" style={{ marginBottom: 2 }} key={f.name}>
          <div className="panel-header"><span>{f.name}</span><span className="tag">{f.role}</span></div>
          <div className="node-card">
            <div className="nc-id" style={{ fontSize: 14 }}>{f.name}</div>
            <div className="nc-name" style={{ fontFamily: `var(${f.variable})`, fontSize: 22 }}>{f.sample}</div>
            <div className="nc-row"><span className="lbl">Variable</span><span className="val">{f.variable}</span></div>
            <div className="nc-row"><span className="lbl">Role</span><span className="val">{f.role}</span></div>
            <div className="nc-row"><span className="lbl">Preview</span><span className="val" style={{ fontFamily: `var(${f.variable})` }}>AaBbCc 012 設計体系</span></div>
          </div>
        </div>
      ))}
    </section>
  );
}

function SurfacesSection() {
  return (
    <section id="surfaces">
      <SectionTitle tag="サーフェス">Surface Hierarchy</SectionTitle>
      <p style={{ color: 'var(--nw-text-dim)', fontSize: 12, margin: '8px 0 16px', lineHeight: 1.6 }}>
        Four levels of dark surfaces, stepping slightly away from the absolute void.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {[
          { name: 'void', hex: '#000000', desc: 'Page background — the absolute void' },
          { name: 'void-warm', hex: '#0a0a0a', desc: 'Panel fill — barely visible warmth' },
          { name: 'void-panel', hex: '#111111', desc: 'Inset surfaces — inputs, code blocks' },
          { name: 'void-raised', hex: '#1a1a1a', desc: 'Elevated — dropdowns, tooltips' },
        ].map(s => (
          <div key={s.name} style={{ display: 'flex', alignItems: 'stretch' }}>
            <div style={{ width: 100, background: s.hex, border: '1px solid var(--nw-text-faint)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 0' }}>
              <span style={{ fontSize: 9, color: s.hex === '#000000' ? 'var(--nw-text-dim)' : 'var(--nw-text)', letterSpacing: '0.1em' }}>{s.hex}</span>
            </div>
            <div style={{ flex: 1, padding: '10px 12px', background: s.hex, border: '1px solid var(--nw-text-faint)', borderLeft: 0 }}>
              <div style={{ fontSize: 10, color: 'var(--nw-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>--{s.name}</div>
              <div style={{ fontSize: 9, color: 'var(--nw-text-dim)', marginTop: 4 }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SpacingSection() {
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
    </section>
  );
}

function ComponentsSection() {
  return (
    <section id="components">
      <SectionTitle tag="UI部品">Component Registry</SectionTitle>
      <p style={{ color: 'var(--nw-text-dim)', fontSize: 12, margin: '8px 0 16px', lineHeight: 1.6 }}>
        All components are pure CSS classes. Use them in any framework.
      </p>
      <div className="panel">
        <div className="panel-header"><span>Full Registry</span><span className="tag">登録簿</span></div>
        <div className="panel-body" style={{ padding: 0 }}>
          <table className="nw-table">
            <thead><tr><th>Class</th><th>Description</th><th>Variants</th></tr></thead>
            <tbody>
              {COMPONENTS.map(c => (
                <tr key={c.name}>
                  <td style={{ color: 'var(--nw-cyan)', fontWeight: 700 }}>{c.name}</td>
                  <td style={{ color: 'var(--nw-text-dim)' }}>{c.desc}</td>
                  <td>{c.variants}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function ButtonsSection() {
  return (
    <section id="buttons">
      <SectionTitle tag="操作">Buttons & Actions</SectionTitle>
      <div className="panel">
        <div className="panel-header"><span>Button Variants</span><span className="tag">ボタン</span></div>
        <div className="panel-body">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            <button className="btn">Primary</button>
            <button className="btn-ghost">Ghost</button>
            <button className="btn-danger">Danger</button>
            <button className="btn btn-sm">Small</button>
          </div>
          <pre>{`<button class="btn">Primary</button>
<button class="btn-ghost">Ghost</button>
<button class="btn-danger">Danger</button>
<button class="btn btn-sm">Small</button>`}</pre>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 2 }}>
        <div className="panel-header"><span>Tags & Badges</span><span className="tag">標識</span></div>
        <div className="panel-body">
          <div style={{ fontSize: 8, color: 'var(--nw-primary)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Status Tags</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            <span className="tag tag-success">Operational</span>
            <span className="tag tag-danger">Offline</span>
            <span className="tag tag-warning">Degraded</span>
            <span className="tag tag-info">Metadata</span>
          </div>
          <div style={{ fontSize: 8, color: 'var(--nw-primary)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Badges</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
            <span className="badge">Default</span>
            <span className="badge badge-success">Success</span>
            <span className="badge badge-danger">Danger</span>
            <span className="badge badge-warning">Warning</span>
          </div>
          <div style={{ fontSize: 8, color: 'var(--nw-primary)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Status LEDs</div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span><span className="led green" />Green</span>
            <span><span className="led blue" />Blue</span>
            <span><span className="led red" />Red</span>
            <span><span className="led yellow" />Yellow</span>
            <span><span className="led green blink" />Blinking</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function DataSection() {
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
        </div>

        <div className="panel">
          <div className="panel-header"><span>Progress Bars</span><span className="tag">進捗</span></div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div><div style={{ fontSize: 7, color: 'var(--nw-primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>Loading: 72%</div><div className="nw-progress"><div className="fill" style={{ width: '72%' }} /></div></div>
            <div><div style={{ fontSize: 7, color: 'var(--nw-primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>Sync: 45%</div><div className="nw-progress"><div className="fill" style={{ width: '45%', background: 'var(--nw-primary)' }} /></div></div>
            <div><div style={{ fontSize: 7, color: 'var(--nw-primary)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>Critical: 91%</div><div className="nw-progress"><div className="fill" style={{ width: '91%', background: 'var(--nw-red)' }} /></div></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeedbackSection() {
  const [events] = useState<EventEntry[]>(() => Array.from({ length: 15 }, makeEvent));
  return (
    <section id="feedback">
      <SectionTitle tag="応答">Feedback & Status</SectionTitle>

      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Toasts</span><span className="tag">通知</span></div>
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div className="toast toast-success">System synchronization complete. All nodes connected.</div>
          <div className="toast toast-warning">High memory utilization detected. Consider optimizing operations.</div>
          <div className="toast toast-danger">Connection to core server lost. Attempting reconnection.</div>
        </div>
      </div>

      <div className="event-log" style={{ height: 300, marginBottom: 2 }}>
        <div className="el-header">
          <span>Event Log Example</span>
          <span className="el-count">{events.length} entries</span>
        </div>
        <div className="el-body">
          {events.map((ev, i) => (
            <div key={i} className="ev">
              <span className="ev-time">{ev.time}</span>
              <span className={`ev-type ${ev.type}`}>{ev.type}</span>
              <span className="ev-detail">{ev.detail}</span>
              <span className="ev-metric">{ev.metric}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PanelsSection() {
  return (
    <section id="panels">
      <SectionTitle tag="構造">Panel Anatomy</SectionTitle>
      <p style={{ color: 'var(--nw-text-dim)', fontSize: 12, margin: '8px 0 16px', lineHeight: 1.6 }}>
        Panels are the primary structural element. 8px uppercase headers, Japanese stylistic tags, and 2px gaps are standard.
      </p>

      <div className="grid-2" style={{ gap: 2 }}>
        <div className="panel">
          <div className="panel-header"><span>Standard Panel</span><span className="tag">日本語タグ</span></div>
          <div className="panel-body">
            <div style={{ color: 'var(--nw-text-dim)', fontSize: 11 }}>
              Standard panel body. 8px font header, Japanese tags, 2px gaps between panels.
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header">Card Component</div>
          <div className="card-body">
            <div style={{ color: 'var(--nw-text-dim)', fontSize: 11 }}>
              Cards have a border-radius and are intended for isolated content blocks.
            </div>
          </div>
          <div className="card-footer" style={{ fontSize: 9, color: 'var(--nw-text-dim)' }}>Card Footer</div>
        </div>
      </div>

      <div className="panel" style={{ marginTop: 2 }}>
        <div className="panel-header"><span>Node Card</span><span className="tag">ノード</span></div>
        <div className="node-card">
          <div className="nc-id">Cluster-Alpha — H100 x 512</div>
          <div className="nc-name">深層学習訓練クラスタ</div>
          <div className="nc-row"><span className="lbl">Model</span><span className="val">CORTEX-7B v4.2</span></div>
          <div className="nc-row"><span className="lbl">Status</span><span className="val">Training</span></div>
          <div className="nc-row"><span className="lbl">GPU Util</span><span className="val">96.8%</span></div>
          <div className="nc-status" style={{ color: 'var(--nw-green)' }}><span className="led green" /> Operational</div>
        </div>
      </div>

      <pre style={{ marginTop: 8 }}>{`<div class="panel">
  <div class="panel-header">
    <span>Title</span>
    <span class="tag">日本語タグ</span>
  </div>
  <div class="panel-body">Content</div>
</div>`}</pre>
    </section>
  );
}

function MoreComponentsSection() {
  return (
    <section id="more-components">
      <SectionTitle tag="追加部品">More Components</SectionTitle>
      <p style={{ color: 'var(--nw-text-dim)', fontSize: 12, margin: '8px 0 16px', lineHeight: 1.6 }}>
        Additional components available in <code style={{ color: 'var(--nw-cyan)' }}>nightwire.css</code>. All are pure CSS — no JavaScript required.
      </p>

      <div className="grid-2" style={{ gap: 2, marginBottom: 2 }}>
        {/* Modal */}
        <div className="panel">
          <div className="panel-header"><span>Modal / Dialog</span><span className="tag">ダイアログ</span></div>
          <div className="panel-body">
            <div className="modal" style={{ position: 'relative', maxWidth: 360 }}>
              <div className="modal-header">
                <span>Confirm Action</span>
                <button className="btn btn-sm btn-ghost">✕</button>
              </div>
              <div className="modal-body" style={{ fontSize: 12 }}>Are you sure you want to proceed with this operation?</div>
              <div className="modal-footer">
                <button className="btn-ghost btn-sm">Cancel</button>
                <button className="btn-danger btn-sm">Delete</button>
              </div>
            </div>
          </div>
          <pre style={{ margin: 0, borderTop: '1px solid var(--nw-text-faint)', borderRadius: 0 }}>{`<div class="modal-backdrop">
  <div class="modal">
    <div class="modal-header">
      <span>Title</span>
      <button class="btn btn-sm btn-ghost">✕</button>
    </div>
    <div class="modal-body">Content</div>
    <div class="modal-footer">
      <button class="btn-ghost">Cancel</button>
      <button class="btn-danger">Confirm</button>
    </div>
  </div>
</div>`}</pre>
        </div>

        {/* Dropdown */}
        <div className="panel">
          <div className="panel-header"><span>Dropdown</span><span className="tag">ドロップダウン</span></div>
          <div className="panel-body">
            <div className="dropdown" style={{ position: 'relative' }}>
              <button className="btn-ghost btn-sm">Actions ▾</button>
              <div className="dropdown-menu" style={{ position: 'relative', marginTop: 4 }}>
                <button className="dropdown-item">Edit</button>
                <button className="dropdown-item">Duplicate</button>
                <div className="dropdown-divider" />
                <button className="dropdown-item danger">Delete</button>
              </div>
            </div>
          </div>
          <pre style={{ margin: 0, borderTop: '1px solid var(--nw-text-faint)', borderRadius: 0 }}>{`<div class="dropdown">
  <button class="btn-ghost btn-sm">Actions ▾</button>
  <div class="dropdown-menu">
    <button class="dropdown-item">Edit</button>
    <button class="dropdown-item">Duplicate</button>
    <div class="dropdown-divider"></div>
    <button class="dropdown-item danger">Delete</button>
  </div>
</div>`}</pre>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 2 }}>
        {/* Skeleton */}
        <div className="panel">
          <div className="panel-header"><span>Skeleton Loader</span><span className="tag">スケルトン</span></div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="skeleton skeleton-heading" />
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-text" style={{ width: '80%' }} />
            <div className="skeleton skeleton-block" />
          </div>
          <pre style={{ margin: 0, borderTop: '1px solid var(--nw-text-faint)', borderRadius: 0 }}>{`<div class="skeleton skeleton-heading"></div>
<div class="skeleton skeleton-text"></div>
<div class="skeleton skeleton-text" style="width:80%"></div>
<div class="skeleton skeleton-block"></div>`}</pre>
        </div>

        {/* Avatar */}
        <div className="panel">
          <div className="panel-header"><span>Avatar</span><span className="tag">アバター</span></div>
          <div className="panel-body" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <span className="avatar avatar-sm">JD</span>
            <span className="avatar">JD</span>
            <span className="avatar avatar-lg">JD</span>
          </div>
          <pre style={{ margin: 0, borderTop: '1px solid var(--nw-text-faint)', borderRadius: 0 }}>{`<span class="avatar avatar-sm">JD</span>
<span class="avatar">JD</span>
<span class="avatar avatar-lg">JD</span>`}</pre>
        </div>
      </div>
    </section>
  );
}

function TemplatesSection() {
  return (
    <section id="templates">
      <SectionTitle tag="型紙">Layout Templates</SectionTitle>
      <p style={{ color: 'var(--nw-text-dim)', fontSize: 13, margin: '8px 0 16px', lineHeight: 1.6 }}>
        The core <code style={{ color: 'var(--nw-cyan)' }}>nightwire.css</code> system is layout-agnostic, meaning it works for standard scrolling websites, portfolios, and blogs.
        However, if you want to build a dense, full-viewport <strong>Operations Console</strong> (like our demos), use this layout template.
      </p>

      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Operations Console CSS</span><span className="tag">構造CSS</span></div>
        <div className="panel-body" style={{ padding: 0 }}>
          <pre style={{ margin: 0, border: 'none', background: 'transparent' }}>{`/* Add this alongside nightwire.css to build dense dashboard interfaces */

/* 1. Full Viewport Wrapper */
.console-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

/* 2. Top Navigation Bar */
.nw-nav {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: var(--void);
  border-bottom: 1px solid var(--nw-primary-dim);
  flex-shrink: 0;
}

/* 3. The Dense Grid Area */
.dashboard {
  display: flex;
  gap: 2px; /* The signature Nightwire 2px gap */
  flex: 1;
  padding: 2px;
  min-height: 0;
}

/* 4. Column Sizing */
.dash-left {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
}
.dash-right {
  width: 370px;
  min-width: 370px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* 5. Fluid Grid Rows */
.dash-row {
  display: grid;
  gap: 2px;
  flex-shrink: 0;
}
.dash-row.r1 { grid-template-columns: 1.2fr 1fr; min-height: 360px; }
.dash-row.r2 { grid-template-columns: 1fr 1fr; }`}</pre>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header"><span>HTML Structure</span><span className="tag">構造HTML</span></div>
        <div className="panel-body" style={{ padding: 0 }}>
          <pre style={{ margin: 0, border: 'none', background: 'transparent', color: 'var(--nw-green)' }}>{`<div class="console-wrapper">
  <!-- Top Navigation -->
  <nav class="nw-nav">...</nav>

  <!-- 3-Column Layout -->
  <div class="dashboard">
    <div class="dash-left">
      <div class="dash-row r1">
        <div class="panel">...</div>
        <div class="panel">...</div>
      </div>
    </div>

    <div class="dash-right">
      <div class="panel">...</div>
    </div>
  </div>
</div>`}</pre>
        </div>
      </div>
    </section>
  );
}

function ExamplesSection() {
  return (
    <section id="examples">
      <SectionTitle tag="デモ">Live Examples</SectionTitle>
      <div className="grid-2" style={{ gap: 2 }}>
        <div className="panel">
          <div className="panel-header"><span>Alchemix V3 Dashboard</span><span className="tag">デモ</span></div>
          <div className="node-card">
            <div className="nc-id">Dashboard Demo</div>
            <div className="nc-name">錬金術V3運用パネル</div>
            <div className="nc-row"><span className="lbl">Three.js</span><span className="val">3D Globe</span></div>
            <div className="nc-row"><span className="lbl">Metrics</span><span className="val">Live Grid</span></div>
            <div className="nc-row"><span className="lbl">Events</span><span className="val">Streaming Log</span></div>
            <div className="nc-row"><span className="lbl">Waveform</span><span className="val">Canvas 2D</span></div>
            <div className="nc-row"><span className="lbl">MAGI</span><span className="val">Oracle Panel</span></div>
            <div style={{ marginTop: 8 }}>
              <a href="/examples/html/dashboard.html" target="_blank" className="btn btn-sm" style={{ fontSize: 9 }}>Open Demo</a>
            </div>
          </div>
        </div>
        <div className="panel">
          <div className="panel-header"><span>Neural-Ops Center</span><span className="tag">デモ</span></div>
          <div className="node-card">
            <div className="nc-id">Neural Ops Demo</div>
            <div className="nc-name">神経制御システム</div>
            <div className="nc-row"><span className="lbl">Three.js</span><span className="val">Neural Network</span></div>
            <div className="nc-row"><span className="lbl">Heatmap</span><span className="val">Attention Grid</span></div>
            <div className="nc-row"><span className="lbl">Layers</span><span className="val">Activation Bars</span></div>
            <div className="nc-row"><span className="lbl">GPU</span><span className="val">Power Grid</span></div>
            <div style={{ marginTop: 8 }}>
              <a href="/examples/html/neural-ops.html" target="_blank" className="btn btn-sm" style={{ fontSize: 9 }}>Open Demo</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InstallSection() {
  return (
    <section id="install">
      <SectionTitle tag="導入">Installation</SectionTitle>
      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>AI Skill (Recommended)</span><span className="tag">推奨</span></div>
        <div className="panel-body"><pre>npx nightwire-cli install</pre></div>
      </div>
      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>CSS Import</span><span className="tag">CSS</span></div>
        <div className="panel-body"><pre>@import 'nightwire/nightwire.css';</pre></div>
      </div>
      <div className="panel">
        <div className="panel-header"><span>Tailwind Preset</span><span className="tag">TW</span></div>
        <div className="panel-body"><pre>{'presets: [require("nightwire/tailwind.preset")]'}</pre></div>
      </div>
    </section>
  );
}

function Sidebar({ active, onNavigate }: { active: string; onNavigate: (id: string) => void }) {
  return (
    <aside className="sidebar" style={{ width: 220, minWidth: 220, height: '100%', position: 'sticky', top: 0, overflow: 'auto' }}>
      <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="compressed-title" style={{ fontSize: 14, color: 'var(--nw-primary)' }}>NIGHTWIRE</span>
        <span style={{ fontFamily: 'var(--font-mincho)', fontSize: 11, fontWeight: 800, color: 'var(--nw-primary-dim)' }}>設計体系</span>
      </div>
      <div className="sidebar-section">Documentation</div>
      {SIDEBAR_ITEMS.map(item => (
        <a
          key={item.id}
          className={`sidebar-item${active === item.id ? ' active' : ''}`}
          href={`#${item.id}`}
          onClick={(e) => { e.preventDefault(); onNavigate(item.id); }}
        >
          <span style={{ flex: 1 }}>{item.label}</span>
          <span style={{ fontSize: 7, color: 'var(--nw-text-dim)', fontFamily: 'var(--font-mincho)' }}>{item.kanji}</span>
        </a>
      ))}
      <div style={{ marginTop: 'auto', padding: '12px 16px', borderTop: '1px solid var(--nw-text-faint)' }}>
        <div style={{ fontSize: 8, color: 'var(--nw-text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <span className="led green" /> v1.0.0-beta
        </div>
        <a href="https://github.com/cativo23/nightwire" target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 9, color: 'var(--nw-primary-dim)', display: 'block', marginTop: 4 }}>
          GitHub →
        </a>
      </div>
    </aside>
  );
}

export default function App() {
  const [active, setActive] = useState('overview');
  const mainRef = useRef<HTMLElement>(null);

  const handleNavigate = (id: string) => {
    setActive(id);
    const el = document.getElementById(id);
    if (el && mainRef.current) {
      mainRef.current.scrollTo({ top: el.offsetTop - 8, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) { setActive(entry.target.id); break; }
        }
      },
      { root: main, rootMargin: '-10% 0px -80% 0px', threshold: 0 }
    );
    for (const item of SIDEBAR_ITEMS) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <div className="console-wrapper">
      <nav className="nw-nav">
        <div className="org-mark">
          <span style={{ color: 'var(--nw-text)' }}>Nightwire</span>
          <span className="sub" style={{ color: 'var(--nw-primary)' }}>Dark Cyberpunk UI Design System — Documentation</span>
        </div>
        <span className="jp-sub">設計体系文書</span>
        <div className="nav-links">
          <a href="https://github.com/cativo23/nightwire" target="_blank" rel="noopener noreferrer">Github</a>
        </div>
      </nav>
      <Ticker />
      <div className="dashboard" style={{ padding: 0, justifyContent: 'center' }}>
        {/* Left Sidebar - Navigation */}
        <div style={{ width: 220, flexShrink: 0, borderRight: '1px solid var(--nw-text-faint)' }}>
          <Sidebar active={active} onNavigate={handleNavigate} />
        </div>

        {/* Center Content - Documentation */}
        <main ref={mainRef} style={{ flex: 1, overflowY: 'auto', padding: '24px 48px 64px' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <OverviewSection />
            <QuickStartSection />
            <InstallSection />
            <TokensSection />
            <ColorsSection />
            <TypographySection />
            <SurfacesSection />
            <SpacingSection />
            <ComponentsSection />
            <ButtonsSection />
            <DataSection />
            <FeedbackSection />
            <PanelsSection />
            <MoreComponentsSection />
            <TemplatesSection />
            <ExamplesSection />
          </div>
        </main>
      </div>
      <StatusBar />
    </div>
  );
}
