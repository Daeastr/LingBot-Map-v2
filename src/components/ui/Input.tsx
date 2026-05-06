import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  isValid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, isValid, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label className="text-[10px] font-mono uppercase tracking-widest text-[#141414]/60">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-md border border-[#141414]/20 bg-transparent px-3 py-2 text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#141414] disabled:cursor-not-allowed disabled:opacity-50 font-mono",
            isValid && "border-emerald-600 focus:ring-emerald-600",
            error && "border-rose-600 focus:ring-rose-600",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-[10px] font-mono text-rose-500 uppercase tracking-tight">
            {error}
          </p>
        )}
      </div>
    );
  }
);
