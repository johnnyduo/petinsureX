
import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { GlassCard } from './glass-card';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className
}) => {
  const sizeClasses = {
    sm: 'max-w-sm',      // ~384px - notifications, confirmations
    md: 'max-w-md',      // ~448px - forms, profiles  
    lg: 'max-w-lg',      // ~512px - detailed forms
    xl: 'max-w-2xl',     // ~672px - complex workflows
    full: 'max-w-4xl'    // ~896px - dashboards, reports
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fixed backdrop with consistent glass effect - prevents color sinking */}
      <div 
        className="absolute inset-0 modal-backdrop-glass transition-opacity"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
          backdropFilter: 'blur(24px)',
          willChange: 'backdrop-filter'
        }}
        onClick={onClose}
      />
      
      {/* Modal with improved z-index and animation */}
      <div
        className={cn(
          "relative w-full modal-content-glass max-h-[90vh] overflow-hidden",
          sizeClasses[size],
          className
        )}
        style={{ 
          zIndex: 51,
          willChange: 'transform, opacity'
        }}
      >
        <GlassCard 
          variant="glass"
          className="overflow-hidden flex flex-col max-h-[90vh]"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(6, 182, 212, 0.15)'
          }}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors duration-200"
                aria-label="Close modal"
              >
                <X size={16} className="text-gray-600" />
              </button>
            </div>
          )}
          
          {/* Content with scrollable area */}
          <div className={cn(
            "flex-1 overflow-y-auto",
            title ? 'p-4' : 'p-4'
          )}>
            {children}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
