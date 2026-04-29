import { useEffect, useRef, useState } from 'react';

export function Waveform() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const [readout, setReadout] = useState('0.00');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let t = 0;
    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w; canvas.height = h;
      ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, w, h);
      const waves = [
        { color: 'rgba(122,237,122,0.7)', freq: 0.02, amp: 0.25, speed: 0.03, phase: 0 },
        { color: 'rgba(102,221,255,0.5)', freq: 0.015, amp: 0.2, speed: 0.02, phase: 2 },
        { color: 'rgba(102,153,255,0.4)', freq: 0.025, amp: 0.15, speed: 0.04, phase: 4 },
      ];
      for (const wave of waves) {
        ctx.beginPath(); ctx.strokeStyle = wave.color; ctx.lineWidth = 1.5;
        for (let x = 0; x < w; x++) {
          const y = h / 2 + Math.sin(x * wave.freq + t * wave.speed + wave.phase) * h * wave.amp
            + Math.sin(x * wave.freq * 2.3 + t * wave.speed * 1.7) * h * wave.amp * 0.3;
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      ctx.strokeStyle = 'rgba(102,153,255,0.06)'; ctx.lineWidth = 1;
      for (let y = 0; y < h; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
      for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      t++;
      setReadout((Math.sin(t * 0.03) * 50 + 50).toFixed(1));
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <div className="waveform-wrap" style={{ height: 120 }}>
      <canvas ref={canvasRef} />
      <span className="readout-label">Signal Analysis — 信号解析</span>
      <span className="readout">{readout}%</span>
      <span className="timecode">LIVE</span>
      <div className="legend">
        <span style={{ color: 'var(--nw-green)' }}>&#9679; design</span>
        <span style={{ color: 'var(--nw-cyan)' }}>&#9679; tokens</span>
        <span style={{ color: 'var(--nw-primary)' }}>&#9679; layout</span>
      </div>
    </div>
  );
}
