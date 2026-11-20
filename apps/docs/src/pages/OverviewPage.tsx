import { PageHead } from '../components/PageHead';
import { Waveform } from '../components/Waveform';

const PRINCIPLES = [
  { id: 'MELCHIOR', name: 'Void First', value: 'Pure #000000 backgrounds. No grays, no gradients, no noise.', status: 'agree' },
  { id: 'BALTHASAR', name: 'Data Density', value: 'Every pixel conveys information. No decorative waste.', status: 'agree' },
  { id: 'CASPER', name: 'Neon Discipline', value: 'Neutral first, semantic color only. Green=data, Blue=focus and accents, Red=danger, Cyan=info.', status: 'agree' },
];

export function OverviewPage() {
  return (
    <section id="overview">
      <PageHead idx="01" label="Overview" kanji="概要" title="Nightwire" subtitle="暗黒専用サイバーパンク設計体系">
        A framework-agnostic, dark-mode-only UI design system optimized for AI-driven development.
        Built on the absolute void <code className="code-inline">#000000</code> with semantic neon accents.
      </PageHead>

      <div className="panel docs-block">
        <div className="panel-header" data-idx="02"><span>System Overview</span><span className="kanji">体系</span></div>
        <div className="panel-body grid grid-cols-1 md:grid-cols-2 md:gap-x-8">
          <div>
            <div className="kv-row"><span className="kv-label">Design Tokens</span><span className="kv-value">{__NW_TOKEN_COUNT__}<span className="kv-note">CSS custom properties</span></span></div>
            <div className="kv-row"><span className="kv-label">Component Classes</span><span className="kv-value">{__NW_COMPONENT_COUNT__}<span className="kv-note">pure CSS components</span></span></div>
            <div className="kv-row"><span className="kv-label">Surface Layers</span><span className="kv-value">4<span className="kv-note">void → raised</span></span></div>
          </div>
          <div>
            <div className="kv-row"><span className="kv-label">Font Families</span><span className="kv-value">4<span className="kv-note">sys, title, stamp, mincho</span></span></div>
            <div className="kv-row"><span className="kv-label">Border Radius</span><span className="kv-value">0px<span className="kv-note">zero tolerance</span></span></div>
            <div className="kv-row"><span className="kv-label">Spacing Base</span><span className="kv-value">4px<span className="kv-note">8-step scale</span></span></div>
          </div>
        </div>
      </div>

      <div className="nw-reticle docs-block">
        <Waveform />
      </div>

      <div className="docs-block">
        <div className="nw-section-head" data-idx="03"><span>MAGI Design Principles</span><span className="kanji">設計哲学</span></div>
        <div className="nw-accordion docs-accordion">
          {PRINCIPLES.map((p, i) => (
            <details key={p.id} open={i === 0}>
              <summary>{p.name}</summary>
              <div className="answer">
                {p.value}
                <span className="kv-note docs-principle-meta">{p.id} · {p.status.toUpperCase()}</span>
              </div>
            </details>
          ))}
        </div>
        <p className="docs-consensus">
          <span className="led" data-state="ok" /> Consensus: UNANIMOUS — VOID-FIRST DESIGN APPROVED
        </p>
      </div>
    </section>
  );
}
