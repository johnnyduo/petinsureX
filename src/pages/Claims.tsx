
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
  Upload
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
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-16T14:20:00Z',
      status: 'review',
      amount: 430,
      description: 'Emergency surgery for hip dysplasia complications',
      invoiceUrl: '/mock-invoice.pdf',
      injuryPhotos: ['/mock-injury1.jpg', '/mock-injury2.jpg'],
      proofs: [
        { id: 'proof-1', type: 'vet_attestation', status: 'valid', createdAt: '2024-01-15T11:00:00Z' },
        { id: 'proof-2', type: 'identity_verification', status: 'valid', createdAt: '2024-01-15T11:30:00Z' }
      ],
      fraudScore: 0.15,
      petMatchConfidence: 0.94,
      adminNotes: 'High-value claim requiring additional review'
    },
    {
      id: 'claim-002',
      petId: 'pet-taro',
      policyId: 'policy-002',
      createdAt: '2024-01-10T09:15:00Z',
      updatedAt: '2024-01-12T16:45:00Z',
      status: 'paid',
      amount: 100,
      description: 'Routine vaccination and health check',
      injuryPhotos: [],
      proofs: [
        { id: 'proof-3', type: 'vet_attestation', status: 'valid', createdAt: '2024-01-10T10:00:00Z' }
      ],
      fraudScore: 0.05,
      petMatchConfidence: 0.98
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
      photos: ['/mock-mali1.jpg', '/mock-mali2.jpg'],
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
      photos: ['/mock-taro1.jpg', '/mock-taro2.jpg'],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
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
        size="md"
        showCloseButton={false}
      >
        <div className="text-center py-6">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Claim Submitted Successfully!
          </h3>
          
          <p className="text-gray-600 mb-6">
            Your claim has been received and is now being processed by our AI system. 
            You'll receive updates via email and can track progress in your dashboard.
          </p>
          
          {/* Success details */}
          <div className="bg-green-50 rounded-lg p-4 mb-6 text-left">
            <div className="flex items-start gap-3">
              <Shield size={20} className="text-green-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-green-900 mb-1">What's Next?</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• AI analysis will complete within 24 hours</li>
                  <li>• You'll receive an email confirmation shortly</li>
                  <li>• Processing typically takes 2-3 business days</li>
                  <li>• Check your Claims dashboard for real-time updates</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <PawButton
              variant="ghost"
              className="flex-1"
              onClick={() => setShowSuccessModal(false)}
            >
              Close
            </PawButton>
            <PawButton
              className="flex-1 bg-teal-600 hover:bg-teal-700"
              onClick={() => {
                setShowSuccessModal(false);
                // Could navigate to claims list or dashboard
                window.location.reload(); // Simple refresh for demo
              }}
            >
              View All Claims
            </PawButton>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default Claims;
