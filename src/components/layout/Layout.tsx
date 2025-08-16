
import React from 'react';
import { Logo } from '@/components/common/Logo';
import { PawButton } from '@/components/ui/paw-button';
import { Menu, X, User, Bell } from 'lucide-react';
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
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Claims', href: '/claims' },
    { name: 'Policies', href: '/policies' },
    { name: 'Support', href: '/support' }
  ];

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30", className)}>
      {showNavigation && (
        <header className="relative">
          <div className="glass-container border-b border-white/20 backdrop-blur-glass">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <Logo size="md" />
                
                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-gray-700 hover:text-petinsure-teal-600 font-medium transition-colors duration-200"
                    >
                      {item.name}
                    </a>
                  ))}
                </nav>

                <div className="hidden md:flex items-center gap-4">
                  <button className="p-2 text-gray-500 hover:text-petinsure-teal-600 transition-colors">
                    <Bell size={20} />
                  </button>
                  <PawButton variant="ghost" size="sm">
                    <User size={16} />
                    Profile
                  </PawButton>
                </div>

                {/* Mobile menu button */}
                <button
                  className="md:hidden p-2 text-gray-500 hover:text-petinsure-teal-600"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-white/20">
                <div className="px-4 py-4 space-y-3">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block py-2 text-gray-700 hover:text-petinsure-teal-600 font-medium transition-colors duration-200"
                    >
                      {item.name}
                    </a>
                  ))}
                  <div className="pt-4 border-t border-white/20">
                    <PawButton variant="ghost" size="sm" className="w-full justify-start">
                      <User size={16} />
                      Profile
                    </PawButton>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>
      )}

      <main className="relative">
        {children}
      </main>

      {/* Floating action button for quick claim (mobile) */}
      <div className="fixed bottom-6 right-6 md:hidden z-50">
        <PawButton size="lg" className="rounded-full shadow-paw">
          <span className="text-xl">🐾</span>
          Quick Claim
        </PawButton>
      </div>
    </div>
  );
};
