import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'technical';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50",
          variant === 'primary' && "bg-primary text-primary-foreground shadow hover:bg-primary/90",
          variant === 'secondary' && "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
          variant === 'outline' && "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
          variant === 'ghost' && "hover:bg-accent hover:text-accent-foreground",
          variant === 'technical' && "bg-[#141414] text-[#E4E3E0] hover:bg-white hover:text-black font-mono uppercase text-xs tracking-wider border border-[#E4E3E0]",
          size === 'sm' && "h-8 px-3 text-xs",
          size === 'md' && "h-10 px-4 py-2",
          size === 'lg' && "h-12 px-8",
          className
        )}
        {...props}
      />
    );
  }
);
