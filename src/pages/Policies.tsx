
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { GlassCard } from '@/components/ui/glass-card';
import { PawButton } from '@/components/ui/paw-button';
import { Modal } from '@/components/ui/modal';
import { cn } from '@/lib/utils';
import { 
  Shield, 
  Plus, 
  Eye, 
  Download, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  AlertTriangle,
  Heart,
  Zap,
  FileText,
  Clock,
  X,
  Check
} from 'lucide-react';
import { Policy, Pet } from '@/types';

interface PlanFeature {
  text: string;
  included: boolean;
}

interface CoveragePlan {
  id: string;
  name: string;
  price: number;
  coverage: number;
  features: PlanFeature[];
  popular?: boolean;
  description?: string;
}

const Policies = () => {
  const [showPolicyDetails, setShowPolicyDetails] = useState<string | null>(null);
  const [showNewPolicyModal, setShowNewPolicyModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('standard'); // Default to Standard plan
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);

  // Handle keyboard navigation for plan selection
  const handleKeyPress = (e: React.KeyboardEvent, planType: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedPlan(planType);
    }
  };

  const coveragePlans: CoveragePlan[] = [
    {
      id: 'basic',
      name: 'PetInsureX Basic',
      price: 189,
      coverage: 2500,
      description: 'Essential coverage for accidents and basic care',
      features: [
        { text: 'Accident Coverage', included: true },
        { text: 'Emergency Surgery', included: true },
        { text: '24/7 Helpline Support', included: true },
        { text: 'Basic Vet Network (200+ clinics)', included: true },
        { text: 'Illness Coverage', included: false },
        { text: 'Wellness Exams', included: false },
        { text: 'Dental Care', included: false },
        { text: 'Alternative Therapies', included: false }
      ]
    },
    {
      id: 'standard',
      name: 'PetInsureX Standard',
      price: 234,
      coverage: 3000,
      description: 'Comprehensive care for most health needs',
      popular: true,
      features: [
        { text: 'Accidents & Illness Coverage', included: true },
        { text: 'Preventive Care & Wellness', included: true },
        { text: 'Specialist Referrals', included: true },
        { text: 'Extended Vet Network (400+ clinics)', included: true },
        { text: 'Prescription Medications', included: true },
        { text: 'Basic Dental Care', included: true },
        { text: 'Hereditary Conditions', included: false },
        { text: 'Alternative Therapies', included: false }
      ]
    },
    {
      id: 'premium',
      name: 'PetInsureX Premium Plus',
      price: 456,
      coverage: 4500,
      description: 'Complete protection with advanced features',
      features: [
        { text: 'Comprehensive Coverage', included: true },
        { text: 'Hereditary & Genetic Conditions', included: true },
        { text: 'Alternative Therapies & Acupuncture', included: true },
        { text: 'Premium Vet Network (600+ clinics)', included: true },
        { text: 'Wellness Programs & Nutrition', included: true },
        { text: 'AI Health Monitoring & Alerts', included: true },
        { text: 'Advanced Dental & Orthodontics', included: true },
        { text: 'Behavioral Therapy', included: true }
      ]
    }
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    // Optional: Close modal after selection or show confirmation
    // setShowNewPolicyModal(false);
  };

  const handleProceedWithPlan = () => {
    if (selectedPlan) {
      // Here you would typically handle the policy creation/purchase
      console.log('Proceeding with plan:', selectedPlan);
      // For demo purposes, we'll just close the modal
      setShowNewPolicyModal(false);
      // You could also show a success message or redirect to payment
    }
  };

  const mockPolicies: Policy[] = [
    {
      id: 'policy-001',
      petId: 'pet-mali',
      provider: 'PetInsureX Premium Plus',
      coverageLimit: 4500,
      remaining: 3250,
      premium: 456,
      start: '2024-08-01',
      end: '2025-07-31',
      status: 'active',
      createdAt: '2024-08-01T00:00:00Z',
      termsUrl: '/policy-terms-premium-001.pdf'
    },
    {
      id: 'policy-002',
      petId: 'pet-taro',
      provider: 'PetInsureX Standard',
      coverageLimit: 3000,
      remaining: 2820,
      premium: 234,
      start: '2024-02-18',
      end: '2025-02-17',
      status: 'active',
      createdAt: '2024-02-18T00:00:00Z',
      termsUrl: '/policy-terms-standard-002.pdf'
    },
    {
      id: 'policy-003',
      petId: 'pet-luna',
      provider: 'PetInsureX Basic',
      coverageLimit: 2500,
      remaining: 2500,
      premium: 189,
      start: '2024-08-12',
      end: '2025-08-11',
      status: 'active',
      createdAt: '2024-08-12T00:00:00Z',
      termsUrl: '/policy-terms-basic-003.pdf'
    }
  ];

  const mockPets: Pet[] = [
    {
      id: 'pet-mali',
      ownerId: 'user-1',
      name: 'Mali',
      species: 'dog',
      breed: 'Golden Retriever',
      ageMonths: 38,
      vaccinated: true,
      photos: ['/mock-mali1.jpg', '/mock-mali2.jpg'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-08-19T00:00:00Z'
    },
    {
      id: 'pet-taro',
      ownerId: 'user-1',
      name: 'Taro',
      species: 'cat',
      breed: 'British Shorthair',
      ageMonths: 32,
      vaccinated: true,
      photos: ['/mock-taro1.jpg', '/mock-taro2.jpg'],
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-08-18T00:00:00Z'
    },
    {
      id: 'pet-luna',
      ownerId: 'user-1',
      name: 'Luna',
      species: 'cat',
      breed: 'Ragdoll',
      ageMonths: 18,
      vaccinated: true,
      photos: ['/mock-luna1.jpg', '/mock-luna2.jpg'],
      createdAt: '2024-08-05T00:00:00Z',
      updatedAt: '2024-08-15T00:00:00Z'
    }
  ];  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'expired': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="text-green-600" size={20} />;
      case 'expired': return <Clock className="text-gray-600" size={20} />;
      case 'cancelled': return <AlertTriangle className="text-red-600" size={20} />;
      default: return <Shield className="text-gray-600" size={20} />;
    }
  };

  const coverageTypes = [
    {
      name: 'PetInsureX Basic',
      price: '$160/year',
      coverage: '$1,430',
      features: ['Accidents Only', 'Emergency Care', '24/7 Support', 'Basic Vet Network']
    },
    {
      name: 'PetInsureX Standard',
      price: '$245/year',
      coverage: '$2,350',
      features: ['Accidents & Illness', 'Preventive Care', 'Specialist Referrals', 'Extended Vet Network', 'Prescription Coverage']
    },
    {
      name: 'PetInsureX Premium',
      price: '$345/year',
      coverage: '$2,850',
      features: ['Comprehensive Coverage', 'Hereditary Conditions', 'Alternative Therapies', 'Premium Vet Network', 'Wellness Programs', 'AI Health Monitoring']
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">Insurance Policies</h1>
                <p className="text-gray-600">Manage your pet insurance coverage and benefits</p>
              </div>
              <PawButton onClick={() => setShowNewPolicyModal(true)}>
                <Plus size={20} />
                Get New Policy
              </PawButton>
            </div>
          </div>

          {/* Stats Cards with enhanced borders and teal aura */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Active Policies', value: '2', icon: Shield, color: 'text-blue-600' },
              { label: 'Total Coverage', value: '$5,200', icon: Heart, color: 'text-green-600' },
              { label: 'Annual Premium', value: '$590', icon: CreditCard, color: 'text-purple-600' },
              { label: 'Coverage Used', value: '18%', icon: Zap, color: 'text-petinsure-teal-600' }
            ].map((stat, index) => (
              <GlassCard key={index} className="p-6 aura-teal-subtle" borderStyle="prominent">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={cn("p-3 rounded-xl bg-white/50 border border-petinsure-teal-200/50", stat.color)}>
                    <stat.icon size={24} />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Active Policies with enhanced borders and teal aura */}
          <GlassCard className="p-6 mb-8 aura-teal-prominent" borderStyle="prominent">
            <h2 className="font-display text-xl font-semibold text-gray-900 mb-6">Your Active Policies</h2>
            <div className="space-y-6">
              {mockPolicies.map((policy) => {
                const pet = mockPets.find(p => p.id === policy.petId);
                const usagePercentage = ((policy.coverageLimit - policy.remaining) / policy.coverageLimit) * 100;
                
                return (
                  <div key={policy.id} className="p-6 rounded-xl bg-white/30 border-2 border-petinsure-teal-200/60 aura-teal-subtle">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {pet?.name?.charAt(0) || 'P'}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-display text-lg font-semibold text-gray-900">{policy.provider}</h3>
                            <span className={cn("px-3 py-1 rounded-full text-xs font-medium border", getStatusColor(policy.status))}>
                              {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-2">Pet: {pet?.name} ({pet?.breed})</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Policy: #{policy.id.split('-')[1].toUpperCase()}</span>
                            <span>Valid until: {new Date(policy.end).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(policy.status)}
                        <PawButton
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowPolicyDetails(policy.id)}
                        >
                          View Details
                        </PawButton>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Coverage Limit</h4>
                        <p className="text-2xl font-bold text-gray-900">${policy.coverageLimit.toLocaleString()}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Remaining</h4>
                        <p className="text-2xl font-bold text-green-600">${policy.remaining.toLocaleString()}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Annual Premium</h4>
                        <p className="text-2xl font-bold text-gray-900">${policy.premium.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Coverage Used</span>
                        <span>{usagePercentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${usagePercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Quick Actions with enhanced borders and teal aura */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="p-6 text-center cursor-pointer aura-teal-glow" borderStyle="prominent">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={24} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-xl text-gray-900 mb-2">Policy Documents</h3>
              <p className="text-sm text-gray-600 mb-4">Download and view your policy terms</p>
              <PawButton variant="secondary" size="sm">
                <Download size={16} />
                Download
              </PawButton>
            </GlassCard>

            <GlassCard className="p-6 text-center cursor-pointer aura-teal-glow" borderStyle="prominent">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={24} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-xl text-gray-900 mb-2">Renewal Reminder</h3>
              <p className="text-sm text-gray-600 mb-4">Set up automatic renewal notifications</p>
              <PawButton variant="secondary" size="sm">
                <Calendar size={16} />
                Setup
              </PawButton>
            </GlassCard>

            <GlassCard className="p-6 text-center cursor-pointer aura-teal-glow" borderStyle="prominent">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard size={24} className="text-purple-600" />
              </div>
              <h3 className="font-semibold text-xl text-gray-900 mb-2">Payment History</h3>
              <p className="text-sm text-gray-600 mb-4">View your premium payment records</p>
              <PawButton variant="secondary" size="sm">
                <Eye size={16} />
                View History
              </PawButton>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* New Policy Modal - Improved Design */}
      <Modal 
        isOpen={showNewPolicyModal} 
        onClose={() => setShowNewPolicyModal(false)}
        size="full"
      >
        {/* Desktop Layout */}
        <div className="hidden md:flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex-shrink-0 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Choose Your Coverage Plan
                </h2>
                <p className="text-lg text-gray-600">
                  Select the best insurance plan for your pet's needs
                </p>
              </div>
              <button
                onClick={() => setShowNewPolicyModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content - Desktop Grid */}
          <div className="flex-1 overflow-y-auto px-8 py-8">
            <div 
              className="grid grid-cols-3 gap-8 max-w-6xl mx-auto"
              role="radiogroup" 
              aria-label="Choose your coverage plan"
            >
              {coveragePlans.map((plan) => (
                <div
                  key={plan.id}
                  className={cn(
                    "relative rounded-xl border-2 p-6 bg-white transition-all duration-200 cursor-pointer min-h-[460px] flex flex-col",
                    selectedPlan === plan.id 
                      ? "border-teal-500 shadow-lg" 
                      : plan.popular
                      ? "border-teal-300 shadow-md"
                      : "border-gray-200 hover:border-teal-200 hover:shadow-md"
                  )}
                  onClick={() => handlePlanSelect(plan.id)}
                  onKeyDown={(e) => handleKeyPress(e, plan.id)}
                  role="radio"
                  aria-checked={selectedPlan === plan.id}
                  tabIndex={0}
                  aria-label={`${plan.name} - ${plan.description} - $${plan.price} per year`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-teal-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="text-center mb-6 flex-shrink-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {plan.name}
                    </h3>
                    <div className="text-4xl font-bold text-teal-600 mb-2">
                      ${plan.price}/year
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      Coverage up to ${plan.coverage.toLocaleString()}
                    </p>
                    {plan.description && (
                      <p className="text-sm text-gray-600">
                        {plan.description}
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="flex-1 mb-4">
                    <div className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center mr-3 flex-shrink-0">
                            <Check size={12} className="text-teal-600" />
                          </div>
                          <span className="text-sm text-gray-700">
                            {feature.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Select Button */}
                  <div className="flex-shrink-0">
                    <PawButton
                      className={cn(
                        "w-full py-3",
                        selectedPlan === plan.id
                          ? "bg-teal-600 hover:bg-teal-700"
                          : plan.popular
                          ? "bg-teal-500 hover:bg-teal-600"
                          : "bg-gray-600 hover:bg-gray-700"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlanSelect(plan.id);
                      }}
                    >
                      {selectedPlan === plan.id ? '✓ Selected' : 'Choose This Plan'}
                    </PawButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Desktop Footer */}
          <div className="flex-shrink-0 px-8 py-6 border-t border-gray-200 bg-gray-50/50">
            <div className="flex items-center justify-between max-w-6xl mx-auto">
              <div className="text-sm text-gray-600">
                {selectedPlan ? `Selected: ${coveragePlans.find(p => p.id === selectedPlan)?.name}` : 'No plan selected'}
              </div>
              <div className="flex gap-3">
                <PawButton variant="ghost" onClick={() => setShowNewPolicyModal(false)}>
                  Cancel
                </PawButton>
                <PawButton 
                  onClick={handleProceedWithPlan}
                  disabled={!selectedPlan}
                  className={cn(
                    selectedPlan ? "bg-teal-600 hover:bg-teal-700" : "bg-gray-400 cursor-not-allowed"
                  )}
                >
                  {selectedPlan ? 'Continue with Selected Plan' : 'Select a Plan to Continue'}
                </PawButton>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Modal Sheet */}
        <div className="md:hidden flex flex-col h-[90vh]">
          {/* Header */}
          <div className="flex-shrink-0 px-4 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-gray-900">
                Choose Your Coverage Plan
              </h2>
              <button
                onClick={() => setShowNewPolicyModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-600">
              Select the best insurance plan for your pet's needs
            </p>
          </div>

          {/* Content - Mobile Stack */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <div 
              className="space-y-4"
              role="radiogroup" 
              aria-label="Choose your coverage plan"
            >
              {coveragePlans.map((plan) => (
                <div
                  key={plan.id}
                  className={cn(
                    "relative rounded-lg border-2 p-4 bg-white transition-all duration-200 cursor-pointer",
                    selectedPlan === plan.id 
                      ? "border-teal-500 shadow-md" 
                      : plan.popular
                      ? "border-teal-300"
                      : "border-gray-200"
                  )}
                  onClick={() => handlePlanSelect(plan.id)}
                  onKeyDown={(e) => handleKeyPress(e, plan.id)}
                  role="radio"
                  aria-checked={selectedPlan === plan.id}
                  tabIndex={0}
                  aria-label={`${plan.name} - ${plan.description} - $${plan.price} per year`}
                >
                  {/* Popular Badge */}
                  {plan.popular && (
                    <div className="absolute -top-2 right-4">
                      <span className="bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {plan.name}
                        </h3>
                        <div className="text-2xl font-bold text-teal-600">
                          ${plan.price}/year
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Coverage up to</p>
                        <p className="text-lg font-semibold text-gray-900">
                          ${plan.coverage.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {plan.description && (
                      <p className="text-sm text-gray-600">
                        {plan.description}
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="grid grid-cols-1 gap-2 mb-4">
                    {plan.features.slice(0, 4).map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-4 h-4 rounded-full bg-teal-100 flex items-center justify-center mr-2 flex-shrink-0">
                          <Check size={10} className="text-teal-600" />
                        </div>
                        <span className="text-sm text-gray-700">
                          {feature.text}
                        </span>
                      </div>
                    ))}
                    {plan.features.length > 4 && (
                      <p className="text-xs text-gray-500 ml-6">
                        +{plan.features.length - 4} more features
                      </p>
                    )}
                  </div>

                  {/* Select Button */}
                  <PawButton
                    className={cn(
                      "w-full",
                      selectedPlan === plan.id
                        ? "bg-teal-600 hover:bg-teal-700"
                        : plan.popular
                        ? "bg-teal-500 hover:bg-teal-600"
                        : "bg-gray-600 hover:bg-gray-700"
                    )}
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    {selectedPlan === plan.id ? '✓ Selected' : 'Choose This Plan'}
                  </PawButton>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mobile Footer */}
          <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200 bg-gray-50/50">
            <div className="mb-2">
              <p className="text-sm text-gray-600 text-center">
                {selectedPlan ? `Selected: ${coveragePlans.find(p => p.id === selectedPlan)?.name}` : 'No plan selected'}
              </p>
            </div>
            <div className="flex gap-3">
              <PawButton variant="ghost" className="flex-1" onClick={() => setShowNewPolicyModal(false)}>
                Cancel
              </PawButton>
              <PawButton 
                className={cn(
                  "flex-1",
                  selectedPlan ? "bg-teal-600 hover:bg-teal-700" : "bg-gray-400 cursor-not-allowed"
                )}
                onClick={handleProceedWithPlan}
                disabled={!selectedPlan}
              >
                {selectedPlan ? 'Continue' : 'Select Plan'}
              </PawButton>
            </div>
          </div>
        </div>
      </Modal>

      {/* Policy Details Modal */}
      {showPolicyDetails && (
        <Modal
          isOpen={!!showPolicyDetails}
          onClose={() => setShowPolicyDetails(null)}
          title="Policy Details"
          size="lg"
        >
          {(() => {
            const policy = mockPolicies.find(p => p.id === showPolicyDetails);
            const pet = mockPets.find(p => p.id === policy?.petId);
            
            if (!policy) return <div>Policy not found</div>;

            return (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 text-lg sm:text-xl">Policy Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Policy Number:</span>
                        <span className="font-medium">#{policy.id.split('-')[1].toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Plan:</span>
                        <span className="font-medium">{policy.provider}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pet:</span>
                        <span className="font-medium">{pet?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(policy.status))}>
                          {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Valid From:</span>
                        <span className="font-medium">{new Date(policy.start).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Valid Until:</span>
                        <span className="font-medium">{new Date(policy.end).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Coverage Details</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Coverage Limit:</span>
                        <span className="font-medium">${policy.coverageLimit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Remaining:</span>
                        <span className="font-medium text-green-600">${policy.remaining.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Annual Premium:</span>
                        <span className="font-medium">${policy.premium.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Deductible:</span>
                        <span className="font-medium">$15 per claim</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Co-pay:</span>
                        <span className="font-medium">20%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">What's Covered</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      'Accidents & Injuries',
                      'Illnesses & Diseases',
                      'Emergency Care',
                      'Surgery & Hospitalization',
                      'Prescription Medications',
                      'Diagnostic Tests',
                      'Specialist Referrals',
                      'Preventive Care (Annual)'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">What's Not Covered</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      'Pre-existing Conditions',
                      'Cosmetic Procedures',
                      'Breeding & Pregnancy',
                      'Experimental Treatments'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <AlertTriangle size={16} className="text-red-500" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-gray-200">
                  <PawButton variant="ghost" onClick={() => setShowPolicyDetails(null)}>
                    Close
                  </PawButton>
                  <PawButton variant="secondary">
                    <Download size={16} />
                    Download Policy
                  </PawButton>
                  <PawButton>
                    Modify Coverage
                  </PawButton>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}
    </Layout>
  );
};

export default Policies;
