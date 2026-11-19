import tokens from '../../../../src/tokens/tokens.json';
import { TokenReader, KNOB_COLUMNS, motionVocab } from './tokens.mjs';

// Motion and intensity values are read from src/tokens/tokens.json (Principle II); only the
// human copy (use, desc) is written here.
const nw = new TokenReader(tokens);

export const COLORS = [
  { name: 'void', hex: '#000000', variable: '--void', desc: 'Primary background — absolute void' },
  { name: 'void-warm', hex: '#0a0a0a', variable: '--void-warm', desc: 'Metric cells, sidebar; the fill of your own box (a .panel has none)' },
  { name: 'void-panel', hex: '#111111', variable: '--void-panel', desc: 'Inset surfaces & inputs' },
  { name: 'void-raised', hex: '#1a1a1a', variable: '--void-raised', desc: 'Elevated elements' },
  { name: 'primary', hex: '#6699ff', variable: '--nw-primary', desc: 'Focus rings, accent lines & links (labels are neutral)' },
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
  { name: '.btn', desc: 'Primary button (bone, the one solid action)', variants: '.btn-ghost, .btn-danger, .btn-chrome, .btn-sm' },
  { name: '.panel', desc: 'Base container', variants: '.panel-header, .panel-body' },
  { name: '.card', desc: 'Bordered container, square corners', variants: '.card-header, .card-body, .card-footer' },
  { name: '.metrics-grid', desc: '2-col data grid', variants: '.metric-cell, .m-label, .m-value, .m-sub' },
  { name: '.nw-table', desc: 'Data table', variants: 'th, td, td.lbl' },
  { name: '.badge', desc: 'Inline badge', variants: '.badge-success, .badge-danger, .badge-warning' },
  { name: '.tag', desc: 'Status tag', variants: '.tag-success, .tag-danger, .tag-warn, .tag-info, .tag-chrome' },
  { name: '.led', desc: 'Status indicator', variants: '[data-state=ok|active|error|warn|info|ai], [data-pulse]' },
  { name: '.toast', desc: 'Notification', variants: '.toast-success, .toast-danger, .toast-warning' },
  { name: '.sidebar', desc: 'Side navigation', variants: '.sidebar-header, .sidebar-section, .sidebar-item' },
  { name: '.tabs', desc: 'Tab bar', variants: '.tab, .tab.active, .tab-panel' },
  { name: '.nw-progress', desc: 'Progress bar', variants: '.nw-progress-fill' },
  { name: '.modal', desc: 'Dialog overlay', variants: '.modal-backdrop, .modal-header, .modal-body' },
  { name: '.kv-row', desc: 'Key-value pair', variants: '.kv-label, .kv-value' },
  { name: '.skeleton', desc: 'Loading state', variants: '.skeleton-text, .skeleton-heading, .skeleton-block' },
  { name: '.compressed-title', desc: 'scaleX(0.82) serif', variants: 'standalone class' },
];

// ── Sidebar structure ──────────────────────────────────────────────────────
// Source of truth is SIDEBAR_GROUPS (named sections in render order).
//
// Grouping follows a Foundation / Components / Patterns model, inspired by Polaris, Geist and
// Atlassian.
//

export type SidebarItem = {
  id: string;
  label: string;
  kanji: string;
};

export type SidebarGroup = {
  section: string;
  kanji: string;
  items: SidebarItem[];
};

export const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    section: 'Getting Started',
    kanji: '入門',
    items: [
      { id: 'overview',   label: 'Overview',     kanji: '概要' },
      { id: 'quickstart', label: 'Quick Start',  kanji: 'クイック' },
      { id: 'install',    label: 'Installation', kanji: '導入' },
    ],
  },
  {
    section: 'Foundation',
    kanji: '基礎',
    items: [
      { id: 'tokens',        label: 'Design Tokens',     kanji: '設計変数' },
      { id: 'colors',        label: 'Color Palette',     kanji: 'パレット' },
      { id: 'typography',    label: 'Typography',        kanji: 'タイポ' },
      { id: 'surfaces',      label: 'Surface Hierarchy', kanji: 'サーフェス' },
      { id: 'spacing',       label: 'Spacing Scale',     kanji: 'スペース' },
      { id: 'layer2-tokens', label: 'Layer 2 Tokens',    kanji: '意味層' },
    ],
  },
  {
    section: 'Components',
    kanji: '部品',
    items: [
      { id: 'components',      label: 'Component Registry', kanji: 'UI部品' },
      { id: 'buttons',         label: 'Buttons & Actions',  kanji: '操作' },
      { id: 'data',            label: 'Data Display',       kanji: 'データ' },
      { id: 'feedback',        label: 'Feedback & Status',  kanji: '応答' },
      { id: 'panels',          label: 'Panel Anatomy',      kanji: '構造' },
      { id: 'more-components', label: 'More Components',    kanji: '追加部品' },
    ],
  },
  {
    section: 'Patterns',
    kanji: '応用',
    items: [
      { id: 'intensity', label: 'Intensity System', kanji: '強度' },
      { id: 'templates', label: 'Layout Templates', kanji: '型紙' },
      { id: 'examples',  label: 'Live Examples',    kanji: 'デモ' },
    ],
  },
];


// Which knobs each column shows (KNOB_COLUMNS) is a display choice; the values come from the JSON.
export const INTENSITY_MODES = [
  {
    id: 'archive',
    label: 'Archive',
    kanji: '保管',
    desc: 'Docs, blogs. No glow, paused pulses, larger padding, no kanji, slower motion.',
    knobs: nw.knobs('archive', KNOB_COLUMNS.archive),
  },
  {
    id: 'operator',
    label: 'Operator',
    kanji: '通常',
    desc: 'Default. Neutral look with a subtle state glow, comfortable density, kanji visible.',
    knobs: nw.knobs('operator', KNOB_COLUMNS.operator),
  },
  {
    id: 'combat',
    label: 'Combat',
    kanji: '戦闘',
    desc: 'Ops console, dense. State signals glow twice as bright, faster pulses, denser padding.',
    knobs: nw.knobs('combat', KNOB_COLUMNS.combat),
  },
];

export const LAYER2_TOKENS = [
  // Surfaces
  { token: '--nw-surface-0', maps: '--void',         desc: 'Page background' },
  { token: '--nw-surface-1', maps: '--void-warm',    desc: 'Metric cells, sidebar (a .panel itself has no fill)' },
  { token: '--nw-surface-2', maps: '--void-panel',   desc: 'Modals, inputs' },
  { token: '--nw-surface-3', maps: '--void-raised',  desc: 'Dropdowns, tooltips' },
  { token: '--nw-surface-4', maps: '#242424',        desc: 'Highest surface tier (no component uses it yet)' },
  // Text tiers
  { token: '--nw-text-strong',   maps: '#ffffff', desc: 'Headings, critical values' },
  { token: '--nw-text-default',  maps: '#e6e6e6', desc: 'Body and table text' },
  { token: '--nw-text-mute',     maps: '#aaaaaa', desc: 'Labels, headers, captions' },
  { token: '--nw-text-disabled', maps: '#5a5a5a', desc: 'Disabled' },
  // Semantic roles
  { token: '--nw-chrome',        maps: '--nw-primary',     desc: 'Focus, accent lines, chrome actions' },
  { token: '--nw-chrome-mute',   maps: '--nw-primary-dim', desc: 'Subdued chrome' },
  { token: '--nw-action',        maps: '--nw-text-default', desc: 'The one solid action (.btn), bone' },
  { token: '--nw-action-hot',    maps: '--nw-chrome-hot',   desc: 'Action hover' },
  { token: '--nw-action-text',   maps: '--void',            desc: 'Text on the action fill' },
  { token: '--nw-data',          maps: '--nw-green',       desc: 'Data values, success' },
  { token: '--nw-data-mute',     maps: '--nw-green-dim',   desc: 'Subdued data' },
  { token: '--nw-signal-info',   maps: '--nw-cyan',        desc: 'Info, metadata' },
  { token: '--nw-signal-warn',   maps: '--nw-yellow',      desc: 'Warnings, degraded' },
  { token: '--nw-signal-error',  maps: '--nw-red',         desc: 'Errors, destructive' },
  { token: '--nw-ai',            maps: '--nw-purple',      desc: 'AI / oracle surfaces' },
  { token: '--nw-ai-mute',       maps: '--nw-purple-dim',  desc: 'Subdued AI' },
  // Lines
  { token: '--nw-line',          maps: '--nw-text-line',                desc: 'Standard divider' },
  { token: '--nw-line-strong',   maps: 'rgba(255,255,255,0.36)',        desc: 'Control boundary (3:1)' },
  { token: '--nw-line-chrome',   maps: 'rgba(102,153,255,0.35)',        desc: 'Chrome-tinted divider' },
  { token: '--nw-hairline',      maps: '1px',                           desc: 'Every structural border' },
  { token: '--nw-rule',          maps: '1.5px',                         desc: 'Marks drawn inside controls' },
  { token: '--nw-accent-width',  maps: '2px',                           desc: 'Accent bars: tabs, sidebar, diff, toast' },
];

export const COMPONENTS_V2 = [
  // Forms
  { name: '.field',       category: 'forms',    desc: 'Form field wrapper', variants: '.field.error, .field.success' },
  { name: '.switch',      category: 'forms',    desc: 'Toggle switch',      variants: '.track, .lbl' },
  { name: '.check',       category: 'forms',    desc: 'Checkbox',           variants: '.box' },
  { name: '.radio',       category: 'forms',    desc: 'Radio button',       variants: '.box' },
  { name: '.combo',       category: 'forms',    desc: 'Multiselect with chips', variants: '.chip, .x' },
  { name: '.kbd',         category: 'forms',    desc: 'Keyboard chip',      variants: 'inline' },
  { name: '.seg',         category: 'forms',    desc: 'Segmented control',  variants: 'aria-pressed' },
  // Overlays
  { name: '.drawer',      category: 'overlays', desc: 'Right slide-in detail panel', variants: '.drawer-backdrop, .drawer-header, .drawer-body' },
  { name: '.cmdk',        category: 'overlays', desc: 'Command palette',    variants: '.cmdk-backdrop, .cmdk-section, .cmdk-item' },
  { name: '.modal-title', category: 'overlays', desc: 'Non-flex header label',  variants: 'companion to modal-header' },
  // Data display
  { name: '.code-block',  category: 'data',     desc: 'Syntax-highlighted code', variants: '.tok-k, .tok-s, .tok-c, .tok-n, .tok-fn' },
  { name: '.code-inline', category: 'data',     desc: 'Inline code chip',   variants: 'inline' },
  { name: '.diff',        category: 'data',     desc: 'Add/del diff view',  variants: '.ln.add, .ln.del, .num, .code-content' },
  { name: '.steps',       category: 'data',     desc: 'Stepper bar',        variants: '.step.done, .step.current' },
  { name: '.stat',        category: 'data',     desc: 'Stat card with sparkline', variants: '.stat-label, .stat-value, .stat-delta, .stat-spark' },
  // State & feedback
  { name: '.empty',       category: 'feedback', desc: 'Empty state',        variants: '.glyph, .head, .sub' },
  { name: '.ai-block',    category: 'feedback', desc: 'Purple-accented suggestion strip', variants: '.ai-block-head, .ai-block-body' },
  { name: '.banner',      category: 'feedback', desc: 'System-wide notice', variants: '.banner-tag' },
  { name: '.led[data-state]', category: 'feedback', desc: 'LED with state attribute', variants: 'ok | warn | error | info | active | ai · [data-pulse]' },
  // Tag & button variants
  { name: '.tag-chrome',  category: 'variants', desc: 'System/UI tag (blue)' },
  { name: '.tag-warn',    category: 'variants', desc: 'Degraded tag (amber)' },
  { name: '.tag-ai',      category: 'variants', desc: 'AI/oracle tag (purple)' },
  { name: '.btn-success', category: 'variants', desc: 'Green outline button' },
  { name: '.btn-ai',      category: 'variants', desc: 'Purple outline button' },
  { name: '.btn-icon',    category: 'variants', desc: 'Square icon-only button' },
  { name: '.btn-xs',      category: 'variants', desc: 'Extra small button' },
  { name: '.btn-lg',      category: 'variants', desc: 'Large button' },
  { name: '.btn-loading', category: 'variants', desc: 'Spinner-prefixed button' },
  // Layout primitives
  { name: '.nw-frame',    category: 'layout',   desc: '100vh flex column with overflow hidden' },
  { name: '.nw-stack',    category: 'layout',   desc: 'Vertical flex with density-aware gap' },
  { name: '.nw-cluster',  category: 'layout',   desc: 'Horizontal wrapping flex' },
  { name: '.nw-split',    category: 'layout',   desc: 'Sidebar + main grid (240px / 1fr)' },
];

export const MOTION_VOCAB = motionVocab(nw);

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
