import React from 'react';
import { FocusEnergy } from '../types.ts';
import { Icon } from './Icon.tsx';
import { FOCUS_ENERGY_PROFILES } from '../constants.ts';

interface FocusEnergyViewProps { userEnergy: FocusEnergy; }

const FocusEnergyView: React.FC<FocusEnergyViewProps> = ({ userEnergy }) => {
    const profile = FOCUS_ENERGY_PROFILES.find(p => p.name === userEnergy)!;
    
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Your Focus Energy</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-3xl mx-auto">This feature uses **self-awareness** by analyzing your study patterns to identify your dominant learning style. The goal is to help you work *with* your natural tendencies, not against them.</p>
            </div>
            
            <div className="bg-light-card dark:bg-dark-card rounded-2xl shadow-lg p-8 border-t-4 border-primary-500 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up">
                <div className="md:col-span-1 flex flex-col items-center text-center">
                    <Icon name={profile.icon} className={`w-24 h-24 ${profile.color} animate-slow-pulse`} />
                    <h2 className={`text-4xl font-bold mt-4 ${profile.color}`}>{profile.name}</h2>
                    <p className="font-semibold text-lg">{profile.energy}</p>
                </div>
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <h3 className="font-bold text-lg">Core Traits</h3>
                        <p className="text-gray-600 dark:text-gray-300">{profile.coreTraits}</p>
                    </div>
                     <div>
                        <h3 className="font-bold text-lg">Learning Style</h3>
                        <p className="text-gray-600 dark:text-gray-300">{profile.learningStyle}</p>
                    </div>
                     <div>
                        <h3 className="font-bold text-lg">Optimal Method</h3>
                        <p className="text-gray-600 dark:text-gray-300">{profile.optimalMethod}</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Stress Response</h3>
                        <p className="text-gray-600 dark:text-gray-300">{profile.stressResponse}</p>
                    </div>
                     <div>
                        <h3 className="font-bold text-lg">Tips for Your Energy</h3>
                        <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                            {profile.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
             <p className="text-center text-xs text-gray-400 dark:text-gray-500">Your Focus Energy is calculated based on your last 5+ sessions. The more you use the timer, the more accurate it becomes.</p>
        </div>
    );
};

export default FocusEnergyView;