
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
  const [currentStep, setCurrentStep] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const mockClaims: Claim[] = [
    {
      id: 'claim-001',
      petId: 'pet-mali',
      policyId: 'policy-001',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-16T14:20:00Z',
      status: 'review',
      amount: 15000,
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
      amount: 3500,
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

  const steps = ['Pet & Details', 'Upload Documents', 'AI Analysis', 'Review & Submit'];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Claims</h1>
                <p className="text-gray-600">Manage your insurance claims with AI-powered processing</p>
              </div>
              <PawButton onClick={() => setShowNewClaimModal(true)}>
                <Plus size={20} />
                New Claim
              </PawButton>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Claims', value: '12', icon: FileText, color: 'text-blue-600' },
              { label: 'Pending Review', value: '1', icon: Clock, color: 'text-yellow-600' },
              { label: 'Approved', value: '8', icon: CheckCircle, color: 'text-green-600' },
              { label: 'Total Paid', value: '₿89,500', icon: Heart, color: 'text-petinsure-teal-600' }
            ].map((stat, index) => (
              <GlassCard key={index} className="p-6">
                <div className="flex items-center">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={cn("p-3 rounded-xl bg-white/50", stat.color)}>
                    <stat.icon size={24} />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Claims List */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Claims</h2>
            <div className="space-y-4">
              {mockClaims.map((claim) => {
                const pet = mockPets.find(p => p.id === claim.petId);
                return (
                  <div key={claim.id} className="p-6 rounded-xl bg-white/30 hover:bg-white/50 transition-all border border-white/20">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                          {pet?.name?.charAt(0) || 'P'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">Claim #{claim.id.split('-')[1].toUpperCase()}</h3>
                            <span className={cn("px-3 py-1 rounded-full text-xs font-medium border", getStatusColor(claim.status))}>
                              {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-2">{claim.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Pet: {pet?.name}</span>
                            <span>Amount: ₿{claim.amount.toLocaleString()}</span>
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

      {/* New Claim Modal */}
      <Modal
        isOpen={showNewClaimModal}
        onClose={() => {
          setShowNewClaimModal(false);
          setCurrentStep(0);
          setUploadedFiles([]);
        }}
        title="Submit New Claim"
        size="xl"
      >
        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  index <= currentStep ? "bg-gradient-primary text-white" : "bg-gray-200 text-gray-600"
                )}>
                  {index + 1}
                </div>
                <span className={cn(
                  "ml-2 text-sm font-medium",
                  index <= currentStep ? "text-gray-900" : "text-gray-500"
                )}>
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-16 h-0.5 mx-4",
                    index < currentStep ? "bg-gradient-primary" : "bg-gray-200"
                  )} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">Select Pet</label>
                <div className="grid grid-cols-2 gap-4">
                  {mockPets.map((pet) => (
                    <button
                      key={pet.id}
                      className="p-4 rounded-xl border border-gray-200 hover:border-petinsure-teal-300 hover:bg-petinsure-teal-50 transition-all text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold">
                          {pet.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 group-hover:text-petinsure-teal-900">{pet.name}</p>
                          <p className="text-sm text-gray-600">{pet.breed} • {Math.floor(pet.ageMonths / 12)} years</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Claim Description</label>
                <textarea
                  rows={4}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-petinsure-teal-300 focus:ring-2 focus:ring-petinsure-teal-100"
                  placeholder="Describe the condition, symptoms, and treatment received..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Estimated Amount</label>
                <input
                  type="number"
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-petinsure-teal-300 focus:ring-2 focus:ring-petinsure-teal-100"
                  placeholder="Amount in THB"
                />
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Documents</h3>
                <FileUploader
                  onFilesChange={setUploadedFiles}
                  accept="image/*,.pdf"
                  multiple={true}
                  maxFiles={10}
                  title="Upload Veterinary Invoice & Photos"
                  description="Include vet invoice, injury photos, and any supporting documents"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain size={32} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis in Progress</h3>
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

              <GlassCard className="p-4 bg-green-50 border-green-200">
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
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Review Your Claim</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Claim Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Pet:</span>
                      <span className="font-medium">Mali</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Treatment:</span>
                      <span className="font-medium">Emergency Surgery</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">₿15,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Documents:</span>
                      <span className="font-medium">3 files</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">AI Analysis Results</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={16} className="text-green-500" />
                      <span>Pet identity verified (94%)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle size={16} className="text-green-500" />
                      <span>Low fraud risk (15%)</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Shield size={16} className="text-blue-500" />
                      <span>Vet attestation verified</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Estimated Processing Time:</strong> 2-3 business days. You'll receive updates via email and in your dashboard.
                </p>
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <PawButton
              variant="ghost"
              className="flex-1"
              onClick={() => {
                if (currentStep > 0) {
                  setCurrentStep(currentStep - 1);
                } else {
                  setShowNewClaimModal(false);
                }
              }}
            >
              {currentStep > 0 ? 'Previous' : 'Cancel'}
            </PawButton>
            <PawButton
              className="flex-1"
              onClick={() => {
                if (currentStep < steps.length - 1) {
                  setCurrentStep(currentStep + 1);
                } else {
                  setShowNewClaimModal(false);
                  // Submit claim logic here
                }
              }}
            >
              {currentStep < steps.length - 1 ? 'Next' : 'Submit Claim'}
            </PawButton>
          </div>
        </div>
      </Modal>

      {/* Claim Details Modal */}
      {showClaimDetails && (
        <Modal
          isOpen={!!showClaimDetails}
          onClose={() => setShowClaimDetails(null)}
          title="Claim Details"
          size="xl"
        >
          {(() => {
            const claim = mockClaims.find(c => c.id === showClaimDetails);
            const pet = mockPets.find(p => p.id === claim?.petId);
            
            if (!claim) return <div>Claim not found</div>;

            return (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Basic Information</h3>
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
                        <span className="font-medium">₿{claim.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Submitted:</span>
                        <span className="font-medium">{new Date(claim.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">AI Analysis</h3>
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
                  <h3 className="font-semibold text-gray-900 mb-4">Description</h3>
                  <p className="text-gray-700 p-4 bg-gray-50 rounded-lg">
                    {claim.description}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Documents & Proofs</h3>
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
                    <h3 className="font-semibold text-gray-900 mb-4">Admin Notes</h3>
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
    </Layout>
  );
};

export default Claims;
