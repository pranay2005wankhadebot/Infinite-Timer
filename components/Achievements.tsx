import React from 'react';
import { Achievement } from '../types.ts';

const Achievements: React.FC<{ achievements: Achievement[] }> = ({ achievements }) => {
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalCount = achievements.length;
    const progress = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;
    
    return (
        <div className="space-y-6">
            <div className="text-center">
                 <h1 className="text-3xl font-bold">Your Achievements</h1>
                 <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-2xl mx-auto">This section uses **gamification**. Earning badges provides positive reinforcement that makes studying more engaging and helps build long-term habits.</p>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-center text-sm font-medium">{unlockedCount} of {totalCount} unlocked.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                {achievements.map((ach, index) => (
                    <div 
                        key={ach.id} 
                        style={{ animationDelay: `${index * 50}ms` }}
                        className={`relative p-6 rounded-lg shadow-md transition-all border-2 overflow-hidden animate-slide-in-up opacity-0 ${ach.unlocked ? 'bg-primary-500/10 border-primary-500' : 'bg-light-card dark:bg-dark-card border-light-border dark:border-dark-border'}`}
                    >
                         {ach.unlocked && <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent,25%,rgba(255,255,255,0.4),75%,transparent)] animate-border-shimmer"></div>}
                        <div className="flex items-center gap-4">
                            <div className={`text-4xl transition-all duration-500 ${ach.unlocked ? '' : 'grayscale'}`}>
                                <span className={ach.unlocked ? 'animate-pop-in inline-block' : 'inline-block'}>{ach.icon}</span>
                            </div>
                            <div>
                                <h3 className={`text-lg font-bold ${ach.unlocked ? '' : 'text-gray-500 dark:text-gray-400'}`}>{ach.name}</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{ach.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Achievements;