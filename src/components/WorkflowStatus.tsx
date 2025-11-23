import React from 'react';

interface WorkflowStep {
  id: number;
  label: string;
  completed: boolean;
  active: boolean;
  icon?: string;
}

interface WorkflowStatusProps {
  steps: WorkflowStep[];
  variant?: 'horizontal' | 'vertical';
}

const WorkflowStatus: React.FC<WorkflowStatusProps> = ({ steps, variant = 'horizontal' }) => {
  if (variant === 'vertical') {
    return (
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  step.completed
                    ? 'bg-green-500 text-white'
                    : step.active
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {step.completed ? '✓' : step.id}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-0.5 h-12 ${
                    step.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
            <div className="flex-1 pt-2">
              <h3
                className={`text-sm font-semibold ${
                  step.completed || step.active ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                {step.label}
              </h3>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                  step.completed
                    ? 'bg-green-500 text-white'
                    : step.active
                    ? 'bg-blue-500 text-white ring-4 ring-blue-200'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {step.completed ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  step.id
                )}
              </div>
              <p
                className={`mt-2 text-xs font-medium text-center max-w-[100px] ${
                  step.completed || step.active ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                {step.label}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 mb-8">
                <div
                  className={`h-full rounded ${
                    step.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default WorkflowStatus;
