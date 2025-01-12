import React from 'react';
import { Upload } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { UPLOAD_CONFIG } from '../../../constants/upload';
import { cn } from '../../../utils/styles';

interface UploadPromptProps {
  inputRef: React.RefObject<HTMLInputElement>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function UploadPrompt({ inputRef, onChange }: UploadPromptProps) {
  const { colors } = useTheme();

  return (
    <div className="px-6 py-12 text-center">
      <Upload 
        className={cn(
          "mx-auto h-12 w-12 mb-3 transition-transform duration-200",
          "group-hover:scale-110"
        )}
        style={{ color: colors.primary }}
      />
      <div className="text-sm mb-2">
        <span 
          className="font-medium transition-colors duration-200 group-hover:opacity-80"
          style={{ color: colors.primary }}
        >
          Upload a video
        </span>
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          accept={UPLOAD_CONFIG.acceptedFormats.join(',')}
          onChange={onChange}
        />
      </div>
      <p className="text-xs text-gray-500">
        {UPLOAD_CONFIG.supportedFormats.join(', ')} up to {UPLOAD_CONFIG.maxSize}MB
      </p>
    </div>
  );
}