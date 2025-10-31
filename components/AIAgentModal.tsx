// FIX: Create content for AIAgentModal.tsx
import React, { useState, useRef, useEffect } from 'react';
// FIX: Using explicit file path to ensure module resolution.
import { Icon } from './Icon.tsx';
// FIX: Using explicit file path to ensure module resolution.
import Modal from './Modal.tsx';
// FIX: Using explicit file path to ensure module resolution.
import { ChatMessage } from '../types.ts';

interface AIAgentModalProps {
    isOpen: boolean;
    onClose: () => void;
    chatHistory: ChatMessage[];
    onSendMessage: (message: string) => void;
    isLoading: boolean;
}

const AIAgentModal: React.FC<AIAgentModalProps> = ({ isOpen, onClose, chatHistory, onSendMessage, isLoading }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatHistory]);

    const handleSend = () => {
        if (input.trim() === '' || isLoading) return;
        onSendMessage(input);
        setInput('');
    };
    
    const promptSuggestions = [
        "How can I improve my focus today?",
        "Give me a study plan based on my tasks.",
        "What achievement can I unlock next?",
        "Tell me about my Tora energy."
    ];
    
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col h-[70vh]">
                <div className="flex items-center gap-3 mb-4 p-2 border-b border-light-border dark:border-dark-border">
                    <Icon name="robot" className="w-8 h-8 text-primary-500" />
                    <h2 className="text-xl font-bold">AI Productivity Coach</h2>
                </div>

                <div className="flex-grow overflow-y-auto pr-4 space-y-4">
                    {chatHistory.filter(m => m.role !== 'system').map((message, index) => (
                        <div key={index} className={`flex gap-3 animate-fade-in ${message.role === 'user' ? 'justify-end' : 'flex-start'}`}>
                            {message.role === 'model' && <Icon name="robot" className="w-6 h-6 text-primary-500 flex-shrink-0 mt-1" />}
                            <div className={`p-3 rounded-xl max-w-sm whitespace-pre-wrap ${message.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 dark:bg-gray-700 rounded-bl-none'}`}>
                                <p className="text-sm" dangerouslySetInnerHTML={{__html: message.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}}></p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3 animate-fade-in">
                             <Icon name="robot" className="w-6 h-6 text-primary-500 flex-shrink-0" />
                            <div className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></span>
                                </div>
                            </div>
                        </div>
                    )}
                     {chatHistory.length === 0 && !isLoading && (
                        <div className="text-center p-4 animate-fade-in">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Try asking one of these:</p>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                {promptSuggestions.map(prompt => (
                                    <button key={prompt} onClick={() => setInput(prompt)} className="p-2 bg-light-bg dark:bg-dark-bg rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-left">
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="mt-4 flex gap-2 border-t border-light-border dark:border-dark-border pt-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask for advice or a study plan..."
                        className="flex-grow bg-gray-100 dark:bg-gray-800 p-3 rounded-md border border-light-border dark:border-dark-border focus:ring-2 focus:ring-primary-500 focus:outline-none"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading || input.trim() === ''} className="bg-primary-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-primary-700 transition-transform active:scale-95 disabled:bg-primary-300 disabled:cursor-not-allowed">
                        <Icon name="send" className="w-5 h-5"/>
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default AIAgentModal;