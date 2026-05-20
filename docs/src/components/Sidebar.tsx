import { NavLink } from 'react-router-dom';
import { SIDEBAR_ITEMS } from '../data';

// Items added in v2-alpha — pin a tiny NEW chip next to their label
// so consumers can spot the additions without splitting the nav.
const V2_NEW_IDS = new Set(['intensity', 'layer2-tokens']);

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar" style={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="compressed-title" style={{ fontSize: 14, color: 'var(--nw-primary)' }}>NIGHTWIRE</span>
        <span style={{ fontFamily: 'var(--font-mincho)', fontSize: 11, fontWeight: 800, color: 'var(--nw-primary-dim)' }}>設計体系</span>
      </div>

      <div className="sidebar-section">Documentation</div>
      {SIDEBAR_ITEMS.map(item => (
        <NavLink
          key={item.id}
          to={`/${item.id}`}
          className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
          onClick={onNavigate}
        >
          <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
            {item.label}
            {V2_NEW_IDS.has(item.id) && (
              <span
                style={{
                  fontFamily: 'var(--font-stamp)',
                  fontSize: 7,
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  color: 'var(--nw-purple)',
                  border: '1px solid var(--nw-purple-dim)',
                  background: 'rgba(178,102,224,0.08)',
                  padding: '0 3px',
                  lineHeight: 1.4,
                  textTransform: 'uppercase',
                }}
              >
                v2
              </span>
            )}
          </span>
          <span style={{ fontSize: 7, color: 'var(--nw-text-dim)', fontFamily: 'var(--font-mincho)' }}>{item.kanji}</span>
        </NavLink>
      ))}

      <div style={{ marginTop: 'auto', padding: '12px 16px', borderTop: '1px solid var(--nw-text-faint)' }}>
        <div style={{ fontSize: 8, color: 'var(--nw-text-dim)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          <span className="led green" /> v2.0.0-alpha
        </div>
        <a href="https://github.com/cativo23/nightwire" target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 9, color: 'var(--nw-primary-dim)', display: 'block', marginTop: 4 }}>
          GitHub →
        </a>
      </div>
    </aside>
  );
}
