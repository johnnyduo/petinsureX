
import React, { useState } from 'react';
import { Logo } from '@/components/common/Logo';
import { PawButton } from '@/components/ui/paw-button';
import { Modal } from '@/components/ui/modal';
import { Menu, X, User, Bell, Shield, FileText, Camera, Brain, Plus, Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {
  showNavigation?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ showNavigation = true }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showQuickClaimModal, setShowQuickClaimModal] = useState(false);

  // Consolidated navigation - removed Vet Portal, cleaner structure
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Shield },
    { name: 'Claims', href: '/claims', icon: FileText },
    { name: 'Policies', href: '/policies', icon: Shield },
    { name: 'Pet ID', href: '/pet-identity', icon: Camera }, // Shortened name
    { name: 'AI Assistant', href: '/ai-chat', icon: Brain }
  ];

  // Mock notifications
  const notifications = [
    { id: 1, type: 'claim', message: 'Claim #CLM-001 has been approved', time: '2 min ago', unread: true },
    { id: 2, type: 'policy', message: 'Policy renewal reminder - 7 days left', time: '1 hour ago', unread: true },
    { id: 3, type: 'update', message: 'New AI features available', time: '2 hours ago', unread: false },
  ];

  if (!showNavigation) return null;

  return (
    <>
      <header className="relative z-50">
        <div className="glass-container border-b border-white/20 backdrop-blur-glass">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Logo size="md" />
              
              {/* Desktop Navigation - More compact */}
              <nav className="hidden md:flex items-center space-x-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-700 hover:text-petinsure-teal-600 hover:bg-white/10 font-medium transition-all duration-200 group"
                  >
                    <item.icon size={16} className="group-hover:scale-110 transition-transform" />
                    {item.name}
                  </a>
                ))}
              </nav>

              {/* Right side actions - More compact */}
              <div className="hidden md:flex items-center gap-2">
                <button 
                  onClick={() => setShowNotificationModal(true)}
                  className="relative p-2 text-gray-500 hover:text-petinsure-teal-600 transition-colors rounded-full hover:bg-white/10"
                >
                  <Bell size={18} />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                </button>
                
                <PawButton 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowProfileModal(true)}
                >
                  <User size={14} />
                  Profile
                </PawButton>
                
                <PawButton 
                  size="sm"
                  onClick={() => setShowQuickClaimModal(true)}
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

      {/* Notification Modal - Compact size */}
      <Modal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        title="Notifications"
        size="md"
      >
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={cn(
                "p-4 rounded-xl border transition-all duration-200 hover:bg-gray-50",
                notification.unread ? "border-petinsure-teal-200 bg-petinsure-teal-50" : "border-gray-200"
              )}
            >
              <p className="text-sm font-medium text-gray-900">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <button className="w-full p-2 text-center text-sm text-petinsure-teal-600 hover:text-petinsure-teal-700">
            Mark all as read
          </button>
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
