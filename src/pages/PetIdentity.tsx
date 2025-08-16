
import React, { useState, useRef } from 'react';
import { Layout } from '@/components/layout/Layout';
import { GlassCard } from '@/components/ui/glass-card';
import { PawButton } from '@/components/ui/paw-button';
import { Modal } from '@/components/ui/modal';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  Camera, 
  Upload, 
  Eye, 
  Brain, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  Scan,
  Video,
  Image as ImageIcon,
  RefreshCw,
  Star,
  Shield,
  Target
} from 'lucide-react';

const PetIdentity = () => {
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanType, setScanType] = useState<'photo' | 'video'>('photo');
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const mockPets = [
    {
      id: 'pet-mali',
      name: 'Mali',
      species: 'dog',
      breed: 'Golden Retriever',
      age: '3 years',
      avatar: '🐕',
      status: 'Verified',
      confidence: 94,
      lastScan: '2024-01-15',
      uniqueMarkers: ['Left ear spot', 'Nose pattern', 'Chest marking'],
      photos: ['/mock-mali1.jpg', '/mock-mali2.jpg', '/mock-mali3.jpg', '/mock-mali4.jpg']
    },
    {
      id: 'pet-taro',
      name: 'Taro',
      species: 'cat',
      breed: 'British Shorthair',
      age: '2 years',
      avatar: '🐱',
      status: 'Needs Update',
      confidence: 76,
      lastScan: '2024-01-01',
      uniqueMarkers: ['Whisker pattern', 'Eye color variation', 'Paw markings'],
      photos: ['/mock-taro1.jpg', '/mock-taro2.jpg']
    }
  ];

  const mockScanResults = {
    breedDetection: {
      primaryBreed: 'Golden Retriever',
      confidence: 96,
      secondaryBreeds: [
        { breed: 'Labrador Retriever', confidence: 78 },
        { breed: 'Nova Scotia Duck Tolling Retriever', confidence: 65 }
      ],
      uniqueMarkers: [
        'Distinctive nose leather pattern',
        'Left ear freckle cluster',
        'Chest fur swirl pattern',
        'Right front paw white marking'
      ],
      analysis: 'High confidence breed identification with multiple unique identifying features detected.'
    },
    uniquenessScore: 98,
    similarities: [
      { petId: 'similar-001', similarity: 12, owner: 'Anonymous', breed: 'Golden Retriever' }
    ],
    healthIndicators: {
      eyeClarity: 'Excellent',
      coatCondition: 'Healthy',
      posture: 'Normal',
      alerts: []
    }
  };

  const startScan = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setScanResults(null);

    // Simulate AI scanning process
    const steps = [
      { name: 'Image Processing', duration: 1000 },
      { name: 'Breed Analysis', duration: 2000 },
      { name: 'Unique Feature Detection', duration: 1500 },
      { name: 'Database Comparison', duration: 2500 },
      { name: 'Health Assessment', duration: 1000 }
    ];

    let totalProgress = 0;
    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, step.duration));
      totalProgress += 20;
      setScanProgress(totalProgress);
    }

    setScanResults(mockScanResults);
    setIsScanning(false);
  };

  const startVideoCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Pet Identity & AI Analysis</h1>
            <p className="text-gray-600">Advanced AI-powered breed detection and unique identification scanning</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Verified Pets', value: '2', icon: Shield, color: 'text-green-600' },
              { label: 'Avg Confidence', value: '85%', icon: Target, color: 'text-blue-600' },
              { label: 'Unique Markers', value: '7', icon: Star, color: 'text-yellow-600' },
              { label: 'Last Scan', value: '5 days', icon: Scan, color: 'text-petinsure-teal-600' }
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

          {/* Pet Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {mockPets.map((pet) => (
              <GlassCard key={pet.id} className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-3xl">
                    {pet.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{pet.name}</h3>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium",
                        pet.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      )}>
                        {pet.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">{pet.breed} • {pet.age}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Brain size={16} />
                      <span>ID Confidence: {pet.confidence}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Unique Markers</h4>
                    <div className="flex flex-wrap gap-2">
                      {pet.uniqueMarkers.map((marker, index) => (
                        <span key={index} className="px-2 py-1 bg-petinsure-teal-100 text-petinsure-teal-700 text-xs rounded-full">
                          {marker}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Recent Photos</h4>
                    <div className="flex gap-2">
                      {pet.photos.slice(0, 4).map((photo, index) => (
                        <div key={index} className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <ImageIcon size={16} className="text-gray-400" />
                        </div>
                      ))}
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-500">
                        +{Math.max(0, pet.photos.length - 4)}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <PawButton
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedPet(pet.id)}
                    >
                      <Eye size={16} />
                      View Details
                    </PawButton>
                    <PawButton
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedPet(pet.id);
                        setShowScanModal(true);
                      }}
                    >
                      <Scan size={16} />
                      New Scan
                    </PawButton>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* AI Features */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">AI-Powered Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain size={24} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Breed Detection</h3>
                <p className="text-sm text-gray-600 mb-4">Advanced AI identifies breed with 95%+ accuracy using computer vision</p>
                <div className="text-xs text-blue-600 font-medium">Latest: GPT-4 Vision</div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target size={24} className="text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Unique ID Mapping</h3>
                <p className="text-sm text-gray-600 mb-4">Creates digital fingerprint from facial features, markings, and patterns</p>
                <div className="text-xs text-green-600 font-medium">Features: 50+ markers</div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield size={24} className="text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Fraud Prevention</h3>
                <p className="text-sm text-gray-600 mb-4">Prevents identity fraud by matching pets to verified database</p>
                <div className="text-xs text-purple-600 font-medium">Accuracy: 99.8%</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* AI Scan Modal - Fixed size */}
      <Modal
        isOpen={showScanModal}
        onClose={() => {
          setShowScanModal(false);
          setIsScanning(false);
          setScanProgress(0);
          setScanResults(null);
        }}
        title="AI Pet Identity Scan"
        size="lg"
      >
        <div className="space-y-6">
          {!scanResults && !isScanning && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Scan Method</h3>
                <p className="text-gray-600">Select how you'd like to capture your pet's identity</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setScanType('photo')}
                  className={cn(
                    "p-6 rounded-xl border-2 transition-all",
                    scanType === 'photo' ? 'border-petinsure-teal-300 bg-petinsure-teal-50' : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="text-center">
                    <Camera size={32} className="mx-auto mb-3 text-petinsure-teal-600" />
                    <h4 className="font-medium text-gray-900 mb-1">Photo Capture</h4>
                    <p className="text-sm text-gray-600">Take photos from multiple angles</p>
                  </div>
                </button>

                <button
                  onClick={() => setScanType('video')}
                  className={cn(
                    "p-6 rounded-xl border-2 transition-all",
                    scanType === 'video' ? 'border-petinsure-teal-300 bg-petinsure-teal-50' : 'border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className="text-center">
                    <Video size={32} className="mx-auto mb-3 text-petinsure-teal-600" />
                    <h4 className="font-medium text-gray-900 mb-1">Video Scan</h4>
                    <p className="text-sm text-gray-600">360° video for complete analysis</p>
                  </div>
                </button>
              </div>

              {scanType === 'photo' && (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Photo Guidelines</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Take 4-6 photos from different angles</li>
                      <li>• Ensure good lighting and clear focus</li>
                      <li>• Include front, side, and full-body shots</li>
                      <li>• Avoid shadows and motion blur</li>
                    </ul>
                  </div>

                  <PawButton
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={20} />
                    Upload Photos
                  </PawButton>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={startScan}
                  />
                </div>
              )}

              {scanType === 'video' && (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <h4 className="font-medium text-green-900 mb-2">Video Guidelines</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Record 30-60 seconds of your pet</li>
                      <li>• Slowly rotate around your pet</li>
                      <li>• Keep pet calm and still</li>
                      <li>• Good lighting is essential</li>
                    </ul>
                  </div>

                  <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center">
                    <video
                      ref={videoRef}
                      className="w-full h-full rounded-xl"
                      autoPlay
                      muted
                    />
                  </div>

                  <div className="flex gap-3">
                    <PawButton variant="secondary" className="flex-1" onClick={startVideoCapture}>
                      <Camera size={16} />
                      Start Camera
                    </PawButton>
                    <PawButton className="flex-1" onClick={startScan}>
                      <Video size={16} />
                      Start Recording
                    </PawButton>
                  </div>
                </div>
              )}
            </div>
          )}

          {isScanning && (
            <div className="text-center py-8 space-y-6">
              <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
                <Brain size={48} className="text-white animate-pulse" />
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Analysis in Progress</h3>
                <p className="text-gray-600">Our advanced AI is analyzing your pet's unique features</p>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                <Progress value={scanProgress} className="h-3" />
                <p className="text-sm text-gray-600">{scanProgress}% Complete</p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-sm">
                {[
                  { step: 'Image Processing', status: scanProgress > 0 ? 'complete' : 'pending' },
                  { step: 'Breed Analysis', status: scanProgress > 20 ? 'complete' : scanProgress > 0 ? 'active' : 'pending' },
                  { step: 'Feature Detection', status: scanProgress > 40 ? 'complete' : scanProgress > 20 ? 'active' : 'pending' },
                  { step: 'Database Search', status: scanProgress > 60 ? 'complete' : scanProgress > 40 ? 'active' : 'pending' },
                  { step: 'Health Check', status: scanProgress > 80 ? 'complete' : scanProgress > 60 ? 'active' : 'pending' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {item.status === 'complete' ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : item.status === 'active' ? (
                      <RefreshCw size={16} className="text-blue-500 animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                    )}
                    <span className={cn(
                      item.status === 'complete' ? 'text-green-700' : 
                      item.status === 'active' ? 'text-blue-700' : 'text-gray-500'
                    )}>
                      {item.step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {scanResults && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={40} className="text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Scan Complete!</h3>
                <p className="text-gray-600">AI analysis has identified your pet with high confidence</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Breed Detection</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{scanResults.breedDetection.primaryBreed}</span>
                      <span className="text-sm font-medium text-green-600">{scanResults.breedDetection.confidence}%</span>
                    </div>
                    {scanResults.breedDetection.secondaryBreeds.map((breed: any, index: number) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{breed.breed}</span>
                        <span className="text-gray-500">{breed.confidence}%</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                <GlassCard className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Uniqueness Score</h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-petinsure-teal-600 mb-2">
                      {scanResults.uniquenessScore}%
                    </div>
                    <p className="text-sm text-gray-600">Highly unique pet with distinctive features</p>
                  </div>
                </GlassCard>
              </div>

              <GlassCard className="p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Unique Markers Detected</h4>
                <div className="grid grid-cols-2 gap-2">
                  {scanResults.breedDetection.uniqueMarkers.map((marker: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-petinsure-teal-50 rounded-lg">
                      <Star size={16} className="text-petinsure-teal-600" />
                      <span className="text-sm text-petinsure-teal-800">{marker}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Health Assessment</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Eye Clarity:</span>
                    <span className="ml-2 font-medium text-green-600">{scanResults.healthIndicators.eyeClarity}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Coat Condition:</span>
                    <span className="ml-2 font-medium text-green-600">{scanResults.healthIndicators.coatCondition}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Posture:</span>
                    <span className="ml-2 font-medium text-green-600">{scanResults.healthIndicators.posture}</span>
                  </div>
                </div>
              </GlassCard>

              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>Analysis Complete:</strong> {scanResults.breedDetection.analysis}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <PawButton variant="ghost" className="flex-1" onClick={() => setShowScanModal(false)}>
                  Close
                </PawButton>
                <PawButton className="flex-1">
                  Save to Profile
                </PawButton>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </Layout>
  );
};

export default PetIdentity;
