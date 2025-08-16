
import React from 'react';
import { cn } from '@/lib/utils';
import { ButtonVariant } from '@/types';

interface PawButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const PawButton = React.forwardRef<HTMLButtonElement, PawButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, disabled, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "btn-paw-primary focus:ring-petinsure-teal-400",
      secondary: "btn-paw-secondary focus:ring-petinsure-teal-400",
      ghost: "btn-paw-ghost focus:ring-petinsure-teal-400",
      danger: "bg-red-500 text-white hover:bg-red-600 hover:scale-105 active:scale-95 rounded-full focus:ring-red-400"
    };

    const sizes = {
      sm: "px-4 py-2 text-sm min-h-[36px]",
      md: "px-6 py-3 text-base min-h-[44px]",
      lg: "px-8 py-4 text-lg min-h-[52px]"
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          loading && "animate-pulse",
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

PawButton.displayName = "PawButton";

export { PawButton };
