import React from 'react';
import { Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/styles';

export function Logo() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <button 
      onClick={handleClick}
      className={cn(
        "flex items-center space-x-3",
        "transition-opacity hover:opacity-80"
      )}
    >
      <Activity size={28} className="text-white shrink-0" />
      <h1 className="text-xl sm:text-2xl font-bold whitespace-nowrap">Shot Analysis Pro</h1>
    </button>
  );
}