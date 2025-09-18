import React, { useState, useCallback } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { PawButton } from '@/components/ui/paw-button';
import { FileUploader } from '@/components/ui/file-uploader';
import { Modal } from '@/components/ui/modal';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/translation';
import { seaLionAPI, SeaLionAPI } from '@/lib/sea-lion';
import { 
  Brain, 
  FileText, 
  Languages, 
  Sparkles, 
  Upload, 
  Download,
  Eye,
  Loader2,
  CheckCircle,
  X,
  Copy,
  Share2,
  AlertCircle,
  Globe,
  Zap
} from 'lucide-react';

interface PolicyAnalysis {
  summary: string;
  keyTerms: string;
  coverageHighlights: string;
  exclusions: string;
  recommendations: string;
}

interface AIPolicyAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIPolicyAssistant: React.FC<AIPolicyAssistantProps> = ({
  isOpen,
  onClose
}) => {
  const { t, currentLanguage } = useTranslation();
  const [currentStep, setCurrentStep] = useState<'upload' | 'analysis' | 'translate'>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [analysis, setAnalysis] = useState<PolicyAnalysis | null>(null);
  const [translatedContent, setTranslatedContent] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [activeTab, setActiveTab] = useState<keyof PolicyAnalysis>('summary');
  const [processingStep, setProcessingStep] = useState<number>(0);

  const supportedLanguages = [
    { code: 'English', name: 'English', flag: '🇺🇸' },
    { code: 'Thai', name: 'ภาษาไทย', flag: '🇹🇭' },
    { code: 'Singlish', name: 'Singlish', flag: '🇸🇬' },
    { code: 'Bahasa Malaysia', name: 'Bahasa Malaysia', flag: '🇲🇾' },
    { code: 'Bahasa Indonesia', name: 'Bahasa Indonesia', flag: '🇮🇩' }
  ];

  const handleFileUpload = useCallback(async (files: any[]) => {
    if (files.length === 0) return;
    
    const file = files[0];
    setUploadedFile(file);
    setError(null);
    setIsProcessing(true);
    setProcessingStep(1);

    try {
      console.log('📄 Extracting text from policy document...');
      const text = await seaLionAPI.extractTextFromDocument(file);
      setExtractedText(text);
      // Don't change step yet - keep showing upload step with loader during analysis
      
      // Automatically start analysis - don't set isProcessing(false) here
      // Let analyzeDocument manage the processing state
      await analyzeDocument(text);
      
      // Only switch to analysis step after analysis is complete
      setCurrentStep('analysis');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process document');
      setIsProcessing(false);
      setProcessingStep(0);
    }
    // Don't set isProcessing(false) in finally - let analyzeDocument handle it
  }, []);

  const cleanAIResponse = (response: string): string => {
    if (!response) return '';
    
    // Remove common AI response prefixes and explanatory text
    const cleaningPatterns = [
      /^(Okay,?\s*)?here's?\s*(the\s*)?(thai\s*translation\s*of\s*)?.*?(summary|analysis|translation).*?[\.\-\:]\s*/i,
      /^I'll\s*(provide|give|create).*?[\.\-\:]\s*/i,
      /^Let me\s*(provide|give|create).*?[\.\-\:]\s*/i,
      /^Based on.*?[\.\-\:]\s*/i,
      /^Here are.*?[\.\-\:]\s*/i,
      /^This.*?(provides|includes|contains).*?[\.\-\:]\s*/i,
      /tailored for.*?audience.*?[\.\,]/i,
      /using appropriate.*?terminology.*?[\.\,]/i,
      /I've also included.*?localization.*?[\.\,]/i,
      /specific choices to highlight.*?[\.\,]/i,
      /note[s]?\s*on.*?[\.\,]/i
    ];

    let cleaned = response;
    
    // Apply all cleaning patterns
    cleaningPatterns.forEach(pattern => {
      cleaned = cleaned.replace(pattern, '');
    });

    // Remove markdown-style formatting
    cleaned = cleaned
      // Remove headers (# ## ### etc.)
      .replace(/^#{1,6}\s+/gm, '')
      // Remove bold markdown (**text**)
      .replace(/\*\*(.*?)\*\*/g, '$1')
      // Remove italic markdown (*text*)
      .replace(/\*([^*]+)\*/g, '$1')
      // Remove bullet points and dashes at line start
      .replace(/^\s*[\*\-\•]\s+/gm, '• ')
      // Remove excessive asterisks
      .replace(/\*{3,}/g, '')
      // Remove horizontal rules
      .replace(/^---+\s*$/gm, '')
      .replace(/^\*{3,}\s*$/gm, '')
      // Clean up brackets and formatting
      .replace(/\[([^\]]+)\]/g, '$1')
      // Remove multiple consecutive line breaks
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      // Remove leading/trailing whitespace
      .replace(/^\s+|\s+$/g, '')
      // Remove excessive spaces
      .replace(/\s{2,}/g, ' ')
      // Remove indentation
      .replace(/\n\s+/g, '\n')
      // Clean up bullet point spacing
      .replace(/•\s+/g, '• ');
    
    return cleaned || 'Content not available';
  };

  const analyzeDocument = async (text: string) => {
    // Don't reset isProcessing here if already processing from file upload
    if (!isProcessing) {
      setIsProcessing(true);
    }
    setError(null);
    setProcessingStep(2); // Start from step 2 since step 1 was text extraction

    try {
      console.log('🤖 Analyzing policy document with SEA-LION AI...');
      console.log('🔧 Using model:', SeaLionAPI.MODELS.INSTRUCT);
      
      // Create specific prompts for each section to get differentiated content
      const summaryPrompt = `Provide a clean, professional summary of this pet insurance policy document. Focus on the main benefits, coverage limits, and overall value proposition in 2-3 clear paragraphs. Write directly without prefixes or explanations: ${text.substring(0, 3000)}`;
      
      const keyTermsPrompt = `List and explain the most important terms, conditions, and definitions from this pet insurance policy. Present as clear bullet points with explanations. Write directly without prefixes: ${text.substring(0, 3000)}`;
      
      const coveragePrompt = `List all specific coverage benefits, procedures covered, and reimbursement details from this pet insurance policy. Include percentages, limits, and special benefits in clear format. Write directly: ${text.substring(0, 3000)}`;
      
      const exclusionsPrompt = `Identify all exclusions, limitations, waiting periods, and conditions that are NOT covered by this pet insurance policy. Be comprehensive and clear. Write directly: ${text.substring(0, 3000)}`;
      
      const recommendationsPrompt = `Provide expert recommendations and insights about this pet insurance policy. Include pros, cons, who it's best suited for, and actionable advice. Write directly: ${text.substring(0, 3000)}`;

      // Run all analyses in parallel for better performance
      setProcessingStep(3);
      const [summaryResult, keyTermsResult, coverageResult, exclusionsResult, recommendationsResult] = await Promise.all([
        seaLionAPI.chatCompletion({
          model: SeaLionAPI.MODELS.INSTRUCT,
          messages: [{ role: 'user', content: summaryPrompt }]
        }),
        seaLionAPI.chatCompletion({
          model: SeaLionAPI.MODELS.INSTRUCT,
          messages: [{ role: 'user', content: keyTermsPrompt }]
        }),
        seaLionAPI.chatCompletion({
          model: SeaLionAPI.MODELS.INSTRUCT,
          messages: [{ role: 'user', content: coveragePrompt }]
        }),
        seaLionAPI.chatCompletion({
          model: SeaLionAPI.MODELS.INSTRUCT,
          messages: [{ role: 'user', content: exclusionsPrompt }]
        }),
        seaLionAPI.chatCompletion({
          model: SeaLionAPI.MODELS.INSTRUCT,
          messages: [{ role: 'user', content: recommendationsPrompt }]
        })
      ]);

      const analysisResult = {
        summary: cleanAIResponse(summaryResult),
        keyTerms: cleanAIResponse(keyTermsResult),
        coverageHighlights: cleanAIResponse(coverageResult),
        exclusions: cleanAIResponse(exclusionsResult),
        recommendations: cleanAIResponse(recommendationsResult)
      };

      setProcessingStep(4);
      setAnalysis(analysisResult);
      setProcessingStep(5);
      
      // Small delay to show completion step
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze document');
    } finally {
      setIsProcessing(false);
      setProcessingStep(0);
    }
  };

  const translateContent = async (language: string) => {
    if (!analysis) return;
    
    setIsProcessing(true);
    setError(null);

    try {
      console.log(`🌐 Translating content to ${language}...`);
      
      const translations: Record<string, string> = {};
      
      // Translate each section with cleaned prompts
      for (const [key, content] of Object.entries(analysis)) {
        if (content && typeof content === 'string') {
          const translationPrompt = `Translate this pet insurance content to ${language}. Provide only the translation without any prefixes, explanations, or notes. Make it natural and professional: ${content}`;
          
          const translatedResult = await seaLionAPI.chatCompletion({
            model: SeaLionAPI.MODELS.INSTRUCT,
            messages: [{ role: 'user', content: translationPrompt }]
          });
          
          translations[key] = cleanAIResponse(translatedResult);
        }
      }
      
      setTranslatedContent(prev => ({
        ...prev,
        [language]: JSON.stringify(translations)
      }));
      
      setSelectedLanguage(language);
      setCurrentStep('translate');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to translate content');
    } finally {
      setIsProcessing(false);
    }
  };

  const getCurrentContent = () => {
    if (selectedLanguage !== 'English' && translatedContent[selectedLanguage]) {
      try {
        return JSON.parse(translatedContent[selectedLanguage]);
      } catch {
        return analysis;
      }
    }
    return analysis;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const resetAssistant = () => {
    setCurrentStep('upload');
    setUploadedFile(null);
    setExtractedText('');
    setAnalysis(null);
    setTranslatedContent({});
    setError(null);
    setSelectedLanguage('English');
    setActiveTab('summary');
    setProcessingStep(0);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      title=""
    >
      <div className="max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <Brain size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  AI Policy Assistant
                </h2>
                <p className="text-gray-600">
                  Powered by SEA-LION AI • Upload, analyze, and translate policy documents
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {analysis && (
                <PawButton variant="ghost" size="sm" onClick={resetAssistant}>
                  Start Over
                </PawButton>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-8">
            {/* Step 1: Upload */}
            {currentStep === 'upload' && (
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload size={32} className="text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Upload Policy Document
                  </h3>
                  <p className="text-gray-600">
                    Upload your pet insurance policy document for AI analysis and translation
                  </p>
                </div>

                <FileUploader
                  onFilesChange={handleFileUpload}
                  accept=".pdf,image/*"
                  maxFiles={1}
                  title="Upload Policy Document"
                  description="PDF files or images (JPG, PNG) up to 10MB"
                  className="mb-6"
                />

                {isProcessing && (
                  <GlassCard className="p-8">
                    <div className="text-center">
                      <div className="relative mb-6">
                        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                          <Brain size={28} className="text-white" />
                        </div>
                        <Loader2 size={20} className="animate-spin text-blue-600 absolute -bottom-1 -right-1" />
                      </div>
                      
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        AI Analysis in Progress
                      </h4>
                      <p className="text-gray-600 mb-6">
                        SEA-LION AI is analyzing your policy document...
                      </p>
                      
                      <div className="space-y-3 mb-6">
                        {[
                          { step: 1, label: '📄 Extracting text content', emoji: '📄' },
                          { step: 2, label: '🧠 Analyzing policy terms', emoji: '🧠' },
                          { step: 3, label: '🎯 Identifying coverage details', emoji: '🎯' },
                          { step: 4, label: '⚠️ Finding exclusions', emoji: '⚠️' },
                          { step: 5, label: '✨ Generating recommendations', emoji: '✨' }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className={cn(
                              processingStep > item.step ? 'text-gray-600' : 
                              processingStep === item.step ? 'text-blue-600 font-medium' : 
                              'text-gray-400'
                            )}>
                              {item.label}
                            </span>
                            {processingStep > item.step ? (
                              <CheckCircle size={16} className="text-green-600" />
                            ) : processingStep === item.step ? (
                              <Loader2 size={16} className="animate-spin text-blue-600" />
                            ) : (
                              <div className="w-4 h-4 border border-gray-300 rounded-full" />
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                        <Sparkles size={12} />
                        <span>Powered by SEA-LION AI</span>
                      </div>
                    </div>
                  </GlassCard>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-red-900 mb-1">AI Analysis Failed</p>
                      <p className="text-sm text-red-800 mb-3">{error}</p>
                      <div className="flex gap-2">
                        <PawButton 
                          size="sm" 
                          variant="secondary"
                          onClick={() => {
                            setError(null);
                            if (extractedText) {
                              analyzeDocument(extractedText);
                            }
                          }}
                        >
                          Try Again
                        </PawButton>
                        <PawButton 
                          size="sm" 
                          variant="ghost"
                          onClick={() => {
                            setError(null);
                            resetAssistant();
                          }}
                        >
                          Reset
                        </PawButton>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Analysis Results */}
            {(currentStep === 'analysis' || currentStep === 'translate') && analysis && (
              <div className="space-y-6">
                {/* Analysis Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle size={20} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Policy Analysis Complete
                      </h3>
                      <p className="text-sm text-gray-600">
                        {uploadedFile?.name} • Analyzed with SEA-LION AI
                      </p>
                    </div>
                  </div>
                  
                  {/* Language Selector */}
                  <div className="flex items-center gap-2">
                    <Globe size={16} className="text-gray-500" />
                    <select
                      value={selectedLanguage}
                      onChange={(e) => {
                        const language = e.target.value;
                        if (language !== 'English') {
                          translateContent(language);
                        } else {
                          setSelectedLanguage(language);
                        }
                      }}
                      className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                    >
                      {supportedLanguages.map(lang => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Analysis Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8">
                    {[
                      { key: 'summary', label: 'Summary', icon: FileText },
                      { key: 'keyTerms', label: 'Key Terms', icon: Zap },
                      { key: 'coverageHighlights', label: 'Coverage', icon: CheckCircle },
                      { key: 'exclusions', label: 'Exclusions', icon: AlertCircle },
                      { key: 'recommendations', label: 'Recommendations', icon: Sparkles }
                    ].map(tab => {
                      const hasContent = getCurrentContent()?.[tab.key as keyof PolicyAnalysis];
                      const isCurrentTab = activeTab === tab.key;
                      
                      return (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key as keyof PolicyAnalysis)}
                          className={cn(
                            "flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors relative",
                            isCurrentTab
                              ? "border-blue-500 text-blue-600"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                            isProcessing && "opacity-75"
                          )}
                          disabled={isProcessing}
                        >
                          {isProcessing && !hasContent ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <tab.icon size={16} />
                          )}
                          {tab.label}
                          {hasContent && !isProcessing && (
                            <div className="w-2 h-2 bg-green-500 rounded-full ml-1" />
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* Analysis Content */}
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900 capitalize">
                      {activeTab.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(getCurrentContent()?.[activeTab] || '')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy size={16} className="text-gray-500" />
                      </button>
                      <button
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Share"
                      >
                        <Share2 size={16} className="text-gray-500" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="prose prose-gray max-w-none">
                    {isProcessing ? (
                      <div className="flex flex-col items-center gap-4 py-12">
                        <div className="relative">
                          <Loader2 size={32} className="animate-spin text-blue-600" />
                          <Brain size={20} className="absolute inset-0 m-auto text-blue-400" />
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-gray-900 mb-1">
                            {selectedLanguage !== 'English' ? 
                              `Translating to ${selectedLanguage}...` : 
                              'Analyzing your policy document...'
                            }
                          </p>
                          <p className="text-sm text-gray-600">
                            {selectedLanguage !== 'English' ? 
                              'SEA-LION AI is translating the content to your selected language' :
                              'SEA-LION AI is processing and analyzing your document across all sections'
                            }
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Sparkles size={12} />
                          <span>Powered by SEA-LION AI</span>
                        </div>
                      </div>
                    ) : getCurrentContent()?.[activeTab] ? (
                      <div className="text-gray-700 leading-relaxed">
                        <div className="prose prose-gray max-w-none">
                          {getCurrentContent()?.[activeTab]?.split('\n').map((line, index) => {
                            const trimmedLine = line.trim();
                            if (!trimmedLine) return null;
                            
                            // Check if it's a bullet point
                            if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
                              return (
                                <div key={index} className="flex items-start gap-2 mb-2">
                                  <span className="text-blue-600 mt-1">•</span>
                                  <span className="flex-1">{trimmedLine.replace(/^[•\-\*]\s*/, '')}</span>
                                </div>
                              );
                            }
                            
                            // Regular paragraph
                            return (
                              <p key={index} className="mb-3 last:mb-0">
                                {trimmedLine}
                              </p>
                            );
                          }).filter(Boolean)}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4 py-12 text-center">
                        <AlertCircle size={32} className="text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 mb-1">No content available</p>
                          <p className="text-sm text-gray-600">
                            The analysis for this section could not be completed.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </GlassCard>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-4">
                  <PawButton onClick={() => translateContent('English')}>
                    <Languages size={16} />
                    Translate to English
                  </PawButton>
                  <PawButton variant="secondary" onClick={() => translateContent('Thai')}>
                    🇹🇭 Translate to Thai
                  </PawButton>
                  <PawButton variant="ghost">
                    <Download size={16} />
                    Export Analysis
                  </PawButton>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Process Steps */}
          <div className="w-80 bg-gray-50 border-l border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Process Steps</h4>
            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: 'Upload Document',
                  description: 'Upload your policy PDF or image',
                  status: uploadedFile ? 'completed' : currentStep === 'upload' ? 'active' : 'pending',
                  icon: Upload
                },
                {
                  step: 2,
                  title: 'AI Analysis',
                  description: 'SEA-LION AI analyzes your policy',
                  status: analysis ? 'completed' : currentStep === 'analysis' ? 'active' : 'pending',
                  icon: Brain
                },
                {
                  step: 3,
                  title: 'Translation',
                  description: 'Translate to multiple languages',
                  status: currentStep === 'translate' ? 'active' : 'pending',
                  icon: Languages
                }
              ].map(item => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    item.status === 'completed' ? 'bg-green-100 text-green-600' :
                    item.status === 'active' ? 'bg-blue-100 text-blue-600' :
                    'bg-gray-100 text-gray-400'
                  )}>
                    {item.status === 'completed' ? (
                      <CheckCircle size={16} />
                    ) : (
                      <item.icon size={16} />
                    )}
                  </div>
                  <div>
                    <p className={cn(
                      "font-medium text-sm",
                      item.status === 'active' ? 'text-blue-600' : 'text-gray-900'
                    )}>
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="mt-8 p-4 bg-blue-50 rounded-xl">
              <h5 className="font-medium text-blue-900 mb-2">AI Features</h5>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Smart document extraction</li>
                <li>• Policy summarization</li>
                <li>• Coverage analysis</li>
                <li>• Multi-language translation</li>
                <li>• Personalized recommendations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};