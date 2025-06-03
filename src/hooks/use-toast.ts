import { useState, useCallback } from 'react';
import { ToastMessage, ToastType } from '@/components/ui/toast';

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((
    type: ToastType,
    title: string,
    description?: string,
    duration?: number
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: ToastMessage = {
      id,
      type,
      title,
      description,
      duration,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto-remove toast after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, duration || 5000);

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((title: string, description?: string, duration?: number) => {
    return addToast('success', title, description, duration);
  }, [addToast]);

  const error = useCallback((title: string, description?: string, duration?: number) => {
    return addToast('error', title, description, duration);
  }, [addToast]);

  const info = useCallback((title: string, description?: string, duration?: number) => {
    return addToast('info', title, description, duration);
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
  };
} 