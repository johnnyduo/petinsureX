
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';
import { PawButton } from '@/components/ui/paw-button';
import { Modal } from '@/components/ui/modal';
import { FullLanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { Menu, X, Shield, FileText, Camera, Brain, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/translation';

interface NavbarProps {
  showNavigation?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ showNavigation = true }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();



  // Navigation with translations
  const navigation = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: Shield },
    { name: t('nav.claims'), href: '/claims', icon: FileText },
    { name: t('nav.policies'), href: '/policies', icon: Shield },
    { name: t('nav.pet_identity'), href: '/pet-identity', icon: Camera },
    { name: t('nav.ai_assistant'), href: '/ai-chat', icon: Brain }
  ];

  if (!showNavigation) return null;

  return (
    <>
      <header className="relative z-50">
        <div className="glass-container border-b border-white/20 backdrop-blur-glass">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Logo size="md" />
              
              {/* Desktop Navigation with balanced typography */}
              <nav className="hidden md:flex items-center space-x-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-nav-item flex items-center gap-2 px-3 py-2 rounded-xl text-gray-700 hover:text-petinsure-teal-600 hover:bg-white/10 transition-all duration-200 group"
                  >
                    <item.icon size={16} className="group-hover:scale-110 transition-transform" />
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Right side actions with consistent sizing */}
              <div className="hidden md:flex items-center gap-3">
                <FullLanguageSwitcher />
                
                <PawButton 
                  size="sm"
                  onClick={() => navigate('/onboarding')}
                  className="text-button-sm bg-petinsure-teal-600 hover:bg-petinsure-teal-700 text-white border-0 shadow-lg hover:shadow-xl"
                >
                  <Plus size={14} />
                  {t('landing.add_new_pet')}
                </PawButton>
              </div>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 text-gray-500 hover:text-petinsure-teal-600 rounded-full hover:bg-white/10 transition-all"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-white/20 bg-white/5 backdrop-blur-glass">
              <div className="px-4 py-4 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center gap-3 py-3 px-3 rounded-xl text-gray-700 hover:text-petinsure-teal-600 hover:bg-white/10 font-medium transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon size={16} />
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4 border-t border-white/20 space-y-2">
                  <div className="w-full flex justify-center">
                    <FullLanguageSwitcher />
                  </div>
                  <PawButton 
                    size="sm" 
                    className="w-full bg-petinsure-teal-600 hover:bg-petinsure-teal-700 text-white border-0 shadow-lg"
                    onClick={() => {
                      navigate('/onboarding');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Plus size={14} />
                    Add New Pet & Get Coverage
                  </PawButton>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};
