
import React from 'react';
import { cn } from '@/lib/utils';
import { Check, Circle } from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: React.ComponentType<LucideProps>;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
  completedSteps?: number[];
  className?: string;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  steps,
  currentStep,
  completedSteps = [],
  className
}) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-start justify-between mb-8">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index);
          const isCurrent = index === currentStep;
          const isPast = index < currentStep;
          
          return (
            <div key={step.id} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center w-full">
                <div
                  className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 flex-shrink-0",
                    isCompleted || isPast
                      ? "bg-gradient-primary border-transparent text-white"
                      : isCurrent
                      ? "border-petinsure-teal-500 bg-petinsure-teal-50 text-petinsure-teal-600"
                      : "border-gray-300 bg-white text-gray-400"
                  )}
                >
                  {isCompleted ? (
                    <Check size={16} className="sm:w-5 sm:h-5" />
                  ) : step.icon ? (
                    <step.icon size={16} className="sm:w-5 sm:h-5" />
                  ) : (
                    <Circle size={16} className="sm:w-5 sm:h-5" />
                  )}
                </div>
                <div className="mt-2 sm:mt-3 text-center w-full px-1">
                  <p
                    className={cn(
                      "text-xs sm:text-sm font-medium leading-tight",
                      isCompleted || isPast || isCurrent
                        ? "text-gray-900"
                        : "text-gray-500"
                    )}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-gray-500 mt-1 leading-tight">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
              
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 sm:mx-4 transition-all duration-300 mt-5 sm:mt-6",
                    isPast || isCompleted
                      ? "bg-gradient-primary"
                      : "bg-gray-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
