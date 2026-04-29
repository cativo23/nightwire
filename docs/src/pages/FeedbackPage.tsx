import { SectionTitle, CodeBlock } from '../components/CodeBlock';
import { useState } from 'react';
import { makeEvent, EventEntry } from '../data';

export function FeedbackPage() {
  const [events] = useState<EventEntry[]>(() => Array.from({ length: 15 }, makeEvent));
  return (
    <section id="feedback">
      <SectionTitle tag="応答">Feedback & Status</SectionTitle>

      <div className="panel" style={{ marginBottom: 2 }}>
        <div className="panel-header"><span>Toasts</span><span className="tag">通知</span></div>
        <div className="panel-body" style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
          <div className="toast toast-success">System synchronization complete. All nodes connected.</div>
          <div className="toast toast-warning">High memory utilization detected. Consider optimizing operations.</div>
          <div className="toast toast-danger">Connection to core server lost. Attempting reconnection.</div>
        </div>
        <CodeBlock>{`<div class="toast toast-success">Success message</div>
<div class="toast toast-warning">Warning message</div>
<div class="toast toast-danger">Error message</div>
<div class="toast toast-info">Info message</div>`}</CodeBlock>
      </div>

      <div className="event-log" style={{ height: 300 }}>
        <div className="el-header">
          <span>Event Log Example</span>
          <span className="el-count">{events.length} entries</span>
        </div>
        <div className="el-body">
          {events.map((ev, i) => (
            <div key={i} className="ev">
              <span className="ev-time">{ev.time}</span>
              <span className={`ev-type ${ev.type}`}>{ev.type}</span>
              <span className="ev-detail">{ev.detail}</span>
              <span className="ev-metric">{ev.metric}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
