
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
  Clock
} from 'lucide-react';
import { Policy, Pet } from '@/types';

const Policies = () => {
  const [showPolicyDetails, setShowPolicyDetails] = useState<string | null>(null);
  const [showNewPolicyModal, setShowNewPolicyModal] = useState(false);

  const mockPolicies: Policy[] = [
    {
      id: 'policy-001',
      petId: 'pet-mali',
      provider: 'PetInsureX Premium',
      coverageLimit: 100000,
      remaining: 85000,
      premium: 12000,
      start: '2024-01-01',
      end: '2024-12-31',
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      termsUrl: '/policy-terms-001.pdf'
    },
    {
      id: 'policy-002',
      petId: 'pet-taro',
      provider: 'PetInsureX Standard',
      coverageLimit: 82000,
      remaining: 82000,
      premium: 8500,
      start: '2024-01-15',
      end: '2025-01-14',
      status: 'active',
      createdAt: '2024-01-15T00:00:00Z',
      termsUrl: '/policy-terms-002.pdf'
    }
  ];

  const mockPets: Pet[] = [
    {
      id: 'pet-mali',
      ownerId: 'user-1',
      name: 'Mali',
      species: 'dog',
      breed: 'Golden Retriever',
      ageMonths: 36,
      vaccinated: true,
      photos: ['/mock-mali1.jpg'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'pet-taro',
      ownerId: 'user-1',
      name: 'Taro',
      species: 'cat',
      breed: 'British Shorthair',
      ageMonths: 24,
      vaccinated: false,
      photos: ['/mock-taro1.jpg'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    }
  ];

  const getStatusColor = (status: string) => {
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
      price: '₿5,500/year',
      coverage: '₿50,000',
      features: ['Accidents Only', 'Emergency Care', '24/7 Support', 'Basic Vet Network']
    },
    {
      name: 'PetInsureX Standard',
      price: '₿8,500/year',
      coverage: '₿82,000',
      features: ['Accidents & Illness', 'Preventive Care', 'Specialist Referrals', 'Extended Vet Network', 'Prescription Coverage']
    },
    {
      name: 'PetInsureX Premium',
      price: '₿12,000/year',
      coverage: '₿100,000',
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Insurance Policies</h1>
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
              { label: 'Total Coverage', value: '₿182,000', icon: Heart, color: 'text-green-600' },
              { label: 'Annual Premium', value: '₿20,500', icon: CreditCard, color: 'text-purple-600' },
              { label: 'Coverage Used', value: '18%', icon: Zap, color: 'text-petinsure-teal-600' }
            ].map((stat, index) => (
              <GlassCard key={index} className="p-6 hover:scale-105 transition-transform aura-teal-subtle" borderStyle="prominent">
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
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Active Policies</h2>
            <div className="space-y-6">
              {mockPolicies.map((policy) => {
                const pet = mockPets.find(p => p.id === policy.petId);
                const usagePercentage = ((policy.coverageLimit - policy.remaining) / policy.coverageLimit) * 100;
                
                return (
                  <div key={policy.id} className="p-6 rounded-xl bg-white/30 hover:bg-white/50 transition-all border-2 border-petinsure-teal-200/60 hover:border-petinsure-teal-300/80 aura-teal-subtle">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {pet?.name?.charAt(0) || 'P'}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{policy.provider}</h3>
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
                        <p className="text-2xl font-bold text-gray-900">₿{policy.coverageLimit.toLocaleString()}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Remaining</h4>
                        <p className="text-2xl font-bold text-green-600">₿{policy.remaining.toLocaleString()}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Annual Premium</h4>
                        <p className="text-2xl font-bold text-gray-900">₿{policy.premium.toLocaleString()}</p>
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
            <GlassCard className="p-6 text-center hover:scale-105 transition-transform cursor-pointer aura-teal-glow" borderStyle="prominent">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText size={24} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Policy Documents</h3>
              <p className="text-sm text-gray-600 mb-4">Download and view your policy terms</p>
              <PawButton variant="secondary" size="sm">
                <Download size={16} />
                Download
              </PawButton>
            </GlassCard>

            <GlassCard className="p-6 text-center hover:scale-105 transition-transform cursor-pointer aura-teal-glow" borderStyle="prominent">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar size={24} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Renewal Reminder</h3>
              <p className="text-sm text-gray-600 mb-4">Set up automatic renewal notifications</p>
              <PawButton variant="secondary" size="sm">
                <Calendar size={16} />
                Setup
              </PawButton>
            </GlassCard>

            <GlassCard className="p-6 text-center hover:scale-105 transition-transform cursor-pointer aura-teal-glow" borderStyle="prominent">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard size={24} className="text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Payment History</h3>
              <p className="text-sm text-gray-600 mb-4">View your premium payment records</p>
              <PawButton variant="secondary" size="sm">
                <Eye size={16} />
                View History
              </PawButton>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* New Policy Modal - Fixed size */}
      <Modal
        isOpen={showNewPolicyModal}
        onClose={() => setShowNewPolicyModal(false)}
        title="Choose Your Coverage Plan"
        size="lg"
      >
        <div className="space-y-6">
          <p className="text-gray-600">Select the best insurance plan for your pet's needs</p>
          
          <div className="grid gap-6">
            {coverageTypes.map((plan, index) => (
              <div key={index} className={cn(
                "p-6 rounded-xl border-2 transition-all cursor-pointer hover:border-petinsure-teal-300 hover:bg-petinsure-teal-50",
                index === 1 ? "border-petinsure-teal-300 bg-petinsure-teal-50" : "border-gray-200"
              )}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{plan.name}</h3>
                    <p className="text-2xl font-bold text-petinsure-teal-600">{plan.price}</p>
                    <p className="text-sm text-gray-600">Coverage up to {plan.coverage}</p>
                  </div>
                  {index === 1 && (
                    <span className="px-3 py-1 bg-petinsure-teal-100 text-petinsure-teal-700 text-xs font-medium rounded-full">
                      Most Popular
                    </span>
                  )}
                </div>
                
                <div className="space-y-2">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-500" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <PawButton variant="ghost" className="flex-1" onClick={() => setShowNewPolicyModal(false)}>
              Cancel
            </PawButton>
            <PawButton className="flex-1">
              Continue to Application
            </PawButton>
          </div>
        </div>
      </Modal>

      {/* Policy Details Modal */}
      {showPolicyDetails && (
        <Modal
          isOpen={!!showPolicyDetails}
          onClose={() => setShowPolicyDetails(null)}
          title="Policy Details"
          size="xl"
        >
          {(() => {
            const policy = mockPolicies.find(p => p.id === showPolicyDetails);
            const pet = mockPets.find(p => p.id === policy?.petId);
            
            if (!policy) return <div>Policy not found</div>;

            return (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Policy Information</h3>
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
                        <span className="font-medium">₿{policy.coverageLimit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Remaining:</span>
                        <span className="font-medium text-green-600">₿{policy.remaining.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Annual Premium:</span>
                        <span className="font-medium">₿{policy.premium.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Deductible:</span>
                        <span className="font-medium">₿500 per claim</span>
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
