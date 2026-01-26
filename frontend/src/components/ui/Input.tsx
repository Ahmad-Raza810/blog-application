import React from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, icon, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-200 mb-1">
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-400">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={twMerge(
                            'block w-full rounded-lg border-secondary-300 bg-white dark:bg-secondary-900 border focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-secondary-900 dark:text-secondary-100 sm:text-sm py-2 px-3 transition-colors',
                            icon ? 'pl-10' : '',
                            error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '',
                            'disabled:bg-secondary-50 disabled:text-secondary-500',
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-200 mb-1">
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    className={twMerge(
                        'block w-full rounded-lg border-secondary-300 bg-white dark:bg-secondary-900 border focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-secondary-900 dark:text-secondary-100 sm:text-sm py-2 px-3 transition-colors',
                        error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : '',
                        'disabled:bg-secondary-50 disabled:text-secondary-500',
                        className
                    )}
                    {...props}
                />
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';
