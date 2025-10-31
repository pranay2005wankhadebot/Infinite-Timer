import React, { useState } from 'react';
// FIX: The IconName type should be imported from the central types file.
import { Icon } from './Icon.tsx';
import { IconName } from '../types.ts';

interface OnboardingProps {
    onComplete: () => void;
}

const onboardingSteps = [
    {
        icon: 'infinity' as IconName,
        title: 'Welcome to Infinite Timer',
        description: 'A modern productivity app designed to help you master focus, organize your work, and understand your unique learning style.',
    },
    {
        icon: 'timer' as IconName,
        title: 'The Dual-Mode Timer',
        description: 'Choose between structured Pomodoro sprints for disciplined focus, or flexible Adaptive sessions to work in your natural flow state.',
    },
    {
        icon: 'matrix' as IconName,
        title: 'The Priority Matrix',
        description: 'Go beyond simple to-do lists. Organize your tasks by their true impact and future leverage to focus on what really matters.',
    },
    {
        icon: 'brain' as IconName,
        title: 'Discover Your Focus Energy',
        description: 'The app analyzes your habits to identify your learning style (Kitsune, Tora, or Kuma) and gives you tailored advice to study smarter.',
    },
    {
        icon: 'robot' as IconName,
        title: 'Your Personal AI Coach',
        description: 'Get personalized advice, study plans, and motivational boosts from an AI that understands your goals, tasks, and learning style.',
    },
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const isLastStep = step === onboardingSteps.length - 1;
    
    const currentStep = onboardingSteps[step];

    const nextStep = () => {
        if (isLastStep) {
            onComplete();
        } else {
            setStep(s => s + 1);
        }
    };

    return (
        <div className="fixed inset-0 bg-light-bg dark:bg-dark-bg z-50 flex flex-col items-center justify-center p-4 animate-fade-in-up">
            <div className="max-w-md w-full text-center">
                <Icon name={currentStep.icon} className="w-24 h-24 text-primary-500 mx-auto" />
                <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {currentStep.title}
                </h1>
                <p className="mt-4 text-gray-600 dark:text-gray-300">
                    {currentStep.description}
                </p>

                <div className="flex justify-center gap-2 mt-8">
                    {onboardingSteps.map((_, index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-colors ${
                                index === step ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                        />
                    ))}
                </div>

                <div className="mt-10">
                    <button
                        onClick={nextStep}
                        className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-transform active:scale-95"
                    >
                        {isLastStep ? "Let's Get Started!" : "Next"}
                    </button>
                    {!isLastStep && (
                         <button
                            onClick={onComplete}
                            className="mt-3 text-sm text-gray-500 dark:text-gray-400 hover:underline"
                        >
                            Skip for now
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Onboarding;