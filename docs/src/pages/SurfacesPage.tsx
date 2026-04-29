import { SectionTitle } from '../components/CodeBlock';

export function SurfacesPage() {
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
