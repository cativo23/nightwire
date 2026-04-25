import { cn } from '../utils/cn';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'success' | 'warning' | 'info' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'btn',
        variant !== 'primary' && `btn-${variant}`,
        size !== 'md' && `btn-${size}`,
        className
      )}
      {...props}
    />
  );
}
