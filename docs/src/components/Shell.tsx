import { useState, useEffect, useRef } from 'react';
import { SIDEBAR_ITEMS } from '../data';
import { Ticker } from './Ticker';
import { StatusBar } from './StatusBar';
import { Sidebar } from './Sidebar';

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
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
        <div style={{ width: 220, flexShrink: 0, borderRight: '1px solid var(--nw-text-faint)' }}>
          <Sidebar active={active} onNavigate={handleNavigate} />
        </div>
        <main ref={mainRef} style={{ flex: 1, overflowY: 'auto', padding: '24px 48px 64px' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            {children}
          </div>
        </main>
      </div>
      <StatusBar />
    </div>
  );
}
