import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface SingleToastProps {
  notification: ToastNotification;
  onClose: () => void;
}

export const Toast: React.FC<SingleToastProps> = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-auto max-w-sm w-full">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
        className={`flex items-start gap-3 p-4 rounded-2xl shadow-2xl border backdrop-blur-md transition-all ${
          notification.type === 'success'
            ? 'bg-[#1E3A2F] text-white border-[#2c5344]'
            : notification.type === 'error'
            ? 'bg-[#4A1515] text-white border-[#702121]'
            : 'bg-[#2A1E17] text-[#FDFBF7] border-[#443226]'
        }`}
      >
        {notification.type === 'success' && (
          <CheckCircle2 className="w-5 h-5 text-[#86efac] shrink-0 mt-0.5" />
        )}
        {notification.type === 'error' && (
          <AlertCircle className="w-5 h-5 text-[#fca5a5] shrink-0 mt-0.5" />
        )}
        {notification.type === 'info' && (
          <Info className="w-5 h-5 text-[#D4A373] shrink-0 mt-0.5" />
        )}

        <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
          {notification.message}
        </div>

        <button
          onClick={onClose}
          className="text-white/70 hover:text-white transition-colors p-1"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
};

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md transition-all ${
              toast.type === 'success'
                ? 'bg-[#1E3A2F] text-white border-[#2c5344]'
                : toast.type === 'error'
                ? 'bg-[#4A1515] text-white border-[#702121]'
                : 'bg-[#2A1E17] text-[#FDFBF7] border-[#443226]'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#86efac] shrink-0 mt-0.5" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-[#fca5a5] shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-5 h-5 text-[#D4A373] shrink-0 mt-0.5" />}

            <div className="flex-1 text-sm">
              <p className="font-semibold">{toast.title}</p>
              {toast.message && <p className="text-xs opacity-90 mt-0.5">{toast.message}</p>}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="text-white/70 hover:text-white transition-colors p-1"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
