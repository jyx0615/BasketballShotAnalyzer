import { Loader2 } from 'lucide-react';
import { cn } from '../../../utils/styles';
import { useTheme } from '../../../contexts/ThemeContext';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export function LoadingSpinner({ size = 24, className }: LoadingSpinnerProps) {
  const { colors } = useTheme();
  
  return (
    <Loader2 
      size={size}
      className={cn("animate-spin", className)}
      style={{ color: colors.primary }}
    />
  );
}