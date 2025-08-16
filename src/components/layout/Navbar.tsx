
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';
import { PawButton } from '@/components/ui/paw-button';
import { Modal } from '@/components/ui/modal';
import { Menu, X, Globe, Shield, FileText, Camera, Brain, Plus, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  showNavigation?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ showNavigation = true }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showQuickClaimModal, setShowQuickClaimModal] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('EN');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'EN', name: 'English', flag: '🇺🇸' },
    { code: 'TH', name: 'ไทย', flag: '🇹🇭' },
    { code: 'ID', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'VI', name: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'MS', name: 'Bahasa Malaysia', flag: '🇲🇾' },
    { code: 'PH', name: 'Filipino', flag: '🇵🇭' }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Consolidated navigation - removed Vet Portal, cleaner structure
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Shield },
    { name: 'Claims', href: '/claims', icon: FileText },
    { name: 'Policies', href: '/policies', icon: Shield },
    { name: 'Pet ID', href: '/pet-identity', icon: Camera }, // Shortened name
    { name: 'AI Assistant', href: '/ai-chat', icon: Brain }
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
                <div className="relative" ref={dropdownRef}>
                  <PawButton 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                    className="text-button-sm border border-gray-200/50 hover:border-petinsure-teal-300 hover:bg-petinsure-teal-50/50 text-gray-700 hover:text-petinsure-teal-700"
                  >
                    <Globe size={14} />
                    <span className="text-lg">{languages.find(lang => lang.code === currentLanguage)?.flag}</span>
                    <span className="font-medium">{currentLanguage}</span>
                    <ChevronDown size={12} className={cn("transition-transform", showLanguageDropdown && "rotate-180")} />
                  </PawButton>
                  
                  {showLanguageDropdown && (
                    <>
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowLanguageDropdown(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden backdrop-blur-sm">
                        <div className="bg-gradient-to-b from-gray-50 to-white p-2">
                          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-1 mb-1">
                            Select Language
                          </div>
                          {languages.map((language) => (
                            <button
                              key={language.code}
                              className={cn(
                                "w-full text-left px-3 py-3 hover:bg-petinsure-teal-50 transition-colors flex items-center gap-3 rounded-lg",
                                "text-gray-800 hover:text-petinsure-teal-700",
                                currentLanguage === language.code && "bg-petinsure-teal-50 text-petinsure-teal-700 font-semibold ring-1 ring-petinsure-teal-200"
                              )}
                              onClick={() => {
                                setCurrentLanguage(language.code);
                                setShowLanguageDropdown(false);
                              }}
                            >
                              <span className="text-xl">{language.flag}</span>
                              <div className="flex flex-col flex-1">
                                <span className="font-medium text-sm">{language.name}</span>
                                <span className="text-xs text-gray-500 uppercase font-mono">{language.code}</span>
                              </div>
                              {currentLanguage === language.code && (
                                <div className="flex items-center justify-center w-5 h-5 bg-petinsure-teal-600 rounded-full">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
                
                <PawButton 
                  size="sm"
                  onClick={() => setShowQuickClaimModal(true)}
                  className="text-button-sm bg-petinsure-teal-600 hover:bg-petinsure-teal-700 text-white border-0 shadow-lg hover:shadow-xl"
                >
                  <Plus size={14} />
                  Quick Claim
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
                  <div className="w-full">
                    <PawButton 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start text-gray-700 hover:text-petinsure-teal-600 hover:bg-white/10"
                      onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                    >
                      <Globe size={14} />
                      <span className="text-lg">{languages.find(lang => lang.code === currentLanguage)?.flag}</span>
                      <span>Language ({currentLanguage})</span>
                      <ChevronDown size={12} className={cn("ml-auto transition-transform", showLanguageDropdown && "rotate-180")} />
                    </PawButton>
                    {showLanguageDropdown && (
                      <div className="mt-2 bg-white/10 rounded-lg border border-white/20 overflow-hidden">
                        {languages.map((language) => (
                          <button
                            key={language.code}
                            className={cn(
                              "w-full text-left px-6 py-3 text-sm hover:bg-white/20 transition-colors flex items-center gap-3",
                              "text-gray-700 border-b border-white/10 last:border-b-0",
                              currentLanguage === language.code && "bg-white/20 text-petinsure-teal-700 font-semibold"
                            )}
                            onClick={() => {
                              setCurrentLanguage(language.code);
                              setShowLanguageDropdown(false);
                              setMobileMenuOpen(false);
                            }}
                          >
                            <span className="text-lg">{language.flag}</span>
                            <div className="flex flex-col">
                              <span className="font-medium">{language.name}</span>
                              <span className="text-xs text-gray-600 uppercase">{language.code}</span>
                            </div>
                            {currentLanguage === language.code && (
                              <div className="ml-auto w-2 h-2 bg-petinsure-teal-600 rounded-full"></div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <PawButton 
                    size="sm" 
                    className="w-full bg-petinsure-teal-600 hover:bg-petinsure-teal-700 text-white border-0 shadow-lg"
                    onClick={() => {
                      setShowQuickClaimModal(true);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Plus size={14} />
                    Quick Claim
                  </PawButton>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Quick Claim Modal - Proper size */}
      <Modal
        isOpen={showQuickClaimModal}
        onClose={() => setShowQuickClaimModal(false)}
        title="Quick Claim"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pet Selection
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-petinsure-teal-500 focus:border-transparent">
              <option>Select your pet</option>
              <option>Mali (Golden Retriever)</option>
              <option>Taro (British Shorthair)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Incident Description
            </label>
            <textarea 
              placeholder="Briefly describe what happened..."
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-petinsure-teal-500 focus:border-transparent"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Cost
            </label>
            <input 
              type="number" 
              placeholder="0.00"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-petinsure-teal-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <PawButton variant="ghost" className="flex-1" onClick={() => setShowQuickClaimModal(false)}>
              Cancel
            </PawButton>
            <PawButton className="flex-1">
              Submit Quick Claim
            </PawButton>
          </div>
        </div>
      </Modal>
    </>
  );
};
