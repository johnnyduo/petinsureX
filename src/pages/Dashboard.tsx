
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { GlassCard } from '@/components/ui/glass-card';
import { PawButton } from '@/components/ui/paw-button';
import { Modal } from '@/components/ui/modal';
import { FileUploader } from '@/components/ui/file-uploader';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/translation';
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
  Zap,
  Upload,
  DollarSign,
  Calendar,
  User,
  ChevronRight,
  ChevronLeft,
  Check,
  X,
  AlertCircle
} from 'lucide-react';

const Dashboard = () => {
  const { t } = useTranslation();
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  
  // Quick Claim Modal States
  const [claimStep, setClaimStep] = useState(0);
  const [selectedPet, setSelectedPet] = useState('');
  const [claimData, setClaimData] = useState({
    petId: '',
    type: '',
    description: '',
    vetName: '',
    treatmentDate: '',
    estimatedCost: '',
    receipts: [],
    medicalRecords: []
  });

  // Update Photo Modal States
  const [photoStep, setPhotoStep] = useState(0);
  const [selectedPhotoPet, setSelectedPhotoPet] = useState('');
  const [uploadedPhotos, setUploadedPhotos] = useState([]);

  const stats = [
    { label: t('dashboard.stats.active_policies'), value: '3', icon: Shield, color: 'text-blue-600', change: '+1 this month' },
    { label: t('dashboard.stats.claims_processed'), value: '2', icon: Clock, color: 'text-yellow-600', change: '1 under review' },
    { label: t('dashboard.stats.total_saved'), value: '$12,500', icon: TrendingUp, color: 'text-green-600', change: '+$2,300 added' },
    { label: t('dashboard.stats.health_score'), value: '24%', icon: Heart, color: 'text-petinsure-teal-600', change: '6% this year' }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'claim_submitted',
      title: 'Emergency claim submitted for Mali',
      description: 'Gastric torsion surgery - Documentation uploaded and reviewed',
      timestamp: '3 hours ago',
      status: 'pending',
      amount: '$1,250',
      details: 'Claim #CLM-2024-08-19-001'
    },
    {
      id: 2,
      type: 'claim_approved',
      title: 'Vaccination claim approved for Taro',
      description: 'Annual vaccination and health checkup claim processed',
      timestamp: '1 day ago',
      status: 'completed',
      amount: '$180',
      details: 'Claim #CLM-2024-08-18-003'
    },
    {
      id: 3,
      type: 'policy_renewed',
      title: 'Premium Plus policy renewed for Mali',
      description: 'Annual premium automatically paid - Coverage active until Aug 2026',
      timestamp: '3 days ago',
      status: 'completed',
      amount: '$456',
      details: 'Policy #POL-MALI-2025'
    },
    {
      id: 4,
      type: 'document_uploaded',
      title: 'Medical records updated for Luna',
      description: 'Pre-existing condition documentation reviewed and approved',
      timestamp: '5 days ago',
      status: 'completed',
      amount: null,
      details: 'Document verification completed'
    },
    {
      id: 5,
      type: 'policy_created',
      title: 'New Basic coverage activated for Luna',
      description: 'Welcome package sent - First premium payment processed',
      timestamp: '1 week ago',
      status: 'completed',
      amount: '$234',
      details: 'Policy #POL-LUNA-2025'
    }
  ];  const pets = [
    {
      id: 1,
      name: 'Mali',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: '3 years 2 months',
      avatar: '🐕',
      status: 'Healthy',
      coverage: '$4,500',
      remaining: '$3,250',
      lastCheckup: '2024-07-15',
      nextCheckup: '2025-01-15',
      policyType: 'Premium Plus'
    },
    {
      id: 2,
      name: 'Taro',
      species: 'Cat',
      breed: 'British Shorthair',
      age: '2 years 8 months',
      avatar: '🐱',
      status: 'Recently Vaccinated',
      coverage: '$3,000',
      remaining: '$2,820',
      lastCheckup: '2024-08-18',
      nextCheckup: '2025-02-18',
      policyType: 'Standard'
    },
    {
      id: 3,
      name: 'Luna',
      species: 'Cat',
      breed: 'Ragdoll',
      age: '1 year 6 months',
      avatar: '🐈',
      status: 'New Policy',
      coverage: '$2,500',
      remaining: '$2,500',
      lastCheckup: '2024-08-10',
      nextCheckup: '2025-08-10',
      policyType: 'Basic'
    }
  ];

  // Handler functions
  const resetClaimModal = () => {
    setShowClaimModal(false);
    setClaimStep(0);
    setSelectedPet('');
    setClaimData({
      petId: '',
      type: '',
      description: '',
      vetName: '',
      treatmentDate: '',
      estimatedCost: '',
      receipts: [],
      medicalRecords: []
    });
  };

  const resetPhotoModal = () => {
    setShowPhotoModal(false);
    setPhotoStep(0);
    setSelectedPhotoPet('');
    setUploadedPhotos([]);
  };

  const handleClaimNext = () => {
    if (claimStep < 4) {
      setClaimStep(claimStep + 1);
    }
  };

  const handleClaimPrevious = () => {
    if (claimStep > 0) {
      setClaimStep(claimStep - 1);
    }
  };

  const handlePhotoNext = () => {
    if (photoStep < 2) {
      setPhotoStep(photoStep + 1);
    }
  };

  const handlePhotoPrevious = () => {
    if (photoStep > 0) {
      setPhotoStep(photoStep - 1);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="font-display text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              {t('dashboard.welcome_title')} 👋
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {t('dashboard.welcome_subtitle')}
            </p>
          </div>

          {/* Stats Grid with enhanced borders and teal aura */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {stats.map((stat, index) => (
              <GlassCard 
                key={index} 
                className="p-4 sm:p-6 aura-teal-subtle" 
                borderStyle="prominent"
              >
                <div className="flex items-center">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1 truncate">{stat.label}</p>
                    <p className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-xs text-gray-600 truncate">{stat.change}</p>
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
                <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">{t('dashboard.quick_actions')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <PawButton 
                    onClick={() => setShowClaimModal(true)}
                    className="justify-start h-auto p-4 border border-petinsure-teal-300/30 aura-teal-subtle"
                  >
                    <Plus size={20} />
                    <div className="text-left">
                      <div className="font-medium">{t('dashboard.submit_claim')}</div>
                      <div className="text-sm opacity-90">{t('dashboard.submit_claim_desc')}</div>
                    </div>
                  </PawButton>
                  
                  <PawButton 
                    variant="secondary" 
                    onClick={() => setShowPhotoModal(true)}
                    className="justify-start h-auto p-4 border border-petinsure-teal-300/30 aura-teal-subtle"
                  >
                    <Camera size={20} />
                    <div className="text-left">
                      <div className="font-medium">{t('dashboard.update_photos')}</div>
                      <div className="text-sm opacity-90">{t('dashboard.update_photos_desc')}</div>
                    </div>
                  </PawButton>
                </div>
              </GlassCard>

              {/* Recent Activity with enhanced borders and teal aura */}
              <GlassCard className="p-6 aura-teal-prominent" borderStyle="prominent">
                <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">{t('dashboard.recent_activity')}</h2>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl bg-white/30 border border-petinsure-teal-200/40 aura-teal-subtle">
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
                        <h3 className="font-semibold text-gray-900 text-base leading-tight">{activity.title}</h3>
                        <p className="text-sm font-medium text-gray-700 mt-1">{activity.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <p className="text-xs text-gray-600">{activity.timestamp}</p>
                          <p className="text-xs text-gray-500 font-medium">{activity.details}</p>
                        </div>
                      </div>
                      {activity.amount && (
                        <div className="text-right">
                          <p className="font-bold text-gray-900 text-lg">{activity.amount}</p>
                          <p className="text-xs text-gray-600">Amount</p>
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
                <h2 className="font-display text-xl font-semibold text-gray-900 mb-4">{t('dashboard.my_pets')}</h2>
                <div className="space-y-4">
                  {pets.map((pet) => (
                    <div key={pet.id} className="p-4 rounded-xl bg-white/50 border border-petinsure-teal-200/50 aura-teal-subtle">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-2xl">{pet.avatar}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-base">{pet.name}</h3>
                          <p className="text-sm font-medium text-gray-700">{pet.breed} • {pet.age}</p>
                        </div>
                        <div className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium border border-petinsure-teal-200/30",
                          pet.status.includes('Healthy') ? 'bg-green-100 text-green-700' : 
                          pet.status.includes('New') ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        )}>
                          {pet.status === 'Healthy' ? t('dashboard.healthy') : 
                           pet.status === 'New Policy' ? t('dashboard.new_pet') : 
                           pet.status}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-700">Policy</span>
                          <span className="font-semibold text-gray-900">{pet.policyType}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-700">{t('dashboard.coverage')}</span>
                          <span className="font-semibold text-gray-900">{pet.coverage}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-700">{t('dashboard.remaining')}</span>
                          <span className="font-semibold text-green-600">{pet.remaining}</span>
                        </div>
                        <div className="pt-2 mt-2 border-t border-gray-200/50">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Last Checkup</span>
                            <span className="font-medium text-gray-700">{pet.lastCheckup}</span>
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                            <span className="text-gray-600">{t('dashboard.next_due')}</span>
                            <span className="font-medium text-gray-700">{pet.nextCheckup}</span>
                          </div>
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
                  <h2 className="font-display text-xl font-semibold text-gray-900">{t('dashboard.ai_insights')}</h2>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-petinsure-teal-50 border-2 border-petinsure-teal-300/60 aura-teal-subtle">
                    <div className="flex items-start gap-2">
                      <Calendar size={16} className="text-petinsure-teal-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-petinsure-teal-800">Vaccination Reminder</p>
                        <p className="text-xs text-petinsure-teal-700 mt-1">Taro's annual vaccination is due in 14 days (Sep 2, 2025)</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-green-50 border-2 border-green-300/60 aura-teal-subtle">
                    <div className="flex items-start gap-2">
                      <Heart size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-green-800">Breed Health Alert</p>
                        <p className="text-xs text-green-700 mt-1">Golden Retrievers like Mali are prone to hip dysplasia. Schedule biannual orthopedic check-ups.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-blue-50 border-2 border-blue-300/60 aura-teal-subtle">
                    <div className="flex items-start gap-2">
                      <Shield size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-blue-800">Coverage Optimization</p>
                        <p className="text-xs text-blue-700 mt-1">You've used only 24% of your annual coverage. Consider wellness visits for Luna.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Quick Claim Modal */}
      <Modal
        isOpen={showClaimModal}
        onClose={resetClaimModal}
        title={`${t('modal.claim.title')} - Step ${claimStep + 1} of 5`}
        size="lg"
      >
        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              {[0, 1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                    step < claimStep
                      ? "bg-petinsure-teal-600 text-white"
                      : step === claimStep
                      ? "bg-petinsure-teal-100 text-petinsure-teal-600 border-2 border-petinsure-teal-600"
                      : "bg-gray-100 text-gray-400"
                  )}
                >
                  {step < claimStep ? <Check size={16} /> : step + 1}
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {[t('modal.claim.step_pet_selection'), t('modal.claim.step_claim_details'), t('modal.claim.step_treatment_info'), t('modal.claim.step_upload_documents'), t('modal.claim.step_review_submit')][claimStep]}
            </span>
          </div>

          {/* Step Content */}
          {claimStep === 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('modal.claim.select_pet_title')}</h3>
              <div className="grid grid-cols-1 gap-3">
                {pets.map((pet) => (
                  <button
                    key={pet.id}
                    onClick={() => {
                      setSelectedPet(pet.id.toString());
                      setClaimData({...claimData, petId: pet.id.toString()});
                    }}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all",
                      selectedPet === pet.id.toString()
                        ? "border-petinsure-teal-300 bg-petinsure-teal-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{pet.avatar}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{pet.name}</p>
                        <p className="text-sm text-gray-600">{pet.breed} • {pet.age}</p>
                        <p className="text-sm text-gray-500">{t('modal.claim.remaining_coverage')}: {pet.remaining}</p>
                      </div>
                      {selectedPet === pet.id.toString() && (
                        <CheckCircle size={20} className="text-petinsure-teal-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {claimStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Claim Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Claim Type *
                </label>
                <select 
                  id="claim-type-select-fixed"
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-petinsure-teal-300 focus:ring-2 focus:ring-petinsure-teal-100"
                  value={claimData.type}
                  onChange={(e) => setClaimData({...claimData, type: e.target.value})}
                >
                  <option value="">Select claim type</option>
                  <option value="emergency">Emergency Treatment</option>
                  <option value="illness">Illness Treatment</option>
                  <option value="accident">Accident/Injury</option>
                  <option value="surgery">Surgery</option>
                  <option value="medication">Prescription Medication</option>
                  <option value="wellness">Wellness Check-up</option>
                  <option value="dental">Dental Care</option>
                  <option value="vaccination">Vaccination</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Description of Issue *
                </label>
                <textarea
                  rows={4}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-petinsure-teal-300 focus:ring-2 focus:ring-petinsure-teal-100 resize-none"
                  placeholder="Please describe the condition, symptoms, or reason for treatment..."
                  value={claimData.description}
                  onChange={(e) => setClaimData({...claimData, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Estimated Cost
                </label>
                <div className="relative">
                  <DollarSign size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="number"
                    className="w-full p-3 pl-10 rounded-xl border border-gray-200 focus:border-petinsure-teal-300 focus:ring-2 focus:ring-petinsure-teal-100"
                    placeholder="0.00"
                    value={claimData.estimatedCost}
                    onChange={(e) => setClaimData({...claimData, estimatedCost: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}

          {claimStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Treatment Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Veterinarian/Clinic Name *
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    className="w-full p-3 pl-10 rounded-xl border border-gray-200 focus:border-petinsure-teal-300 focus:ring-2 focus:ring-petinsure-teal-100"
                    placeholder="Dr. Smith's Animal Hospital"
                    value={claimData.vetName}
                    onChange={(e) => setClaimData({...claimData, vetName: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Treatment Date *
                </label>
                <div className="relative">
                  <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="date"
                    className="w-full p-3 pl-10 rounded-xl border border-gray-200 focus:border-petinsure-teal-300 focus:ring-2 focus:ring-petinsure-teal-100"
                    value={claimData.treatmentDate}
                    onChange={(e) => setClaimData({...claimData, treatmentDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Treatment Documentation Required</p>
                    <p>Please ensure you have all relevant medical records and receipts ready for upload in the next step.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {claimStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Documents</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Receipts & Invoices *
                  </label>
                  <FileUploader
                    onFilesChange={(files) => setClaimData({...claimData, receipts: files})}
                    accept="image/*,.pdf"
                    maxFiles={5}
                    title="Upload Receipts"
                    description="Upload photos or PDFs of receipts and invoices"
                  />
                  {claimData.receipts.length > 0 && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {claimData.receipts.length} file(s) uploaded
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">
                    Medical Records (Optional)
                  </label>
                  <FileUploader
                    onFilesChange={(files) => setClaimData({...claimData, medicalRecords: files})}
                    accept="image/*,.pdf"
                    maxFiles={3}
                    title="Upload Medical Records"
                    description="Upload vet reports, test results, or treatment notes"
                  />
                  {claimData.medicalRecords.length > 0 && (
                    <p className="text-sm text-green-600 mt-2">
                      ✓ {claimData.medicalRecords.length} file(s) uploaded
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Supported File Formats</p>
                    <p>Images: JPG, PNG, HEIC • Documents: PDF • Maximum file size: 10MB per file</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {claimStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review & Submit</h3>
              
              <div className="space-y-4">
                <GlassCard variant="solid" className="p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Claim Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pet:</span>
                      <span className="font-medium text-gray-900">
                        {pets.find(p => p.id.toString() === selectedPet)?.name} {pets.find(p => p.id.toString() === selectedPet)?.avatar}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Claim Type:</span>
                      <span className="font-medium text-gray-900 capitalize">{claimData.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Veterinarian:</span>
                      <span className="font-medium text-gray-900">{claimData.vetName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Treatment Date:</span>
                      <span className="font-medium text-gray-900">{claimData.treatmentDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Cost:</span>
                      <span className="font-medium text-gray-900">${claimData.estimatedCost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Documents:</span>
                      <span className="font-medium text-gray-900">
                        {claimData.receipts.length + claimData.medicalRecords.length} files
                      </span>
                    </div>
                  </div>
                </GlassCard>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-green-800">
                      <p className="font-medium mb-1">{t('modal.claim.ready_to_submit')}</p>
                      <p>{t('modal.claim.processing_note')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200 gap-4">
            <div className="flex gap-3 w-full sm:w-auto">
              {claimStep > 0 && (
                <PawButton
                  variant="ghost"
                  onClick={handleClaimPrevious}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft size={16} />
                  {t('common.previous')}
                </PawButton>
              )}
              <PawButton
                variant="ghost"
                onClick={resetClaimModal}
                className="text-gray-600"
              >
                {t('common.cancel')}
              </PawButton>
            </div>

            <PawButton
              onClick={claimStep === 4 ? () => {
                // Submit claim logic here
                alert('Claim submitted successfully!');
                resetClaimModal();
              } : handleClaimNext}
              disabled={
                (claimStep === 0 && !selectedPet) ||
                (claimStep === 1 && (!claimData.type || !claimData.description)) ||
                (claimStep === 2 && (!claimData.vetName || !claimData.treatmentDate)) ||
                (claimStep === 3 && claimData.receipts.length === 0)
              }
              className="flex items-center gap-2"
            >
              {claimStep === 4 ? t('claims.submit_new') : t('common.next')}
              {claimStep < 4 && <ChevronRight size={16} />}
            </PawButton>
          </div>
        </div>
      </Modal>

      {/* Comprehensive Update Photos Modal */}
      <Modal
        isOpen={showPhotoModal}
        onClose={resetPhotoModal}
        title={`${t('modal.photos.title')} - Step ${photoStep + 1} of 3`}
        size="lg"
      >
        <div className="space-y-6">
          {/* Progress Indicator */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-2">
              {[0, 1, 2].map((step) => (
                <div
                  key={step}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all",
                    step < photoStep
                      ? "bg-petinsure-teal-600 text-white"
                      : step === photoStep
                      ? "bg-petinsure-teal-100 text-petinsure-teal-600 border-2 border-petinsure-teal-600"
                      : "bg-gray-100 text-gray-400"
                  )}
                >
                  {step < photoStep ? <Check size={16} /> : step + 1}
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {[t('modal.photos.step_select_pet'), t('modal.photos.step_upload_photos'), t('modal.photos.step_review')][photoStep]}
            </span>
          </div>

          {/* Step Content */}
          {photoStep === 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Pet for Photo Update</h3>
              <div className="grid grid-cols-1 gap-3">
                {pets.map((pet) => (
                  <button
                    key={pet.id}
                    onClick={() => setSelectedPhotoPet(pet.id.toString())}
                    className={cn(
                      "p-4 rounded-xl border text-left transition-all",
                      selectedPhotoPet === pet.id.toString()
                        ? "border-petinsure-teal-300 bg-petinsure-teal-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{pet.avatar}</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{pet.name}</p>
                        <p className="text-sm text-gray-600">{pet.breed} • {pet.age}</p>
                        <p className="text-sm text-gray-500">Last photo update: 3 months ago</p>
                      </div>
                      {selectedPhotoPet === pet.id.toString() && (
                        <CheckCircle size={20} className="text-petinsure-teal-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Camera size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Why Update Photos?</p>
                    <p>Regular photo updates help our AI system accurately identify your pet and prevent claim fraud. We recommend updating photos every 6 months or after significant appearance changes.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {photoStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload New Photos</h3>
              
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={18} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium mb-2">Photo Guidelines for Best Results:</p>
                      <ul className="space-y-1 ml-4">
                        <li>• Take 4 photos: front view, left side, right side, and full body</li>
                        <li>• Ensure good lighting (natural light preferred)</li>
                        <li>• Keep your pet still and looking at the camera</li>
                        <li>• Clear, unobstructed view of your pet</li>
                        <li>• No filters, decorations, or other pets in the photo</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <FileUploader
                  onFilesChange={setUploadedPhotos}
                  accept="image/*"
                  maxFiles={4}
                  title="Upload Pet Photos"
                  description="Upload 4 clear photos of your pet from different angles"
                />

                {uploadedPhotos.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Uploaded Photos ({uploadedPhotos.length}/4)
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {uploadedPhotos.map((file, index) => (
                        <div key={index} className="relative">
                          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                            <Camera size={24} className="text-gray-400" />
                          </div>
                          <div className="absolute bottom-1 left-1 bg-black/70 text-white px-1 py-0.5 rounded text-xs">
                            Photo {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {photoStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review & Submit</h3>
              
              <div className="space-y-4">
                <GlassCard variant="solid" className="p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Photo Update Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pet:</span>
                      <span className="font-medium text-gray-900">
                        {pets.find(p => p.id.toString() === selectedPhotoPet)?.name} {pets.find(p => p.id.toString() === selectedPhotoPet)?.avatar}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Photos Uploaded:</span>
                      <span className="font-medium text-gray-900">{uploadedPhotos.length} photos</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processing Time:</span>
                      <span className="font-medium text-gray-900">~30 seconds</span>
                    </div>
                  </div>
                </GlassCard>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-green-800">
                      <p className="font-medium mb-1">Ready to Process</p>
                      <p>Your photos will be analyzed by our AI system to update your pet's identity profile. This helps ensure accurate claim processing and fraud prevention.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200 gap-4">
            <div className="flex gap-3 w-full sm:w-auto">
              {photoStep > 0 && (
                <PawButton
                  variant="ghost"
                  onClick={handlePhotoPrevious}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft size={16} />
                  Previous
                </PawButton>
              )}
              <PawButton
                variant="ghost"
                onClick={resetPhotoModal}
                className="text-gray-600"
              >
                Cancel
              </PawButton>
            </div>

            <PawButton
              onClick={photoStep === 2 ? () => {
                // Submit photos logic here
                alert('Photos updated successfully!');
                resetPhotoModal();
              } : handlePhotoNext}
              disabled={
                (photoStep === 0 && !selectedPhotoPet) ||
                (photoStep === 1 && uploadedPhotos.length === 0)
              }
              className="flex items-center gap-2"
            >
              {photoStep === 2 ? 'Update Photos' : 'Next'}
              {photoStep < 2 && <ChevronRight size={16} />}
            </PawButton>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default Dashboard;
