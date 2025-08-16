
import React from 'react';
import { cn } from '@/lib/utils';
import { CardVariant } from '@/types';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  hover?: boolean;
  children: React.ReactNode;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'glass', hover = true, children, ...props }, ref) => {
    const variants = {
      default: "bg-white border border-gray-200 rounded-2xl shadow-sm",
      glass: "glass-container",
      solid: "bg-white border border-gray-200 rounded-2xl shadow-lg",
      outline: "border-2 border-petinsure-teal-200 rounded-2xl bg-transparent"
    };

    return (
      <div
        ref={ref}
        className={cn(
          "transition-all duration-300 ease-out",
          variants[variant],
          // Improved hover effects with better performance
          hover && variant === 'glass' && "hover:glass-card-hover hover:scale-[1.02] hover:-translate-y-1",
          hover && variant !== 'glass' && "hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1",
          className
        )}
        style={{
          willChange: hover ? 'transform, box-shadow, background-color' : 'auto',
          ...props.style
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
