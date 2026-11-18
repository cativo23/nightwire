import { cn } from '../utils/cn';
import React from 'react';

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto">
      <table className={cn('nw-table w-full', className)} {...props} />
    </div>
  );
}

export function MetricCell({ 
  label, 
  value, 
  sub, 
  highlight, 
  className 
}: { 
  label: string; 
  value: React.ReactNode; 
  sub?: string; 
  highlight?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('metric-cell', highlight && 'highlight', className)}>
      <div className="m-label">{label}</div>
      <div className="m-value">{value}</div>
      {sub && <div className="m-sub">{sub}</div>}
    </div>
  );
}

export function KVRow({ label, value, className }: { label: string; value: React.ReactNode; className?: string }) {
  return (
    <div className={cn('kv-row', className)}>
      <div className="kv-label">{label}</div>
      <div className="kv-value">{value}</div>
    </div>
  );
}

export function Progress({ value, max = 100, variant = 'primary', className }: { value: number; max?: number; variant?: 'primary' | 'danger'; className?: string }) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  return (
    <div className={cn('nw-progress', className)}>
      <div 
        className="fill" 
        style={{ 
          width: `${percentage}%`,
          ...(variant === 'danger' ? { background: 'var(--nw-red)', boxShadow: '0 0 4px rgba(255,102,136,0.3)' } : {})
        }} 
      />
    </div>
  );
}
