
import React from 'react';
import { Logo } from '@/components/common/Logo';
import { PawButton } from '@/components/ui/paw-button';
import { Menu, X, User, Bell, Shield, FileText, Camera, Brain, Settings, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  showNavigation?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ showNavigation = true }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: User },
    { name: 'Claims', href: '/claims', icon: FileText },
    { name: 'Policies', href: '/policies', icon: Shield },
    { name: 'Pet Identity', href: '/pet-identity', icon: Camera },
    { name: 'AI Assistant', href: '/ai-chat', icon: Brain },
    { name: 'Vet Portal', href: '/vet', icon: Settings }
  ];

  if (!showNavigation) return null;

  return (
    <header className="relative z-50">
      <div className="glass-container border-b border-white/20 backdrop-blur-glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo size="md" />
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-700 hover:text-petinsure-teal-600 hover:bg-white/10 font-medium transition-all duration-200 group"
                >
                  <item.icon size={18} className="group-hover:scale-110 transition-transform" />
                  {item.name}
                </a>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <button className="relative p-2 text-gray-500 hover:text-petinsure-teal-600 transition-colors rounded-full hover:bg-white/10">
                <Bell size={20} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>
              <PawButton variant="ghost" size="sm">
                <User size={16} />
                Profile
              </PawButton>
              <PawButton size="sm">
                <Plus size={16} />
                Quick Claim
              </PawButton>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-gray-500 hover:text-petinsure-teal-600 rounded-full hover:bg-white/10 transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 bg-white/5 backdrop-blur-glass">
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 py-3 px-3 rounded-xl text-gray-700 hover:text-petinsure-teal-600 hover:bg-white/10 font-medium transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon size={18} />
                  {item.name}
                </a>
              ))}
              <div className="pt-4 border-t border-white/20">
                <PawButton variant="ghost" size="sm" className="w-full justify-start mb-2">
                  <User size={16} />
                  Profile
                </PawButton>
                <PawButton size="sm" className="w-full">
                  <Plus size={16} />
                  Quick Claim
                </PawButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
