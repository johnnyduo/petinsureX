import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { Logo } from '@/components/common/Logo';
import { PawButton } from '@/components/ui/paw-button';
import { GlassCard } from '@/components/ui/glass-card';
import { 
  Shield, 
  Camera, 
  Brain, 
  Zap, 
  CheckCircle, 
  Star,
  ArrowRight,
  Play
} from 'lucide-react';
import { UI_COPY } from '@/lib/constants';

const Index = () => {
  const features = [
    {
      icon: Camera,
      title: 'AI Pet Recognition',
      description: 'Advanced computer vision ensures your pet photos match your registered profile instantly.'
    },
    {
      icon: Brain,
      title: 'Smart Fraud Detection',
      description: 'SEA-LION powered analysis detects fraudulent claims with explainable AI reasoning.'
    },
    {
      icon: Shield,
      title: 'ZKP Privacy Proofs',
      description: 'Zero-knowledge proofs protect sensitive veterinary data while ensuring claim validity.'
    },
    {
      icon: Zap,
      title: 'Instant Processing',
      description: 'OCR invoice extraction and automated underwriting for lightning-fast claim approvals.'
    }
  ];

  const stats = [
    { value: '98%', label: 'Claim Accuracy' },
    { value: '<2min', label: 'Average Processing' },
    { value: '10k+', label: 'Happy Pets' },
    { value: '24/7', label: 'AI Support' }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Dog Owner',
      content: 'Mali\'s emergency surgery claim was approved in under 2 minutes. The AI recognized her instantly!',
      rating: 5,
      avatar: '🐕'
    },
    {
      name: 'Dr. James Wong',
      role: 'Veterinarian',
      content: 'The vet attestation system streamlines our workflow. KMS signatures ensure authenticity.',
      rating: 5,
      avatar: '👨‍⚕️'
    },
    {
      name: 'Lisa Park',
      role: 'Cat Owner',
      content: 'Zero-knowledge proofs let me keep Taro\'s medical history private while still getting covered.',
      rating: 5,
      avatar: '🐱'
    }
  ];

  return (
    <Layout showNavigation={false}>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-petinsure-teal-50 via-white to-blue-50"></div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 opacity-30">
          <div className="w-20 h-20 bg-gradient-primary rounded-full blur-xl animate-paw-bounce"></div>
        </div>
        <div className="absolute bottom-40 right-20 opacity-20">
          <div className="w-32 h-32 bg-gradient-accent rounded-full blur-2xl animate-paw-bounce" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="text-center mb-16">
            <Logo size="lg" className="justify-center mb-8" />
            
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                AI-Powered
              </span>
              <br />
              <span className="font-brand">Pet Insurance</span>
            </h1>
            
            <p className="text-body-friendly text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Revolutionary pet insurance with computer vision identity verification, 
              fraud detection, and zero-knowledge privacy proofs. 
              Powered by SEA-LION AI for lightning-fast, accurate claims processing.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <a href="/onboarding">
                <PawButton size="lg" className="group">
                  {UI_COPY.CTA}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </PawButton>
              </a>
              
              <a href="/dashboard">
                <PawButton variant="ghost" size="lg" className="group">
                  <Play size={20} className="group-hover:scale-110 transition-transform" />
                  Try Demo
                </PawButton>
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
                <GlassCard key={index} className="p-6 text-center aura-teal-subtle" borderStyle="subtle">
                  <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Hero Image Placeholder */}
          <div className="relative max-w-4xl mx-auto">
            <GlassCard className="p-8 bg-gradient-to-br from-white/80 to-white/40 aura-teal-prominent" borderStyle="prominent">
              <div className="aspect-video bg-gradient-to-br from-petinsure-teal-100 to-blue-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🐕🐱</div>
                  <p className="text-gray-600">Interactive Demo Coming Soon</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
              Revolutionary Features
            </h2>
            <p className="text-body-friendly text-lg text-gray-600 max-w-2xl mx-auto">
              Cutting-edge technology meets pet care with our advanced AI-powered platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <GlassCard key={index} className="p-6 text-center group aura-teal-glow" borderStyle="prominent">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon size={28} className="text-white" />
                </div>
                <h3 className="text-display text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-body-friendly text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to comprehensive pet protection
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Register Your Pet',
                description: 'Upload 4 canonical photos with our guided capture system. AI creates a unique identity profile.',
                icon: '📸'
              },
              {
                step: '02',
                title: 'Submit Claims Instantly',
                description: 'Upload invoice and injury photos. OCR extraction and fraud detection happen automatically.',
                icon: '🔍'
              },
              {
                step: '03',
                title: 'Get Paid Fast',
                description: 'AI verification, vet attestation, and ZKP privacy proofs ensure instant, secure payouts.',
                icon: '💰'
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <GlassCard className="p-8 text-center h-full aura-teal-prominent" borderStyle="prominent">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <div className="text-sm font-medium text-petinsure-teal-600 mb-2">
                    STEP {item.step}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-gray-900 mb-4">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </GlassCard>
                
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight size={24} className="text-petinsure-teal-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-4">
              Loved by Pet Owners & Vets
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from our community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <GlassCard key={index} className="p-6 aura-teal-subtle" borderStyle="subtle">
                <div className="flex items-center mb-4">
                  <div className="text-2xl mr-3">{testimonial.avatar}</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-gray-700 italic">
                  "{testimonial.content}"
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-90"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Protect Your Pet?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of pet owners who trust PetInsureX for comprehensive, 
            AI-powered protection.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PawButton 
              variant="secondary" 
              size="lg"
              className="bg-white text-petinsure-teal-600 hover:bg-gray-50"
            >
              Start Free Trial
            </PawButton>
            <PawButton 
              variant="ghost" 
              size="lg"
              className="text-white border border-white/30 hover:bg-white/10"
            >
              Schedule Demo
            </PawButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <Logo size="md" className="mb-4" />
              <p className="text-gray-400 mb-6 max-w-md">
                Revolutionary pet insurance powered by AI, computer vision, 
                and zero-knowledge proofs for ultimate privacy and security.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-petinsure-teal-600 transition-colors cursor-pointer">
                  📧
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-petinsure-teal-600 transition-colors cursor-pointer">
                  🐦
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-petinsure-teal-600 transition-colors cursor-pointer">
                  📱
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PetInsureX. All rights reserved. Built with AI, secured with ZKP.</p>
          </div>
        </div>
      </footer>
    </Layout>
  );
};

export default Index;
