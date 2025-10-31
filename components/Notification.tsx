import React from 'react';
import { Notification as NotificationType } from '../types.ts';
import { Icon } from './Icon.tsx';

const Notification: React.FC<{ notification: NotificationType }> = ({ notification }) => {
    const iconName = notification.type === 'achievement' ? 'trophy' : (notification.type === 'milestone' ? 'celebrate' : 'bell');
    const color = 'text-yellow-500';

    return (
        <div className="bg-light-card dark:bg-dark-card rounded-lg shadow-2xl p-4 w-80 border animate-fade-in-up">
            <div className="flex items-start gap-3">
                <Icon name={iconName} className={`w-6 h-6 ${color}`} />
                <div>
                    <p className="font-bold">{notification.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{notification.message}</p>
                </div>
            </div>
        </div>
    );
};

export default Notification;
