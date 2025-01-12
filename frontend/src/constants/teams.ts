export const NBA_TEAMS = {
  warriors: {
    name: 'Golden State Warriors',
    colors: {
      primary: '#1d428a',
      secondary: '#ffc72c',
      accent: '#2A5CAD'
    },
    gradients: {
      header: 'bg-gradient-to-r from-[#1D428A] to-[#FFC72C]',
      hero: 'bg-gradient-to-b from-[#1D428A] to-[#2A5CAD]'
    }
  },
  lakers: {
    name: 'Los Angeles Lakers',
    colors: {
      primary: '#552583',
      secondary: '#f9a01b',
      accent: '#773BBE'
    },
    gradients: {
      header: 'bg-gradient-to-r from-[#552583] to-[#FDB927]',
      hero: 'bg-gradient-to-b from-[#552583] to-[#773BBE]'
    }
  },
  celtics: {
    name: 'Boston Celtics',
    colors: {
      primary: '#007a33',
      secondary: '#ba9653',
      accent: '#009646'
    },
    gradients: {
      header: 'bg-gradient-to-r from-[#007A33] to-[#BA9653]',
      hero: 'bg-gradient-to-b from-[#007A33] to-[#009646]'
    }
  },
  heat: {
    name: 'Miami Heat',
    colors: {
      primary: '#98002e',
      secondary: '#f9a01b',
      accent: '#B4043F'
    },
    gradients: {
      header: 'bg-gradient-to-r from-[#98002E] to-[#F9A01B]',
      hero: 'bg-gradient-to-b from-[#98002E] to-[#B4043F]'
    }
  }
} as const;

export type TeamId = keyof typeof NBA_TEAMS;