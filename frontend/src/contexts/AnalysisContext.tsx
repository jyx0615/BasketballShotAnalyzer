import React, { createContext, useContext, useState } from 'react';
import { AnalysisResult, AnalysisState } from '../types/analysis';

const AnalysisContext = createContext<AnalysisState | undefined>(undefined);

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);

  const value: AnalysisState = {
    currentResult,
    setCurrentResult,
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