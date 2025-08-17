
import React from 'react';
import { cn } from '@/lib/utils';
import { CardVariant } from '@/types';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hover?: boolean;
  children: React.ReactNode;
  borderStyle?: 'subtle' | 'prominent' | 'none';
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'glass', hover = true, borderStyle = 'subtle', children, ...props }, ref) => {
    const variants = {
      default: "bg-white border border-petinsure-teal-200/60 rounded-2xl shadow-sm",
      glass: "glass-container",
      solid: "bg-white border border-petinsure-teal-200/80 rounded-2xl shadow-lg",
      outline: "border-2 border-petinsure-teal-300 rounded-2xl bg-transparent"
    };

    const borderStyles = {
      subtle: variant === 'glass' ? 'border-petinsure-teal-200/40' : 'border-petinsure-teal-200/60',
      prominent: 'border-petinsure-teal-400/80',
      none: 'border-transparent'
    };

    return (
      <div
        ref={ref}
        className={cn(
          "transition-none", // Remove all transitions
          variants[variant],
          borderStyles[borderStyle],
          // Remove all hover effects completely
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
