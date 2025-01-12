export interface KeyFrame {
  url: string;
  label: string;
}

export interface AnalysisResult {
  type: 'comparison' | 'individual';
  videoUrl: string;
  score: number;
  feedback: {
    title: string;
    content: string;
    type: 'primary' | 'secondary';
  }[];
  keyFrames: KeyFrame[];
}

export interface AnalysisState {
  currentResult: AnalysisResult | null;
  setCurrentResult: (result: AnalysisResult | null) => void;
}