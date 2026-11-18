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
  color = 'green', 
  className 
}: { 
  color?: 'green' | 'blue' | 'red' | 'yellow'; 
  className?: string; 
}) {
  return <span className={cn('led', color, className)} />;
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
