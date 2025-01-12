import React from 'react';
import { ButtonProps } from '../../types/button';
import { useTheme } from '../../contexts/ThemeContext';
import { cn } from '../../utils/styles';

export function Button({ 
  children, 
  variant = 'primary', 
  icon: Icon, 
  onClick,
}: ButtonProps) {
  const { colors } = useTheme();
  
  const baseClasses = cn(
    "px-6 py-3 rounded-lg flex items-center space-x-2",
    "transition-all transform hover:scale-105",
    "shadow-md hover:shadow-lg"
  );

  const buttonStyle = {
    backgroundColor: variant === 'primary' ? colors.primary : colors.secondary,
    color: '#ffffff',
  };

  return (
    <button 
      className={baseClasses}
      style={buttonStyle}
      onClick={onClick}
    >
      <span>{children}</span>
      {Icon && <Icon size={20} />}
    </button>
  );
}