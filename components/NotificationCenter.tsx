import React from 'react';
// FIX: Using explicit file path to ensure module resolution.
import { Notification as NotificationType } from '../types.ts';
// FIX: Using explicit file path to ensure module resolution.
import Notification from './Notification.tsx';

interface NotificationCenterProps {
    notifications: NotificationType[];
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications }) => {
    return (
        <div className="fixed top-20 right-4 z-50 space-y-3">
            {notifications.map(notification => (
                <Notification key={notification.id} notification={notification} />
            ))}
        </div>
    );
};

export default NotificationCenter;
