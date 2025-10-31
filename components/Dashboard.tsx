import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { View, UserStats, FocusEnergyProfile } from '../types.ts';
import { FOCUS_ENERGY_PROFILES } from '../constants.ts';
import { Icon } from './Icon.tsx';
import Modal from './Modal.tsx';

interface DashboardProps {
    stats: UserStats;
    dailyStats: { studyTimeToday: number; tasksCompletedToday: number; };
    setView: (view: View) => void;
    onSetDailyGoal: (hours: number) => void;
}

const StatCard: React.FC<{ icon: any; title: string; value: string; color: string; delay: string }> = ({ icon, title, value, color, delay }) => (
    <div className={`bg-light-card dark:bg-dark-card p-4 rounded-lg shadow-sm border border-light-border dark:border-dark-border flex items-center gap-4 animate-slide-in-up opacity-0`} style={{animationDelay: delay}}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
            <Icon name={icon} className="w-6 h-6 text-white" />
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

const EditGoalModal: React.FC<{ isOpen: boolean; onClose: () => void; currentGoal: number; onSave: (newGoal: number) => void; }> = ({ isOpen, onClose, currentGoal, onSave }) => {
    const [goal, setGoal] = useState(currentGoal);
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-2">
                <h3 className="text-xl font-bold mb-4">Edit Daily Study Goal</h3>
                <div className="flex items-center gap-4">
                    <input type="number" value={goal} onChange={e => setGoal(Number(e.target.value))} className="w-full bg-light-bg dark:bg-dark-bg p-3 rounded-md border border-light-border dark:border-dark-border" min="0.5" step="0.5" />
                    <span className="font-semibold">hours</span>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-600">Cancel</button>
                    <button onClick={() => { onSave(goal); onClose(); }} className="px-4 py-2 rounded-md bg-primary-500 text-white">Save</button>
                </div>
            </div>
        </Modal>
    );
}

const Dashboard: React.FC<DashboardProps> = ({ stats, dailyStats, setView, onSetDailyGoal }) => {
    const { level, xp, studyStreak, dailyGoal } = stats;
    const { studyTimeToday, tasksCompletedToday } = dailyStats;
    const [quote, setQuote] = useState("Loading your daily inspiration...");
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: "Give me a short, inspiring quote about productivity or learning."});
                setQuote(response.text);
            } catch (error) {
                console.error("Failed to fetch quote:", error);
                setQuote("The secret of getting ahead is getting started. – Mark Twain");
            }
        };
        fetchQuote();
    }, []);

    const levelXP = xp % 1000;
    const xpToNextLevel = 1000;
    const dailyGoalProgress = dailyGoal > 0 ? (studyTimeToday / dailyGoal) * 100 : 0;
    
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon="timer" title="Study Time Today" value={`${(studyTimeToday/3600).toFixed(1)}h`} color="bg-blue-500" delay="0s" />
                <StatCard icon="check" title="Tasks Done Today" value={`${tasksCompletedToday}`} color="bg-green-500" delay="0.1s" />
                <StatCard icon="trophy" title="Study Streak" value={`${studyStreak} days`} color="bg-orange-500" delay="0.2s" />
                <StatCard icon="brain" title="Current Level" value={`${level}`} color="bg-purple-500" delay="0.3s" />
            </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-sm border border-light-border dark:border-dark-border">
                    <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
                    <div className="space-y-4">
                        <div>
                             <div className="flex justify-between items-end mb-1">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Level {level} Progress</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{levelXP} / {xpToNextLevel} XP</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"><div className="bg-purple-500 h-2.5 rounded-full animate-progress-fill" style={{width: `${(levelXP/xpToNextLevel)*100}%`}}></div></div>
                        </div>
                        <div>
                             <div className="flex justify-between items-end mb-1">
                                <div className="flex items-center gap-2">
                                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Daily Study Goal</span>
                                     <button onClick={() => setIsGoalModalOpen(true)}><Icon name="edit" className="w-4 h-4 text-gray-400 hover:text-primary-500"/></button>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{(studyTimeToday/3600).toFixed(1)} / {(dailyGoal/3600).toFixed(1)} hours</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"><div className="bg-blue-500 h-2.5 rounded-full animate-progress-fill" style={{width: `${dailyGoalProgress > 100 ? 100 : dailyGoalProgress}%`}}></div></div>
                        </div>
                    </div>
                </div>
                <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-sm border border-light-border dark:border-dark-border flex flex-col justify-center">
                     <Icon name="quote" className="w-8 h-8 text-gray-300 dark:text-gray-600 mb-2"/>
                    <p className="text-gray-700 dark:text-gray-300 italic">"{quote}"</p>
                </div>
             </div>

             <div>
                <h2 className="text-2xl font-bold mb-4">Discover Focus Energies</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {FOCUS_ENERGY_PROFILES.filter(p => p.name !== 'Hybrid').map(profile => (
                         <div key={profile.name} className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-sm border border-light-border dark:border-dark-border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary-500 dark:hover:border-primary-500">
                            <Icon name={profile.icon} className={`w-12 h-12 ${profile.color}`} />
                            <h3 className={`text-xl font-bold mt-3 ${profile.color}`}>{profile.name}</h3>
                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">{profile.energy}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{profile.coreTraits}</p>
                            <button onClick={() => setView('focus-energy')} className="text-sm font-medium text-primary-500 hover:underline">Learn more &rarr;</button>
                        </div>
                    ))}
                </div>
             </div>
             <EditGoalModal isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} currentGoal={stats.dailyGoal / 3600} onSave={onSetDailyGoal}/>
        </div>
    );
};

export default Dashboard;