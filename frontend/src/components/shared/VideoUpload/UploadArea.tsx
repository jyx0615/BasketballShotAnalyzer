import React, { useRef } from 'react';
import { cn } from '../../../utils/styles';
import { useTheme } from '../../../contexts/ThemeContext';
import { UploadPrompt } from './UploadPrompt';
import { VideoPreview } from './VideoPreview';

interface UploadAreaProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  previewUrl?: string;
  fileName?: string;
}

export function UploadArea({ onChange, onDelete, previewUrl, fileName }: UploadAreaProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { colors } = useTheme();

  const handleClick = () => {
    if (!previewUrl) {
      fileInputRef.current?.click();
    }
  };
  
  return (
    <div
      onClick={handleClick}
      className={cn(
        "border-2 border-dashed rounded-lg transition-all",
        "relative overflow-hidden cursor-pointer",
        previewUrl ? "bg-gray-50" : "hover:bg-opacity-10 group"
      )}
      style={{
        borderColor: colors.primary,
        backgroundColor: previewUrl ? undefined : `${colors.primary}05`,
      }}
    >
      {previewUrl && fileName ? (
        <VideoPreview
          url={previewUrl}
          fileName={fileName}
          onDelete={onDelete}
        />
      ) : (
        <UploadPrompt
          inputRef={fileInputRef}
          onChange={onChange}
        />
      )}
    </div>
  );
}