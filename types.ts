export type View = 'dashboard' | 'timer' | 'tasks' | 'focus-energy' | 'stats' | 'achievements';

export type Theme = 'light' | 'dark';

export type IconName =
  | 'home' | 'timer' | 'matrix' | 'brain' | 'focus' | 'trophy'
  | 'infinity' | 'moon' | 'sun' | 'logout' | 'check' | 'edit'
  | 'trash' | 'info' | 'close' | 'google' | 'email' | 'lock'
  | 'robot' | 'celebrate' | 'settings' | 'play' | 'pause'
  | 'reset' | 'chevron-down' | 'volume-up' | 'volume-off' | 'sparkles'
  | 'send' | 'quote' | 'gear' | 'bell' | 'atom' | 'calendar' | 'balance';

export interface Task {
  id: string;
  text: string;
  subject: string;
  completed: boolean;
  isImportant: boolean; // Corresponds to Leverage
  isUrgent: boolean;    // Corresponds to Consequence
  completionDate?: string;
}

export interface SessionLog {
  date: string;
  duration: number; // in seconds
  subject: string;
  sessionType: 'pomodoro' | 'adaptive';
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    type: 'tasks' | 'study_time' | 'streak' | 'level' | 'session_length';
    value: number;
}


export type FocusEnergy = 'Kitsune' | 'Tora' | 'Kuma' | 'Hybrid';

export interface FocusEnergyProfile {
  name: FocusEnergy;
  icon: IconName;
  color: string;
  energy: string;
  coreTraits: string;
  stressResponse: string;
  learningStyle: string;
  optimalMethod: string;
  tips: string[];
}

export interface User {
  email: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'achievement' | 'milestone' | 'reminder';
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export interface SoundSettings {
    volume: number;
    isMuted: boolean;
    focusEndSound: string;
    breakEndSound: string;
}

export interface UserStats {
    level: number;
    xp: number;
    studyStreak: number;
    dailyGoal: number; // in seconds
    soundSettings: SoundSettings;
}
