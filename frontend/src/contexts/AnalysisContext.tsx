import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnalysisResult, AnalysisState } from '../types/analysis';

const AnalysisContext = createContext<AnalysisState | undefined>(undefined);

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);

  const addResult = useCallback((result: AnalysisResult) => {
    setResults(prev => [...prev, result]);
    setCurrentResult(result);
  }, []);

  const value: AnalysisState = {
    results,
    currentResult,
    setCurrentResult,
    addResult
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}