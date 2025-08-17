
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
    sm: 'w-full max-w-sm',      // ~384px - notifications, confirmations
    md: 'w-full max-w-md',      // ~448px - forms, profiles  
    lg: 'w-full max-w-lg',      // ~512px - compact forms
    xl: 'w-full max-w-2xl',     // ~672px - detailed forms
    full: 'w-full max-w-7xl'    // ~1280px - policy modals, large workflows
  };

  // Simplified mobile constraints
  const spacingClasses = 'mx-3 sm:mx-6 lg:mx-auto';

  // Handle escape key and modal state tracking with enhanced body lock
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      
      // Enhanced body locking for mobile
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.setAttribute('data-modal-open', 'true');
      document.body.setAttribute('data-scroll-y', scrollY.toString());
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      
      // Restore body state
      const scrollY = parseInt(document.body.getAttribute('data-scroll-y') || '0');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.removeAttribute('data-modal-open');
      document.body.removeAttribute('data-scroll-y');
      window.scrollTo(0, scrollY);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex items-center justify-center overflow-hidden",
      size === 'full' ? 'p-4 sm:p-6 lg:p-8' : 'p-4 sm:p-6 lg:p-8'
    )}>
      {/* Enhanced backdrop with responsive opacity */}
      <div 
        className="absolute inset-0 transition-all duration-300 ease-out"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.3)', // Slightly less dark for desktop
          backdropFilter: 'blur(8px)', // Less blur for better performance
          opacity: isOpen ? 1 : 0
        }}
        onClick={onClose}
      />
      
      {/* Modal container with proper desktop/mobile sizing */}
      <div
        className={cn(
          "modal-container relative transform transition-all duration-300 ease-out",
          size === 'full' 
            ? "w-full h-full max-h-[calc(100vh-4rem)] my-8" // Perfect spacing for full size
            : "h-full sm:h-auto max-h-[calc(100vh-2rem)]", // Smaller modals
          "flex flex-col", // Consistent flexbox layout
          sizeClasses[size],
          size !== 'full' && spacingClasses,
          className,
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        )}
        style={{ 
          zIndex: 51,
          minHeight: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        <GlassCard 
          variant="glass"
          hover={false}
          className="aura-teal-glow shadow-2xl border border-petinsure-teal-200/30 overflow-hidden flex flex-col h-full sm:h-auto rounded-2xl"
          borderStyle="subtle"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            maxHeight: '100%',
            height: '100%', // Full height on mobile
            minHeight: '200px',
          }}
        >
          {/* Header with pet-friendly styling and mobile optimization */}
          {title && (
            <div className="flex items-center justify-between p-3 sm:p-4 lg:p-6 border-b border-petinsure-teal-100/60 bg-gradient-to-r from-petinsure-teal-50/30 to-transparent flex-shrink-0">
              <h2 className="font-display text-base sm:text-lg lg:text-xl font-semibold text-gray-900 flex items-center gap-2 pr-2 min-w-0 flex-1">
                {title}
              </h2>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-1.5 sm:p-2 rounded-full flex-shrink-0 ml-2"
                  aria-label="Close modal"
                >
                  <X size={18} className="sm:w-5 sm:h-5 text-gray-500" />
                </button>
              )}
            </div>
          )}
          
          {/* Content with enhanced scrolling and mobile optimization */}
          <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
            <div className={cn(
              "p-3 sm:p-4 lg:p-6",
              !title && "pt-4 sm:pt-6 lg:pt-8"
            )}>
              {children}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
