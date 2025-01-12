import React from 'react';
import { Download } from 'lucide-react';
import { cn } from '../../../utils/styles';
import { useTheme } from '../../../contexts/ThemeContext';

interface SaveButtonProps {
  onClick: () => void;
  label: string;
}

export function SaveButton({ onClick, label }: SaveButtonProps) {
  const { colors } = useTheme();
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center space-x-2 px-4 py-2 rounded-lg",
        "text-white transition-transform hover:scale-105",
        "shadow-md hover:shadow-lg"
      )}
      style={{ backgroundColor: colors.primary }}
    >
      <Download size={16} />
      <span>{label}</span>
    </button>
  );
}