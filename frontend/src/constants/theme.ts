export const COLORS = {
  primary: {
    base: 'bg-purple-600',
    hover: 'hover:bg-purple-700',
    text: 'text-white'
  },
  secondary: {
    base: 'bg-yellow-500',
    hover: 'hover:bg-yellow-600',
    text: 'text-white'
  }
} as const;

export const GRADIENTS = {
  header: 'bg-gradient-to-r from-purple-600 to-yellow-500',
  hero: 'bg-gradient-to-b from-purple-600 to-purple-800'
} as const;