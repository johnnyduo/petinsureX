
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Shield } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  href?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '',
  href = '/',
  onClick
}) => {
  const navigate = useNavigate();
  
  const sizes = {
    sm: { icon: 20, text: 'text-nav-brand text-sm' },
    md: { icon: 24, text: 'text-nav-brand text-base' },
    lg: { icon: 32, text: 'text-brand text-lg' }
  };

  const iconSize = sizes[size].icon;
  const textSize = sizes[size].text;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (href) {
      navigate(href);
    }
  };

  return (
    <div 
      className={`flex items-center gap-3 cursor-pointer transition-transform hover:scale-105 ${className}`}
      onClick={handleClick}
    >
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
          <span className={`font-brand font-bold bg-gradient-primary bg-clip-text text-transparent ${textSize}`}>
            PetInsureX
          </span>
          <span className="text-xs text-gray-500 -mt-0.5 font-display font-medium">
            AI-Powered Protection
          </span>
        </div>
      )}
    </div>
  );
};
