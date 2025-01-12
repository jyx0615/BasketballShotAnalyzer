import { useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '../../../utils/styles';

interface ToastProps {
  message?: string;
  onClose: () => void;
  duration?: number;
  type?: 'success' | 'error';
}

export function Toast({ 
  message, 
  onClose, 
  duration = 3000,
  type = 'success' 
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const styles = {
    success: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-500',
      text: 'text-emerald-800',
      icon: 'text-emerald-500',
      hover: 'hover:bg-emerald-100',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-800',
      icon: 'text-red-500',
      hover: 'hover:bg-red-100',
    },
  };

  const currentStyle = styles[type];
  const Icon = type === 'success' ? CheckCircle : AlertCircle;

  return (
    <div 
      className={cn(
        "fixed top-4 z-50 pointer-events-auto animate-slide-in-right",
        "w-[calc(100%-2rem)] max-w-[320px]",
        "right-4 md:right-6",
        currentStyle.bg,
        `border ${currentStyle.border}`,
        "shadow-lg rounded-lg"
      )}
    >
      <div className="p-3 md:p-4">
        <div className="flex items-center">
          <Icon className={`h-5 w-5 ${currentStyle.icon} mr-2 md:mr-3 flex-shrink-0`} />
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${currentStyle.text} truncate`}>
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className={cn(
              "ml-2 md:ml-4 flex-shrink-0 rounded-md p-1.5",
              currentStyle.icon,
              currentStyle.hover,
              "focus:outline-none focus:ring-2",
              `focus:ring-${type === 'success' ? 'emerald' : 'red'}-500`,
              "transition-colors"
            )}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}