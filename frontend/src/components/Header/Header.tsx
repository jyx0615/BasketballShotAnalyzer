import { useState } from 'react';
import { Logo } from './Logo';
import { Navigation } from './Navigation';
import { MobileMenu } from './MobileMenu';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { gradients } = useTheme();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleNavigateHome = () => {
    setIsMenuOpen(false); // Close mobile menu if open
    navigate('/');
  };

  return (
    <header className={`${gradients.header} text-white py-6 px-4 sm:px-8`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <Logo onNavigateHome={handleNavigateHome} />
          <div className="hidden md:block">
            <Navigation />
          </div>
          <MobileMenu 
            isOpen={isMenuOpen} 
            onToggle={toggleMenu} 
          />
        </div>
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <Navigation mobile onClose={() => setIsMenuOpen(false)} />
          </div>
        )}
      </div>
    </header>
  );
}