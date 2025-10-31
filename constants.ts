import { Achievement, FocusEnergyProfile } from './types.ts';

export const PRIORITY_MATRIX_INSTRUCTIONS = {
    title: "The Priority Matrix",
    description: "This matrix helps you prioritize based on a task's future **Leverage** (importance) and immediate **Consequence** (urgency). This ensures you're not just busy, but effective.",
    quadrants: [
        { name: 'High Leverage, Low Consequence', details: 'Important but not urgent. Your main focus for long-term growth.' },
        { name: 'High Leverage, High Consequence', details: 'Urgent and important. Handle these to avoid problems and achieve goals.' },
        { name: 'Low Leverage, High Consequence', details: 'Urgent but not important. Do these quickly to get them out of the way.' },
        { name: 'Low Leverage, Low Consequence', details: 'Neither urgent nor important. Eliminate these to free up focus.' },
    ]
};

export const ADAPTIVE_TIMER_INSTRUCTIONS = {
    title: "Adaptive Timer: Deep Work",
    description: "The adaptive timer is for long, focused sessions. Prepare your environment to minimize distractions and maximize your productivity."
};

export const DEEP_WORK_INSTRUCTIONS = [
    "Turn off all notifications on your phone and computer.",
    "Close any unnecessary tabs or applications.",
    "Have a glass of water and a notepad nearby.",
    "Set a clear goal for what you want to accomplish."
];

export const FOCUS_ENERGY_PROFILES: FocusEnergyProfile[] = [
    {
        name: 'Kitsune',
        icon: 'brain',
        color: 'text-orange-500',
        energy: "Quick & Adaptable",
        coreTraits: "You're a curious multi-tasker who learns by exploring. You enjoy variety and jumping between different topics.",
        stressResponse: "You might feel scattered or overwhelmed by too many options. Deep, prolonged focus can sometimes be a challenge.",
        learningStyle: "You connect ideas from different fields. Mind maps and brainstorming are your superpowers.",
        optimalMethod: "Use the Adaptive Timer to switch subjects frequently. Project-based learning keeps you engaged.",
        tips: [
            "Group small, varied tasks together to satisfy your curiosity.",
            "Schedule 'exploration time' so you can discover new things without derailing core tasks.",
            "Use the Priority Matrix to ensure you're chasing important new ideas, not just any new idea."
        ]
    },
    {
        name: 'Tora',
        icon: 'atom',
        color: 'text-red-500',
        energy: "Deep & Intense",
        coreTraits: "You excel at deep, sustained concentration on a single subject. You're methodical and prefer to see one thing through to completion.",
        stressResponse: "Switching tasks frequently can be draining. You might get frustrated when your flow state is interrupted.",
        learningStyle: "You learn best through linear, structured material. Master one concept before moving to the next.",
        optimalMethod: "Use the Adaptive Timer for long, uninterrupted work sessions. Block out time for specific subjects.",
        tips: [
            "Dedicate specific days to specific subjects to maintain focus.",
            "Use the 'Deep Work' preparation checklist before starting an Adaptive session.",
            "Break large projects into sequential, manageable tasks."
        ]
    },
    {
        name: 'Kuma',
        icon: 'balance',
        color: 'text-green-500',
        energy: "Steady & Foundational",
        coreTraits: "You thrive on routine and consistency. You build knowledge brick by brick, ensuring a solid foundation.",
        stressResponse: "Unpredictable schedules can be unsettling. You prefer a clear plan and may resist sudden changes.",
        learningStyle: "You learn through repetition and practice. Well-structured routines and habits are key to your success.",
        optimalMethod: "The Pomodoro technique is perfect for you, providing a predictable rhythm of work and rest. Set daily goals.",
        tips: [
            "Stick to a consistent study schedule to build momentum.",
            "Review past material regularly to reinforce your knowledge base.",
            "Use the Daily Goal feature on the Dashboard to track your consistency."
        ]
    },
     {
        name: 'Hybrid',
        icon: 'sparkles',
        color: 'text-primary-500',
        energy: "Balanced & Evolving",
        coreTraits: "Your style is still emerging. You show a mix of traits, adapting your approach as needed. Keep exploring to find what works best!",
        stressResponse: "You're still figuring out your triggers. Pay attention to when you feel most productive and when you feel drained.",
        learningStyle: "You're a generalist, able to learn in various ways. This is a great time to experiment with different techniques.",
        optimalMethod: "Try both Pomodoro and Adaptive timers. Your profile will become clearer as you log more sessions.",
        tips: [
            "Log at least 5 sessions to get your personalized Focus Energy profile.",
            "Experiment with different subjects and timer settings.",
            "Don't worry about being perfect; focus on building a consistent habit."
        ]
    }
];

export const INBUILT_SOUNDS = {
    Chime: 'https://cdn.pixabay.com/audio/2022/03/15/audio_a54b3cfd29.mp3',
    Alert: 'https://cdn.pixabay.com/audio/2022/11/21/audio_1e8787399a.mp3',
    Beep: 'https://cdn.pixabay.com/audio/2021/08/04/audio_542a0b4a78.mp3',
    Tick: 'https://cdn.pixabay.com/audio/2022/03/10/audio_57e174457a.mp3',
    None: 'none',
};


export const INITIAL_ACHIEVEMENTS: Achievement[] = [
    // Task Completion
    { id: 'task_1', name: 'Task Taker', description: 'Complete your first task.', icon: '✅', unlocked: false, type: 'tasks', value: 1 },
    { id: 'task_10', name: 'Task Master', description: 'Complete 10 tasks.', icon: '🔥', unlocked: false, type: 'tasks', value: 10 },
    { id: 'task_50', name: 'Task Legend', description: 'Complete 50 tasks.', icon: '👑', unlocked: false, type: 'tasks', value: 50 },
    
    // Study Time
    { id: 'study_1', name: 'First Focus', description: 'Log 1 hour of study time.', icon: '⏱️', unlocked: false, type: 'study_time', value: 1 },
    { id: 'study_10', name: 'Dedicated Learner', description: 'Log 10 hours of study time.', icon: '📚', unlocked: false, type: 'study_time', value: 10 },
    { id: 'study_50', name: 'Academic Weapon', description: 'Log 50 hours of study time.', icon: '🧠', unlocked: false, type: 'study_time', value: 50 },

    // Streak
    { id: 'streak_3', name: 'Getting Started', description: 'Maintain a 3-day streak.', icon: '🌱', unlocked: false, type: 'streak', value: 3 },
    { id: 'streak_7', name: 'Weekly Warrior', description: 'Maintain a 7-day streak.', icon: '📅', unlocked: false, type: 'streak', value: 7 },
    { id: 'streak_30', name: 'Habitual Hero', description: 'Maintain a 30-day streak.', icon: '🗓️', unlocked: false, type: 'streak', value: 30 },

    // Level
    { id: 'level_5', name: 'Leveling Up', description: 'Reach Level 5.', icon: '⭐', unlocked: false, type: 'level', value: 5 },
    { id: 'level_10', name: 'Power Player', description: 'Reach Level 10.', icon: '🌟', unlocked: false, type: 'level', value: 10 },

    // Session Length
    { id: 'session_60', name: 'Deep Diver', description: 'Complete a single session of 60 minutes.', icon: '🌊', unlocked: false, type: 'session_length', value: 60 },
];