import { NavLink } from 'react-router-dom';
import { SIDEBAR_GROUPS } from '../data';

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <aside className="sidebar" style={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <div className="sidebar-header docs-side-head">
        <span>Documentation</span>
        <span className="kanji">設計体系</span>
      </div>

      {SIDEBAR_GROUPS.map(group => (
        <div key={group.section}>
          <div className="sidebar-section docs-side-section">
            <span>{group.section}</span>
            <span className="kanji">{group.kanji}</span>
          </div>
          {group.items.map(item => (
            <NavLink
              key={item.id}
              to={`/${item.id}`}
              className={({ isActive }) => `sidebar-item${isActive ? ' active' : ''}`}
              onClick={onNavigate}
            >
              <span className="docs-side-label">{item.label}</span>
              <span className="kanji">{item.kanji}</span>
            </NavLink>
          ))}
        </div>
      ))}

      <div className="docs-side-foot">
        <div><span className="led" data-state="ok" /> v{__NW_VERSION__}</div>
        <a href="https://github.com/cativo23/nightwire" target="_blank" rel="noopener noreferrer">GitHub →</a>
      </div>
    </aside>
  );
}
