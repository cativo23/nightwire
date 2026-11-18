import { cn } from '../utils/cn';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Sidebar({ children, className }: { children: React.ReactNode; className?: string }) {
  return <nav className={cn('sidebar', className)}>{children}</nav>;
}

export function SidebarHeader({ children }: { children: React.ReactNode }) {
  return <div className="sidebar-header">{children}</div>;
}

export function SidebarSection({ children }: { children: React.ReactNode }) {
  return <div className="sidebar-section">{children}</div>;
}

export function SidebarItem({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) {
  const location = useLocation();
  const isActive = location.pathname === to || (to !== '/docs' && location.pathname.startsWith(to));
  
  return (
    <Link to={to} className={cn('sidebar-item', isActive && 'active', className)}>
      {children}
    </Link>
  );
}

export function Tabs({ tabs, activeTab, onChange, className }: { tabs: string[]; activeTab: string; onChange: (tab: string) => void; className?: string }) {
  return (
    <div className={cn('tabs', className)}>
      {tabs.map(tab => (
        <button
          key={tab}
          className={cn('tab', activeTab === tab && 'active')}
          onClick={() => onChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
