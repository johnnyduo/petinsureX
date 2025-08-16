
import React from 'react';
import { Heart, Shield } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizes = {
    sm: { icon: 24, text: 'text-lg' },
    md: { icon: 32, text: 'text-xl' },
    lg: { icon: 40, text: 'text-2xl' }
  };

  const iconSize = sizes[size].icon;
  const textSize = sizes[size].text;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-sm opacity-30"></div>
        <div className="relative bg-gradient-primary p-2 rounded-2xl">
          <Shield 
            size={iconSize} 
            className="text-white drop-shadow-sm" 
          />
          <Heart 
            size={iconSize * 0.4} 
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white fill-white" 
          />
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold bg-gradient-primary bg-clip-text text-transparent ${textSize}`}>
            PetInsureX
          </span>
          <span className="text-xs text-gray-500 -mt-1">
            AI-Powered Protection
          </span>
        </div>
      )}
    </div>
  );
};
