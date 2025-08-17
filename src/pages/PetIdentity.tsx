
import React, { useState, useRef, useCallback, useEffect } from 'react';
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
  Target,
  StopCircle,
  Download,
  RotateCcw
} from 'lucide-react';

const PetIdentity = () => {
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const [showScanModal, setShowScanModal] = useState(false);
  const [scanType, setScanType] = useState<'photo' | 'video'>('photo');
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<any>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [cameraError, setCameraError] = useState<string>('');
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  // Camera functions
  const startCamera = useCallback(async () => {
    try {
      setCameraError('');
      setIsCameraActive(false);
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera access is not supported in this browser.');
        return;
      }

      const constraints = { 
        video: { 
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          facingMode: 'environment' // Use back camera on mobile
        },
        audio: scanType === 'video' // Only include audio for video
      };

      console.log('Requesting camera access with constraints:', constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Camera stream acquired:', stream);
      
      setCameraStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Add multiple event listeners to ensure proper loading
        const handleLoadedMetadata = () => {
          console.log('Video metadata loaded, attempting to play...');
          videoRef.current?.play()
            .then(() => {
              console.log('Video playback started successfully');
              setIsCameraActive(true);
            })
            .catch((error) => {
              console.error('Video play error:', error);
              setCameraError('Failed to start video playback.');
            });
        };

        const handleCanPlay = () => {
          console.log('Video can play');
          setIsCameraActive(true);
        };

        videoRef.current.onloadedmetadata = handleLoadedMetadata;
        videoRef.current.oncanplay = handleCanPlay;
        
        // Force load in case the events don't fire
        setTimeout(() => {
          if (videoRef.current && !isCameraActive) {
            console.log('Forcing video load...');
            videoRef.current.load();
          }
        }, 1000);
      }
    } catch (error: any) {
      console.error('Camera access error:', error);
      let errorMessage = 'Unable to access camera. ';
      
      if (error.name === 'NotAllowedError') {
        errorMessage += 'Please allow camera permissions and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage += 'No camera found on this device.';
      } else if (error.name === 'NotReadableError') {
        errorMessage += 'Camera is already in use by another application.';
      } else {
        errorMessage += 'Please check permissions and try again.';
      }
      
      setCameraError(errorMessage);
    }
  }, [scanType, isCameraActive]);

  const stopCamera = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
      setIsCameraActive(false);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [cameraStream]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedPhotos(prev => [...prev, photoDataUrl]);
      }
    }
  }, []);

  const startVideoRecording = useCallback(() => {
    if (cameraStream) {
      const recorder = new MediaRecorder(cameraStream);
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordedChunks([blob]);
      };
      
      setMediaRecorder(recorder);
      recorder.start();
      setIsRecording(true);
    }
  }, [cameraStream]);

  const stopVideoRecording = useCallback(() => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  }, [mediaRecorder, isRecording]);

  const downloadRecording = useCallback(() => {
    if (recordedChunks.length > 0) {
      const blob = recordedChunks[0];
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pet-scan-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [recordedChunks]);

  // Cleanup camera on component unmount or modal close
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const resetCapture = () => {
    setCapturedPhotos([]);
    setRecordedChunks([]);
    setCameraError('');
    setIsRecording(false);
  };

  const startScan = async () => {
    if (scanType === 'photo' && capturedPhotos.length === 0) {
      setCameraError('Please capture at least one photo before scanning.');
      return;
    }
    if (scanType === 'video' && recordedChunks.length === 0) {
      setCameraError('Please record a video before scanning.');
      return;
    }

    setIsScanning(true);
    setScanProgress(0);
    setScanResults(null);
    stopCamera(); // Stop camera during processing

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

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="font-display text-xl sm:text-2xl font-bold text-gray-900 mb-2">Pet Identity & AI Analysis</h1>
            <p className="text-sm sm:text-base text-gray-600">Advanced AI-powered breed detection and unique identification scanning</p>
          </div>

          {/* Stats Cards with enhanced borders and teal aura */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {[
              { label: 'Verified Pets', value: '2', icon: Shield, color: 'text-green-600' },
              { label: 'Avg Confidence', value: '85%', icon: Target, color: 'text-blue-600' },
              { label: 'Unique Markers', value: '7', icon: Star, color: 'text-yellow-600' },
              { label: 'Last Scan', value: '5 days', icon: Scan, color: 'text-petinsure-teal-600' }
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

          {/* Pet Cards with enhanced borders and teal aura */}
          <div className="grid grid-cols-1 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {mockPets.map((pet) => (
              <GlassCard key={pet.id} className="p-6 aura-teal-prominent" borderStyle="prominent">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-3xl">
                    {pet.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display text-xl font-semibold text-gray-900">{pet.name}</h3>
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

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <PawButton
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={() => setSelectedPet(pet.id)}
                    >
                      <Eye size={16} />
                      <span className="hidden sm:inline">View Details</span>
                      <span className="sm:hidden">Details</span>
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
                      <span className="hidden sm:inline">New Scan</span>
                      <span className="sm:hidden">Scan</span>
                    </PawButton>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* AI Features with enhanced borders and intense teal aura */}
          <GlassCard className="p-4 sm:p-6 aura-teal-intense" borderStyle="prominent">
            <h2 className="font-display text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">AI-Powered Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Brain size={20} className="text-blue-600 sm:size-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-xl">Breed Detection</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4">Advanced AI identifies breed with 95%+ accuracy using computer vision</p>
                <div className="text-xs text-blue-600 font-medium">Latest: GPT-4 Vision</div>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Target size={20} className="text-green-600 sm:size-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-xl">Unique ID Mapping</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4">Creates digital fingerprint from facial features, markings, and patterns</p>
                <div className="text-xs text-green-600 font-medium">Features: 50+ markers</div>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Shield size={20} className="text-purple-600 sm:size-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-xl">Fraud Prevention</h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4">Prevents identity fraud by matching pets to verified database</p>
                <div className="text-xs text-purple-600 font-medium">Accuracy: 99.8%</div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* AI Scan Modal - Mobile optimized */}
      <Modal
        isOpen={showScanModal}
        onClose={() => {
          setShowScanModal(false);
          setIsScanning(false);
          setScanProgress(0);
          setScanResults(null);
          stopCamera();
          resetCapture();
        }}
        title="AI Pet Identity Scan"
        size="md"
      >
        <div className="space-y-4 sm:space-y-6">
          {!scanResults && !isScanning && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Choose Scan Method</h3>
                <p className="text-sm sm:text-base text-gray-600">Select how you'd like to capture your pet's identity</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <button
                  onClick={() => setScanType('photo')}
                  className={cn(
                    "p-3 sm:p-4 lg:p-6 rounded-xl border-2 transition-all",
                    scanType === 'photo' ? 'border-petinsure-teal-300 bg-petinsure-teal-50' : 'border-gray-200'
                  )}
                >
                  <div className="text-center">
                    <Camera size={24} className="mx-auto mb-2 sm:mb-3 text-petinsure-teal-600 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                    <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Photo Capture</h4>
                    <p className="text-xs sm:text-sm text-gray-600">Take photos from multiple angles</p>
                  </div>
                </button>

                <button
                  onClick={() => setScanType('video')}
                  className={cn(
                    "p-4 sm:p-6 rounded-xl border-2 transition-all",
                    scanType === 'video' ? 'border-petinsure-teal-300 bg-petinsure-teal-50' : 'border-gray-200'
                  )}
                >
                  <div className="text-center">
                    <Video size={28} className="mx-auto mb-3 text-petinsure-teal-600 sm:size-8" />
                    <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">Video Scan</h4>
                    <p className="text-xs sm:text-sm text-gray-600">360° video for complete analysis</p>
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

                  {cameraError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                      {cameraError}
                    </div>
                  )}

                  {!isCameraActive ? (
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <PawButton className="flex-1" onClick={startCamera}>
                          <Camera size={16} />
                          Open Camera
                        </PawButton>
                        <PawButton variant="secondary" className="flex-1" onClick={() => fileInputRef.current?.click()}>
                          <Upload size={16} />
                          Upload Photos
                        </PawButton>
                      </div>

                      {/* Debug info for camera issues */}
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>Camera Support: {navigator.mediaDevices ? '✅ Available' : '❌ Not Available'}</div>
                        <div>getUserMedia: {navigator.mediaDevices?.getUserMedia ? '✅ Supported' : '❌ Not Supported'}</div>
                        <div>HTTPS/Localhost: {location.protocol === 'https:' || location.hostname === 'localhost' ? '✅ Secure' : '❌ Requires HTTPS'}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-gray-300">
                        <video
                          ref={videoRef}
                          className="w-full h-full object-cover"
                          autoPlay
                          muted
                          playsInline
                          style={{ transform: 'scaleX(-1)' }} // Mirror the video for selfie-like experience
                        />
                        
                        {/* Camera guidelines overlay */}
                        <div className="absolute inset-4 border-2 border-dashed border-white/70 rounded-xl pointer-events-none">
                          <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                            {isCameraActive ? 'Camera Active' : 'Starting Camera...'}
                          </div>
                        </div>

                        {/* Loading spinner when camera is starting */}
                        {!isCameraActive && (
                          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                            <div className="text-center text-white">
                              <RefreshCw size={32} className="mx-auto mb-2 animate-spin" />
                              <p className="text-sm">Starting camera...</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        <PawButton onClick={capturePhoto} className="flex-1">
                          <Camera size={16} />
                          <span className="hidden sm:inline">Capture Photo ({capturedPhotos.length})</span>
                          <span className="sm:hidden">Photo ({capturedPhotos.length})</span>
                        </PawButton>
                        <PawButton variant="secondary" onClick={stopCamera} className="sm:flex-shrink-0">
                          <StopCircle size={16} />
                          <span className="hidden sm:inline">Stop Camera</span>
                          <span className="sm:hidden">Stop</span>
                        </PawButton>
                      </div>

                      {capturedPhotos.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="font-medium text-gray-900">Captured Photos ({capturedPhotos.length})</h5>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {capturedPhotos.map((photo, index) => (
                              <img
                                key={index}
                                src={photo}
                                alt={`Captured ${index + 1}`}
                                className="w-full aspect-square object-cover rounded-lg border border-gray-200"
                              />
                            ))}
                          </div>
                          <PawButton variant="ghost" size="sm" onClick={resetCapture}>
                            <RotateCcw size={14} />
                            Reset Photos
                          </PawButton>
                        </div>
                      )}
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        const files = Array.from(e.target.files);
                        const photoUrls = files.map(file => URL.createObjectURL(file));
                        setCapturedPhotos(photoUrls);
                      }
                    }}
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

                  {cameraError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                      {cameraError}
                    </div>
                  )}

                  {!isCameraActive ? (
                    <div className="text-center py-8">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Video size={32} className="text-gray-400" />
                      </div>
                      <h5 className="font-medium text-gray-900 mb-2">Ready to Record</h5>
                      <p className="text-sm text-gray-600 mb-4">Start your camera to begin recording</p>
                      <PawButton onClick={startCamera}>
                        <Camera size={16} />
                        Start Camera
                      </PawButton>

                      {/* Debug info for camera issues */}
                      <div className="text-xs text-gray-500 space-y-1 mt-4">
                        <div>Camera Support: {navigator.mediaDevices ? '✅ Available' : '❌ Not Available'}</div>
                        <div>getUserMedia: {navigator.mediaDevices?.getUserMedia ? '✅ Supported' : '❌ Not Supported'}</div>
                        <div>HTTPS/Localhost: {location.protocol === 'https:' || location.hostname === 'localhost' ? '✅ Secure' : '❌ Requires HTTPS'}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-gray-300">
                        <video
                          ref={videoRef}
                          className="w-full h-full object-cover"
                          autoPlay
                          muted
                          playsInline
                          style={{ transform: 'scaleX(-1)' }} // Mirror the video for selfie-like experience
                        />
                        
                        {/* Recording indicator */}
                        {isRecording && (
                          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                            <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                            REC
                          </div>
                        )}

                        {/* Camera guidelines overlay */}
                        <div className="absolute inset-4 border-2 border-dashed border-white/70 rounded-xl pointer-events-none">
                          <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                            {isCameraActive ? 'Camera Active' : 'Starting Camera...'}
                          </div>
                        </div>

                        {/* Loading spinner when camera is starting */}
                        {!isCameraActive && (
                          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center">
                            <div className="text-center text-white">
                              <RefreshCw size={32} className="mx-auto mb-2 animate-spin" />
                              <p className="text-sm">Starting camera...</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3">
                        {!isRecording ? (
                          <PawButton onClick={startVideoRecording} className="flex-1">
                            <Video size={16} />
                            <span className="hidden sm:inline">Start Recording</span>
                            <span className="sm:hidden">Record</span>
                          </PawButton>
                        ) : (
                          <PawButton onClick={stopVideoRecording} variant="secondary" className="flex-1">
                            <StopCircle size={16} />
                            <span className="hidden sm:inline">Stop Recording</span>
                            <span className="sm:hidden">Stop</span>
                          </PawButton>
                        )}
                        <PawButton variant="ghost" onClick={stopCamera} className="sm:flex-shrink-0">
                          <span className="hidden sm:inline">Close Camera</span>
                          <span className="sm:hidden">Close</span>
                        </PawButton>
                      </div>

                      {recordedChunks.length > 0 && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-green-900">Video Recorded!</h5>
                              <p className="text-sm text-green-700">Ready for AI analysis</p>
                            </div>
                            <PawButton size="sm" variant="ghost" onClick={downloadRecording}>
                              <Download size={14} />
                              Download
                            </PawButton>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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
                <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">AI Analysis in Progress</h3>
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
                <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">Scan Complete!</h3>
                <p className="text-gray-600">AI analysis has identified your pet with high confidence</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <GlassCard className="p-4 aura-teal-glow" borderStyle="subtle">
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

                <GlassCard className="p-4 aura-teal-glow" borderStyle="subtle">
                  <h4 className="font-semibold text-gray-900 mb-3">Uniqueness Score</h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-petinsure-teal-600 mb-2">
                      {scanResults.uniquenessScore}%
                    </div>
                    <p className="text-sm text-gray-600">Highly unique pet with distinctive features</p>
                  </div>
                </GlassCard>
              </div>

              <GlassCard className="p-4 aura-teal-prominent" borderStyle="subtle">
                <h4 className="font-semibold text-gray-900 mb-3">Unique Markers Detected</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {scanResults.breedDetection.uniqueMarkers.map((marker: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-petinsure-teal-50 rounded-lg border border-petinsure-teal-200/50 aura-teal-subtle">
                      <Star size={16} className="text-petinsure-teal-600" />
                      <span className="text-sm text-petinsure-teal-800">{marker}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-4 aura-teal-prominent" borderStyle="subtle">
                <h4 className="font-semibold text-gray-900 mb-3">Health Assessment</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-sm">
                  <div className="flex justify-between sm:flex-col">
                    <span className="text-gray-600">Eye Clarity:</span>
                    <span className="ml-2 sm:ml-0 font-medium text-green-600">{scanResults.healthIndicators.eyeClarity}</span>
                  </div>
                  <div className="flex justify-between sm:flex-col">
                    <span className="text-gray-600">Coat Condition:</span>
                    <span className="ml-2 sm:ml-0 font-medium text-green-600">{scanResults.healthIndicators.coatCondition}</span>
                  </div>
                  <div className="flex justify-between sm:flex-col">
                    <span className="text-gray-600">Posture:</span>
                    <span className="ml-2 sm:ml-0 font-medium text-green-600">{scanResults.healthIndicators.posture}</span>
                  </div>
                </div>
              </GlassCard>

              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>Analysis Complete:</strong> {scanResults.breedDetection.analysis}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <PawButton variant="ghost" className="flex-1" onClick={() => {
                  setShowScanModal(false);
                  setScanResults(null);
                  resetCapture();
                }}>
                  Close
                </PawButton>
                <PawButton className="flex-1" onClick={() => {
                  // Save to profile logic would go here
                  setShowScanModal(false);
                  setScanResults(null);
                  resetCapture();
                }}>
                  <CheckCircle size={16} />
                  <span className="hidden sm:inline">Save to Profile</span>
                  <span className="sm:hidden">Save</span>
                </PawButton>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!isScanning && !scanResults && (
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <PawButton 
                variant="ghost" 
                className="flex-1" 
                onClick={() => {
                  setShowScanModal(false);
                  stopCamera();
                  resetCapture();
                }}
              >
                Cancel
              </PawButton>
              <PawButton 
                className="flex-1" 
                onClick={startScan}
                disabled={(scanType === 'photo' && capturedPhotos.length === 0) || (scanType === 'video' && recordedChunks.length === 0)}
              >
                <Scan size={16} />
                <span className="hidden sm:inline">Start AI Analysis</span>
                <span className="sm:hidden">Analyze</span>
              </PawButton>
            </div>
          )}

          {/* Hidden canvas for photo capture */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </Modal>
    </Layout>
  );
};

export default PetIdentity;
