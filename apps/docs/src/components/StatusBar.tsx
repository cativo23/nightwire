import { useState, useEffect } from 'react';

export function StatusBar() {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(id); }, []);
  return (
    <div className="status-bar">
      <span><span className="led green" /> NIGHTWIRE DOCS — ONLINE</span>
      <span>COMPONENTS: 24 &nbsp;│&nbsp; TOKENS: 42 &nbsp;│&nbsp; CSS CLASSES: 60+</span>
      <span>{time.toLocaleTimeString('en-US', { hour12: false })} JST</span>
    </div>
  );
}
