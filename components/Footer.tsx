import React from 'react';

const Footer: React.FC = () => (
    <footer className="bg-light-card dark:bg-dark-card border-t border-light-border dark:border-dark-border mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} Infinite Timer. All rights reserved.</p>
        </div>
    </footer>
);

export default Footer;
