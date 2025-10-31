
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
// FIX: Changed date-fns imports to use named exports from the main package to fix call signature errors.
import { startOfDay, isSameDay, parseISO, subDays } from 'date-fns';

// Component Imports
import Header from './components/Header.tsx';
import Dashboard from './components/Dashboard.tsx';
import Timer from './components/Timer.tsx';
import Tasks from './components/Tasks.tsx';
import Stats from './components/Stats.tsx';
import Achievements from './components/Achievements.tsx';
import FocusEnergyView from './components/FocusEnergyView.tsx';
import Auth from './components/Auth.tsx';
import Onboarding from './components/Onboarding.tsx';
import NotificationCenter from './components/NotificationCenter.tsx';
import AIAgentButton from './components/AIAgentButton.tsx';
import AIAgentModal from './components/AIAgentModal.tsx';
import Footer from './components/Footer.tsx';
import StreakModal from './components/StreakModal.tsx';


// Type and Constant Imports
import { View, Theme, User, Task, SessionLog, Achievement, FocusEnergy, Notification as NotificationType, ChatMessage, UserStats, SoundSettings } from './types.ts';
import { INITIAL_ACHIEVEMENTS, FOCUS_ENERGY_PROFILES, INBUILT_SOUNDS } from './constants.ts';

const App: React.FC = () => {
    // Global State
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('infiniteTimer_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem('infiniteTimer_theme') as Theme;
        return savedTheme || 'dark';
    });
    const [currentView, setView] = useState<View>('dashboard');
    const [showOnboarding, setShowOnboarding] = useState(false);

    // Data State
    const [tasks, setTasks] = useState<Task[]>([]);
    const [sessionLogs, setSessionLogs] = useState<SessionLog[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
    const [stats, setStats] = useState<UserStats>({
        level: 1,
        xp: 0,
        studyStreak: 0,
        dailyGoal: 3600, // 1 hour default
        soundSettings: {
            volume: 0.5,
            isMuted: false,
            focusEndSound: INBUILT_SOUNDS.Chime,
            breakEndSound: INBUILT_SOUNDS.Alert,
        }
    });
    const [notifications, setNotifications] = useState<NotificationType[]>([]);

    // UI State
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [showStreakModal, setShowStreakModal] = useState(false);
    const prevStreakRef = useRef(stats.studyStreak);

    // AI Chat State
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isAiLoading, setIsAiLoading] = useState(false);
    
    // --- EFFECTS ---
    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        localStorage.setItem('infiniteTimer_theme', theme);
    }, [theme]);

    useEffect(() => {
        if (user) {
            localStorage.setItem('infiniteTimer_user', JSON.stringify(user));
            // Load user-specific data
            const savedTasks = localStorage.getItem(`infiniteTimer_tasks_${user.email}`);
            const savedLogs = localStorage.getItem(`infiniteTimer_logs_${user.email}`);
            const savedAchievements = localStorage.getItem(`infiniteTimer_achievements_${user.email}`);
            const savedStats = localStorage.getItem(`infiniteTimer_stats_${user.email}`);
            const hasOnboarded = localStorage.getItem(`infiniteTimer_onboarded_${user.email}`);

            setTasks(savedTasks ? JSON.parse(savedTasks) : []);
            setSessionLogs(savedLogs ? JSON.parse(savedLogs) : []);
            setAchievements(savedAchievements ? JSON.parse(savedAchievements) : INITIAL_ACHIEVEMENTS);
            
            const defaultStats = { level: 1, xp: 0, studyStreak: 0, dailyGoal: 3600, soundSettings: { volume: 0.5, isMuted: false, focusEndSound: INBUILT_SOUNDS.Chime, breakEndSound: INBUILT_SOUNDS.Alert }};
            if (savedStats) {
                const parsed = JSON.parse(savedStats);
                const loadedStats = {
                    ...defaultStats,
                    ...parsed,
                    level: Number(parsed.level ?? defaultStats.level),
                    xp: Number(parsed.xp ?? defaultStats.xp),
                    studyStreak: Number(parsed.studyStreak ?? defaultStats.studyStreak),
                    dailyGoal: Number(parsed.dailyGoal ?? defaultStats.dailyGoal),
                    soundSettings: {
                        ...defaultStats.soundSettings,
                        ...(parsed.soundSettings || {}),
                    }
                };
                setStats(loadedStats);
                prevStreakRef.current = loadedStats.studyStreak;
            } else {
                setStats(defaultStats);
            }

            setShowOnboarding(!hasOnboarded);
        } else {
            localStorage.removeItem('infiniteTimer_user');
        }
    }, [user]);
    
    const saveData = useCallback(() => {
        if (!user) return;
        localStorage.setItem(`infiniteTimer_tasks_${user.email}`, JSON.stringify(tasks));
        localStorage.setItem(`infiniteTimer_logs_${user.email}`, JSON.stringify(sessionLogs));
        localStorage.setItem(`infiniteTimer_achievements_${user.email}`, JSON.stringify(achievements));
        localStorage.setItem(`infiniteTimer_stats_${user.email}`, JSON.stringify(stats));
    }, [user, tasks, sessionLogs, achievements, stats]);
    
    useEffect(() => {
        saveData();
    }, [saveData]);

    // --- BUSINESS LOGIC ---
    const userFocusEnergy = useMemo<FocusEnergy>(() => {
        if (sessionLogs.length < 5) return 'Hybrid';
        const totalSessions = sessionLogs.length;
        const longSessions = sessionLogs.filter(s => s.duration > 2700).length;
        const uniqueSubjects = new Set(sessionLogs.map(s => s.subject)).size;
        
        if (longSessions / totalSessions > 0.6) return 'Tora';
        if (uniqueSubjects / totalSessions > 0.5) return 'Kitsune';
        return 'Kuma';
    }, [sessionLogs]);

    const dailyStats = useMemo(() => {
        const today = startOfDay(new Date());
        const todaysLogs = sessionLogs.filter(log => isSameDay(parseISO(log.date), today));
        const studyTimeToday = todaysLogs.reduce((acc, log) => acc + log.duration, 0);
        const tasksCompletedToday = tasks.filter(task => task.completed && task.completionDate && isSameDay(parseISO(task.completionDate), today)).length;
        return { studyTimeToday, tasksCompletedToday };
    }, [sessionLogs, tasks]);

    const calculateStudyStreak = useCallback(() => {
        if (sessionLogs.length === 0) return 0;
        const uniqueDays = [...new Set(sessionLogs.map(log => startOfDay(parseISO(log.date)).getTime()))].sort((a, b) => b - a);
        if (uniqueDays.length === 0) return 0;

        let streak = 0;
        let currentDate = startOfDay(new Date());
        
        if (!uniqueDays.includes(currentDate.getTime())) {
             const yesterday = subDays(currentDate, 1);
             if(!uniqueDays.includes(yesterday.getTime())) return 0; 
             currentDate = yesterday;
        }
       
        for (let i = 0; i < uniqueDays.length; i++) {
            const dayToCheck = subDays(currentDate, i);
            if(uniqueDays.includes(dayToCheck.getTime())) {
                streak++;
            } else {
                break;
            }
        }
        return streak;
    }, [sessionLogs]);

    useEffect(() => {
        const newStreak = calculateStudyStreak();
        setStats(prev => ({ ...prev, studyStreak: newStreak }));
    }, [sessionLogs, calculateStudyStreak]);
    
    useEffect(() => {
        if (stats.studyStreak > prevStreakRef.current && stats.studyStreak > 0) {
            setShowStreakModal(true);
        }
        prevStreakRef.current = stats.studyStreak;
    }, [stats.studyStreak]);

    const addNotification = useCallback((title: string, message: string, type: NotificationType['type']) => {
        const newNotif: NotificationType = { id: Date.now(), title, message, type };
        setNotifications(prev => [newNotif, ...prev]);
        setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== newNotif.id)), 5000);
    }, []);

    const checkAchievements = useCallback(() => {
        const newlyUnlocked: Achievement[] = [];
        const totalTasksCompleted = tasks.filter(t => t.completed).length;
        const totalStudyTimeHours = sessionLogs.reduce((sum, log) => sum + log.duration, 0) / 3600;
        
        const updatedAchievements = achievements.map(ach => {
            if (ach.unlocked) return ach;
            let conditionMet = false;
            // FIX: Explicitly cast ach.value to a Number to prevent type errors with data from localStorage.
            switch(ach.type) {
                case 'tasks': conditionMet = totalTasksCompleted >= Number(ach.value); break;
                case 'study_time': conditionMet = totalStudyTimeHours >= Number(ach.value); break;
                case 'streak': conditionMet = stats.studyStreak >= Number(ach.value); break;
                case 'level': conditionMet = stats.level >= Number(ach.value); break;
                case 'session_length': conditionMet = sessionLogs.some(log => log.duration >= Number(ach.value) * 60); break;
            }
            
            if (conditionMet) {
                const unlockedAch = { ...ach, unlocked: true };
                newlyUnlocked.push(unlockedAch);
                return unlockedAch;
            }
            return ach;
        });

        if (newlyUnlocked.length > 0) {
            setAchievements(updatedAchievements);
            newlyUnlocked.forEach(ach => {
                 addNotification(`Achievement Unlocked!`, `You've earned: ${ach.name}`, 'achievement');
            });
        }
    }, [tasks, sessionLogs, achievements, stats.studyStreak, stats.level, addNotification]);
    
    useEffect(() => {
        checkAchievements();
    }, [tasks, sessionLogs, stats.studyStreak, stats.level, checkAchievements]);
    
    // --- EVENT HANDLERS ---
    const handleLogin = (loggedInUser: User) => setUser(loggedInUser);
    const handleLogout = () => setUser(null);
    
    const handleTaskUpdate = (updatedTask: Task) => setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    const handleTaskDelete = (taskId: string) => setTasks(prev => prev.filter(t => t.id !== taskId));
    const handleTaskAdd = (newTask: Task) => setTasks(prev => [...prev, newTask]);
    
    const handleTaskComplete = (taskId: string) => {
        setTasks(prev => prev.map(t => {
            if (t.id === taskId) {
                const wasCompleted = t.completed;
                const newCompleted = !wasCompleted;
                if(newCompleted) addXP(50);
                return { ...t, completed: newCompleted, completionDate: newCompleted ? new Date().toISOString() : undefined };
            }
            return t;
        }));
    };
    
    const handleSessionComplete = (duration: number, subject: string, sessionType: 'pomodoro' | 'adaptive') => {
// FIX: Removed extra 'new' keyword before 'new Date()'.
        const newLog: SessionLog = { date: new Date().toISOString(), duration, subject, sessionType };
        setSessionLogs(prev => [...prev, newLog]);
        addXP(Math.floor(duration / 60) * 10); // 10 XP per minute
    };
    
    const addXP = (amount: number) => {
        setStats(prev => {
            const newXP = Number(prev.xp) + amount;
            const newLevel = Math.floor(newXP / 1000) + 1;
            if(newLevel > prev.level) {
                 addNotification(`Level Up!`, `You've reached Level ${newLevel}!`, 'milestone');
            }
            return { ...prev, xp: newXP, level: newLevel };
        });
    };
    
    const handleSetDailyGoal = (hours: number) => {
        setStats(prev => ({...prev, dailyGoal: hours * 3600}));
    };
    
    const handleSoundSettingsChange = (newSettings: Partial<SoundSettings>) => {
        setStats(prev => ({...prev, soundSettings: {...prev.soundSettings, ...newSettings }}));
    }

    const handleSendMessage = async (message: string) => {
        setIsAiLoading(true);
        setChatHistory(prev => [...prev, { role: 'user', content: message }]);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const profile = FOCUS_ENERGY_PROFILES.find(p => p.name === userFocusEnergy);
            
            const context = `
                SYSTEM CONTEXT: You are a helpful and motivating productivity coach called 'Infinity AI'. 
                The user's data is as follows:
                - Focus Energy Profile: ${profile?.name} (${profile?.coreTraits})
                - Current Level: ${stats.level} (XP: ${Number(stats.xp) % 1000}/1000)
                - Study Streak: ${stats.studyStreak} days
                - Incomplete Tasks: ${tasks.filter(t => !t.completed).map(t => `- ${t.text} (${t.subject})`).join('\n') || 'None'}
                - Last 3 Sessions: ${sessionLogs.slice(-3).map(s => `- ${Math.round(s.duration/60)} mins on ${s.subject}`).join('\n') || 'None'}

                INSTRUCTIONS: Your name is Infinity AI. Use this data to provide personalized, concise, and actionable advice. Use markdown for formatting. Do not repeat the context back to the user.
            `;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `${context}\n\nUSER QUESTION: ${message}`
            });

            setChatHistory(prev => [...prev, { role: 'model', content: response.text }]);
        } catch (error) {
            console.error("AI chat error:", error);
            setChatHistory(prev => [...prev, { role: 'model', content: "Sorry, I couldn't get a response. Please check the API key and try again." }]);
        } finally {
            setIsAiLoading(false);
        }
    };

    // --- RENDER LOGIC ---
    if (!user) return <Auth onLogin={handleLogin} />;
    if (showOnboarding) return <Onboarding onComplete={() => {setShowOnboarding(false); localStorage.setItem(`infiniteTimer_onboarded_${user.email}`, 'true'); }} />;
    
    const renderView = () => {
        switch(currentView) {
            case 'dashboard': return <Dashboard stats={stats} dailyStats={dailyStats} setView={setView} onSetDailyGoal={handleSetDailyGoal} />;
            case 'timer': return <Timer onSessionComplete={handleSessionComplete} tasks={tasks} soundSettings={stats.soundSettings} onSoundSettingsChange={handleSoundSettingsChange}/>;
            case 'tasks': return <Tasks tasks={tasks} onTaskComplete={handleTaskComplete} onTaskAdd={handleTaskAdd} onTaskUpdate={handleTaskUpdate} onTaskDelete={handleTaskDelete} />;
            case 'focus-energy': return <FocusEnergyView userEnergy={userFocusEnergy} />;
            case 'stats': return <Stats sessionLogs={sessionLogs} tasks={tasks} />;
            case 'achievements': return <Achievements achievements={achievements} />;
            default: return <Dashboard stats={stats} dailyStats={dailyStats} setView={setView} onSetDailyGoal={handleSetDailyGoal} />;
        }
    };

    return (
        <div className={`flex flex-col min-h-screen bg-light-bg dark:bg-dark-bg text-gray-900 dark:text-gray-100 font-sans transition-colors`}>
            <Header currentView={currentView} setView={setView} theme={theme} setTheme={setTheme} onLogout={handleLogout} userEmail={user.email} />
            <main className="flex-grow w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
                <div key={currentView} className="animate-fade-in-up">
                    {renderView()}
                </div>
            </main>
            <Footer />
            <NotificationCenter notifications={notifications} />
            <AIAgentButton onClick={() => setIsAiModalOpen(true)} />
            <AIAgentModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} chatHistory={chatHistory} onSendMessage={handleSendMessage} isLoading={isAiLoading} />
            <StreakModal isOpen={showStreakModal} onClose={() => setShowStreakModal(false)} streak={stats.studyStreak} />
        </div>
    );
};

export default App;
