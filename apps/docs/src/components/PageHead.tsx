import type { ReactNode } from 'react';

interface PageHeadProps {
  /** Section index shown as "01 // LABEL". */
  idx: string;
  label: string;
  /** Kanji in the right slot of the section head. */
  kanji: string;
  /** The big serif headline (.nw-display). */
  title: string;
  /** Optional Japanese line under the headline. */
  subtitle?: string;
  /** Optional intro paragraph (.nw-lede). */
  children?: ReactNode;
}

/**
 * The v3 page heading: section head, serif display headline, optional lede.
 * Copy this for every docs page; only the props change.
 */
export function PageHead({ idx, label, kanji, title, subtitle, children }: PageHeadProps) {
  return (
    <header className="docs-pagehead">
      <div className="nw-section-head" data-idx={idx}>
        <span>{label}</span>
        <span className="kanji">{kanji}</span>
      </div>
      <h1 className="nw-display">{title}</h1>
      {subtitle && <div className="docs-pagehead-sub">{subtitle}</div>}
      {children && <p className="nw-lede">{children}</p>}
    </header>
  );
}
