import type { CSSProperties, ReactNode } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { PageHead } from '../components/PageHead';
import scene from '../assets/scene.svg';

// The pieces of the v3 mockup look. Each demo is rendered with the real classes from nightwire.css
// and followed by the markup that produces it.

const note: CSSProperties = { color: 'var(--nw-text-dim)', fontSize: 11, lineHeight: 1.6, margin: '0 0 12px' };

function Demo({ title, kanji, children, code }: { title: string; kanji: string; children: ReactNode; code: string }) {
  return (
    <div className="panel" style={{ marginBottom: 2 }}>
      <div className="panel-header"><span>{title}</span><span className="kanji">{kanji}</span></div>
      <div className="panel-body">
        {children}
        <CodeBlock>{code}</CodeBlock>
      </div>
    </div>
  );
}

export function PiecesPage() {
  return (
    <section id="pieces">
      <PageHead idx="15" label="Mockup Pieces" kanji="新部品" title="Mockup Pieces" />
      <p style={{ ...note, margin: '8px 0 16px' }}>
        The pieces that give a page the approved mockup look: heads and headings, chips, an index, an
        accordion, an arrow link, a frame, halftone art, a barcode, an outline wordmark and film grain.
        All are plain classes in <code>nightwire.css</code>; the kanji ones leave at the archive
        intensity, and the grain is 0 there. Put <code>aria-hidden=&quot;true&quot;</code> on the
        decorative ones: <code>.nw-barcode</code>, <code>.nw-wordmark</code>, <code>.nw-reticle-stamp</code> and{' '}
        <code>.nw-reticle-vlabel</code>.
      </p>

      <Demo
        title="Section head, display and lede"
        kanji="見出し"
        code={`<div class="nw-section-head" data-idx="01"><span>telemetry</span><span class="kanji">観</span></div>
<h2 class="nw-display">See it live.</h2>
<p class="nw-lede">Three intensities, one set of tokens.</p>

<!-- chrome variant: the rule fades out, the kanji is chrome -->
<div class="nw-section-head nw-section-head-chrome" data-idx="02">…</div>`}
      >
        <p style={note}>
          <code>.panel-header</code> and <code>.card-header</code> share this look; <code>data-idx</code> shows an index before the label.
        </p>
        <div className="nw-section-head" data-idx="01"><span>telemetry</span><span className="kanji">観</span></div>
        <h2 className="nw-display">See it live.</h2>
        <p className="nw-lede">Three intensities, one set of tokens. Walk the strip and open any view at full size.</p>
        <div className="nw-section-head nw-section-head-chrome" data-idx="02" style={{ marginTop: 24 }}><span>manifesto</span><span className="kanji">道</span></div>
      </Demo>

      <Demo
        title="Chip"
        kanji="札"
        code={`<a class="nw-chip" href="#"><span class="led" data-state="ok"></span>v3.0.0</a>
<a class="nw-chip" href="#"><span class="sq"></span>142 tokens</a>
<a class="nw-chip" href="#"><span class="star">★</span>github</a>
<a class="nw-chip nw-chip-solid" href="#">INSTALL</a>`}
      >
        <p style={note}>
          Square and mono, with a hairline outline. Use <code>.tag</code> for a status; a chip is a label or a link.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <a className="nw-chip" href="#pieces" onClick={(e) => e.preventDefault()}><span className="led" data-state="ok" />v3.0.0</a>
          <a className="nw-chip" href="#pieces" onClick={(e) => e.preventDefault()}><span className="led" data-state="warn" />beta</a>
          <a className="nw-chip" href="#pieces" onClick={(e) => e.preventDefault()}><span className="sq" />{__NW_TOKEN_COUNT__} tokens</a>
          <a className="nw-chip" href="#pieces" onClick={(e) => e.preventDefault()}><span className="star">★</span>github</a>
          <a className="nw-chip nw-chip-solid" href="#pieces" onClick={(e) => e.preventDefault()}>INSTALL</a>
        </div>
      </Demo>

      <Demo
        title="Kanji index"
        kanji="索引"
        code={`<div class="nw-index">
  <div class="nw-index-row">
    <span class="kanji">押</span><span class="name">Buttons</span>
    <span class="count">11</span>
    <span class="items">btn, btn-ghost, btn-chrome…</span>
  </div>
  …
</div>`}
      >
        <p style={note}>
          Two columns, one row per group: kanji, name, count, items. Hover a row to light its kanji. At archive
          the kanji hide and the name and count keep their columns.
        </p>
        <div className="nw-index">
          <div className="nw-index-row"><span className="kanji">押</span><span className="name">Buttons</span><span className="count">11</span><span className="items">btn, btn-ghost, btn-chrome, btn-danger, btn-success, btn-ai…</span></div>
          <div className="nw-index-row"><span className="kanji">入</span><span className="name">Forms</span><span className="count">8</span><span className="items">field, field-label, field-help, check, radio, switch, seg, combo</span></div>
          <div className="nw-index-row"><span className="kanji">層</span><span className="name">Overlays</span><span className="count">6</span><span className="items">modal, drawer, cmdk, dropdown, tooltip, toast</span></div>
          <div className="nw-index-row"><span className="kanji">数</span><span className="name">Data</span><span className="count">8</span><span className="items">nw-table, stat, stat-spark, metrics-grid, metric-cell, kv-row…</span></div>
        </div>
      </Demo>

      <Demo
        title="Accordion and arrow link"
        kanji="問答"
        code={`<div class="nw-accordion">
  <details open>
    <summary>Can I use it with Tailwind?</summary>
    <div class="answer">
      Yes. The preset exposes the same tokens.<br>
      <a class="nw-link-arrow" href="#">Read the manual →</a>
    </div>
  </details>
  <details>…</details>
</div>`}
      >
        <p style={note}>
          Native <code>&lt;details&gt;</code>, no JavaScript. The marker is a +/− and the answer animates where the
          browser can; reduced motion makes it instant. The arrow is part of the link text.
        </p>
        <div className="nw-accordion">
          <details open>
            <summary>Can I use it with Tailwind?</summary>
            <div className="answer">Yes. The preset <code>tailwind.preset.js</code> exposes the same tokens as <code>nightwire.css</code>, so you can use classes or utilities.<br /><a className="nw-link-arrow" href="#pieces" onClick={(e) => e.preventDefault()}>Read the manual →</a></div>
          </details>
          <details>
            <summary>Does it need JavaScript?</summary>
            <div className="answer">No. Every component is CSS; the demos here use React only to render the markup.</div>
          </details>
          <details>
            <summary>Can I turn the decoration down?</summary>
            <div className="answer">Set the intensity to archive: the kanji hide and the grain goes to 0.</div>
          </details>
        </div>
      </Demo>

      <Demo
        title="Reticle frame"
        kanji="照準"
        code={`<!-- alone, with its parts -->
<div class="nw-reticle">
  <div class="nw-reticle-meta"><span>00 // CORE</span><span>v3</span></div>
  <span class="nw-reticle-vlabel" aria-hidden="true">SUPPORTED · INTENSITY</span>
  <span class="nw-reticle-stamp" aria-hidden="true">夜線</span>
  <div class="nw-reticle-foot"><div class="nw-barcode" aria-hidden="true"></div><span class="kanji">電</span></div>
</div>

<!-- on a panel: the dense console tile that wants its box back -->
<div class="panel nw-reticle">
  <div class="panel-header"><span>CPU</span><span class="kanji">算</span></div>
  <div class="panel-body">…</div>
</div>`}
      >
        <p style={note}>
          A panel is open in v3. A dense console where tiles would merge opts into the frame with{' '}
          <code>class=&quot;panel nw-reticle&quot;</code>. The arms are background images, so the element keeps its own
          fill; <code>--nw-reticle-c</code> and <code>--nw-reticle-arm</code> are the two knobs.
        </p>
        <div className="grid-2" style={{ gap: 8, marginBottom: 12 }}>
          <div className="nw-reticle" style={{ minHeight: 240 }}>
            <div className="nw-reticle-meta"><span>00 // NIGHTWIRE-CORE</span><span>v3</span></div>
            <span className="nw-reticle-vlabel" aria-hidden="true">SUPPORTED · INTENSITY</span>
            <span className="nw-reticle-stamp" aria-hidden="true">夜線</span>
            <div style={{ height: 110 }} />
            <div className="nw-reticle-foot"><div className="nw-barcode" aria-hidden="true" /><span className="kanji">電</span></div>
          </div>
          <div className="panel nw-reticle">
            <div className="panel-header"><span>CPU</span><span className="kanji">算</span></div>
            <div className="panel-body"><div className="stat"><div className="stat-label">load</div><div className="stat-value">42%</div></div></div>
          </div>
        </div>
      </Demo>

      <Demo
        title="Halftone"
        kanji="網点"
        code={`<div class="nw-halftone nw-halftone-bone">
  <div class="nw-halftone-layer"><img src="scene.svg" alt=""></div>
</div>

<!-- tints: -chrome, -data, -bone (default: text colour). -fine for a finer dot -->
<div class="nw-halftone nw-halftone-chrome nw-halftone-fine">…</div>`}
      >
        <p style={note}>
          Plain CSS over any <code>&lt;img&gt;</code>: grey and high-contrast, a dot pattern, then a tint multiplied
          on top. The tint is <code>--nw-halftone-tint</code>, the dot size <code>--nw-halftone-dot</code>.
        </p>
        <div className="grid-2" style={{ gap: 8, marginBottom: 12 }}>
          <div className="nw-halftone nw-halftone-bone" style={{ maxHeight: 240 }}><div className="nw-halftone-layer"><img src={scene} alt="" /></div></div>
          <div className="nw-halftone nw-halftone-chrome nw-halftone-fine" style={{ maxHeight: 240 }}><div className="nw-halftone-layer"><img src={scene} alt="" /></div></div>
        </div>
      </Demo>

      <Demo
        title="Barcode"
        kanji="縞"
        code={`<div class="nw-barcode" aria-hidden="true"></div>
<div class="nw-barcode" aria-hidden="true" style="color: var(--nw-chrome)"></div>`}
      >
        <p style={note}>A strip of bars drawn in the current text colour; set <code>color</code> to tint it.</p>
        <div className="nw-barcode" aria-hidden="true" />
        <div className="nw-barcode" aria-hidden="true" style={{ color: 'var(--nw-chrome)', marginBottom: 12 }} />
      </Demo>

      <Demo
        title="Outline wordmark"
        kanji="輪郭"
        code={`<div class="nw-wordmark" aria-hidden="true">Nightwire</div>`}
      >
        <p style={note}>
          A large outlined word for footers and covers: hairline stroke, squeezed to 82% wide, faded towards the bottom.
        </p>
        <div style={{ overflow: 'hidden', marginBottom: 12 }}>
          <div className="nw-wordmark" aria-hidden="true">Nightwire</div>
        </div>
      </Demo>

      <Demo
        title="Grain"
        kanji="粒子"
        code={`<body class="nw-grain">

/* strength: 0 at archive, .07 at operator, .1 at combat */
:root { --nw-grain: .07; }`}
      >
        <p style={note}>
          Film grain is a page-level layer, so it goes on <code>&lt;body&gt;</code>, once. This site keeps its own body
          clean (the docs are for reading), so the box below is a scoped preview: it forces <code>--nw-grain</code> to
          .1, because at archive the knob is 0 and the grain would not show, and contains the fixed layer with{' '}
          <code>contain: paint</code>. A real page needs neither.
        </p>
        <div
          className="nw-grain"
          style={{
            '--nw-grain': 0.1, contain: 'paint', position: 'relative', height: 120,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--nw-line)', marginBottom: 12,
            color: 'var(--nw-text-dim)', fontSize: 11,
          } as CSSProperties}
        >
          scoped grain preview
        </div>
      </Demo>
    </section>
  );
}
