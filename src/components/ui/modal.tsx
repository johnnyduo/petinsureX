
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
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl'
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
          "relative w-full modal-content-glass",
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
          className="overflow-hidden"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 20px 40px rgba(6, 182, 212, 0.15)'
          }}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                aria-label="Close modal"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>
          )}
          
          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
