
import React, { useState } from 'react';
import { Logo } from '@/components/common/Logo';
import { PawButton } from '@/components/ui/paw-button';
import { Modal } from '@/components/ui/modal';
import { Menu, X, User, Shield, FileText, Camera, Brain, Plus, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  showNavigation?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ showNavigation = true }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showQuickClaimModal, setShowQuickClaimModal] = useState(false);

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
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-nav-item flex items-center gap-2 px-3 py-2 rounded-xl text-gray-700 hover:text-petinsure-teal-600 hover:bg-white/10 transition-all duration-200 group"
                  >
                    <item.icon size={16} className="group-hover:scale-110 transition-transform" />
                    {item.name}
                  </a>
                ))}
              </nav>

              {/* Right side actions with consistent sizing */}
              <div className="hidden md:flex items-center gap-3">
                <PawButton 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowProfileModal(true)}
                  className="text-button-sm"
                >
                  <User size={14} />
                  Profile
                </PawButton>
                
                <PawButton 
                  size="sm"
                  onClick={() => setShowQuickClaimModal(true)}
                  className="text-button-sm"
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
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 py-3 px-3 rounded-xl text-gray-700 hover:text-petinsure-teal-600 hover:bg-white/10 font-medium transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon size={16} />
                    {item.name}
                  </a>
                ))}
                <div className="pt-4 border-t border-white/20 space-y-2">
                  <PawButton 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => {
                      setShowProfileModal(true);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <User size={14} />
                    Profile
                  </PawButton>
                  <PawButton 
                    size="sm" 
                    className="w-full"
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

      {/* Profile Modal - Compact size */}
      <Modal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        title="Profile Settings"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <User size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Jun Nakamura</h3>
              <p className="text-gray-600">jun.nakamura@email.com</p>
            </div>
          </div>
          <div className="space-y-2">
            <button className="w-full p-3 text-left rounded-xl hover:bg-gray-50 flex items-center gap-3">
              <Settings size={16} />
              Account Settings
            </button>
            <button className="w-full p-3 text-left rounded-xl hover:bg-gray-50 flex items-center gap-3">
              <Shield size={16} />
              Privacy & Security
            </button>
            <button className="w-full p-3 text-left rounded-xl hover:bg-gray-50 flex items-center gap-3 text-red-600">
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </Modal>

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
              <option>Taro (Shiba Inu)</option>
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
