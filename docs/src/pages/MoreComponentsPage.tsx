import { SectionTitle, CodeBlock } from '../components/CodeBlock';

export function MoreComponentsPage() {
  return (
    <section id="more-components">
      <SectionTitle tag="追加部品">More Components</SectionTitle>
      <p style={{ color: 'var(--nw-text-dim)', fontSize: 12, margin: '8px 0 16px', lineHeight: 1.6 }}>
        Additional components available in <code style={{ color: 'var(--nw-cyan)' }}>nightwire.css</code>. All are pure CSS — no JavaScript required.
      </p>

      <div className="grid-2" style={{ gap: 2, marginBottom: 2 }}>
        <div className="panel">
          <div className="panel-header"><span>Modal / Dialog</span><span className="tag">ダイアログ</span></div>
          <div className="panel-body">
            <div className="modal" style={{ position: 'relative', maxWidth: 360 }}>
              <div className="modal-header">
                <span>Confirm Action</span>
                <button className="btn btn-sm btn-ghost">✕</button>
              </div>
              <div className="modal-body" style={{ fontSize: 12 }}>Are you sure you want to proceed?</div>
              <div className="modal-footer">
                <button className="btn-ghost btn-sm">Cancel</button>
                <button className="btn-danger btn-sm">Delete</button>
              </div>
            </div>
          </div>
          <CodeBlock>{`<div class="modal-backdrop">
  <div class="modal">
    <div class="modal-header">
      <span>Title</span>
      <button class="btn btn-sm btn-ghost">✕</button>
    </div>
    <div class="modal-body">Content</div>
    <div class="modal-footer">
      <button class="btn-ghost">Cancel</button>
      <button class="btn-danger">Confirm</button>
    </div>
  </div>
</div>`}</CodeBlock>
        </div>

        <div className="panel">
          <div className="panel-header"><span>Dropdown</span><span className="tag">ドロップダウン</span></div>
          <div className="panel-body">
            <div className="dropdown" style={{ position: 'relative' }}>
              <button className="btn-ghost btn-sm">Actions ▾</button>
              <div className="dropdown-menu" style={{ position: 'relative', marginTop: 4 }}>
                <button className="dropdown-item">Edit</button>
                <button className="dropdown-item">Duplicate</button>
                <div className="dropdown-divider" />
                <button className="dropdown-item danger">Delete</button>
              </div>
            </div>
          </div>
          <CodeBlock>{`<div class="dropdown">
  <button class="btn-ghost btn-sm">Actions ▾</button>
  <div class="dropdown-menu">
    <button class="dropdown-item">Edit</button>
    <button class="dropdown-item">Duplicate</button>
    <div class="dropdown-divider"></div>
    <button class="dropdown-item danger">Delete</button>
  </div>
</div>`}</CodeBlock>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 2 }}>
        <div className="panel">
          <div className="panel-header"><span>Skeleton Loader</span><span className="tag">スケルトン</span></div>
          <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
            <div className="skeleton skeleton-heading" />
            <div className="skeleton skeleton-text" />
            <div className="skeleton skeleton-text" style={{ width: '80%' }} />
            <div className="skeleton skeleton-block" />
          </div>
          <CodeBlock>{`<div class="skeleton skeleton-heading"></div>
<div class="skeleton skeleton-text"></div>
<div class="skeleton skeleton-text" style="width:80%"></div>
<div class="skeleton skeleton-block"></div>`}</CodeBlock>
        </div>

        <div className="panel">
          <div className="panel-header"><span>Avatar</span><span className="tag">アバター</span></div>
          <div className="panel-body" style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
            <span className="avatar avatar-sm">JD</span>
            <span className="avatar">JD</span>
            <span className="avatar avatar-lg">JD</span>
          </div>
          <CodeBlock>{`<span class="avatar avatar-sm">JD</span>
<span class="avatar">JD</span>
<span class="avatar avatar-lg">JD</span>`}</CodeBlock>
        </div>
      </div>
    </section>
  );
}
