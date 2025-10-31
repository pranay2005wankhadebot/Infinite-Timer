import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Task, SoundSettings } from '../types.ts';
import { Icon } from './Icon.tsx';
import SoundSettingsModal from './SoundSettingsModal.tsx';
import Modal from './Modal.tsx';
import { DEEP_WORK_INSTRUCTIONS, ADAPTIVE_TIMER_INSTRUCTIONS } from '../constants.ts';

interface TimerProps {
    onSessionComplete: (duration: number, subject: string, sessionType: 'pomodoro' | 'adaptive') => void;
    tasks: Task[];
    soundSettings: SoundSettings;
    onSoundSettingsChange: (settings: Partial<SoundSettings>) => void;
}

type TimerMode = 'pomodoro' | 'adaptive';
type PomodoroState = 'work' | 'break';

const Timer: React.FC<TimerProps> = ({ onSessionComplete, tasks, soundSettings, onSoundSettingsChange }) => {
    const [mode, setMode] = useState<TimerMode>('pomodoro');
    const [isActive, setIsActive] = useState(false);
    const [time, setTime] = useState(0);
    const [subject, setSubject] = useState('');
    const [showPrepModal, setShowPrepModal] = useState(false);
    
    // Pomodoro settings
    const [focusDuration, setFocusDuration] = useState(25 * 60);
    const [breakDuration, setBreakDuration] = useState(5 * 60);
    const [pomodoroState, setPomodoroState] = useState<PomodoroState>('work');

    // Adaptive settings
    const [adaptiveTime, setAdaptiveTime] = useState(0);
    const [breakRatio, setBreakRatio] = useState(1/4);

    const timerRef = useRef<number | null>(null);
    const focusAudioRef = useRef<HTMLAudioElement>(null);
    const breakAudioRef = useRef<HTMLAudioElement>(null);
    
    const subjects = useMemo(() => {
        const uniqueSubjects = ['General', ...Array.from(new Set(tasks.filter(t => !t.completed).map(t => t.subject)))];
        if(!subject && uniqueSubjects.length > 0) setSubject(uniqueSubjects[0]);
        return uniqueSubjects;
    }, [tasks]);

    useEffect(() => {
        return () => { if (timerRef.current) clearInterval(timerRef.current) };
    }, []);

    useEffect(() => {
        if (focusAudioRef.current) focusAudioRef.current.volume = soundSettings.isMuted ? 0 : soundSettings.volume;
        if (breakAudioRef.current) breakAudioRef.current.volume = soundSettings.isMuted ? 0 : soundSettings.volume;
    }, [soundSettings]);

    const startTimer = () => {
        if (mode === 'adaptive' && adaptiveTime === 0) {
            setShowPrepModal(true);
            return;
        }
        setIsActive(true);
        timerRef.current = window.setInterval(() => {
            if (mode === 'pomodoro') setTime(t => t - 1);
            else setAdaptiveTime(t => t + 1);
        }, 1000);
    };

    const stopTimer = () => {
        setIsActive(false);
        if (timerRef.current) clearInterval(timerRef.current);
        if (mode === 'adaptive' && adaptiveTime > 0) {
            onSessionComplete(adaptiveTime, subject, 'adaptive');
            const breakTime = Math.floor(adaptiveTime * breakRatio);
            alert(`Great session! Time for a ${Math.floor(breakTime/60)} minute break.`);
            setAdaptiveTime(0);
        }
    };

    useEffect(() => {
        if (mode === 'pomodoro' && time === 0 && isActive) {
            if (pomodoroState === 'work') {
                focusAudioRef.current?.play().catch(e => console.error(e));
                onSessionComplete(focusDuration, subject, 'pomodoro');
                setPomodoroState('break');
                setTime(breakDuration);
            } else {
                breakAudioRef.current?.play().catch(e => console.error(e));
                setPomodoroState('work');
                setTime(focusDuration);
            }
        }
    }, [time, isActive, mode, pomodoroState, focusDuration, breakDuration, subject, onSessionComplete]);

    useEffect(() => {
        stopTimer();
        setTime(focusDuration);
        setPomodoroState('work');
        setAdaptiveTime(0);
    }, [mode, focusDuration, breakDuration]);

    const handleStartFromPrep = () => {
        setShowPrepModal(false);
        setIsActive(true);
         timerRef.current = window.setInterval(() => setAdaptiveTime(t => t + 1), 1000);
    }
    
    const displayTime = mode === 'pomodoro' ? time : adaptiveTime;
    const minutes = Math.floor(displayTime / 60);
    const seconds = displayTime % 60;

    return (
        <div className="max-w-xl mx-auto flex flex-col items-center gap-6">
            <div className="w-full flex justify-center bg-light-card dark:bg-dark-card p-1 rounded-full border border-light-border dark:border-dark-border">
                <button onClick={() => setMode('pomodoro')} className={`w-1/2 py-2 rounded-full text-sm font-semibold transition-colors ${mode === 'pomodoro' ? 'bg-primary-500 text-white' : ''}`}>Pomodoro</button>
                <button onClick={() => setMode('adaptive')} className={`w-1/2 py-2 rounded-full text-sm font-semibold transition-colors ${mode === 'adaptive' ? 'bg-primary-500 text-white' : ''}`}>Adaptive</button>
            </div>
            
            <div className={`relative w-72 h-72 rounded-full flex items-center justify-center transition-all duration-500 ease-in-out border-8 ${isActive ? 'bg-primary-500/10 animate-slow-pulse border-primary-500 scale-105' : 'bg-light-card dark:bg-dark-card border-light-border dark:border-dark-border'}`}>
                <div className="text-center">
                    <p className="text-7xl font-bold tracking-tighter">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</p>
                    <p className="text-gray-500 dark:text-gray-400 capitalize">{mode === 'pomodoro' ? pomodoroState : 'Focus Session'}</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button onClick={isActive ? stopTimer : startTimer} className="w-24 h-24 rounded-full bg-primary-600 text-white flex items-center justify-center text-2xl font-bold hover:bg-primary-700 transition-transform active:scale-90 shadow-lg">
                    {isActive ? <Icon name="pause" className="w-10 h-10"/> : <Icon name="play" className="w-10 h-10"/>}
                </button>
            </div>

             <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full max-w-xs bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500">
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            
            <div className="w-full bg-light-card dark:bg-dark-card p-4 rounded-lg border border-light-border dark:border-dark-border">
                <div key={mode} className="animate-fade-in">
                {mode === 'pomodoro' ? (
                     <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm font-medium"><label>Focus</label><span>{Math.floor(focusDuration/60)} min</span></div>
                            <input type="range" min="300" max="10800" step="300" value={focusDuration} onChange={e => setFocusDuration(Number(e.target.value))} className="w-full" disabled={isActive}/>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm font-medium"><label>Break</label><span>{Math.floor(breakDuration/60)} min</span></div>
                            <input type="range" min="60" max="3600" step="60" value={breakDuration} onChange={e => setBreakDuration(Number(e.target.value))} className="w-full" disabled={isActive}/>
                        </div>
                    </div>
                ) : (
                    <div>
                         <p className="text-sm font-medium mb-2">Break Ratio (Break : Work)</p>
                         <div className="flex bg-light-bg dark:bg-dark-bg p-1 rounded-lg border border-light-border dark:border-dark-border">
                            <button onClick={() => setBreakRatio(1/3)} className={`w-1/2 py-1 rounded-md text-xs transition-colors ${breakRatio === 1/3 ? 'bg-primary-500 text-white' : ''}`}>1 : 3</button>
                            <button onClick={() => setBreakRatio(1/4)} className={`w-1/2 py-1 rounded-md text-xs transition-colors ${breakRatio === 1/4 ? 'bg-primary-500 text-white' : ''}`}>1 : 4</button>
                         </div>
                    </div>
                )}
                </div>
            </div>
             <Modal isOpen={showPrepModal} onClose={() => setShowPrepModal(false)}>
                 <div className="p-2 text-center">
                    <Icon name="brain" className="w-16 h-16 text-primary-500 mx-auto"/>
                    <h3 className="text-xl font-bold mt-2">Prepare for Deep Work</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{ADAPTIVE_TIMER_INSTRUCTIONS.description}</p>
                    <ul className="text-left list-disc list-inside mt-4 space-y-2 text-sm">
                        {DEEP_WORK_INSTRUCTIONS.map((item, i) => <li key={i}>{item}</li>)}
                    </ul>
                    <button onClick={handleStartFromPrep} className="w-full mt-6 bg-primary-600 text-white py-3 rounded-lg font-semibold">Begin Session</button>
                 </div>
             </Modal>
             <audio ref={focusAudioRef} src={soundSettings.focusEndSound} />
             <audio ref={breakAudioRef} src={soundSettings.breakEndSound} />
        </div>
    );
};

export default Timer;