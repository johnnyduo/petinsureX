
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { GlassCard } from '@/components/ui/glass-card';
import { PawButton } from '@/components/ui/paw-button';
import { ServiceHealthMonitor } from '@/components/common/ServiceHealthMonitor';
import { cn } from '@/lib/utils';
import { seaLionAPI } from '@/lib/sea-lion';
import { aiContextManager } from '@/lib/ai-context';
import { useTranslation, translationService } from '@/lib/translation';
import { 
  Brain, 
  Send, 
  Mic, 
  MicOff, 
  Camera, 
  FileText, 
  Lightbulb, 
  Heart, 
  Shield,
  Zap,
  User,
  Bot,
  Image as ImageIcon,
  Upload,
  RefreshCw,
  Stethoscope,
  Calendar,
  Receipt
} from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  attachments?: Array<{
    type: 'image' | 'document';
    url: string;
    name: string;
  }>;
}

const AIAssistant = () => {
  const { t } = useTranslation();
  
  // Get personalized welcome message
  const getWelcomeMessage = () => {
    const userContext = aiContextManager.getUserContext();
    const petNames = userContext.pets.map(p => p.name).join(', ');
    const activePolicies = userContext.policies.length;
    const recentClaims = userContext.claims.length;
    
    const personalizedGreeting = petNames 
      ? `Hello! I'm your AI pet insurance assistant, ready to help you with ${petNames} and your ${activePolicies} active ${activePolicies === 1 ? 'policy' : 'policies'}.`
      : "Hello! I'm your AI pet insurance assistant.";
    
    const baseMessage = seaLionAPI.isConfigured() 
      ? `${personalizedGreeting} I'm powered by SEA-LION AI and specialize in Southeast Asian pet care contexts.\n\n🌏 **Languages**: English, Singlish, Thai (ภาษาไทย), Bahasa Malaysia, Bahasa Indonesia\n\n🏥 **Professional Services**:\n• Claims processing & fraud detection\n• Policy analysis & recommendations  \n• Emergency veterinary guidance\n• Health insights & wellness planning\n• Regional vet network navigation\n\n📊 **Your Account**: ${activePolicies} active ${activePolicies === 1 ? 'policy' : 'policies'}, ${recentClaims} ${recentClaims === 1 ? 'claim' : 'claims'}\n\nHow can I assist you today? 🐾`
      : `${personalizedGreeting} I'm running in demo mode with sample responses. For full AI capabilities, please configure the SEA-LION API key.\n\nHow can I assist you today? 🐾`;
    
    return baseMessage;
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: getWelcomeMessage(),
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quickActions = [
    { 
      icon: Shield, 
      label: t('ai.actions.check_coverage', 'Check Policy Coverage'), 
      prompt: t('ai.prompts.coverage', 'What does my Premium Plus policy cover for Mali\'s emergency surgery?') 
    },
    { 
      icon: FileText, 
      label: t('ai.actions.claim_status', 'Claim Status Update'), 
      prompt: t('ai.prompts.claim_status', 'What is the status of my gastric torsion claim CLM-2024-08-19-001?') 
    },
    { 
      icon: Heart, 
      label: t('ai.actions.emergency', 'Pet Health Emergency'), 
      prompt: t('ai.prompts.emergency', 'My Golden Retriever is showing signs of bloating and distress - what should I do immediately?') 
    },
    { 
      icon: Stethoscope, 
      label: t('ai.actions.find_vet', 'Find Emergency Vet'), 
      prompt: t('ai.prompts.find_vet', 'Help me find 24/7 emergency veterinarians in Bangkok that accept my insurance') 
    },
    { 
      icon: Calendar, 
      label: t('ai.actions.wellness', 'Wellness Checkup'), 
      prompt: t('ai.prompts.wellness', 'Schedule annual wellness checkup for Taro - he\'s due for vaccinations') 
    },
    { 
      icon: Receipt, 
      label: t('ai.actions.analyze_bill', 'Analyze Vet Bill'), 
      prompt: t('ai.prompts.analyze_bill', 'Please review this $1,250 emergency surgery invoice for accuracy and fraud detection') 
    },
    {
      icon: Lightbulb,
      label: t('ai.actions.policy_recommend', 'Policy Recommendations'),
      prompt: 'AI_WORKFLOW:POLICY_ANALYSIS'
    },
    {
      icon: Brain,
      label: t('ai.actions.wellness_insights', 'Health Insights'),
      prompt: 'AI_WORKFLOW:WELLNESS_ANALYSIS'
    },
    {
      icon: Zap,
      label: t('ai.actions.claim_analysis', 'Analyze My Claims'),
      prompt: 'AI_WORKFLOW:CLAIM_ANALYSIS'
    }
  ];

  const mockResponses = [
    "Your Premium Plus policy provides excellent coverage for Mali's emergency surgery:\n\n✅ **Emergency Surgery Coverage**: Up to $4,500 annually\n✅ **Gastric Torsion**: Specifically covered as life-threatening condition\n✅ **Deductible**: $25 per incident\n✅ **Reimbursement**: 90% after deductible\n\n**Your Current Status:**\n🐕 Mali (Golden Retriever) - Identity Verified (94%)\n💰 Remaining Coverage: $3,250 of $4,500\n⚡ Claim Processing: Expedited for emergencies\n\nExpected payout for $1,250 claim: $1,102.50 (after $25 deductible + 10% copay)",

    "**Claim Status: CLM-2024-08-19-001** 🔍\n\n**Current Stage**: Under Review (Day 1 of 3-5)\n**Pet**: Mali (Golden Retriever)\n**Condition**: Gastric Torsion Emergency\n**Amount**: $1,250.00\n\n**AI Analysis Results:**\n✅ Pet Identity Match: 94% (Excellent)\n✅ Fraud Risk Score: 15% (Very Low)\n✅ SEA-LION AI Verification: Approved ✓\n✅ Medical Necessity: Confirmed ✓\n✅ Network Provider: Bangkok Animal Emergency Hospital ✓\n\n**Next Steps:**\n📋 Final AI review (24-48 hrs)\n💰 Payment processing (2-3 business days)\n📧 You'll receive email updates at each stage\n\n**Estimated Completion**: August 22, 2024",

    "🚨 **EMERGENCY RESPONSE - Gastric Torsion (Bloat)**\n\n**IMMEDIATE ACTION REQUIRED:**\n1. 🏥 **Go to emergency vet NOW** - This is life-threatening\n2. 📞 **Call ahead**: Bangkok Animal Emergency Hospital: (02) 555-0123\n3. 🚗 **Transport carefully**: Keep Mali calm, minimal movement\n4. ❌ **DO NOT** induce vomiting or give water\n\n**Emergency Vets Within 10km:**\n🏥 Bangkok Animal Emergency Hospital (2.1km) - OPEN 24/7\n🏥 Thonglor Veterinary Emergency (3.8km) - OPEN 24/7\n🏥 Sukhumvit Emergency Clinic (5.2km) - OPEN 24/7\n\n**Your Insurance Coverage:**\n✅ Emergency surgery: Covered 90%\n✅ Pre-approval: Not required for emergencies\n✅ Direct billing: Available at all listed hospitals\n\n**Time is critical - GO NOW!** 🚨",

    "🏥 **24/7 Emergency Veterinarians in Bangkok**\n\n**Top Recommended (Your Insurance Accepted):**\n\n� **Bangkok Animal Emergency Hospital**\n📍 123 Sukhumvit Rd, Klongtoei (2.1km)\n⭐ 4.9/5 stars (2,847 reviews)\n💰 Direct billing available\n🕐 24/7 Emergency & Surgery\n📞 Emergency: (02) 555-0123\n\n� **Thonglor Veterinary Emergency Center**\n📍 456 Thonglor Rd, Watthana (3.8km)\n⭐ 4.8/5 stars (1,923 reviews)\n💰 Direct billing available\n🕐 24/7 Emergency, Advanced Surgery\n📞 Emergency: (02) 555-0199\n\n� **Sukhumvit Emergency Animal Clinic**\n📍 789 Sukhumvit Rd, Khlong Tan (5.2km)\n⭐ 4.7/5 stars (1,567 reviews)\n💰 Direct billing available\n🕐 24/7 Emergency & Critical Care\n📞 Emergency: (02) 555-0156\n\n**Need directions or want me to call ahead?**",

    "📅 **Scheduling Taro's Annual Wellness Checkup**\n\n**Recommended Services for British Shorthair (2y 8m):**\n✅ Complete physical examination\n✅ FVRCP booster vaccination\n✅ Rabies vaccination renewal\n✅ Dental health assessment\n✅ Weight and body condition evaluation\n✅ Parasite screening\n\n**Your Coverage (Standard Plan):**\n💰 Wellness exam: $85 (100% covered)\n💰 Vaccinations: $95 (100% covered)\n💰 Dental check: $45 (100% covered)\n**Total estimated: $225 (Fully covered!)**\n\n**Available Appointments:**\n📅 **This Week**: Aug 22 (Thu) 2:00 PM\n📅 **Next Week**: Aug 26 (Mon) 10:30 AM, Aug 28 (Wed) 3:15 PM\n\n**Preferred Clinic**: Phuket Veterinary Clinic\n📞 Would you like me to book the Thursday 2:00 PM slot?",

    "🔍 **Invoice Analysis: Bangkok Animal Emergency Hospital**\n\n**Invoice Details:**\n📋 Invoice #: BAH-2024-08-19-001\n🗓️ Date: August 19, 2024\n🐕 Patient: Mali (Golden Retriever)\n💰 Total: $1,250.00\n\n**AI Fraud Detection Analysis:**\n✅ **Clinic Verification**: Network provider ✓\n✅ **Price Analysis**: Within normal range for gastric torsion surgery\n✅ **Service Codes**: All legitimate and necessary\n✅ **Duplicate Check**: No duplicate charges found\n✅ **Timeline**: Consistent with emergency nature\n\n**Line Item Review:**\n• Emergency consultation: $125 ✓ (Standard: $100-$150)\n• Pre-surgical bloodwork: $185 ✓ (Standard: $150-$200)\n• Anesthesia & monitoring: $220 ✓ (Standard: $200-$250)\n• Gastric torsion surgery: $620 ✓ (Standard: $550-$700)\n• Post-op medications: $85 ✓ (Standard: $70-$100)\n• Recovery monitoring: $15 ✓ (Standard: $10-$25)\n\n**Final Assessment:**\n🟢 **Fraud Risk**: Very Low (8%)\n🟢 **Pricing**: Fair and appropriate\n🟢 **Recommendation**: Approve for full processing\n\n**Expected payout**: $1,102.50 (after $25 deductible)"
  ];

  // Auto-scroll to bottom with improved performance
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      // Use requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end'
        });
      });
    }
  }, []);

  // Improved scroll effect with proper cleanup
  useEffect(() => {
    // Delay scroll to ensure DOM updates are complete
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(async (content?: string) => {
    const messageContent = content || inputMessage.trim();
    if (!messageContent || isTyping) return; // Prevent sending while AI is typing

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date()
    };

    // Use functional updates to prevent race conditions
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      let responseContent = '';
      let isFromAPI = false;
      
      // Try SEA-LION API first, fallback to mock responses
      if (seaLionAPI.isConfigured()) {
        console.log('🤖 SEA-LION API is configured, attempting to get response...');
        try {
          // Get user context for personalized responses with current language
          const currentLanguage = translationService.getCurrentLanguage();
          const userContext = aiContextManager.getUserContext(currentLanguage);
          console.log('📊 User context loaded:', {
            pets: userContext.pets.length,
            policies: userContext.policies.length,
            claims: userContext.claims.length,
            language: currentLanguage
          });
          
          // Check for AI workflow commands
          if (messageContent.startsWith('AI_WORKFLOW:')) {
            const workflowType = messageContent.replace('AI_WORKFLOW:', '');
            
            switch (workflowType) {
              case 'POLICY_ANALYSIS':
                console.log('🔍 Running policy analysis workflow...');
                responseContent = await seaLionAPI.generatePolicyRecommendations(
                  userContext.pets,
                  userContext.policies,
                  { location: 'Bangkok', coverage_priority: 'comprehensive' }
                );
                break;
                
              case 'WELLNESS_ANALYSIS':
                console.log('🏥 Running wellness analysis workflow...');
                responseContent = await seaLionAPI.generateWellnessInsights(
                  userContext.pets,
                  userContext.claims,
                  userContext.policies
                );
                break;
                
              case 'CLAIM_ANALYSIS':
                console.log('📊 Running claim analysis workflow...');
                if (userContext.claims.length > 0) {
                  const claimContext = aiContextManager.getClaimContext(userContext.claims[0].id);
                  responseContent = await seaLionAPI.analyzeClaim(
                    claimContext.claim!,
                    claimContext
                  );
                } else {
                  responseContent = `📋 **Claim Analysis Report**\n\nNo claims found for your pets. This is great news! Your pets have been healthy and haven't needed insurance coverage yet.\n\n**Recommendations:**\n• Continue preventive care to maintain good health\n• Consider wellness checkups to catch issues early\n• Keep your policy active for unexpected emergencies\n• Review your coverage annually as pets age`;
                }
                break;
                
              default:
                responseContent = await seaLionAPI.petInsuranceAssistant(messageContent, userContext);
            }
          } else {
            // Use SEA-LION API for regular chat with full context
            responseContent = await seaLionAPI.petInsuranceAssistant(messageContent, userContext);
          }
          isFromAPI = true;
          console.log('✅ SEA-LION API response received:', responseContent.substring(0, 100) + '...');
        } catch (apiError) {
          console.error('❌ SEA-LION API failed, using fallback:', apiError);
          
          // Enhanced fallback with multilingual support
          const errorMessage = apiError instanceof Error ? apiError.message : 'Unknown error';
          const isServerError = errorMessage.includes('500') || errorMessage.includes('Connection error');
          const isThaiQuery = /[\u0E00-\u0E7F]/.test(messageContent);
          
          if (isServerError) {
            // Server is down - provide helpful status message
            if (isThaiQuery) {
              responseContent = `🔧 **บริการ AI ชั่วคราวไม่พร้อมใช้งาน**

ขออภัยค่ะ บริการ SEA-LION AI กำลังมีปัญหาการเชื่อมต่อชั่วคราว

**สิ่งที่เราสามารถช่วยเหลือได้:**
• ✅ ความคุ้มครองกรมธรรม์ - ครอบคลุมอุบัติเหตุ เจ็บป่วย และการรักษาฉุกเฉิน
• ✅ การเคลม - ส่งใบเสร็จคลินิกภายใน 30 วัน
• ✅ เบี้ยประกัน - ขึ้นอยู่กับอายุ สายพันธุ์ และระดับความคุ้มครอง
• ✅ ระยะเวลารอ - 14 วันสำหรับการเจ็บป่วย, 48 ชั่วโมงสำหรับอุบัติเหตุ

**สำหรับความช่วยเหลือทันที**: support@petinsurex.com

*หมายเหตุ: ผู้ช่วย AI แบบเต็มรูปแบบจะกลับมาเมื่อบริการฟื้นฟู ขณะนี้แสดงตัวอย่างการตอบคำถาม*

---

${mockResponses[Math.floor(Math.random() * mockResponses.length)]}`;
            } else {
              responseContent = `🔧 **AI Service Temporarily Unavailable**

I apologize, but the SEA-LION AI service is currently experiencing temporary connectivity issues.

**What I can help you with:**
• ✅ **Policy Coverage** - Accidents, illnesses, and emergency care
• ✅ **Claims Processing** - Submit vet receipts within 30 days
• ✅ **Premium Information** - Based on pet age, breed, and coverage level
• ✅ **Waiting Periods** - 14 days for illness, 48 hours for accidents

**For immediate assistance**: support@petinsurex.com

*Note: Full AI capabilities will return once the service is restored. Showing sample response below:*

---

${mockResponses[Math.floor(Math.random() * mockResponses.length)]}`;
            }
          } else {
            // Other API errors
            responseContent = `⚠️ **Service Error**

I encountered an issue processing your request. Please try again in a moment, or contact our support team at support@petinsurex.com for immediate assistance.

Here's a sample response for your question:

${mockResponses[Math.floor(Math.random() * mockResponses.length)]}`;
          }
          
          isFromAPI = false;
        }
      } else {
        console.log('⚠️ SEA-LION API not configured, using mock responses');
        // Use mock responses if API not configured
        responseContent = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        isFromAPI = false;
      }

      // Create assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: '',
        timestamp: new Date(),
        isTyping: true
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      // Stream the response text for better UX
      let currentText = '';
      let index = 0;
      const streamInterval = setInterval(() => {
        if (index < responseContent.length) {
          // Add multiple characters at once for faster streaming
          const charsToAdd = Math.min(3, responseContent.length - index);
          currentText += responseContent.slice(index, index + charsToAdd);
          index += charsToAdd;
          
          // Batch updates for better performance
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMessage.id 
                ? { ...msg, content: currentText }
                : msg
            )
          );
        } else {
          clearInterval(streamInterval);
          // Final update to remove typing indicator
          setMessages(prev => 
            prev.map(msg => 
              msg.id === assistantMessage.id 
                ? { ...msg, isTyping: false }
                : msg
            )
          );
        }
      }, 20); // Faster streaming for better UX

    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment, or contact our support team if the issue persists.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  }, [inputMessage, isTyping, mockResponses]);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, you would handle voice recording here
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const userMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: `Uploaded ${file.name} for analysis`,
        timestamp: new Date(),
        attachments: [{
          type: file.type.startsWith('image/') ? 'image' : 'document',
          url: URL.createObjectURL(file),
          name: file.name
        }]
      };
      setMessages(prev => [...prev, userMessage]);
      sendMessage(`Please analyze this ${file.type.startsWith('image/') ? 'image' : 'document'}`);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <img 
                    src="/sealionllm.png" 
                    alt="SEA-LION LLM" 
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      // Fallback to Brain icon if logo fails to load
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <Brain size={24} className="text-white hidden" />
                </div>
                <div>
                  <h1 className="font-display text-2xl font-bold text-gray-900">{t('nav.ai_assistant')}</h1>
                  <p className="text-gray-600">Powered by SEA-LION LLM for intelligent pet insurance support</p>
                </div>
              </div>
              
              {/* Service Health Monitor */}
              <ServiceHealthMonitor variant="compact" />
            </div>

            {/* AI Stats with enhanced borders and teal aura */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { label: 'Response Time', value: '<2s', icon: Zap },
                { label: 'Accuracy Rate', value: '99.2%', icon: Shield },
                { label: 'Languages', value: '12+', icon: Brain },
                { label: 'Queries Today', value: '1,247', icon: Heart },
                { 
                  label: 'AI Model', 
                  value: seaLionAPI.isConfigured() ? 'SEA-LION' : 'Demo Mode', 
                  icon: seaLionAPI.isConfigured() ? Brain : RefreshCw,
                  status: seaLionAPI.isConfigured() ? 'active' : 'demo'
                }
              ].map((stat, index) => (
                <div key={index} className={cn(
                  "flex items-center gap-3 p-4 rounded-xl bg-white/50 border-2 transition-colors aura-teal-subtle",
                  stat.status === 'active' 
                    ? "border-green-200/50 hover:border-green-300/70" 
                    : stat.status === 'demo'
                    ? "border-orange-200/50 hover:border-orange-300/70"
                    : "border-petinsure-teal-200/50 hover:border-petinsure-teal-300/70"
                )}>
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    stat.status === 'active' 
                      ? "bg-green-100" 
                      : stat.status === 'demo'
                      ? "bg-orange-100"
                      : "bg-petinsure-teal-100"
                  )}>
                    <stat.icon size={20} className={cn(
                      stat.status === 'active' 
                        ? "text-green-600" 
                        : stat.status === 'demo'
                        ? "text-orange-600"
                        : "text-petinsure-teal-600"
                    )} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="font-semibold text-gray-900">{stat.value}</p>
                    {stat.status === 'active' && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600">Live</span>
                      </div>
                    )}
                    {stat.status === 'demo' && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-xs text-orange-600">Mock</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Chat Area with enhanced borders and intense teal aura */}
            <div className="lg:col-span-3">
              <GlassCard className="flex flex-col h-[600px] aura-teal-intense" borderStyle="prominent">
                {/* Messages with improved rendering */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4" style={{ scrollBehavior: 'smooth' }}>
                  {messages.map((message, index) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3 chat-message-enter opacity-0",
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      )}
                      style={{
                        animation: `message-slide-in 0.3s ease-out ${index * 0.1}s forwards`
                      }}
                    >
                      {message.type === 'assistant' && (
                        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot size={16} className="text-white" />
                        </div>
                      )}
                      
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-3 break-words relative",
                          message.type === 'user'
                            ? 'bg-gradient-primary text-white shadow-paw'
                            : 'bg-white/50 text-gray-900 border border-white/20 backdrop-blur-sm'
                        )}
                        style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                      >
                        {message.type === 'assistant' && (
                          <img 
                            src="/sealionllm.png" 
                            alt="SEA-LION LLM" 
                            className="absolute top-2 object-contain opacity-60 hover:opacity-100 transition-opacity z-10"
                            style={{ width: '100px', height: 'auto', right: '-140px' }}
                            title="Powered by SEA-LION LLM"
                          />
                        )}
                        <p className="text-sm leading-relaxed whitespace-pre-wrap pr-8">
                          {message.content}
                          {message.isTyping && (
                            <span className="chat-typing-indicator inline-block w-2 h-4 bg-current opacity-50 ml-1" />
                          )}
                        </p>
                        
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {message.attachments.map((attachment, index) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-black/10 rounded-lg">
                                {attachment.type === 'image' ? (
                                  <ImageIcon size={16} className="text-gray-600" />
                                ) : (
                                  <FileText size={16} className="text-gray-600" />
                                )}
                                <span className="text-xs font-medium">{attachment.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <p className="text-xs opacity-70 mt-2 font-mono">
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                      
                      {message.type === 'user' && (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <User size={16} className="text-gray-600" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                        <RefreshCw size={16} className="text-white animate-spin" />
                      </div>
                      <div className="bg-white/50 rounded-2xl px-4 py-3 border border-white/20">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area with improved responsiveness */}
                <div className="border-t border-white/20 p-4">
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 p-3 bg-white/50 rounded-2xl border border-petinsure-teal-200 focus-within:border-petinsure-teal-400 focus-within:ring-2 focus-within:ring-petinsure-teal-100 transition-all duration-200 shadow-sm">
                        <textarea
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              if (!isTyping && inputMessage.trim()) {
                                sendMessage();
                              }
                            }
                          }}
                          placeholder="Ask about claims, policies, pet health, or upload documents..."
                          rows={1}
                          disabled={isTyping}
                          className="flex-1 bg-transparent border-none outline-none resize-none text-gray-900 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{
                            minHeight: '24px',
                            maxHeight: '120px'
                          }}
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isTyping}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Upload file"
                          >
                            <Upload size={18} className="text-gray-500" />
                          </button>
                          <button
                            onClick={toggleRecording}
                            disabled={isTyping}
                            className={cn(
                              "p-2 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
                              isRecording ? "bg-red-100 text-red-600" : "hover:bg-white/10 text-gray-500"
                            )}
                            aria-label={isRecording ? "Stop recording" : "Start recording"}
                          >
                            {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <PawButton
                      onClick={() => sendMessage()}
                      disabled={!inputMessage.trim() || isTyping}
                      size="sm"
                      className="px-4 transition-all duration-200"
                    >
                      <Send size={18} />
                    </PawButton>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </GlassCard>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions with enhanced borders and teal aura */}
              <GlassCard className="p-6 aura-teal-prominent" borderStyle="prominent">
                <h3 className="font-display text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(action.prompt)}
                      className="w-full p-3 text-left rounded-xl bg-white/30 hover:bg-white/50 transition-all border border-white/20 hover:border-petinsure-teal-200 aura-teal-subtle"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-petinsure-teal-100 rounded-lg flex items-center justify-center">
                          <action.icon size={16} className="text-petinsure-teal-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{action.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </GlassCard>

              {/* AI Capabilities with enhanced borders and teal aura */}
              <GlassCard className="p-6 aura-teal-glow" borderStyle="prominent">
                <h3 className="font-display text-xl font-semibold text-gray-900 mb-4">AI Capabilities</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Brain size={16} className="text-petinsure-teal-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Smart Analysis</p>
                      <p className="text-xs text-gray-600">Analyzes documents, photos, and claims for fraud detection</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Heart size={16} className="text-petinsure-teal-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Health Insights</p>
                      <p className="text-xs text-gray-600">Provides breed-specific health advice and recommendations</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Shield size={16} className="text-petinsure-teal-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Policy Expert</p>
                      <p className="text-xs text-gray-600">Explains coverage, processes claims, and suggests improvements</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Lightbulb size={16} className="text-petinsure-teal-600 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Personalized</p>
                      <p className="text-xs text-gray-600">Learns from your pets and preferences for better assistance</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Recent Topics with enhanced borders and teal aura */}
              <GlassCard className="p-6 aura-teal-prominent" borderStyle="prominent">
                <h3 className="font-display text-xl font-semibold text-gray-900 mb-4">Recent Topics</h3>
                <div className="space-y-2">
                  {[
                    'Claim processing timeline',
                    'Hip dysplasia coverage',
                    'Emergency vet locations',
                    'Policy renewal options',
                    'Vaccination requirements'
                  ].map((topic, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(`Tell me about ${topic.toLowerCase()}`)}
                      className="block w-full text-left p-2 text-sm text-gray-600 hover:text-petinsure-teal-700 hover:bg-petinsure-teal-50 rounded-lg transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AIAssistant;
