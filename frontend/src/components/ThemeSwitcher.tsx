import { Palette } from 'lucide-react';
import { NBA_TEAMS, TeamId } from '../constants/teams';
import { useTheme } from '../contexts/ThemeContext';
import { cn } from '../utils/styles';

export function ThemeSwitcher() {
  const { currentTeam, setTeam } = useTheme();

  return (
    <div className="relative group">
      <button
        className="p-2 rounded-lg hover:bg-white/10 transition-colors flex items-center space-x-2"
        aria-label="Change team theme"
      >
        <Palette size={20} />
        <span>Color Theme</span>
      </button>
      
      <div className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {(Object.keys(NBA_TEAMS) as TeamId[]).map((teamId) => (
          <button
            key={teamId}
            onClick={() => setTeam(teamId)}
            className={cn(
              "w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors",
              "flex items-center space-x-2 text-black",
              currentTeam === teamId && "bg-gray-50"
            )}
          >
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: NBA_TEAMS[teamId].colors.primary }}
            />
            <span>{NBA_TEAMS[teamId].name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}