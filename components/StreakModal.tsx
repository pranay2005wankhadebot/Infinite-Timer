import React from 'react';
import Modal from './Modal.tsx';
import { Icon } from './Icon.tsx';

interface StreakModalProps {
    isOpen: boolean;
    onClose: () => void;
    streak: number;
}

const StreakModal: React.FC<StreakModalProps> = ({ isOpen, onClose, streak }) => {
    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
             <div className="p-2 text-center">
                <Icon name="celebrate" className="w-20 h-20 text-yellow-400 mx-auto animate-pop-in" />
                <h2 className="text-2xl font-bold mt-4">Streak Extended!</h2>
                <p className="text-5xl font-bold my-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                    <span className="inline-block bg-gradient-to-r from-orange-400 via-red-500 to-orange-400 bg-clip-text text-transparent animate-shimmer-text bg-[length:200%_auto]">
                        {streak}
                    </span>
                    <span className="text-3xl"> Days</span>
                </p>
                <p className="text-gray-600 dark:text-gray-300">You're on fire! Keep up the amazing consistency.</p>
                <button onClick={onClose} className="w-full mt-6 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700">
                    Keep Going!
                </button>
             </div>
        </Modal>
    );
};

export default StreakModal;