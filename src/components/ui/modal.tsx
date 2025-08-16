
import React, { useEffect } from 'react';
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
  showCloseButton?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className,
  showCloseButton = true
}) => {
  const sizeClasses = {
    sm: 'max-w-sm',      // ~384px - notifications, confirmations
    md: 'max-w-md',      // ~448px - forms, profiles  
    lg: 'max-w-2xl',     // ~672px - detailed forms
    xl: 'max-w-4xl',     // ~896px - complex workflows
    full: 'max-w-6xl'    // ~1152px - dashboards, reports
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced backdrop with smooth animation */}
      <div 
        className="absolute inset-0 transition-all duration-300 ease-out"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(12px)',
          opacity: isOpen ? 1 : 0
        }}
        onClick={onClose}
      />
      
      {/* Modal container with smooth entrance animation */}
      <div
        className={cn(
          "relative w-full transform transition-all duration-300 ease-out",
          sizeClasses[size],
          className,
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        )}
        style={{ 
          zIndex: 51,
          maxHeight: 'calc(100vh - 2rem)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <GlassCard 
          variant="glass"
          className="aura-teal-glow shadow-2xl border border-petinsure-teal-200/30 overflow-hidden flex flex-col"
          borderStyle="subtle"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            maxHeight: 'calc(100vh - 2rem)'
          }}
        >
          {/* Header with pet-friendly styling */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-petinsure-teal-100/60 bg-gradient-to-r from-petinsure-teal-50/30 to-transparent flex-shrink-0">
              <h2 className="font-display text-xl font-semibold text-gray-900 flex items-center gap-2">
                {title}
              </h2>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-petinsure-teal-100/50 rounded-full transition-all duration-200 hover:scale-110 group"
                  aria-label="Close modal"
                >
                  <X size={20} className="text-gray-500 group-hover:text-gray-700 transition-colors" />
                </button>
              )}
            </div>
          )}
          
          {/* Content with enhanced scrolling */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className={cn(
              "p-6",
              !title && "pt-8"
            )}>
              {children}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
