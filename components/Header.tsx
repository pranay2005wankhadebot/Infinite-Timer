import React from 'react';
import { View, Theme, IconName } from '../types.ts';
import { Icon } from './Icon.tsx';

interface HeaderProps {
    currentView: View;
    setView: (view: View) => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
    onLogout: () => void;
    userEmail: string;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, theme, setTheme, onLogout, userEmail }) => {
    const navItems: { id: View; label: string, icon: IconName }[] = [
        { id: 'dashboard', label: 'Dashboard', icon: 'home' },
        { id: 'timer', label: 'Timer', icon: 'timer' },
        { id: 'tasks', label: 'Tasks', icon: 'matrix' },
        { id: 'focus-energy', label: 'Focus Energy', icon: 'brain' },
        { id: 'stats', label: 'Stats', icon: 'focus' },
        { id: 'achievements', label: 'Achievements', icon: 'trophy' },
    ];


    const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

    return (
        <header className="bg-light-card dark:bg-dark-card border-b border-light-border dark:border-dark-border sticky top-0 z-40">
            <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => setView('dashboard')}>
                        <Icon name="infinity" className="w-8 h-8 text-primary-500" />
                        <h1 className="text-xl font-bold tracking-tight hidden md:block">Infinite Timer</h1>
                    </div>
                    <div className="hidden sm:flex sm:items-center sm:space-x-4">
                        {navItems.map((item) => (
                            <button key={item.id} onClick={() => setView(item.id)} className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 ${currentView === item.id ? 'bg-primary-500 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
                                <Icon name={item.icon} className="w-5 h-5" />
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                         <div className="hidden lg:flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mr-2">
                            <span>Signed in as</span>
                            <span className="font-semibold">{userEmail}</span>
                        </div>
                        <button onClick={toggleTheme} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110 active:scale-95" aria-label="Toggle theme">
                            <Icon name={theme === 'light' ? 'moon' : 'sun'} className="w-6 h-6" />
                        </button>
                         <button onClick={onLogout} className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-110 active:scale-95" aria-label="Sign Out">
                            <Icon name="logout" className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                 {/* Mobile Nav */}
                <div className="sm:hidden flex justify-center items-center py-2 space-x-1 overflow-x-auto">
                     {navItems.map((item) => (
                        <button key={item.id} onClick={() => setView(item.id)} className={`px-3 py-2 rounded-md text-xs font-medium transition-colors flex flex-col items-center gap-1 flex-shrink-0 ${currentView === item.id ? 'bg-primary-500 text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                            <Icon name={item.icon} className="w-5 h-5" />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>
        </header>
    );
};

export default Header;