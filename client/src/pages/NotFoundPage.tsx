import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full w-full text-center p-8">
            <div className="theme-card-bg p-12 rounded-3xl theme-shadow-strong flex flex-col items-center max-w-lg w-full">
                <div className="text-8xl font-black text-transparent bg-clip-text mb-4" style={{ backgroundImage: 'var(--gradient-bg)' }}>
                    404
                </div>
                <h1 className="text-2xl font-bold theme-text-primary mb-2">Page Not Found</h1>
                <p className="theme-text-secondary mb-8">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <Link 
                    to="/" 
                    className="px-8 py-3 rounded-xl text-white font-bold transition-transform hover:scale-105 active:scale-95"
                    style={{ background: 'var(--gradient-bg)' }}
                >
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default NotFoundPage;
