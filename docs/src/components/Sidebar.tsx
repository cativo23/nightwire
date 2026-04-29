import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { SIDEBAR_ITEMS } from '../data';

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
          <span style={{ flex: 1 }}>{item.label}</span>
          <span style={{ fontSize: 7, color: 'var(--nw-text-dim)', fontFamily: 'var(--font-mincho)' }}>{item.kanji}</span>
        </NavLink>
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
