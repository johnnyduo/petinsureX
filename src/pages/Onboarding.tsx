
import React, { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { GlassCard } from '@/components/ui/glass-card';
import { PawButton } from '@/components/ui/paw-button';
import { ProgressStepper } from '@/components/ui/progress-stepper';
import { FileUploader } from '@/components/ui/file-uploader';
import { 
  Camera, 
  User, 
  FileText, 
  Check, 
  AlertCircle,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [petPhotos, setPetPhotos] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    petName: '',
    species: '',
    breed: '',
    age: '',
    weight: '',
    vaccinated: false,
    previousConditions: ''
  });

  const steps = [
    {
      id: 'profile',
      title: 'Pet Profile',
      description: 'Basic information',
      icon: User
    },
    {
      id: 'photos',
      title: 'Identity Photos',
      description: '4 canonical photos',
      icon: Camera
    },
    {
      id: 'consent',
      title: 'Consent & Terms',
      description: 'Privacy agreement',
      icon: FileText
    },
    {
      id: 'complete',
      title: 'Complete',
      description: 'Registration done',
      icon: Check
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => [...prev, currentStep]);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Pet Profile
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tell us about your pet
              </h2>
              <p className="text-gray-600">
                This information helps us provide the best coverage for your furry friend.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Pet Name *
                </label>
                <input
                  type="text"
                  value={formData.petName}
                  onChange={(e) => handleInputChange('petName', e.target.value)}
                  placeholder="e.g., Mali"
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-petinsure-teal-300 focus:ring-2 focus:ring-petinsure-teal-100 text-gray-900 placeholder-gray-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Species *
                </label>
                <select
                  value={formData.species}
                  onChange={(e) => handleInputChange('species', e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-petinsure-teal-300 focus:ring-2 focus:ring-petinsure-teal-100 text-gray-900 bg-white"
                >
                  <option value="">Select species</option>
                  <option value="dog">Dog 🐕</option>
                  <option value="cat">Cat 🐱</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Breed
                </label>
                <input
                  type="text"
                  value={formData.breed}
                  onChange={(e) => handleInputChange('breed', e.target.value)}
                  placeholder="e.g., Golden Retriever"
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-petinsure-teal-300 focus:ring-2 focus:ring-petinsure-teal-100 text-gray-900 placeholder-gray-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Age (years)
                </label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="e.g., 3"
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-petinsure-teal-300 focus:ring-2 focus:ring-petinsure-teal-100 text-gray-900 placeholder-gray-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', e.target.value)}
                  placeholder="e.g., 25"
                  className="w-full p-3 rounded-xl border border-gray-200 focus:border-petinsure-teal-300 focus:ring-2 focus:ring-petinsure-teal-100 text-gray-900 placeholder-gray-500 bg-white"
                />
              </div>

              <div>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.vaccinated}
                    onChange={(e) => handleInputChange('vaccinated', e.target.checked)}
                    className="rounded border-gray-300 text-petinsure-teal-600 focus:ring-petinsure-teal-500"
                  />
                  <span className="text-sm font-medium text-gray-900">
                    Up to date with vaccinations
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Previous Medical Conditions (Optional)
              </label>
              <textarea
                value={formData.previousConditions}
                onChange={(e) => handleInputChange('previousConditions', e.target.value)}
                placeholder="Describe any existing conditions or past treatments..."
                rows={4}
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-petinsure-teal-300 focus:ring-2 focus:ring-petinsure-teal-100 text-gray-900 placeholder-gray-500 bg-white resize-none"
              />
            </div>
          </div>
        );

      case 1: // Identity Photos
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Pet Identity Photos
              </h2>
              <p className="text-gray-600 mb-4">
                Take 4 photos: front, left, right, full-body — good lighting and no motion.
              </p>
              
              <GlassCard className="p-4 bg-blue-50/50 border-blue-200">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-blue-900 mb-1">
                      Photo Quality Guidelines
                    </p>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li>• Ensure good lighting (natural light preferred)</li>
                      <li>• Keep your pet still and calm</li>
                      <li>• Clear, unobstructed view of your pet</li>
                      <li>• Take photos from different angles</li>
                    </ul>
                  </div>
                </div>
              </GlassCard>
            </div>

            <FileUploader
              onFilesChange={setPetPhotos}
              accept="image/*"
              maxFiles={4}
              title="Upload Pet Photos"
              description="Drag and drop up to 4 photos or click to browse"
            />

            {petPhotos.length > 0 && (
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {petPhotos.length} of 4 photos uploaded
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(petPhotos.length / 4) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        );

      case 2: // Consent & Terms
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Privacy & Consent
              </h2>
              <p className="text-gray-600">
                Review and accept our terms to protect your pet's data privacy.
              </p>
            </div>

            <div className="space-y-4">
              <GlassCard className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3 text-xl">Data Usage Agreement</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>• Pet photos will be used for identity verification only</p>
                  <p>• Medical data is encrypted and stored securely</p>
                  <p>• Zero-knowledge proofs protect sensitive information</p>
                  <p>• You can request data deletion at any time</p>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="font-semibold text-gray-900 mb-3 text-xl">AI Processing Consent</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>• Computer vision analysis for fraud detection</p>
                  <p>• SEA-LION AI for claim processing and explanations</p>
                  <p>• Automated risk assessment algorithms</p>
                  <p>• Veterinary attestation verification</p>
                </div>
              </GlassCard>

              <div className="space-y-3">
                <label className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-petinsure-teal-600 focus:ring-petinsure-teal-500 mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    I agree to the <span className="text-petinsure-teal-600 font-medium">Terms of Service</span> and <span className="text-petinsure-teal-600 font-medium">Privacy Policy</span>
                  </span>
                </label>

                <label className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-petinsure-teal-600 focus:ring-petinsure-teal-500 mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    I consent to AI-powered processing of my pet's data for insurance purposes
                  </span>
                </label>

                <label className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-petinsure-teal-600 focus:ring-petinsure-teal-500 mt-1"
                  />
                  <span className="text-sm text-gray-700">
                    I want to receive email updates about my pet's coverage and health tips
                  </span>
                </label>
              </div>
            </div>
          </div>
        );

      case 3: // Complete
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-6">
              <Check size={32} className="text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome to PetInsureX! 🎉
            </h2>
            
            <p className="text-gray-600 max-w-md mx-auto">
              {formData.petName || 'Your pet'} is now registered and protected. 
              Your policy will be activated within 24 hours.
            </p>

            <GlassCard className="p-6 max-w-md mx-auto">
              <h3 className="font-semibold text-gray-900 mb-4 text-xl">What's Next?</h3>
              <div className="space-y-3 text-sm text-left">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-petinsure-teal-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Policy documents sent to your email</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-petinsure-teal-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Download the mobile app for quick claims</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-petinsure-teal-500 rounded-full"></div>
                  <span className="text-gray-700 font-medium">Schedule a free vet consultation</span>
                </div>
              </div>
            </GlassCard>

            <PawButton size="lg" className="mx-auto">
              Go to Dashboard
            </PawButton>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-petinsure-blue-50 via-white to-petinsure-teal-50 pt-4 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="font-display text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Pet Registration
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Let's get your furry friend protected with AI-powered insurance.
            </p>
          </div>

          <ProgressStepper
            steps={steps}
            currentStep={currentStep}
            completedSteps={completedSteps}
            className="mb-6 sm:mb-8"
          />

          <GlassCard className="p-4 sm:p-8">
            {renderStepContent()}

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/20 gap-4 sm:gap-0">
              <PawButton
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                type="button"
                className="flex items-center gap-2 w-full sm:w-auto order-2 sm:order-1"
              >
                <ChevronLeft size={16} />
                Previous
              </PawButton>

              <div className="text-xs sm:text-sm text-gray-500 order-1 sm:order-2">
                Step {currentStep + 1} of {steps.length}
              </div>

              <PawButton
                onClick={handleNext}
                disabled={currentStep === steps.length - 1}
                type="button"
                className="flex items-center gap-2 w-full sm:w-auto order-3"
              >
                {currentStep === steps.length - 2 ? 'Complete' : 'Next'}
                <ChevronRight size={16} />
              </PawButton>
            </div>
          </GlassCard>
        </div>
      </div>
    </Layout>
  );
};

export default Onboarding;
