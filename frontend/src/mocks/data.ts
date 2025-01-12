import { AnalysisResult } from '../types/analysis';

export const MOCK_FRAMES = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
    timestamp: 0.5,
    label: 'Starting Position'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=80',
    timestamp: 1.2,
    label: 'Release Point'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?auto=format&fit=crop&w=800&q=80',
    timestamp: 1.8,
    label: 'Follow Through'
  }
];

export const MOCK_FEEDBACK = [
  {
    title: 'Form Analysis',
    content: 'Excellent follow-through on your shot. Your elbow alignment is consistent, and the ball rotation shows good spin. Consider maintaining a higher release point for better arc on the shot.',
    type: 'primary'
  },
  {
    title: 'Balance and Posture',
    content: 'Your base is stable throughout the shooting motion. The knee bend is appropriate, providing good power transfer. Work on keeping your shoulders squared to the basket.',
    type: 'secondary'
  }
];