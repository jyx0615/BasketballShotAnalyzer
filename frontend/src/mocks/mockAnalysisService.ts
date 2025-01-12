import { AnalysisResult } from '../types/analysis';
import { MOCK_FRAMES, MOCK_FEEDBACK } from './data';

const MOCK_DELAY = 2000; // 2 seconds delay to simulate processing

function createMockResult(type: 'comparison' | 'individual'): AnalysisResult {
  return {
    id: Math.random().toString(36).substring(7),
    type,
    timestamp: new Date().toISOString(),
    score: Math.floor(Math.random() * 20) + 80, // Random score between 80-100
    feedback: MOCK_FEEDBACK,
    keyFrames: MOCK_FRAMES
  };
}

export async function mockAnalyzeShot(
  video: File,
  type: 'comparison' | 'individual',
  comparisonVideo?: File
): Promise<AnalysisResult> {
  // Simulate network delay and processing time
  await new Promise(resolve => setTimeout(resolve, MOCK_DELAY));
  
  // Simulate random failures (10% chance)
  if (Math.random() < 0.1) {
    throw new Error('Analysis failed: Server error');
  }

  return createMockResult(type);
}