
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Layout } from '@/components/layout/Layout';
import { GlassCard } from '@/components/ui/glass-card';
import { PawButton } from '@/components/ui/paw-button';
import { cn } from '@/lib/utils';
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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your AI pet insurance assistant. I can help you with claims, policy questions, pet health advice, and fraud detection. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const quickActions = [
    { icon: Shield, label: 'Check Policy Coverage', prompt: 'What does my policy cover for emergencies?' },
    { icon: FileText, label: 'Claim Status', prompt: 'What is the status of my recent claim?' },
    { icon: Heart, label: 'Pet Health Advice', prompt: 'My pet is showing unusual symptoms, what should I do?' },
    { icon: Stethoscope, label: 'Find Veterinarian', prompt: 'Help me find qualified veterinarians in my area' },
    { icon: Calendar, label: 'Schedule Vet Visit', prompt: 'I need to schedule a veterinary appointment for my pet' },
    { icon: Receipt, label: 'Review Invoice', prompt: 'Please analyze this vet invoice for accuracy and potential fraud' }
  ];

  const mockResponses = [
    "Based on your Premium policy, emergency treatments are covered up to ₿100,000 annually with a ₿500 deductible. Your current claim shows high pet identity match (94%) and low fraud risk (15%), which typically results in faster processing.",
    "Your claim #001 is currently under review. Our AI analysis shows: ✅ Pet identity verified (94% confidence) ✅ Low fraud risk (15%) ✅ Vet attestation valid. Expected processing time: 2-3 business days.",
    "If your pet is showing unusual symptoms, I recommend: 1) Monitor for 24 hours and document symptoms 2) Contact your vet if symptoms persist 3) Take photos if there are visible changes 4) Keep receipts for potential claims. Would you like me to help you find nearby emergency vets?",
    "I found 5 qualified veterinarians near you: 🏥 Bangkok Pet Hospital (4.8★, 2km away, Emergency 24/7) 🏥 Thonglor Animal Clinic (4.9★, 3km away, Specialist care) 🏥 Sukhumvit Vet Center (4.7★, 1.5km away, Preventive care). Would you like contact details or directions?",
    "I can help you schedule a vet appointment. Based on your pet's history and symptoms, I recommend: • General checkup within 1-2 days • Bring recent medical records • Prepare a list of current symptoms • Budget estimate: ₿2,000-₿4,000. Would you like me to call Bangkok Pet Hospital for availability?",
    "I've analyzed the veterinary invoice for accuracy: ✅ Treatment costs within normal range ✅ Clinic is verified network partner ✅ No duplicate charges detected ⚠️ Minor concern: Pre-medication fee seems high (₿800 vs typical ₿400-₿600). Fraud risk: Low (12%). Recommendation: Proceed with claim submission."
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

    // Simulate AI response with streaming effect
    try {
      setTimeout(() => {
        const responseContent = mockResponses[Math.floor(Math.random() * mockResponses.length)];
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: '',
          timestamp: new Date(),
          isTyping: true
        };

        setMessages(prev => [...prev, assistantMessage]);
        setIsTyping(false);

        // Simulate streaming text with better performance
        let currentText = '';
        let index = 0;
        const streamInterval = setInterval(() => {
          if (index < responseContent.length) {
            currentText += responseContent[index];
            // Batch updates for better performance
            setMessages(prev => 
              prev.map(msg => 
                msg.id === assistantMessage.id 
                  ? { ...msg, content: currentText }
                  : msg
              )
            );
            index++;
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
        }, 30); // Slightly faster for smoother effect
      }, 800); // Slightly reduced delay
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
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
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <Brain size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
                <p className="text-gray-600">Powered by advanced AI for intelligent pet insurance support</p>
              </div>
            </div>

            {/* AI Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: 'Response Time', value: '<2s', icon: Zap },
                { label: 'Accuracy Rate', value: '99.2%', icon: Shield },
                { label: 'Languages', value: '12+', icon: Brain },
                { label: 'Queries Today', value: '1,247', icon: Heart }
              ].map((stat, index) => (
                <div key={index} className="flex items-center gap-3 p-4 rounded-xl bg-white/50 border border-white/20">
                  <div className="w-10 h-10 bg-petinsure-teal-100 rounded-lg flex items-center justify-center">
                    <stat.icon size={20} className="text-petinsure-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Chat Area */}
            <div className="lg:col-span-3">
              <GlassCard className="flex flex-col h-[600px]">
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
                          "max-w-[80%] rounded-2xl px-4 py-3 break-words",
                          message.type === 'user'
                            ? 'bg-gradient-primary text-white shadow-paw'
                            : 'bg-white/50 text-gray-900 border border-white/20 backdrop-blur-sm'
                        )}
                        style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
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
                      <div className="flex items-center gap-2 p-3 bg-white/50 rounded-2xl border border-white/20 focus-within:border-petinsure-teal-300 focus-within:ring-2 focus-within:ring-petinsure-teal-100 transition-all duration-200">
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
              {/* Quick Actions */}
              <GlassCard className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => sendMessage(action.prompt)}
                      className="w-full p-3 text-left rounded-xl bg-white/30 hover:bg-white/50 transition-all border border-white/20 hover:border-petinsure-teal-200"
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

              {/* AI Capabilities */}
              <GlassCard className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">AI Capabilities</h3>
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

              {/* Recent Topics */}
              <GlassCard className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Recent Topics</h3>
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
