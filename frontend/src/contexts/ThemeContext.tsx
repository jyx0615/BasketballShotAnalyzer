import React, { createContext, useContext, useState } from 'react';
import { NBA_TEAMS, TeamId } from '../constants/teams';

interface ThemeContextType {
  currentTeam: TeamId;
  setTeam: (team: TeamId) => void;
  colors: typeof NBA_TEAMS[TeamId]['colors'];
  gradients: typeof NBA_TEAMS[TeamId]['gradients'];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTeam, setCurrentTeam] = useState<TeamId>('warriors');

  const value = {
    currentTeam,
    setTeam: setCurrentTeam,
    colors: NBA_TEAMS[currentTeam].colors,
    gradients: NBA_TEAMS[currentTeam].gradients,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}