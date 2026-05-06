import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'technical';
}

export const Badge = ({ className, variant = 'default', ...props }: BadgeProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variant === 'default' && "border-transparent bg-primary text-primary-foreground",
        variant === 'success' && "border-transparent bg-green-500/20 text-green-500",
        variant === 'warning' && "border-transparent bg-amber-500/20 text-amber-500",
        variant === 'danger' && "border-transparent bg-red-500/20 text-red-500",
        variant === 'technical' && "border-[#E4E3E0] bg-[#141414] text-[#E4E3E0] font-mono",
        className
      )}
      {...props}
    />
  );
};
