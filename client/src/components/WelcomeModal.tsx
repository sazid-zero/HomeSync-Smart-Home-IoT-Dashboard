import React from 'react';

interface WelcomeModalProps {
    isOpen: boolean;
    onDismiss: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onDismiss }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <div className="relative theme-card-bg w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl border theme-border animate-in zoom-in duration-300">
                <div className="flex flex-col items-center text-center space-y-5">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                        <span className="text-4xl">🏠</span>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold theme-text-primary">Welcome to HomeSync!</h3>
                        <p className="text-sm theme-text-secondary leading-relaxed">
                            Your smart home dashboard is ready to explore.
                        </p>
                    </div>

                    {/* Info cards */}
                    <div className="w-full space-y-3 text-left">
                        <div className="flex items-start space-x-3 p-3 rounded-2xl theme-bg-tertiary">
                            <span className="text-lg flex-shrink-0 mt-0.5">⚡</span>
                            <div>
                                <h4 className="text-sm font-bold theme-text-primary">Simulated Devices</h4>
                                <p className="text-xs theme-text-secondary mt-0.5 leading-relaxed">
                                    We've pre-loaded your dashboard with demo rooms and devices. All sensor data (temperature, power, air quality) is <strong>auto-generated</strong> to showcase the system.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 rounded-2xl theme-bg-tertiary">
                            <span className="text-lg flex-shrink-0 mt-0.5">✏️</span>
                            <div>
                                <h4 className="text-sm font-bold theme-text-primary">Fully Customizable</h4>
                                <p className="text-xs theme-text-secondary mt-0.5 leading-relaxed">
                                    You can <strong>add or delete</strong> rooms and devices from the <strong>Rooms</strong> page to personalize your smart home layout.
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3 p-3 rounded-2xl theme-bg-tertiary">
                            <span className="text-lg flex-shrink-0 mt-0.5">📊</span>
                            <div>
                                <h4 className="text-sm font-bold theme-text-primary">Live Analytics</h4>
                                <p className="text-xs theme-text-secondary mt-0.5 leading-relaxed">
                                    Real-time energy charts and environmental monitoring update continuously via WebSocket.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <button
                        onClick={onDismiss}
                        className="w-full py-4 rounded-2xl bg-cyan-500 text-white font-bold text-lg shadow-lg shadow-cyan-500/20 transition-transform active:scale-95 mt-2"
                    >
                        Got it, let's go!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WelcomeModal;
