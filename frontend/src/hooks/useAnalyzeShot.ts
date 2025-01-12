import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeShot } from '../api/analysis';
import { useAnalysis } from '../contexts/AnalysisContext';

interface UseAnalyzeShotResult {
  analyze: (video: File, type: 'comparison' | 'individual', comparisonVideo?: File) => Promise<void>;
  isAnalyzing: boolean;
  error: Error | null;
  showResults: boolean;
  setError: (error: Error | null) => void;
  handleViewResults: () => void;
  handleStop: () => void;
}

export function useAnalyzeShot(): UseAnalyzeShotResult {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const { addResult, setCurrentResult } = useAnalysis();

  const analyze = async (video: File, type: 'comparison' | 'individual', comparisonVideo?: File) => {
    setIsAnalyzing(true);
    setError(null);
    setShowResults(false);

    try {
      const result = await analyzeShot(video, type, comparisonVideo);
      addResult(result);
      setShowResults(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Analysis failed'));
      setIsAnalyzing(false);
    }
  };

  const handleViewResults = () => {
    setShowResults(false);
    setIsAnalyzing(false);
    navigate('/results');
  };

  const handleStop = () => {
    setShowResults(false);
    setIsAnalyzing(false);
    setCurrentResult(null);
  }

  return { analyze, isAnalyzing, error, showResults, setError, handleViewResults, handleStop };
}