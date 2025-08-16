
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { GlassCard } from '@/components/ui/glass-card';
import { PawButton } from '@/components/ui/paw-button';
import { Modal } from '@/components/ui/modal';
import { cn } from '@/lib/utils';
import { 
  Plus, 
  FileText, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Camera,
  TrendingUp,
  Heart,
  Zap
} from 'lucide-react';

const Dashboard = () => {
  const [showClaimModal, setShowClaimModal] = useState(false);

  const stats = [
    { label: 'Active Policies', value: '2', icon: Shield, color: 'text-blue-600' },
    { label: 'Pending Claims', value: '1', icon: Clock, color: 'text-yellow-600' },
    { label: 'Total Covered', value: '$5,200', icon: TrendingUp, color: 'text-green-600' },
    { label: 'Coverage Used', value: '18%', icon: Heart, color: 'text-petinsure-teal-600' }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'claim_submitted',
      title: 'Claim submitted for Mali',
      description: 'Emergency surgery claim - Under review',
      timestamp: '2 hours ago',
      status: 'pending',
      amount: '$430'
    },
    {
      id: 2,
      type: 'policy_renewed',
      title: 'Policy renewed for Taro',
      description: 'Annual premium paid automatically',
      timestamp: '1 day ago',
      status: 'completed',
      amount: '$345'
    },
    {
      id: 3,
      type: 'identity_verified',
      title: 'Pet identity verified',
      description: 'Mali\'s photos updated successfully',
      timestamp: '3 days ago',
      status: 'completed'
    }
  ];

  const pets = [
    {
      id: 1,
      name: 'Mali',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: '3 years',
      avatar: '🐕',
      status: 'Healthy',
      coverage: '$2,850',
      remaining: '$2,430'
    },
    {
      id: 2,
      name: 'Taro',
      species: 'Cat',
      breed: 'British Shorthair',
      age: '2 years',
      avatar: '🐱',
      status: 'Vaccinated',
      coverage: '$2,350',
      remaining: '$2,350'
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="font-display text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Welcome back, Jun! 👋
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Your pets are protected and healthy. Here's what's happening today.
            </p>
          </div>

          {/* Stats Grid with enhanced borders and teal aura */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {stats.map((stat, index) => (
              <GlassCard 
                key={index} 
                className="p-4 sm:p-6 hover:scale-105 transition-transform aura-teal-subtle" 
                borderStyle="prominent"
              >
                <div className="flex items-center">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-700 mb-1 truncate">{stat.label}</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={cn("p-2 sm:p-3 rounded-xl bg-white/50 border border-petinsure-teal-200/50 flex-shrink-0", stat.color)}>
                    <stat.icon size={20} className="sm:size-6" />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions with enhanced borders and teal aura */}
              <GlassCard className="p-6 aura-teal-prominent" borderStyle="prominent">
                <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PawButton 
                    onClick={() => setShowClaimModal(true)}
                    className="justify-start h-auto p-4 border border-petinsure-teal-300/30 aura-teal-subtle"
                  >
                    <Plus size={20} />
                    <div className="text-left">
                      <div className="font-medium">Submit Claim</div>
                      <div className="text-sm opacity-90">Quick claim processing</div>
                    </div>
                  </PawButton>
                  
                  <PawButton variant="secondary" className="justify-start h-auto p-4 border border-petinsure-teal-300/30 aura-teal-subtle">
                    <Camera size={20} />
                    <div className="text-left">
                      <div className="font-medium">Update Photos</div>
                      <div className="text-sm opacity-90">Pet identity verification</div>
                    </div>
                  </PawButton>
                </div>
              </GlassCard>

              {/* Recent Activity with enhanced borders and teal aura */}
              <GlassCard className="p-6 aura-teal-prominent" borderStyle="prominent">
                <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl bg-white/30 border border-petinsure-teal-200/40 hover:border-petinsure-teal-300/60 transition-colors aura-teal-subtle">
                      <div className={cn(
                        "p-2 rounded-full border border-petinsure-teal-200/30",
                        activity.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
                      )}>
                        {activity.status === 'completed' ? (
                          <CheckCircle size={16} className="text-green-600" />
                        ) : (
                          <Clock size={16} className="text-yellow-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-xl">{activity.title}</h3>
                        <p className="text-sm text-gray-700">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                      </div>
                      {activity.amount && (
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{activity.amount}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pet Cards with enhanced borders and teal aura */}
              <GlassCard className="p-6 aura-teal-prominent" borderStyle="prominent">
                <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">Your Pets</h2>
                <div className="space-y-4">
                  {pets.map((pet) => (
                    <div key={pet.id} className="p-4 rounded-xl bg-white/50 hover:bg-white/70 transition-colors border border-petinsure-teal-200/50 hover:border-petinsure-teal-300/70 aura-teal-subtle">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-2xl">{pet.avatar}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-xl">{pet.name}</h3>
                          <p className="text-sm text-gray-600">{pet.breed} • {pet.age}</p>
                        </div>
                        <div className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium border border-petinsure-teal-200/30",
                          pet.status === 'Healthy' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        )}>
                          {pet.status}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">Coverage</span>
                          <span className="font-medium">{pet.coverage}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">Remaining</span>
                          <span className="font-medium text-green-600">{pet.remaining}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* AI Insights with enhanced borders and teal aura */}
              <GlassCard className="p-6 aura-teal-glow" borderStyle="prominent">
                <div className="flex items-center gap-2 mb-4">
                  <Zap size={20} className="text-petinsure-teal-600" />
                  <h2 className="font-display text-xl font-semibold text-gray-900">AI Insights</h2>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-petinsure-teal-50 border-2 border-petinsure-teal-300/60 hover:border-petinsure-teal-400/80 transition-colors aura-teal-subtle">
                    <p className="text-sm text-petinsure-teal-800">
                      <strong>Vaccination Reminder:</strong> Taro is due for annual vaccination in 2 weeks.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50 border-2 border-green-300/60 hover:border-green-400/80 transition-colors aura-teal-subtle">
                    <p className="text-sm text-green-800">
                      <strong>Health Tip:</strong> Mali's breed is prone to hip dysplasia. Consider regular check-ups.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Claim Modal */}
      <Modal
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        title="Submit New Claim"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Select Pet
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pets.map((pet) => (
                <button
                  key={pet.id}
                  className="p-3 rounded-xl border border-gray-200 hover:border-petinsure-teal-300 hover:bg-petinsure-teal-50 transition-all text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{pet.avatar}</span>
                    <div>
                      <p className="font-medium text-gray-900">{pet.name}</p>
                      <p className="text-xs text-gray-600">{pet.breed}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Claim Type
            </label>
            <select className="w-full p-3 rounded-xl border border-gray-200 focus:border-petinsure-teal-300 focus:ring-2 focus:ring-petinsure-teal-100">
              <option>Emergency Treatment</option>
              <option>Routine Check-up</option>
              <option>Vaccination</option>
              <option>Surgery</option>
              <option>Medication</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <PawButton 
              variant="ghost" 
              className="flex-1"
              onClick={() => setShowClaimModal(false)}
            >
              Cancel
            </PawButton>
            <PawButton className="flex-1">
              Continue to Upload
            </PawButton>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default Dashboard;
