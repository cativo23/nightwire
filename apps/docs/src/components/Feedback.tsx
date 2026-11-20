import { cn } from '../utils/cn';
import React from 'react';

export function Tag({ 
  className, 
  variant = 'primary', 
  ...props 
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: 'primary' | 'danger' | 'success' | 'warning' | 'info' }) {
  return (
    <span
      className={cn(
        'tag',
        variant !== 'primary' && `tag-${variant}`,
        className
      )}
      {...props}
    />
  );
}

export function LED({ 
  state = 'ok', 
  className 
}: { 
  state?: 'ok' | 'active' | 'error' | 'warn' | 'info' | 'ai'; 
  className?: string; 
}) {
  return <span className={cn('led', className)} data-state={state} />;
}

export function Toast({ 
  variant = 'info', 
  children, 
  className 
}: { 
  variant?: 'success' | 'info' | 'warning' | 'danger'; 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={cn('toast', `toast-${variant}`, className)}>
      {children}
    </div>
  );
}
