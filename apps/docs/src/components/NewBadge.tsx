/**
 * NewBadge — marks a class/variant as introduced in v2-alpha.
 *
 * Pin it next to component names, variant chips, or section headings
 * to signal that the surface is additive (v1 unchanged, v2 adds).
 *
 * Usage:
 *   <h3>.btn-success <NewBadge /></h3>
 *   <span className="tag">.field <NewBadge tight /></span>
 */
interface NewBadgeProps {
  /** Compact spacing (no left margin) for inline use within tight chips */
  tight?: boolean;
  /** Override the label (default: "NEW IN V2") */
  label?: string;
}

export function NewBadge({ tight = false, label = 'NEW IN V2' }: NewBadgeProps) {
  return (
    <span
      style={{
        display: 'inline-block',
        marginLeft: tight ? 0 : 6,
        padding: '1px 5px',
        fontFamily: 'var(--font-stamp)',
        fontSize: 8,
        fontWeight: 700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--nw-purple)',
        border: '1px solid var(--nw-purple-dim)',
        background: 'rgba(178, 102, 224, 0.08)',
        verticalAlign: 'middle',
        lineHeight: 1.4,
      }}
      aria-label="New in v2"
    >
      {label}
    </span>
  );
}
