'use client';

import { useEffect, useState } from 'react';
import { Check, X, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

const toastVariants = {
  success: {
    icon: Check,
    className: 'bg-green-50 border-green-200 text-green-900',
    iconClassName: 'bg-green-500 text-white',
  },
  error: {
    icon: AlertCircle,
    className: 'bg-red-50 border-red-200 text-red-900',
    iconClassName: 'bg-red-500 text-white',
  },
  info: {
    icon: Info,
    className: 'bg-blue-50 border-blue-200 text-blue-900',
    iconClassName: 'bg-blue-500 text-white',
  },
};

export function Toast({ toast, onRemove }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const variant = toastVariants[toast.type];
  const Icon = variant.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(toast.id), 200); // Allow fade out animation
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  return (
    <div
      className={cn(
        'transform transition-all duration-200 ease-in-out',
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      )}
    >
      <div
        className={cn(
          'bg-white border shadow-lg rounded-lg p-4 min-w-[300px] max-w-md',
          variant.className
        )}
      >
        <div className="flex items-start space-x-3">
          <div className={cn('w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0', variant.iconClassName)}>
            <Icon className="w-3.5 h-3.5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">{toast.title}</p>
            {toast.description && (
              <p className="text-xs mt-1 opacity-80">{toast.description}</p>
            )}
          </div>
          
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onRemove(toast.id), 200);
            }}
            className="w-5 h-5 flex items-center justify-center hover:bg-black/10 rounded-full transition-colors flex-shrink-0"
          >
            <X className="w-3 h-3 opacity-60" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ToastContainer({ toasts }: { toasts: ToastMessage[] }) {
  return (
    <div className="fixed top-6 right-6 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onRemove={() => {}} />
      ))}
    </div>
  );
} 