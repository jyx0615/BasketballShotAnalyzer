import { LucideIcon } from 'lucide-react';

export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  icon?: LucideIcon;
  onClick?: () => void;
}