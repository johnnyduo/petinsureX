/**
 * Language Switcher Component
 * Provides UI for switching between supported languages
 */

import React from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation, SupportedLanguage } from '@/lib/translation';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'default' | 'lg';
  showFlag?: boolean;
  showText?: boolean;
  className?: string;
}

const languageFlags: Record<SupportedLanguage, string> = {
  en: '🇺🇸',
  th: '🇹🇭',
  singlish: '🇸🇬',
  ms: '🇲🇾',
  id: '🇮🇩'
};

const languageNames: Record<SupportedLanguage, string> = {
  en: 'English',
  th: 'ไทย',
  singlish: 'Singlish',
  ms: 'Bahasa Malaysia',
  id: 'Bahasa Indonesia'
};

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'outline',
  size = 'default',
  showFlag = true,
  showText = true,
  className
}) => {
  const { currentLanguage, setLanguage, supportedLanguages, getLanguageDisplayName } = useTranslation();

  const handleLanguageChange = (language: SupportedLanguage) => {
    setLanguage(language);
    
    // Optional: Reload page to ensure all components update
    // This can be removed once all components use the translation hook
    if (typeof window !== 'undefined') {
      // Save scroll position
      const scrollPosition = window.scrollY;
      
      // Small delay to allow translation to apply
      setTimeout(() => {
        // Restore scroll position
        window.scrollTo(0, scrollPosition);
      }, 100);
    }
  };

  const currentFlag = languageFlags[currentLanguage];
  const currentName = languageNames[currentLanguage];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={size}
          className={cn(
            'min-w-[40px] gap-2 transition-colors',
            'bg-white/50 border border-gray-200/50',
            'text-petinsure-teal-600 font-medium',
            'hover:bg-white/80 hover:border-petinsure-teal-300 hover:text-petinsure-teal-700',
            'focus:ring-2 focus:ring-petinsure-teal-400 focus:ring-offset-2',
            className
          )}
        >
          {showFlag && (
            <span className="text-lg leading-none" role="img" aria-label={`${currentName} flag`}>
              {currentFlag || <Globe className="h-4 w-4" />}
            </span>
          )}
          {showText && (
            <span className="font-medium">
              {getLanguageDisplayName(currentLanguage)}
            </span>
          )}
          <ChevronDown className="h-3 w-3 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="min-w-[180px] bg-white border border-gray-200 shadow-lg rounded-xl p-1"
      >
        {supportedLanguages.map((language) => {
          const isActive = language === currentLanguage;
          
          return (
            <DropdownMenuItem
              key={language}
              onClick={() => handleLanguageChange(language)}
              className={cn(
                'flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg',
                'text-gray-800 data-[highlighted]:text-gray-900',
                'hover:bg-gray-100 data-[highlighted]:bg-gray-100',
                'focus:bg-gray-100 focus:text-gray-900',
                'transition-colors duration-150',
                isActive && 'bg-petinsure-teal-50 text-petinsure-teal-800 font-medium data-[highlighted]:bg-petinsure-teal-100 data-[highlighted]:text-petinsure-teal-900'
              )}
            >
              <span 
                className="text-lg leading-none" 
                role="img" 
                aria-label={`${languageNames[language]} flag`}
              >
                {languageFlags[language]}
              </span>
              <span className="flex-1">
                {languageNames[language]}
              </span>
              {isActive && (
                <span className="text-petinsure-teal-600 text-xs">✓</span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Compact version for mobile/tight spaces
export const CompactLanguageSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <LanguageSwitcher
      variant="ghost"
      size="sm"
      showFlag={true}
      showText={false}
      className={cn('min-w-[32px] px-2', className)}
    />
  );
};

// Full version with text for desktop
export const FullLanguageSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <LanguageSwitcher
      variant="outline"
      size="default"
      showFlag={true}
      showText={true}
      className={className}
    />
  );
};