import { cn } from '../utils/cn';
import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'danger' | 'success' | 'warning' | 'info';
}

export function Badge({ 
  className, 
  variant = 'primary', 
  ...props 
}: BadgeProps) {
  return (
    <span
      className={cn(
        'badge',
        variant !== 'primary' && `badge-${variant}`,
        className
      )}
      {...props}
    />
  );
}
