
import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showNavigation = true,
  className 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Watch for modal state changes
  useEffect(() => {
    const checkModalState = () => {
      const hasModal = document.body.getAttribute('data-modal-open') === 'true';
      setIsModalOpen(hasModal);
    };

    // Initial check
    checkModalState();

    // Create observer for body attribute changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-modal-open') {
          checkModalState();
        }
      });
    });
    
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['data-modal-open'] 
    });

    // Also listen for direct attribute changes as fallback
    const intervalCheck = setInterval(checkModalState, 100);

    return () => {
      observer.disconnect();
      clearInterval(intervalCheck);
    };
  }, []);

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30", className)}>
      <Navbar showNavigation={showNavigation} />
      
      <main className="relative">
        {children}
      </main>

      {/* Floating action button for quick claim - Hidden on mobile responsive */}
      {showNavigation && (
        <div 
          className={cn(
            "fixed bottom-6 right-6 hidden md:block quick-claim-floating",
            isModalOpen && "hidden"
          )}
        >
          <button className="paw-button text-white font-medium px-6 py-3 min-h-[52px] rounded-full shadow-paw flex items-center gap-2 hover:scale-105 active:scale-95 transition-all duration-200">
            <span className="text-xl">🐾</span>
            Quick Claim
          </button>
        </div>
      )}
    </div>
  );
};
