import { Menu, X } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MobileMenu({ isOpen, onToggle }: MobileMenuProps) {
  return (
    <button 
      className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
      onClick={onToggle}
      aria-label="Toggle menu"
    >
      {isOpen ? (
        <X size={24} className="text-white" />
      ) : (
        <Menu size={24} className="text-white" />
      )}
    </button>
  );
}