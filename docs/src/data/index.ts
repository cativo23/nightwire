export const COLORS = [
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

export const FONTS = [
  { name: 'JetBrains Mono', variable: '--font-sys', role: 'System & Data', sample: 'SYNC_RATIO: 48.2%' },
  { name: 'Noto Serif Display', variable: '--font-title', role: 'Compressed Titles', sample: 'NIGHTWIRE' },
  { name: 'Saira Extra Condensed', variable: '--font-stamp', role: 'Tags & Stamps', sample: 'OPERATIONAL' },
  { name: 'Shippori Mincho B1', variable: '--font-mincho', role: 'Japanese Accents', sample: '設計体系文書' },
];

export const COMPONENTS = [
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

export const SIDEBAR_ITEMS = [
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

export type EventEntry = { time: string; type: string; detail: string; metric: string };

export function makeEvent(): EventEntry {
  const types = ['system', 'render', 'token', 'build', 'warning'];
  const details = [
    'Component tree reconciled', 'Token palette validated', 'Panel layout recalculated',
    'Waveform buffer flushed', 'Metrics grid recomputed', 'Font stack loaded: 4/4',
    'CSS custom properties: 42 active', 'Design token sync complete', 'Surface hierarchy verified',
    'Glow shader compiled', 'DOM elements mounted',
  ];
  const t = types[Math.floor(Math.random() * types.length)];
  const d = details[Math.floor(Math.random() * details.length)];
  const now = new Date();
  const ts = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const ms = String(now.getMilliseconds()).padStart(3, '0');
  return { time: `${ts}.${ms}`, type: t, detail: d, metric: `${(Math.random() * 100).toFixed(1)}ms` };
}
