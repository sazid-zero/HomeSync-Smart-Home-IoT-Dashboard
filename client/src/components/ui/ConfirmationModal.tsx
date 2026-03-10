import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'info'
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onCancel}
            />
            
            {/* Modal Content */}
            <div className="relative theme-card-bg w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border theme-border animate-in zoom-in duration-300">
                <div className="flex flex-col items-center text-center space-y-6">
                    {/* Icon based on variant */}
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                        variant === 'danger' ? 'bg-red-500/10' : 'bg-cyan-500/10'
                    }`}>
                        {variant === 'danger' ? (
                            <span className="text-3xl">⚠️</span>
                        ) : (
                            <span className="text-3xl text-cyan-500">❓</span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-bold theme-text-primary capitalize">{title}</h3>
                        <p className="text-sm theme-text-secondary leading-relaxed max-w-[280px]">
                            {message}
                        </p>
                    </div>

                    <div className="flex flex-col w-full gap-3 pt-4">
                        <button
                            onClick={onConfirm}
                            className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-transform active:scale-95 ${
                                variant === 'danger' 
                                ? 'bg-red-500 text-white shadow-red-500/20' 
                                : 'bg-cyan-500 text-white shadow-cyan-500/20'
                            }`}
                        >
                            {confirmText}
                        </button>
                        <button
                            onClick={onCancel}
                            className="w-full py-4 rounded-2xl theme-bg-tertiary theme-text-secondary font-bold text-lg hover:opacity-80 transition-all border theme-border"
                        >
                            {cancelText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
