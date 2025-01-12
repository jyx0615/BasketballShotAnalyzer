import { useLocation, useNavigate } from 'react-router-dom';
import { ThemeSwitcher } from '../ThemeSwitcher';
import { cn } from '../../utils/styles';

interface NavigationProps {
  mobile?: boolean;
  onClose?: () => void;
}

export function Navigation({ mobile, onClose }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const links = [
    { href: '#comparison', label: 'Comparison Analysis' },
    { href: '#individual', label: 'Individual Analysis' },
  ];

  const handleClick = (href: string) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
    onClose?.();
  };

  return (
    <nav>
      <ul className={cn(
        'flex items-center',
        mobile ? 'flex-col space-y-4' : 'space-x-6'
      )}>
        {links.map(({ href, label }) => (
          <li key={href}>
            <a
              href={href}
              className={cn(
                'block transition-colors',
                'py-2 px-4 hover:bg-white/10 rounded-lg'
              )}
              onClick={(e) => {
                e.preventDefault();
                handleClick(href);
              }}
            >
              {label}
            </a>
          </li>
        ))}
        <li>
          <ThemeSwitcher />
        </li>
      </ul>
    </nav>
  );
}