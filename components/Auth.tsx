import React, { useState } from 'react';
import { User } from '../types.ts';
import { Icon } from './Icon.tsx';

interface AuthProps { onLogin: (user: User) => void; }

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim() === '' || password.trim() === '') {
            alert('Please provide an email and password.');
            return;
        }
        onLogin({ email });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-light-bg dark:bg-dark-bg px-4 animate-fade-in">
            <div className="max-w-md w-full space-y-8">
                 <div className="text-center">
                    <Icon name="infinity" className="w-16 h-16 text-primary-500 mx-auto" />
                    <h1 className="mt-4 text-4xl font-bold">Infinite Timer</h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Unlock Your Infinite Potential.</p>
                </div>
                <div className="bg-light-card dark:bg-dark-card p-8 rounded-2xl shadow-lg">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)}
                                   className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-md placeholder-gray-500 text-gray-900 dark:text-white bg-light-bg dark:bg-dark-bg focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-all"
                                   placeholder="Email address" />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)}
                                   className="w-full px-3 py-2 border border-light-border dark:border-dark-border rounded-md placeholder-gray-500 text-gray-900 dark:text-white bg-light-bg dark:bg-dark-bg focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition-all"
                                   placeholder="Password" />
                        </div>
                        <div>
                            <button type="submit"
                                    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-transform active:scale-95">
                                {mode === 'login' ? 'Sign In' : 'Sign Up'}
                            </button>
                        </div>
                    </form>
                    <div className="mt-6 text-center">
                        <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                className="font-medium text-primary-600 hover:text-primary-500 text-sm">
                            {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;