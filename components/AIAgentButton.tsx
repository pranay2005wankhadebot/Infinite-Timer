// FIX: Create content for AIAgentButton.tsx
import React from 'react';
// FIX: Using explicit file path to ensure module resolution.
import { Icon } from './Icon.tsx';

interface AIAgentButtonProps {
    onClick: () => void;
}

const AIAgentButton: React.FC<AIAgentButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 bg-gradient-to-br from-purple-600 to-indigo-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-transform duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-purple-300 animate-soft-pulse"
            aria-label="Open AI Assistant"
        >
            <Icon name="robot" className="w-8 h-8" />
        </button>
    );
};

export default AIAgentButton;