import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const Stepper = ({ steps, currentStep, highestStepReached, onStepClick }) => {
    return (
        <div className="mb-8 sm:mb-12 px-2 sm:px-0 relative z-10 bg-gray-50 pt-4">
            <nav aria-label="Progress">
                <ol className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <li key={step.id} className="relative flex-1">
                            <div
                                className={`flex flex-col items-center ${step.id <= highestStepReached ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                onClick={() => step.id <= highestStepReached && onStepClick(step.id)}
                                title={step.id <= highestStepReached ? `Go to ${step.name}` : `Complete previous steps first`}
                            >
                                {index > 0 && (
                                    <div className="absolute left-[-35%] right-[35%] sm:left-[-45%] sm:right-[55%] top-3 sm:top-4 h-[2px]">
                                        <div className={`h-full ${currentStep > step.id ? 'bg-gradient-to-r from-[#FF7A7A] to-[#E23744]' : 'bg-gray-200'}`} />
                                    </div>
                                )}
                                <div className="relative mb-2 sm:mb-4">
                                    <div className={`h-7 w-7 sm:h-9 sm:w-9 rounded-full flex items-center justify-center transition-all duration-300 
                    ${currentStep > step.id
                                            ? 'bg-gradient-to-br from-[#FF7A7A] to-[#E23744] shadow-lg'
                                            : currentStep === step.id
                                                ? 'border-2 border-[#E23744] bg-white ring-2 sm:ring-4 ring-[#E23744]/20'
                                                : step.id <= highestStepReached
                                                    ? 'border-2 border-[#E23744]/60 bg-white hover:ring-2 hover:ring-[#E23744]/20'
                                                    : 'border-2 border-gray-300 bg-white'}`}>
                                        {currentStep > step.id ? (
                                            <FaCheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                                        ) : (
                                            <span className={`text-sm sm:text-base font-semibold 
                        ${currentStep === step.id
                                                    ? 'text-[#E23744]'
                                                    : step.id <= highestStepReached
                                                        ? 'text-[#E23744]/70'
                                                        : 'text-gray-400'}`}>
                                                {step.id}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <span className={`text-xs sm:text-sm font-medium text-center px-1 sm:px-2 
                  ${currentStep === step.id
                                        ? 'text-[#E23744] font-bold'
                                        : step.id <= highestStepReached
                                            ? 'text-[#E23744]/80'
                                            : 'text-gray-500'}`}>
                                    {step.name}
                                </span>
                            </div>
                        </li>
                    ))}
                </ol>
            </nav>
        </div>
    );
};

export default Stepper;
