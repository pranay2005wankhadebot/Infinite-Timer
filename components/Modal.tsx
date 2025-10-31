import React, { ReactNode } from 'react';
import { Icon } from './Icon.tsx';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-light-card dark:bg-dark-card rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full relative animate-pop-in" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">
                    <Icon name="close" className="w-6 h-6" />
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;