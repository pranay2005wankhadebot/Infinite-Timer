
import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Sector } from 'recharts';
// FIX: Using named imports from the main date-fns package to resolve export errors.
import {
    format,
    isSameDay,
    eachDayOfInterval,
    parseISO,
    subDays
} from 'date-fns';
import { SessionLog, Task } from '../types.ts';
import { Icon } from './Icon.tsx';

interface StatsProps {
    sessionLogs: SessionLog[];
    tasks: Task[];
}

type ViewMode = 'daily' | 'weekly' | 'monthly';

const formatTimeForChart = (seconds: number) => Number((seconds / 3600).toFixed(2));

const subjectColors = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ec4899', '#f59e0b'];

const Stats: React.FC<StatsProps> = ({ sessionLogs, tasks }) => {
    const [viewMode, setViewMode] = useState<ViewMode>('daily');

    const chartData = useMemo(() => {
        const now = new Date();
        if (viewMode === 'daily') {
            const interval = { start: subDays(now, 6), end: now };
            const days = eachDayOfInterval(interval);
            return days.map(day => ({
                name: format(day, 'EEE'),
                'Study Hours': formatTimeForChart(sessionLogs.filter(log => isSameDay(parseISO(log.date), day)).reduce((sum, log) => sum + log.duration, 0)),
                'Tasks Done': tasks.filter(task => task.completionDate && isSameDay(parseISO(task.completionDate), day)).length,
            }));
        }
        // Weekly and Monthly logic...
        return [];
    }, [sessionLogs, tasks, viewMode]);

    const subjectData = useMemo(() => {
        const dataMap = new Map<string, number>();
        sessionLogs.forEach(log => {
            dataMap.set(log.subject, (dataMap.get(log.subject) || 0) + log.duration);
        });
        return Array.from(dataMap.entries()).map(([name, value]) => ({ name, value: formatTimeForChart(value) })).sort((a,b) => b.value - a.value);
    }, [sessionLogs]);

    const hasData = sessionLogs.length > 0 || tasks.some(t => t.completed);

    if (!hasData) {
        return (
            <div className="text-center py-16">
                 <Icon name="focus" className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto" />
                 <h3 className="mt-4 text-xl font-semibold">No Stats to Show Yet</h3>
                 <p className="mt-2 text-gray-500">Complete a study session or a task to start tracking your progress!</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2 bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-sm border border-light-border dark:border-dark-border">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Productivity Overview</h2>
                        <div className="flex bg-light-bg dark:bg-dark-bg p-1 rounded-lg border border-light-border dark:border-dark-border">
                            {(['daily', 'weekly', 'monthly'] as ViewMode[]).map(mode => (
                                <button key={mode} onClick={() => setViewMode(mode)} className={`px-3 py-1 rounded-md text-sm font-medium capitalize transition-colors ${viewMode === mode ? 'bg-primary-500 text-white' : ''}`}>{mode}</button>
                            ))}
                        </div>
                    </div>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Legend /><Bar dataKey="Study Hours" fill="#3b82f6" isAnimationActive={true} animationDuration={800} /><Bar dataKey="Tasks Done" fill="#10b981" isAnimationActive={true} animationDuration={800} /></BarChart></ResponsiveContainer>
                    </div>
                </div>
                 <div className="bg-light-card dark:bg-dark-card p-6 rounded-lg shadow-sm border border-light-border dark:border-dark-border">
                    <h2 className="text-xl font-semibold mb-4">Focus by Subject</h2>
                     <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={subjectData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label isAnimationActive={true}>
                                    {subjectData.map((entry, index) => <Cell key={`cell-${index}`} fill={subjectColors[index % subjectColors.length]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Stats;
