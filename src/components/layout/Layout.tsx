
import React from 'react';
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
  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30", className)}>
      <Navbar showNavigation={showNavigation} />
      
      <main className="relative">
        {children}
      </main>

      {/* Floating action button for quick claim (mobile) */}
      {showNavigation && (
        <div className="fixed bottom-6 right-6 md:hidden z-50">
          <button className="paw-button text-white font-medium px-6 py-3 min-h-[52px] rounded-full shadow-paw flex items-center gap-2 hover:scale-105 active:scale-95 transition-all duration-200">
            <span className="text-xl">🐾</span>
            Quick Claim
          </button>
        </div>
      )}
    </div>
  );
};
