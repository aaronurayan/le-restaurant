import React from 'react';

interface ProgressBarProps {
  progress: number; // 0-100
  steps: Array<{
    id: string;
    label: string;
    completed: boolean;
    current?: boolean;
  }>;
  variant?: 'default' | 'compact' | 'detailed';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  steps,
  variant = 'default',
  className = ''
}) => {
  const getStepStatus = (step: typeof steps[0], index: number) => {
    if (step.completed) return 'completed';
    if (step.current) return 'current';
    if (index === 0) return 'pending';
    return 'pending';
  };

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-primary-600 text-white';
      case 'current':
        return 'bg-primary-100 text-primary-700 border-primary-600';
      default:
        return 'bg-neutral-100 text-neutral-500 border-neutral-300';
    }
  };

  const getConnectorColor = (index: number) => {
    if (index < steps.length - 1) {
      const currentStep = steps[index];
      const nextStep = steps[index + 1];
      return currentStep.completed ? 'bg-primary-600' : 'bg-neutral-300';
    }
    return 'bg-transparent';
  };

  if (variant === 'compact') {
    return (
      <div className={`w-full ${className}`}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-700">
            Progress: {Math.round(progress)}%
          </span>
          <span className="text-sm text-neutral-500">
            {steps.filter(s => s.completed).length} of {steps.length} steps
          </span>
        </div>
        <div className="w-full bg-neutral-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">Delivery Progress</h3>
          <span className="text-sm text-neutral-500">
            {Math.round(progress)}% Complete
          </span>
        </div>
        
        <div className="space-y-3">
          {steps.map((step, index) => {
            const status = getStepStatus(step, index);
            const stepColor = getStepColor(status);
            const connectorColor = getConnectorColor(index);
            
            return (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={`
                      w-8 h-8 rounded-full border-2 flex items-center justify-center
                      font-medium text-sm transition-all duration-200
                      ${stepColor}
                    `}
                  >
                    {step.completed ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div
                      className={`
                        w-12 h-0.5 mx-2 transition-all duration-200
                        ${connectorColor}
                      `}
                    />
                  )}
                </div>
                
                <div className="ml-3">
                  <p className={`text-sm font-medium ${status === 'current' ? 'text-primary-700' : status === 'completed' ? 'text-neutral-900' : 'text-neutral-500'}`}>
                    {step.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-700">
          {steps.find(s => s.current)?.label || 'In Progress'}
        </span>
        <span className="text-sm text-neutral-500">
          {Math.round(progress)}%
        </span>
      </div>
      
      <div className="w-full bg-neutral-200 rounded-full h-2">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-neutral-500">
        {steps.map((step, index) => (
          <span
            key={step.id}
            className={`${
              step.completed || step.current
                ? 'text-primary-600 font-medium'
                : 'text-neutral-400'
            }`}
          >
            {step.label}
          </span>
        ))}
      </div>
    </div>
  );
};
