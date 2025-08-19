
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { GlassCard } from '@/components/ui/glass-card';
import { PawButton } from '@/components/ui/paw-button';
import { Modal } from '@/components/ui/modal';
import { FileUploader } from '@/components/ui/file-uploader';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  Plus, 
  FileText, 
  Camera, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Eye,
  Download,
  Shield,
  Brain,
  Zap,
  Heart,
  X,
  Upload,
  Bell
} from 'lucide-react';
import { Claim, Pet } from '@/types';

const Claims = () => {
  const [showNewClaimModal, setShowNewClaimModal] = useState(false);
  const [showClaimDetails, setShowClaimDetails] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  
  // New claim form state
  const [newClaimForm, setNewClaimForm] = useState({
    selectedPetId: '',
    description: '',
    estimatedAmount: ''
  });

  const mockClaims: Claim[] = [
    {
      id: 'claim-001',
      petId: 'pet-mali',
      policyId: 'policy-001',
      createdAt: '2024-08-19T10:30:00Z',
      updatedAt: '2024-08-19T14:20:00Z',
      status: 'review',
      amount: 1250,
      description: 'Emergency surgery for gastric torsion (bloat) - life-threatening condition requiring immediate surgical intervention',
      invoiceUrl: '/mock-invoice-CLM001.pdf',
      injuryPhotos: ['/mock-mali-xray1.jpg', '/mock-mali-surgery1.jpg'],
      proofs: [
        { id: 'proof-1', type: 'vet_attestation', status: 'valid', createdAt: '2024-08-19T11:00:00Z' },
        { id: 'proof-2', type: 'identity_verification', status: 'valid', createdAt: '2024-08-19T11:30:00Z' },
        { id: 'proof-3', type: 'forensic_analysis', status: 'valid', createdAt: '2024-08-19T12:00:00Z' }
      ],
      fraudScore: 0.15,
      petMatchConfidence: 0.94,
      adminNotes: 'Emergency surgery claim - veterinary attestation confirms life-threatening condition',
      vetAttestation: {
        id: 'att-001',
        vetId: 'vet-bangkok-001',
        clinicName: 'Bangkok Animal Emergency Hospital',
        licenseNumber: 'VET-TH-2024-001',
        signature: 'sig-bangkok-001',
        timestamp: '2024-08-19T14:00:00Z',
        invoiceHash: 'hash-mali-emergency-001'
      }
    },
    {
      id: 'claim-002',
      petId: 'pet-taro',
      policyId: 'policy-002',
      createdAt: '2024-08-18T09:15:00Z',
      updatedAt: '2024-08-18T16:45:00Z',
      status: 'paid',
      amount: 180,
      description: 'Annual comprehensive health examination with core vaccinations (FVRCP, Rabies)',
      invoiceUrl: '/mock-invoice-CLM002.pdf',
      injuryPhotos: [],
      proofs: [
        { id: 'proof-4', type: 'vet_attestation', status: 'valid', createdAt: '2024-08-18T10:00:00Z' },
        { id: 'proof-5', type: 'identity_verification', status: 'valid', createdAt: '2024-08-18T10:15:00Z' }
      ],
      fraudScore: 0.05,
      petMatchConfidence: 0.98,
      adminNotes: 'Routine preventive care - standard processing',
      vetAttestation: {
        id: 'att-002',
        vetId: 'vet-phuket-002',
        clinicName: 'Phuket Veterinary Clinic',
        licenseNumber: 'VET-TH-2023-087',
        signature: 'sig-phuket-002',
        timestamp: '2024-08-18T16:30:00Z',
        invoiceHash: 'hash-taro-wellness-001'
      }
    },
    {
      id: 'claim-003',
      petId: 'pet-luna',
      policyId: 'policy-003',
      createdAt: '2024-08-10T14:20:00Z',
      updatedAt: '2024-08-15T10:30:00Z',
      status: 'approved',
      amount: 320,
      description: 'Dental cleaning and minor tooth extraction - preventive dental care',
      invoiceUrl: '/mock-invoice-CLM003.pdf',
      injuryPhotos: ['/mock-luna-dental1.jpg'],
      proofs: [
        { id: 'proof-6', type: 'vet_attestation', status: 'valid', createdAt: '2024-08-10T15:00:00Z' },
        { id: 'proof-7', type: 'identity_verification', status: 'valid', createdAt: '2024-08-10T15:15:00Z' }
      ],
      fraudScore: 0.08,
      petMatchConfidence: 0.96,
      adminNotes: 'Approved for payment - dental work documented with photos',
      vetAttestation: {
        id: 'att-003',
        vetId: 'vet-chiang-003',
        clinicName: 'Chiang Mai Pet Dental Center',
        licenseNumber: 'VET-TH-2024-045',
        signature: 'sig-chiang-003',
        timestamp: '2024-08-15T09:45:00Z',
        invoiceHash: 'hash-luna-dental-001'
      }
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
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Clock className="text-blue-600" size={20} />;
      case 'review': return <Eye className="text-yellow-600" size={20} />;
      case 'approved': return <CheckCircle className="text-green-600" size={20} />;
      case 'paid': return <CheckCircle className="text-green-600" size={20} />;
      case 'rejected': return <X className="text-red-600" size={20} />;
      default: return <Clock className="text-gray-600" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'review': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-700 border-green-200';
      case 'paid': return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Form handlers
  const handlePetSelection = (petId: string) => {
    setNewClaimForm({...newClaimForm, selectedPetId: petId});
  };

  const handleFormReset = () => {
    setNewClaimForm({
      selectedPetId: '',
      description: '',
      estimatedAmount: ''
    });
    setCurrentStep(0);
    setUploadedFiles([]);
    setShowNewClaimModal(false);
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 0:
        return newClaimForm.selectedPetId && newClaimForm.description && newClaimForm.estimatedAmount;
      case 1:
        return uploadedFiles.length > 0;
      case 2:
        return true; // AI analysis step
      case 3:
        return true; // Review step
      default:
        return false;
    }
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit claim logic here
      console.log('Submitting claim:', newClaimForm, uploadedFiles);
      setShowNewClaimModal(false);
      setShowSuccessModal(true);
      // Reset form after a delay so user doesn't see the reset
      setTimeout(() => {
        handleFormReset();
      }, 100);
    }
  };

  const steps = ['Pet & Details', 'Upload Documents', 'AI Analysis', 'Review & Submit'];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">Claims</h1>
                <p className="text-gray-600">Manage your insurance claims with AI-powered processing</p>
              </div>
              <PawButton type="button" onClick={() => setShowNewClaimModal(true)}>
                <Plus size={20} />
                New Claim
              </PawButton>
            </div>
          </div>

          {/* Stats Cards with enhanced borders and teal aura */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Claims', value: '12', icon: FileText, color: 'text-blue-600' },
              { label: 'Pending Review', value: '1', icon: Clock, color: 'text-yellow-600' },
              { label: 'Approved', value: '8', icon: CheckCircle, color: 'text-green-600' },
              { label: 'Total Paid', value: '$2,560', icon: Heart, color: 'text-petinsure-teal-600' }
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

          {/* Claims List with enhanced borders and teal aura */}
          <GlassCard className="p-6 aura-teal-prominent" borderStyle="prominent">
            <h2 className="font-display text-xl font-semibold text-gray-900 mb-6">Recent Claims</h2>
            <div className="space-y-4">
              {mockClaims.map((claim) => {
                const pet = mockPets.find(p => p.id === claim.petId);
                return (
                  <div key={claim.id} className="p-6 rounded-xl bg-white/30 border-2 border-petinsure-teal-200/60 aura-teal-subtle">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                          {pet?.name?.charAt(0) || 'P'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900 text-xl">Claim #{claim.id.split('-')[1].toUpperCase()}</h3>
                            <span className={cn("px-3 py-1 rounded-full text-xs font-medium border", getStatusColor(claim.status))}>
                              {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-2">{claim.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Pet: {pet?.name}</span>
                            <span>Amount: ${claim.amount.toLocaleString()}</span>
                            <span>Date: {new Date(claim.createdAt).toLocaleDateString()}</span>
                          </div>
                          {claim.petMatchConfidence && (
                            <div className="mt-3 flex items-center gap-2">
                              <Brain size={16} className="text-petinsure-teal-600" />
                              <span className="text-sm text-petinsure-teal-700">
                                Pet Match: {(claim.petMatchConfidence * 100).toFixed(0)}% confidence
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(claim.status)}
                        <PawButton
                          variant="ghost"
                          size="sm"
                          type="button"
                          onClick={() => setShowClaimDetails(claim.id)}
                        >
                          View Details
                        </PawButton>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* New Claim Modal - Optimized UX */}
      <Modal
        isOpen={showNewClaimModal}
        onClose={handleFormReset}
        title="Submit New Claim"
        size="lg"
      >
        <div className="space-y-3 sm:space-y-4">
          {/* Progress Summary */}
          <div className="mb-3 p-2 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
                </p>
                <p className="text-xs text-gray-600">
                  {currentStep === 0 && "Fill in your pet and claim details"}
                  {currentStep === 1 && "Upload required documents"}
                  {currentStep === 2 && "AI is analyzing your submission"}
                  {currentStep === 3 && "Review and submit your claim"}
                </p>
              </div>
              <div className="text-xs text-teal-600 font-medium">
                {Math.round(((currentStep + (isStepValid(currentStep) ? 1 : 0)) / steps.length) * 100)}% Complete
              </div>
            </div>
          </div>

          {/* Compact Progress Steps - Mobile Responsive */}
          <div className="mb-3">
            {/* Mobile: Vertical step layout */}
            <div className="block sm:hidden space-y-2">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 flex-shrink-0",
                    index < currentStep ? "bg-green-500 text-white" :
                    index === currentStep ? "bg-gradient-primary text-white" : 
                    "bg-gray-200 text-gray-600"
                  )}>
                    {index < currentStep ? (
                      <CheckCircle size={12} className="text-white" />
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </div>
                  <span className={cn(
                    "text-xs font-medium transition-colors flex-1",
                    index <= currentStep ? "text-gray-900" : "text-gray-500"
                  )}>
                    {step}
                  </span>
                  {index === currentStep && (
                    <span className="text-xs text-teal-600 font-medium bg-teal-50 px-2 py-1 rounded-full">
                      Current
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop: Horizontal step layout */}
            <div className="hidden sm:flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200",
                    index < currentStep ? "bg-green-500 text-white" :
                    index === currentStep ? "bg-gradient-primary text-white" : 
                    "bg-gray-200 text-gray-600"
                  )}>
                    {index < currentStep ? (
                      <CheckCircle size={12} className="text-white" />
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </div>
                  <span className={cn(
                    "ml-1.5 text-xs font-medium transition-colors",
                    index <= currentStep ? "text-gray-900" : "text-gray-500"
                  )}>
                    {step}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "w-6 lg:w-8 h-0.5 mx-2 transition-colors",
                      index < currentStep ? "bg-green-500" : 
                      index === currentStep - 1 ? "bg-gradient-primary" :
                      "bg-gray-200"
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step Content - Mobile Responsive Layout */}
          {currentStep === 0 && (
            <div className="space-y-6">
              {/* Mobile: Single column, Desktop: Two columns */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pet Selection Section */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Select Pet <span className="text-red-500">*</span>
                  </label>
                  <div 
                    className="grid grid-cols-1 gap-2"
                    role="radiogroup"
                    aria-label="Select your pet for this claim"
                  >
                    {mockPets.map((pet) => (
                      <button
                        key={pet.id}
                        onClick={() => handlePetSelection(pet.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handlePetSelection(pet.id);
                          }
                        }}
                        role="radio"
                        aria-checked={newClaimForm.selectedPetId === pet.id}
                        tabIndex={0}
                        aria-label={`Select ${pet.name}, ${pet.breed}, ${Math.floor(pet.ageMonths / 12)} years old`}
                        className={cn(
                          "p-3 rounded-lg border-2 text-left transition-all duration-200 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500",
                          newClaimForm.selectedPetId === pet.id
                            ? "border-teal-500 bg-teal-50 shadow-sm"
                            : "border-gray-200 hover:border-teal-200"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0",
                            newClaimForm.selectedPetId === pet.id ? "bg-teal-600" : "bg-gradient-primary"
                          )}>
                            {pet.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "font-medium text-sm",
                              newClaimForm.selectedPetId === pet.id ? "text-teal-900" : "text-gray-900"
                            )}>
                              {pet.name}
                            </p>
                            <p className={cn(
                              "text-xs",
                              newClaimForm.selectedPetId === pet.id ? "text-teal-600" : "text-gray-600"
                            )}>
                              {pet.breed} • {Math.floor(pet.ageMonths / 12)}y
                            </p>
                          </div>
                          {newClaimForm.selectedPetId === pet.id && (
                            <CheckCircle size={16} className="text-teal-600 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {/* Pet selection confirmation */}
                  {newClaimForm.selectedPetId && (
                    <div className="flex items-center gap-2 text-xs text-teal-700 bg-teal-50 p-2 rounded">
                      <CheckCircle size={12} />
                      <span>Pet selected</span>
                    </div>
                  )}
                </div>

                {/* Claim Details Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Claim Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      value={newClaimForm.description}
                      onChange={(e) => setNewClaimForm({...newClaimForm, description: e.target.value})}
                      className={cn(
                        "w-full p-3 rounded-lg border-2 focus:ring-2 focus:ring-teal-100 text-sm transition-colors resize-none text-gray-900 placeholder-gray-500 bg-white",
                        newClaimForm.description 
                          ? "border-teal-300 focus:border-teal-500" 
                          : "border-gray-300 focus:border-teal-300"
                      )}
                      placeholder="Describe the condition, symptoms, and treatment received..."
                    />
                    {newClaimForm.description && (
                      <p className="text-xs text-teal-600 mt-1">
                        {newClaimForm.description.length}/500 characters
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Estimated Amount <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500 text-sm font-medium">$</span>
                      <input
                        type="number"
                        value={newClaimForm.estimatedAmount}
                        onChange={(e) => setNewClaimForm({...newClaimForm, estimatedAmount: e.target.value})}
                        className={cn(
                          "w-full p-3 pl-8 rounded-lg border-2 focus:ring-2 focus:ring-teal-100 transition-colors text-gray-900 placeholder-gray-500 bg-white",
                          newClaimForm.estimatedAmount 
                            ? "border-teal-300 focus:border-teal-500" 
                            : "border-gray-300 focus:border-teal-300"
                        )}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    {newClaimForm.estimatedAmount && (
                      <p className="text-xs text-teal-600 mt-1">
                        Estimated claim amount
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Progress Status - Full width on mobile */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-medium text-blue-900 mb-2">Progress:</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className={cn("flex items-center gap-1 px-2 py-1 rounded-full border", 
                    newClaimForm.selectedPetId 
                      ? "bg-green-100 border-green-300 text-green-700" 
                      : "bg-gray-100 border-gray-300 text-gray-600"
                  )}>
                    {newClaimForm.selectedPetId ? <CheckCircle size={10} /> : <div className="w-2.5 h-2.5 border border-current rounded-full" />}
                    Pet
                  </span>
                  <span className={cn("flex items-center gap-1 px-2 py-1 rounded-full border",
                    newClaimForm.description 
                      ? "bg-green-100 border-green-300 text-green-700" 
                      : "bg-gray-100 border-gray-300 text-gray-600"
                  )}>
                    {newClaimForm.description ? <CheckCircle size={10} /> : <div className="w-2.5 h-2.5 border border-current rounded-full" />}
                    Description
                  </span>
                  <span className={cn("flex items-center gap-1 px-2 py-1 rounded-full border",
                    newClaimForm.estimatedAmount 
                      ? "bg-green-100 border-green-300 text-green-700" 
                      : "bg-gray-100 border-gray-300 text-gray-600"
                  )}>
                    {newClaimForm.estimatedAmount ? <CheckCircle size={10} /> : <div className="w-2.5 h-2.5 border border-current rounded-full" />}
                    Amount
                  </span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">Upload Documents</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Upload vet invoices, receipts, and photos related to your claim
                </p>
                <FileUploader
                  onFilesChange={setUploadedFiles}
                  accept="image/*,.pdf"
                  multiple={true}
                  maxFiles={10}
                  title="Upload Veterinary Invoice & Photos"
                  description="Include vet invoice, injury photos, and any supporting documents (PDF, JPG, PNG)"
                />
                
                {/* File upload feedback */}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="text-sm font-medium text-green-900">
                        {uploadedFiles.length} file{uploadedFiles.length > 1 ? 's' : ''} uploaded successfully
                      </span>
                    </div>
                    <p className="text-xs text-green-700">
                      Your documents will be processed by AI for verification
                    </p>
                  </div>
                )}
                
                {uploadedFiles.length === 0 && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Upload size={16} className="text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Required Documents</p>
                        <ul className="text-xs text-blue-700 mt-1 space-y-1">
                          <li>• Veterinary invoice or receipt</li>
                          <li>• Photos of your pet (for AI verification)</li>
                          <li>• Medical reports (if applicable)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain size={32} className="text-white" />
                </div>
                <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">AI Analysis in Progress</h3>
                <p className="text-gray-600 mb-6">Our AI is analyzing your documents and verifying pet identity</p>
                
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="flex items-center justify-between text-sm">
                    <span>OCR Processing</span>
                    <CheckCircle size={16} className="text-green-500" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Pet Identity Verification</span>
                    <div className="flex items-center gap-2">
                      <Progress value={85} className="w-16 h-2" />
                      <span>85%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Fraud Detection</span>
                    <Clock size={16} className="text-yellow-500" />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Medical Analysis</span>
                    <Clock size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>

              <GlassCard className="p-4 bg-green-50 border-2 border-green-300/60 aura-teal-glow">
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">Pet Identity Confirmed</p>
                    <p className="text-sm text-green-700">This photo matches your registered pet with 94% confidence.</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="font-display text-lg font-semibold text-gray-900">Review Your Claim</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 text-sm">Claim Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pet:</span>
                      <span className="font-medium">
                        {newClaimForm.selectedPetId ? 
                          mockPets.find(p => p.id === newClaimForm.selectedPetId)?.name || 'Unknown' 
                          : 'Not selected'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Description:</span>
                      <span className="font-medium max-w-24 truncate" title={newClaimForm.description}>
                        {newClaimForm.description || 'Not provided'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium text-teal-600">
                        ${newClaimForm.estimatedAmount ? Number(newClaimForm.estimatedAmount).toFixed(2) : '0.00'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Documents:</span>
                      <span className="font-medium">{uploadedFiles.length} files</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3 text-sm">AI Analysis Results</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={14} className="text-green-600" />
                      <span className="text-green-700">Pet identity verified (94%)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={14} className="text-green-600" />
                      <span className="text-green-700">Low fraud risk (15%)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield size={14} className="text-blue-600" />
                      <span className="text-blue-700">Vet attestation verified</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Processing Time:</strong> 2-3 business days. You'll receive updates via email.
                </p>
              </div>
            </div>
          )}

          {/* Modal Actions - Mobile optimized */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 border-t border-gray-200">
            <PawButton
              variant="ghost"
              type="button"
              className="flex-1 order-2 sm:order-1"
              onClick={() => {
                if (currentStep > 0) {
                  setCurrentStep(currentStep - 1);
                } else {
                  handleFormReset();
                }
              }}
            >
              {currentStep > 0 ? 'Previous' : 'Cancel'}
            </PawButton>
            <PawButton
              className={cn(
                "flex-1 order-1 sm:order-2",
                !isStepValid(currentStep) 
                  ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed" 
                  : "bg-teal-600 hover:bg-teal-700"
              )}
              type="button"
              disabled={!isStepValid(currentStep)}
              onClick={handleNextStep}
            >
              {currentStep < steps.length - 1 ? 'Next' : 'Submit Claim'}
            </PawButton>
          </div>
          
          {/* Step validation info */}
          {currentStep === 0 && !isStepValid(0) && (
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-500">
                Please fill in all required fields to continue
              </p>
            </div>
          )}
          {currentStep === 1 && !isStepValid(1) && (
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-500">
                Please upload at least one document to continue
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* Claim Details Modal */}
      {showClaimDetails && (
        <Modal
          isOpen={!!showClaimDetails}
          onClose={() => setShowClaimDetails(null)}
          title="Claim Details"
          size="lg"
        >
          {(() => {
            const claim = mockClaims.find(c => c.id === showClaimDetails);
            const pet = mockPets.find(p => p.id === claim?.petId);
            
            if (!claim) return <div>Claim not found</div>;

            return (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 text-lg sm:text-xl">Basic Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Claim ID:</span>
                        <span className="font-medium">#{claim.id.split('-')[1].toUpperCase()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pet:</span>
                        <span className="font-medium">{pet?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(claim.status))}>
                          {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-medium">${claim.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Submitted:</span>
                        <span className="font-medium">{new Date(claim.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 text-xl">AI Analysis</h3>
                    <div className="space-y-3">
                      {claim.petMatchConfidence && (
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Brain size={16} className="text-green-600" />
                            <span className="text-sm font-medium text-green-900">Pet Identity Match</span>
                          </div>
                          <p className="text-sm text-green-700">
                            {(claim.petMatchConfidence * 100).toFixed(0)}% confidence
                          </p>
                        </div>
                      )}
                      
                      {claim.fraudScore !== undefined && (
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 mb-1">
                            <Shield size={16} className="text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">Fraud Risk</span>
                          </div>
                          <p className="text-sm text-blue-700">
                            {claim.fraudScore < 0.3 ? 'Low' : claim.fraudScore < 0.7 ? 'Medium' : 'High'} risk ({(claim.fraudScore * 100).toFixed(0)}%)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 text-xl">Description</h3>
                  <p className="text-gray-700 p-4 bg-gray-50 rounded-lg">
                    {claim.description}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4 text-xl">Documents & Proofs</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {claim.proofs.map((proof) => (
                      <div key={proof.id} className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {proof.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(proof.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            proof.status === 'valid' ? 'bg-green-100 text-green-700' : 
                            proof.status === 'invalid' ? 'bg-red-100 text-red-700' : 
                            'bg-yellow-100 text-yellow-700'
                          )}>
                            {proof.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {claim.adminNotes && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4 text-xl">Admin Notes</h3>
                    <p className="text-gray-700 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      {claim.adminNotes}
                    </p>
                  </div>
                )}
              </div>
            );
          })()}
        </Modal>
      )}

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title=""
        size="xl"
        showCloseButton={false}
      >
        <div className="relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-green-100 rounded-full opacity-20 -translate-x-8 -translate-y-8 animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-blue-100 rounded-full opacity-30 translate-x-6 translate-y-6 animate-bounce"></div>
          <div className="absolute top-1/2 right-0 w-16 h-16 bg-purple-100 rounded-full opacity-25 translate-x-4"></div>
          
          <div className="relative text-center py-12 px-8">
            {/* Multi-layered animated success icon */}
            <div className="relative mx-auto mb-8">
              {/* Outer pulsing ring */}
              <div className="absolute -inset-8 rounded-full bg-gradient-to-r from-green-200 via-emerald-200 to-teal-200 opacity-30 animate-ping"></div>
              <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-green-300 via-emerald-300 to-teal-300 opacity-40 animate-ping animation-delay-150"></div>
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 opacity-50 animate-ping animation-delay-300"></div>
              
              {/* Main success icon with gradient and shadow */}
              <div className="relative mx-auto flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 shadow-2xl transform transition-transform duration-500 hover:scale-110">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
                <CheckCircle className="w-12 h-12 text-white drop-shadow-lg" />
              </div>
              
              {/* Sparkle effects */}
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
              <div className="absolute top-1 -right-4 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
            </div>
            
            {/* Success title with gradient text */}
            <div className="mb-6">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                Success!
              </h2>
              <h3 className="text-xl font-semibold text-gray-700">
                Your claim has been submitted
              </h3>
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="w-12 h-1 bg-gradient-to-r from-green-400 to-teal-400 rounded-full"></div>
                <Heart className="w-4 h-4 text-pink-500 animate-pulse" />
                <div className="w-12 h-1 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full"></div>
              </div>
            </div>
            
            <p className="text-gray-600 mb-10 text-lg max-w-lg mx-auto leading-relaxed">
              We're processing your claim with our advanced AI system. You'll receive real-time updates 
              and can expect a response within 24 hours.
            </p>
            
            {/* Claim reference card with glassmorphism effect */}
            <div className="relative mb-8 p-6 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl"></div>
              <div className="relative">
                <p className="text-sm font-medium text-blue-800/80 mb-2">Claim Reference</p>
                <div className="flex items-center justify-center gap-3">
                  <div className="px-4 py-2 bg-white/60 rounded-lg border border-blue-200/30">
                    <p className="text-2xl font-bold text-blue-700 font-mono tracking-wider">
                      CLM-{Date.now().toString().slice(-6)}
                    </p>
                  </div>
                  <div className="p-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                </div>
                <p className="text-xs text-blue-600/70 mt-2">Save this reference number for tracking</p>
              </div>
            </div>

            {/* Processing timeline with enhanced design */}
            <div className="mb-10 p-8 bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-2xl border border-green-200/50 shadow-lg text-left">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-green-900">Processing Timeline</h4>
                  <p className="text-sm text-green-700">Here's what happens next</p>
                </div>
              </div>
              
              <div className="space-y-4 ml-2">
                {[
                  { time: 'Now', status: 'active', title: 'AI Analysis Starting', desc: 'Documents uploaded and being processed', color: 'green' },
                  { time: '1 hour', status: 'pending', title: 'Email Confirmation', desc: 'Confirmation sent to your inbox', color: 'blue' },
                  { time: '24 hours', status: 'pending', title: 'Review Complete', desc: 'AI analysis finished, status updated', color: 'purple' },
                  { time: '2-3 days', status: 'pending', title: 'Decision & Payout', desc: 'Final approval and payment processing', color: 'teal' }
                ].map((step, index) => (
                  <div key={index} className="flex items-start gap-4 relative">
                    {/* Timeline line */}
                    {index < 3 && (
                      <div className="absolute left-5 top-12 w-0.5 h-8 bg-gradient-to-b from-gray-300 to-gray-200"></div>
                    )}
                    
                    {/* Status indicator */}
                    <div className={cn(
                      "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                      step.status === 'active' 
                        ? `bg-${step.color}-500 border-${step.color}-400 animate-pulse shadow-lg shadow-${step.color}-200` 
                        : `bg-gray-100 border-gray-300`
                    )}>
                      {step.status === 'active' ? (
                        <div className={`w-3 h-3 bg-white rounded-full animate-ping`}></div>
                      ) : (
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full font-medium",
                          step.status === 'active' ? `bg-${step.color}-100 text-${step.color}-700` : 'bg-gray-100 text-gray-600'
                        )}>
                          {step.time}
                        </span>
                        <h5 className={cn(
                          "font-semibold",
                          step.status === 'active' ? 'text-gray-900' : 'text-gray-600'
                        )}>
                          {step.title}
                        </h5>
                      </div>
                      <p className={cn(
                        "text-sm",
                        step.status === 'active' ? 'text-gray-700' : 'text-gray-500'
                      )}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          {/* Feature highlights with glassmorphism cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { icon: Bell, title: 'Real-time Updates', desc: 'SMS & Email alerts', color: 'blue', bg: 'from-blue-500/10 to-cyan-500/10' },
              { icon: Brain, title: 'AI Processing', desc: '24/7 automated review', color: 'purple', bg: 'from-purple-500/10 to-pink-500/10' },
              { icon: Shield, title: 'Secure & Fast', desc: 'Bank-level security', color: 'green', bg: 'from-green-500/10 to-emerald-500/10' }
            ].map((feature, index) => (
              <div 
                key={index} 
                className={cn(
                  "group relative p-5 bg-gradient-to-br backdrop-blur-sm rounded-xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1",
                  feature.bg
                )}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative text-center">
                  <div className={cn(
                    "w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center bg-gradient-to-br shadow-md",
                    feature.color === 'blue' ? 'from-blue-500 to-cyan-600' :
                    feature.color === 'purple' ? 'from-purple-500 to-pink-600' :
                    'from-green-500 to-emerald-600'
                  )}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1 text-sm">{feature.title}</h4>
                  <p className="text-xs text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Enhanced action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <PawButton
              variant="ghost"
              className="flex-1 h-12 bg-white/50 hover:bg-white/70 border border-gray-200 backdrop-blur-sm transition-all duration-300 hover:shadow-md"
              onClick={() => setShowSuccessModal(false)}
            >
              <X size={18} className="mr-2" />
              Close
            </PawButton>
            <PawButton
              className="flex-1 h-12 bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 hover:from-teal-600 hover:via-emerald-600 hover:to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => {
                setShowSuccessModal(false);
                window.location.reload();
              }}
            >
              <Eye size={18} className="mr-2" />
              View Claims Dashboard
            </PawButton>
          </div>

          {/* Support footer with enhanced styling */}
          <div className="relative p-6 bg-gradient-to-r from-gray-50/50 to-blue-50/50 backdrop-blur-sm rounded-2xl border border-gray-200/30">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-700">24/7 Support Available</span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Need help with your claim? Our team is here for you!
              </p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium text-teal-700">AI Assistant</span>
                </div>
                <div className="w-1 h-6 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">📞</span>
                  </div>
                  <span className="font-bold text-blue-700">1-800-PET-CARE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </Modal>
    </Layout>
  );
};

export default Claims;
