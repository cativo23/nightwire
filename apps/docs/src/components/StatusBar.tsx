import { useState, useEffect } from 'react';

export function StatusBar() {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(id); }, []);
  return (
    <div className="status-bar">
      <span><span className="led" data-state="ok" /> NIGHTWIRE DOCS — ONLINE</span>
      <span title={`${__NW_COMPONENT_COUNT__} component stylesheets in src/components, ${__NW_TOKEN_COUNT__} tokens with a CSS custom property`}>COMPONENTS: {__NW_COMPONENT_COUNT__} &nbsp;│&nbsp; TOKENS: {__NW_TOKEN_COUNT__}</span>
      <span>{time.toLocaleTimeString('en-US', { hour12: false })} JST</span>
    </div>
  );
}
