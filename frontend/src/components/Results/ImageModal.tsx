import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/styles';

interface ImageModalProps {
  imageUrl: string;
  title?: string;
  onClose: () => void;
}

export function ImageModal({ imageUrl, title, onClose }: ImageModalProps) {
  const { colors } = useTheme();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
      onClick={onClose}
    >
      <div 
        className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className={cn(
            "absolute top-4 right-4 p-2 rounded-full",
            "bg-white shadow-lg hover:bg-gray-100",
            "transition-colors z-10"
          )}
          style={{ color: colors.primary }}
        >
          <X size={24} />
        </button>
        
        <div className="relative h-full flex items-center justify-center">
          <img
            src={imageUrl}
            alt={title || "Full size view"}
            className={cn(
              "max-w-full max-h-[calc(90vh-2rem)]",
              "object-contain w-auto h-auto"
            )}
          />
          {title && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-50">
              <h3 className="text-white text-lg font-medium">
                {title}
              </h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}