import { SectionTitle, CodeBlock } from '../components/CodeBlock';
import { NewBadge } from '../components/NewBadge';

export function MoreComponentsPage() {
  return (
    <section id="more-components">
      <SectionTitle tag="追加部品">More Components</SectionTitle>
      <p style={{ color: 'var(--nw-text-dim)', fontSize: 12, margin: '8px 0 16px', lineHeight: 1.6 }}>
        Additional components available in <code style={{ color: 'var(--nw-cyan)' }}>nightwire.css</code>. All are pure CSS — no JavaScript required.
      </p>

      {/* Form Suite — v2 */}
      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Form Suite <NewBadge /></span><span className="tag">入力</span></div>
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="field">
            <label className="field-label">Node ID <span className="req">*</span></label>
            <input defaultValue="cluster-α-12" />
            <span className="field-help">Identifier of the target node</span>
          </div>
          <div className="field success">
            <label className="field-label">Region</label>
            <input defaultValue="ap-northeast-1" />
            <span className="field-help">✓ Verified · 12 nodes available</span>
          </div>
          <div className="field error">
            <label className="field-label">Replica count</label>
            <input defaultValue="9999" />
            <span className="field-help">Exceeds quota (max 512)</span>
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <label className="switch"><input type="checkbox" defaultChecked /><span className="track" /><span className="lbl">Auto-scale</span></label>
            <label className="check"><input type="checkbox" defaultChecked /><span className="box" /> Notify oncall</label>
            <label className="check"><input type="checkbox" /><span className="box" /> Dry run</label>
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <label className="radio"><input type="radio" name="strategy" defaultChecked /><span className="box" /> Rolling</label>
            <label className="radio"><input type="radio" name="strategy" /><span className="box" /> Blue/green</label>
            <label className="radio"><input type="radio" name="strategy" /><span className="box" /> Canary</label>
          </div>
          <div className="field">
            <label className="field-label">Multiselect · regions</label>
            <div className="combo">
              <span className="chip">ap-northeast-1 <span className="x">×</span></span>
              <span className="chip">eu-west-2 <span className="x">×</span></span>
              <input placeholder="Add region…" />
            </div>
          </div>
          <CodeBlock>{`<!-- Field with validation states -->
<div class="field success">
  <label class="field-label">Region</label>
  <input value="ap-northeast-1" />
  <span class="field-help">✓ Verified</span>
</div>

<!-- Switch / Check / Radio -->
<label class="switch">
  <input type="checkbox" checked>
  <span class="track"></span>
  <span class="lbl">Auto-scale</span>
</label>

<!-- Multiselect combo -->
<div class="combo">
  <span class="chip">ap-northeast-1 <span class="x">×</span></span>
  <input placeholder="Add region…">
</div>`}</CodeBlock>
        </div>
      </div>

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
          <CodeBlock>{`<div class="modal-backdrop" data-open="true">
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
