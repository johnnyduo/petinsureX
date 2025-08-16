
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
    xl: 'max-w-3xl',     // ~768px - reduced from 896px for better mobile fit
    full: 'max-w-4xl'    // ~896px - reduced from 1152px for better mobile fit
  };

  // Mobile-first responsive adjustments with better constraints
  const mobileClasses = {
    sm: 'mx-3 sm:mx-auto w-[calc(100%-1.5rem)] sm:w-full',
    md: 'mx-3 sm:mx-auto w-[calc(100%-1.5rem)] sm:w-full',
    lg: 'mx-3 sm:mx-6 lg:mx-auto w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] lg:w-full',
    xl: 'mx-3 sm:mx-6 lg:mx-8 xl:mx-auto w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] lg:w-[calc(100%-4rem)] xl:w-full',
    full: 'mx-2 sm:mx-4 lg:mx-6 xl:mx-8 w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] lg:w-[calc(100%-3rem)] xl:w-full'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
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
      
      {/* Modal container with smooth entrance animation and mobile optimization */}
      <div
        className={cn(
          "relative transform transition-all duration-300 ease-out",
          "h-full sm:h-auto max-h-screen", // Full height on mobile, constrained max height
          "flex flex-col", // Always use flexbox for proper mobile sizing
          sizeClasses[size],
          mobileClasses[size],
          className,
          isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
        )}
        style={{ 
          zIndex: 51,
          maxHeight: '100vh', // Full viewport height constraint
          minHeight: 'auto', // Allow shrinking on desktop
        }}
        onClick={e => e.stopPropagation()}
      >
        <GlassCard 
          variant="glass"
          className="aura-teal-glow shadow-2xl border border-petinsure-teal-200/30 overflow-hidden flex flex-col h-full rounded-none sm:rounded-xl"
          borderStyle="subtle"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            maxHeight: '100vh', // Full height constraint
            height: '100%', // Take full height on mobile
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
                  className="p-1.5 sm:p-2 hover:bg-petinsure-teal-100/50 rounded-full transition-all duration-200 hover:scale-110 group flex-shrink-0 ml-2"
                  aria-label="Close modal"
                >
                  <X size={18} className="sm:w-5 sm:h-5 text-gray-500 group-hover:text-gray-700 transition-colors" />
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
