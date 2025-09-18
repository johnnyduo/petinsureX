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
  Shield,
  DollarSign,
  Clock,
  AlertTriangle,
  Search,
  Zap,
  TrendingUp,
  TrendingDown,
  Activity,
  Info,
  XCircle
} from 'lucide-react';

// Enhanced UI Components for each analysis type
const FraudDetectionUI: React.FC<{ content: string }> = ({ content }) => {
  // Extract score from content (mock scoring for demo)
  const getScore = (text: string) => {
    if (text.toLowerCase().includes('high risk') || text.toLowerCase().includes('suspicious')) return { score: 85, level: 'high', color: 'red' };
    if (text.toLowerCase().includes('medium risk') || text.toLowerCase().includes('caution')) return { score: 45, level: 'medium', color: 'yellow' };
    return { score: 15, level: 'low', color: 'green' };
  };
  
  const riskData = getScore(content);
  
  return (
    <div className="space-y-6">
      {/* Risk Score Card */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
              <AlertTriangle size={20} className="text-white" />
            </div>
            <div>
              <h5 className="font-bold text-red-900">Fraud Risk Score</h5>
              <p className="text-sm text-red-700">AI-calculated risk assessment</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-red-600">{riskData.score}%</div>
            <div className={cn("text-sm font-medium capitalize", 
              riskData.color === 'red' ? 'text-red-600' :
              riskData.color === 'yellow' ? 'text-yellow-600' : 'text-green-600'
            )}>
              {riskData.level} Risk
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-red-100 rounded-full h-3 mb-4">
          <div 
            className={cn("h-3 rounded-full transition-all duration-1000",
              riskData.color === 'red' ? 'bg-red-500' :
              riskData.color === 'yellow' ? 'bg-yellow-500' : 'bg-green-500'
            )}
            style={{ width: `${riskData.score}%` }}
          />
        </div>
        
        {/* Risk Indicators */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Document Integrity', value: riskData.score < 30 ? 'Good' : 'Flagged', icon: FileText },
            { label: 'Pattern Analysis', value: riskData.score < 50 ? 'Normal' : 'Suspicious', icon: Activity },
            { label: 'Historical Data', value: riskData.score < 70 ? 'Consistent' : 'Irregular', icon: TrendingUp }
          ].map((item, index) => (
            <div key={index} className="bg-white/60 rounded-lg p-3 text-center">
              <item.icon size={16} className="mx-auto mb-1 text-red-600" />
              <div className="text-xs font-medium text-red-900">{item.label}</div>
              <div className="text-xs text-red-700">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Analysis Summary */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h6 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
          <Info size={16} className="text-blue-600" />
          Analysis Summary
        </h6>
        <p className="text-sm text-gray-700 leading-relaxed">{content.slice(0, 200)}...</p>
      </div>
    </div>
  );
};

const PolicyVerificationUI: React.FC<{ content: string }> = ({ content }) => {
  const getStatus = (text: string) => {
    if (text.toLowerCase().includes('covered') || text.toLowerCase().includes('approved')) return { status: 'approved', color: 'green' };
    if (text.toLowerCase().includes('partial') || text.toLowerCase().includes('limited')) return { status: 'partial', color: 'yellow' };
    return { status: 'denied', color: 'red' };
  };
  
  const verification = getStatus(content);
  
  return (
    <div className="space-y-6">
      {/* Verification Status */}
      <div className={cn("rounded-xl p-6 border",
        verification.color === 'green' ? 'bg-green-50 border-green-200' :
        verification.color === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
        'bg-red-50 border-red-200'
      )}>
        <div className="flex items-center gap-3 mb-4">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center",
            verification.color === 'green' ? 'bg-green-500' :
            verification.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
          )}>
            {verification.status === 'approved' ? (
              <CheckCircle size={20} className="text-white" />
            ) : verification.status === 'partial' ? (
              <Clock size={20} className="text-white" />
            ) : (
              <XCircle size={20} className="text-white" />
            )}
          </div>
          <div>
            <h5 className={cn("font-bold capitalize",
              verification.color === 'green' ? 'text-green-900' :
              verification.color === 'yellow' ? 'text-yellow-900' : 'text-red-900'
            )}>
              Policy {verification.status}
            </h5>
            <p className={cn("text-sm",
              verification.color === 'green' ? 'text-green-700' :
              verification.color === 'yellow' ? 'text-yellow-700' : 'text-red-700'
            )}>
              Coverage verification complete
            </p>
          </div>
        </div>
        
        {/* Coverage Details */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Policy Active', value: 'Yes', icon: Shield },
            { label: 'Coverage Type', value: 'Comprehensive', icon: FileText },
            { label: 'Deductible Met', value: verification.status === 'approved' ? 'Yes' : 'No', icon: DollarSign },
            { label: 'Pre-approval', value: verification.status !== 'denied' ? 'Required' : 'N/A', icon: CheckCircle }
          ].map((item, index) => (
            <div key={index} className="bg-white/60 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <item.icon size={14} className={cn(
                  verification.color === 'green' ? 'text-green-600' :
                  verification.color === 'yellow' ? 'text-yellow-600' : 'text-red-600'
                )} />
                <span className="text-xs font-medium text-gray-900">{item.label}</span>
              </div>
              <div className="text-xs text-gray-700 ml-5">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Details */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h6 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
          <Shield size={16} className="text-blue-600" />
          Verification Details
        </h6>
        <p className="text-sm text-gray-700 leading-relaxed">{content.slice(0, 200)}...</p>
      </div>
    </div>
  );
};

const CompletenessCheckUI: React.FC<{ content: string }> = ({ content }) => {
  const completionRate = Math.floor(Math.random() * 30) + 70; // Mock 70-100%
  
  return (
    <div className="space-y-6">
      {/* Completion Score */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <FileText size={20} className="text-white" />
            </div>
            <div>
              <h5 className="font-bold text-green-900">Document Completeness</h5>
              <p className="text-sm text-green-700">Required information check</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-green-600">{completionRate}%</div>
            <div className="text-sm font-medium text-green-600">Complete</div>
          </div>
        </div>
        
        <div className="w-full bg-green-100 rounded-full h-3 mb-4">
          <div 
            className="bg-green-500 h-3 rounded-full transition-all duration-1000"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        
        {/* Document Checklist */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { item: 'Medical Records', complete: true },
            { item: 'Vet Invoice', complete: true },
            { item: 'Photos/Evidence', complete: completionRate > 80 },
            { item: 'Previous Claims', complete: completionRate > 90 }
          ].map((check, index) => (
            <div key={index} className="flex items-center gap-2 bg-white/60 rounded-lg p-2">
              {check.complete ? (
                <CheckCircle size={14} className="text-green-600" />
              ) : (
                <XCircle size={14} className="text-red-500" />
              )}
              <span className="text-xs text-gray-700">{check.item}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h6 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
          <FileText size={16} className="text-blue-600" />
          Completeness Analysis
        </h6>
        <p className="text-sm text-gray-700 leading-relaxed">{content.slice(0, 200)}...</p>
      </div>
    </div>
  );
};

const AmountValidationUI: React.FC<{ content: string }> = ({ content }) => {
  const claimAmount = 2500 + Math.floor(Math.random() * 5000); // Mock amount
  const marketAverage = claimAmount * (0.8 + Math.random() * 0.4); // Mock market comparison
  const variance = ((claimAmount - marketAverage) / marketAverage * 100).toFixed(1);
  
  return (
    <div className="space-y-6">
      {/* Amount Analysis */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-100">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h5 className="font-bold text-yellow-900 mb-2">Claim Amount</h5>
            <div className="text-3xl font-bold text-yellow-600 mb-1">฿{claimAmount.toLocaleString()}</div>
            <div className="text-sm text-yellow-700">Submitted amount</div>
          </div>
          <div>
            <h5 className="font-bold text-yellow-900 mb-2">Market Average</h5>
            <div className="text-3xl font-bold text-gray-600 mb-1">฿{marketAverage.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</div>
            <div className={cn("text-sm font-medium flex items-center gap-1",
              parseFloat(variance) > 20 ? 'text-red-600' : 
              parseFloat(variance) > 10 ? 'text-yellow-600' : 'text-green-600'
            )}>
              {parseFloat(variance) > 0 ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              {Math.abs(parseFloat(variance))}% {parseFloat(variance) > 0 ? 'above' : 'below'} market
            </div>
          </div>
        </div>
        
        {/* Cost Breakdown */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          {[
            { label: 'Consultation', amount: Math.floor(claimAmount * 0.3), icon: FileText },
            { label: 'Treatment', amount: Math.floor(claimAmount * 0.5), icon: Activity },
            { label: 'Medication', amount: Math.floor(claimAmount * 0.2), icon: DollarSign }
          ].map((item, index) => (
            <div key={index} className="bg-white/60 rounded-lg p-3 text-center">
              <item.icon size={16} className="mx-auto mb-1 text-yellow-600" />
              <div className="text-xs font-medium text-yellow-900">{item.label}</div>
              <div className="text-sm font-bold text-gray-900">฿{item.amount.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h6 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
          <DollarSign size={16} className="text-blue-600" />
          Amount Validation
        </h6>
        <p className="text-sm text-gray-700 leading-relaxed">{content.slice(0, 200)}...</p>
      </div>
    </div>
  );
};

const RecommendationsUI: React.FC<{ content: string }> = ({ content }) => {
  const recommendations = [
    { type: 'approve', text: 'Recommend approval with standard processing', priority: 'high', icon: CheckCircle, color: 'green' },
    { type: 'review', text: 'Additional documentation required', priority: 'medium', icon: Clock, color: 'yellow' },
    { type: 'investigate', text: 'Further investigation recommended', priority: 'low', icon: Search, color: 'blue' }
  ];
  
  return (
    <div className="space-y-4">
      {recommendations.map((rec, index) => (
        <div key={index} className={cn("rounded-lg p-4 border-l-4",
          rec.color === 'green' ? 'bg-green-50 border-green-400' :
          rec.color === 'yellow' ? 'bg-yellow-50 border-yellow-400' :
          'bg-blue-50 border-blue-400'
        )}>
          <div className="flex items-start gap-3">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center mt-1",
              rec.color === 'green' ? 'bg-green-500' :
              rec.color === 'yellow' ? 'bg-yellow-500' : 'bg-blue-500'
            )}>
              <rec.icon size={14} className="text-white" />
            </div>
            <div className="flex-1">
              <div className={cn("font-medium mb-1",
                rec.color === 'green' ? 'text-green-900' :
                rec.color === 'yellow' ? 'text-yellow-900' : 'text-blue-900'
              )}>
                {rec.text}
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("text-xs px-2 py-1 rounded-full font-medium",
                  rec.priority === 'high' ? 'bg-red-100 text-red-700' :
                  rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                )}>
                  {rec.priority} priority
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      <div className="bg-white rounded-lg p-4 border border-gray-200 mt-4">
        <h6 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
          <Sparkles size={16} className="text-blue-600" />
          AI Recommendations
        </h6>
        <p className="text-sm text-gray-700 leading-relaxed">{content.slice(0, 200)}...</p>
      </div>
    </div>
  );
};

interface ClaimAnalysis {
  fraudDetection: string;
  policyVerification: string;
  completenessCheck: string;
  amountValidation: string;
  recommendations: string;
}

interface AIClaimAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIClaimAssistant: React.FC<AIClaimAssistantProps> = ({
  isOpen,
  onClose
}) => {
  const { t, currentLanguage } = useTranslation();
  const [currentStep, setCurrentStep] = useState<'upload' | 'analysis' | 'translate'>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [analysis, setAnalysis] = useState<ClaimAnalysis | null>(null);
  const [translatedContent, setTranslatedContent] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [activeTab, setActiveTab] = useState<keyof ClaimAnalysis>('fraudDetection');
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
      console.log('📄 Extracting text from claim document...');
      const text = await seaLionAPI.extractTextFromDocument(file);
      setExtractedText(text);
      
      // Automatically start analysis
      await analyzeClaim(text);
      
      // Only switch to analysis step after analysis is complete
      setCurrentStep('analysis');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process claim document');
      setIsProcessing(false);
      setProcessingStep(0);
    }
  }, []);

  const cleanAIResponse = (response: string): string => {
    if (!response) return '';
    
    const cleaningPatterns = [
      /^(Okay,?\s*)?here's?\s*(the\s*)?(thai\s*translation\s*of\s*)?.*?(analysis|detection|verification).*?[\.\-\:]\s*/i,
      /^I'll\s*(provide|analyze|check).*?[\.\-\:]\s*/i,
      /^Let me\s*(analyze|check|examine).*?[\.\-\:]\s*/i,
      /^Based on.*?[\.\-\:]\s*/i,
      /^Here are.*?[\.\-\:]\s*/i,
      /^This.*?(analysis|provides|includes|contains).*?[\.\-\:]\s*/i,
      /for.*?claim.*?analysis.*?[\.\,]/i,
      /using.*?methodology.*?[\.\,]/i,
      /I've.*?examined.*?[\.\,]/i,
      /specific.*?findings.*?[\.\,]/i
    ];

    let cleaned = response;
    
    cleaningPatterns.forEach(pattern => {
      cleaned = cleaned.replace(pattern, '');
    });

    cleaned = cleaned
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/^\s*[\*\-\•]\s+/gm, '• ')
      .replace(/\*{3,}/g, '')
      .replace(/^---+\s*$/gm, '')
      .replace(/^\*{3,}\s*$/gm, '')
      .replace(/\[([^\]]+)\]/g, '$1')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .replace(/^\s+|\s+$/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/\n\s+/g, '\n')
      .replace(/•\s+/g, '• ');
    
    return cleaned || 'Content not available';
  };

  const analyzeClaim = async (text: string) => {
    if (!isProcessing) {
      setIsProcessing(true);
    }
    setError(null);
    setProcessingStep(2);

    try {
      console.log('🤖 Analyzing claim document with SEA-LION AI...');
      console.log('🔧 Using model:', SeaLionAPI.MODELS.INSTRUCT);
      
      setProcessingStep(3);
      
      // Create specific prompts for claim analysis, optimized for Thai/Southeast Asian context
      const fraudDetectionPrompt = `Analyze this pet insurance claim document (may be in Thai or English) for potential fraud indicators. Look for:
      - Inconsistencies in dates, amounts, or medical details
      - Unusual patterns or suspicious billing
      - Timeline issues or pre-existing condition flags
      - Document authenticity concerns
      - Excessive or unreasonable amounts for Southeast Asian market
      Provide a clear risk assessment (Low/Medium/High) with specific findings and reasoning: ${text.substring(0, 3000)}`;
      
      const policyVerificationPrompt = `Review this claim against typical pet insurance policy coverage in Thailand/Southeast Asia. Verify:
      - Treatment types and procedures are typically covered
      - Conditions align with standard pet insurance benefits
      - Pre-existing condition exclusions
      - Coverage limits and deductibles
      - Policy terms compliance
      Provide clear coverage assessment and any red flags: ${text.substring(0, 3000)}`;
      
      const completenessPrompt = `Evaluate the completeness of this pet insurance claim documentation. Check for:
      - Required forms and AI validation
      - Medical records and veterinary reports
      - Receipts and payment documentation
      - Pet identification and policy details
      - Missing information or unclear data
      List what's complete, missing, or needs clarification: ${text.substring(0, 3000)}`;
      
      const amountValidationPrompt = `Validate the financial aspects of this pet insurance claim for Southeast Asian market:
      - Compare claimed amounts with typical veterinary costs in Thailand
      - Check for reasonable pricing of treatments/procedures
      - Identify unusually high or suspicious amounts
      - Verify calculation accuracy
      - Flag any financial inconsistencies
      Provide detailed cost analysis and validation: ${text.substring(0, 3000)}`;
      
      const recommendationsPrompt = `Provide comprehensive processing recommendations for this pet insurance claim:
      - Approval/Denial recommendation with reasoning
      - Additional verification or documentation needed
      - Follow-up actions required
      - Risk mitigation steps
      - Overall assessment and next steps
      Include specific actionable recommendations: ${text.substring(0, 3000)}`;

      setProcessingStep(4);
      const [fraudResult, policyResult, completenessResult, amountResult, recommendationsResult] = await Promise.all([
        seaLionAPI.chatCompletion({
          model: SeaLionAPI.MODELS.INSTRUCT,
          messages: [{ role: 'user', content: fraudDetectionPrompt }]
        }),
        seaLionAPI.chatCompletion({
          model: SeaLionAPI.MODELS.INSTRUCT,
          messages: [{ role: 'user', content: policyVerificationPrompt }]
        }),
        seaLionAPI.chatCompletion({
          model: SeaLionAPI.MODELS.INSTRUCT,
          messages: [{ role: 'user', content: completenessPrompt }]
        }),
        seaLionAPI.chatCompletion({
          model: SeaLionAPI.MODELS.INSTRUCT,
          messages: [{ role: 'user', content: amountValidationPrompt }]
        }),
        seaLionAPI.chatCompletion({
          model: SeaLionAPI.MODELS.INSTRUCT,
          messages: [{ role: 'user', content: recommendationsPrompt }]
        })
      ]);

      const analysisResult = {
        fraudDetection: cleanAIResponse(fraudResult),
        policyVerification: cleanAIResponse(policyResult),
        completenessCheck: cleanAIResponse(completenessResult),
        amountValidation: cleanAIResponse(amountResult),
        recommendations: cleanAIResponse(recommendationsResult)
      };

      setProcessingStep(5);
      setAnalysis(analysisResult);
      
      // Small delay to show completion step
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze claim');
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
      console.log(`🌐 Translating claim analysis to ${language}...`);
      
      const translations: Record<string, string> = {};
      
      for (const [key, content] of Object.entries(analysis)) {
        if (content && typeof content === 'string') {
          const translationPrompt = `Translate this claim analysis content to ${language}. Provide only the translation without any prefixes, explanations, or notes. Make it natural and professional: ${content}`;
          
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
    setActiveTab('fraudDetection');
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
        {/* Compact Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  AI Claim Assistant
                </h2>
                <p className="text-sm text-gray-600">
                  Powered by SEA-LION AI • Fraud detection & verification
                </p>
              </div>
            </div>
            
            {/* Horizontal Process Steps */}
            <div className="flex items-center gap-6">
              {[
                { title: 'Upload', icon: Upload, status: uploadedFile ? 'completed' : currentStep === 'upload' ? 'active' : 'pending' },
                { title: 'Analysis', icon: Brain, status: analysis ? 'completed' : currentStep === 'analysis' ? 'active' : 'pending' },
                { title: 'Translation', icon: Languages, status: currentStep === 'translate' ? 'active' : 'pending' }
              ].map((step, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                    step.status === 'completed' ? 'bg-green-500 text-white' :
                    step.status === 'active' ? 'bg-blue-500 text-white' :
                    'bg-gray-200 text-gray-500'
                  )}>
                    <step.icon size={14} />
                  </div>
                  <span className={cn(
                    "text-sm font-medium",
                    step.status === 'completed' ? 'text-green-700' :
                    step.status === 'active' ? 'text-blue-700' :
                    'text-gray-500'
                  )}>
                    {step.title}
                  </span>
                  {index < 2 && (
                    <div className={cn(
                      "w-8 h-0.5 mx-2",
                      step.status === 'completed' ? 'bg-green-300' : 'bg-gray-300'
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-6 py-8">
            {/* Step 1: Upload */}
            {currentStep === 'upload' && (
              <div className="max-w-6xl mx-auto">
                <div className="grid lg:grid-cols-5 gap-8">
                  {/* Main Upload Area */}
                  <div className="lg:col-span-3">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload size={24} className="text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        Upload Claim Document
                      </h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        Upload your pet insurance claim document for comprehensive AI analysis including fraud detection and policy verification
                      </p>
                    </div>

                    <FileUploader
                      onFilesChange={handleFileUpload}
                      accept=".pdf,image/*"
                      maxFiles={1}
                      title="Upload Claim Document"
                      description="PDF files or images (JPG, PNG) up to 10MB"
                      className="mb-6"
                    />
                  </div>

                  {/* AI Analysis Features - Compact Section */}
                  <div className="lg:col-span-2">
                    <GlassCard className="p-6 h-fit">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                        <Sparkles size={18} className="text-teal-600" />
                        AI Analysis Features
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {[
                          { icon: AlertTriangle, title: 'Fraud Detection', desc: 'AI-powered risk assessment', color: 'text-red-600', bgColor: 'bg-red-100' },
                          { icon: Shield, title: 'Policy Verification', desc: 'Coverage alignment check', color: 'text-blue-600', bgColor: 'bg-blue-100' },
                          { icon: FileText, title: 'Completeness Review', desc: 'Document validation', color: 'text-green-600', bgColor: 'bg-green-100' },
                          { icon: DollarSign, title: 'Amount Validation', desc: 'Cost reasonableness check', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
                          { icon: Languages, title: 'Multi-language Support', desc: 'Thai, English, Singlish & more', color: 'text-purple-600', bgColor: 'bg-purple-100' }
                        ].map((feature, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-white/50 border border-gray-100 hover:bg-white/70 transition-colors">
                            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", feature.bgColor)}>
                              <feature.icon size={16} className={feature.color} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 text-sm">{feature.title}</div>
                              <div className="text-xs text-gray-600 truncate">{feature.desc}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 p-3 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-100">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Zap size={12} className="text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-teal-900 text-sm">Powered by SEA-LION AI</div>
                            <div className="text-xs text-teal-700">Optimized for Southeast Asian markets</div>
                          </div>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                </div>

                {isProcessing && (
                  <div className="lg:col-span-2">
                    <GlassCard className="p-8">
                      <div className="text-center">
                        <div className="relative mb-6">
                          <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
                            <Shield size={32} className="text-white" />
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                            <Loader2 size={16} className="animate-spin text-blue-600" />
                          </div>
                        </div>
                        
                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                          AI Analysis in Progress
                        </h4>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                          SEA-LION AI is performing comprehensive analysis of your claim document
                        </p>
                        
                        <div className="max-w-md mx-auto space-y-4 mb-8">
                          {[
                            { step: 1, label: 'Extracting document content', icon: FileText },
                            { step: 2, label: 'Analyzing for fraud indicators', icon: Search },
                            { step: 3, label: 'Verifying policy coverage', icon: Shield },
                            { step: 4, label: 'Validating completeness', icon: CheckCircle },
                            { step: 5, label: 'Assessing claim amounts', icon: DollarSign }
                          ].map((item, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-white/50">
                              <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center",
                                processingStep > item.step ? 'bg-green-500 text-white' :
                                processingStep === item.step ? 'bg-blue-500 text-white' :
                                'bg-gray-200 text-gray-400'
                              )}>
                                {processingStep > item.step ? (
                                  <CheckCircle size={16} />
                                ) : processingStep === item.step ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <item.icon size={16} />
                                )}
                              </div>
                              <span className={cn(
                                "font-medium text-left flex-1",
                                processingStep > item.step ? 'text-green-700' :
                                processingStep === item.step ? 'text-blue-700' :
                                'text-gray-500'
                              )}>
                                {item.label}
                              </span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 bg-white/30 rounded-full px-4 py-2 w-fit mx-auto">
                          <Sparkles size={14} className="text-teal-600" />
                          <span>Powered by SEA-LION AI</span>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-red-900 mb-1">Claim Analysis Failed</p>
                      <p className="text-sm text-red-800 mb-3">{error}</p>
                      <div className="flex gap-2">
                        <PawButton 
                          size="sm" 
                          variant="secondary"
                          onClick={() => {
                            setError(null);
                            if (extractedText) {
                              analyzeClaim(extractedText);
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
              <div className="max-w-6xl mx-auto space-y-6">
                {/* Analysis Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle size={24} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Analysis Complete
                      </h3>
                      <p className="text-sm text-gray-600">
                        {uploadedFile?.name} • Analyzed with SEA-LION AI
                      </p>
                    </div>
                  </div>
                  
                  {/* Language Selector */}
                  <div className="flex items-center gap-3">
                    <Globe size={18} className="text-gray-500" />
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
                      className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-100 bg-white shadow-sm"
                    >
                      {supportedLanguages.map(lang => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Analysis Tabs - Card Style */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
                  {[
                    { key: 'fraudDetection', label: 'Fraud Detection', icon: AlertTriangle, color: 'red' },
                    { key: 'policyVerification', label: 'Policy Check', icon: Shield, color: 'blue' },
                    { key: 'completenessCheck', label: 'Completeness', icon: FileText, color: 'green' },
                    { key: 'amountValidation', label: 'Amount Review', icon: DollarSign, color: 'yellow' },
                    { key: 'recommendations', label: 'Recommendations', icon: Sparkles, color: 'purple' }
                  ].map(tab => {
                    const hasContent = getCurrentContent()?.[tab.key as keyof ClaimAnalysis];
                    const isCurrentTab = activeTab === tab.key;
                    
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as keyof ClaimAnalysis)}
                        className={cn(
                          "p-4 rounded-xl border-2 transition-all duration-200 text-left group relative overflow-hidden",
                          isCurrentTab
                            ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md hover:scale-102",
                          isProcessing && "opacity-75"
                        )}
                        disabled={isProcessing}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            isCurrentTab ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                          )}>
                            {isProcessing && !hasContent ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <tab.icon size={16} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={cn(
                              "font-medium text-sm truncate",
                              isCurrentTab ? 'text-blue-700' : 'text-gray-900'
                            )}>
                              {tab.label}
                            </div>
                            <div className={cn(
                              "text-xs mt-1",
                              isCurrentTab ? 'text-blue-600' : 'text-gray-500'
                            )}>
                              {hasContent ? 'Analyzed' : 'Pending'}
                            </div>
                          </div>
                        </div>
                        {hasContent && !isProcessing && (
                          <div className="absolute top-3 right-3 w-3 h-3 bg-green-500 rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Analysis Content */}
                <GlassCard className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      {[
                        { key: 'fraudDetection', icon: AlertTriangle, color: 'text-red-600' },
                        { key: 'policyVerification', icon: Shield, color: 'text-blue-600' },
                        { key: 'completenessCheck', icon: FileText, color: 'text-green-600' },
                        { key: 'amountValidation', icon: DollarSign, color: 'text-yellow-600' },
                        { key: 'recommendations', icon: Sparkles, color: 'text-purple-600' }
                      ].find(tab => tab.key === activeTab)?.icon && (
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          {React.createElement(
                            [
                              { key: 'fraudDetection', icon: AlertTriangle },
                              { key: 'policyVerification', icon: Shield },
                              { key: 'completenessCheck', icon: FileText },
                              { key: 'amountValidation', icon: DollarSign },
                              { key: 'recommendations', icon: Sparkles }
                            ].find(tab => tab.key === activeTab)?.icon || AlertTriangle,
                            { size: 20, className: 'text-blue-600' }
                          )}
                        </div>
                      )}
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 capitalize">
                          {activeTab.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </h4>
                        <p className="text-sm text-gray-600">
                          AI-powered analysis results
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(getCurrentContent()?.[activeTab] || '')}
                        className="p-3 hover:bg-gray-100 rounded-lg transition-colors group"
                        title="Copy to clipboard"
                      >
                        <Copy size={16} className="text-gray-500 group-hover:text-gray-700" />
                      </button>
                      <button
                        className="p-3 hover:bg-gray-100 rounded-lg transition-colors group"
                        title="Share"
                      >
                        <Share2 size={16} className="text-gray-500 group-hover:text-gray-700" />
                      </button>
                    </div>
                  </div>
                  
                  {isProcessing ? (
                    <div className="flex flex-col items-center gap-4 py-12">
                      <div className="relative">
                        <Loader2 size={32} className="animate-spin text-blue-600" />
                        <Shield size={20} className="absolute inset-0 m-auto text-blue-400" />
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-gray-900 mb-1">
                          {selectedLanguage !== 'English' ? 
                            `Translating to ${selectedLanguage}...` : 
                            'Analyzing your claim document...'
                          }
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedLanguage !== 'English' ? 
                            'SEA-LION AI is translating the analysis to your selected language' :
                            'SEA-LION AI is processing fraud detection, policy verification, and validation'
                          }
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Sparkles size={12} />
                        <span>Powered by SEA-LION AI</span>
                      </div>
                    </div>
                  ) : getCurrentContent()?.[activeTab] ? (
                    <div>
                      {activeTab === 'fraudDetection' && (
                        <FraudDetectionUI content={getCurrentContent()?.[activeTab] || ''} />
                      )}
                      {activeTab === 'policyVerification' && (
                        <PolicyVerificationUI content={getCurrentContent()?.[activeTab] || ''} />
                      )}
                      {activeTab === 'completenessCheck' && (
                        <CompletenessCheckUI content={getCurrentContent()?.[activeTab] || ''} />
                      )}
                      {activeTab === 'amountValidation' && (
                        <AmountValidationUI content={getCurrentContent()?.[activeTab] || ''} />
                      )}
                      {activeTab === 'recommendations' && (
                        <RecommendationsUI content={getCurrentContent()?.[activeTab] || ''} />
                      )}
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
                </GlassCard>

                {/* Action Buttons */}
                <div className="bg-gray-50 rounded-xl p-6 mt-8 border border-gray-200">
                  <h5 className="font-semibold text-gray-900 mb-4">Quick Actions</h5>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <PawButton 
                      variant="secondary" 
                      onClick={() => translateContent('Thai')}
                      className="w-full justify-center"
                    >
                      <Languages size={16} />
                      🇹🇭 Thai
                    </PawButton>
                    <PawButton 
                      variant="secondary" 
                      onClick={() => translateContent('English')}
                      className="w-full justify-center"
                    >
                      <Globe size={16} />
                      🇺🇸 English
                    </PawButton>
                    <PawButton 
                      variant="ghost"
                      className="w-full justify-center"
                    >
                      <Download size={16} />
                      Export
                    </PawButton>
                    <PawButton 
                      variant="ghost" 
                      onClick={resetAssistant}
                      className="w-full justify-center"
                    >
                      <Upload size={16} />
                      New Analysis
                    </PawButton>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};