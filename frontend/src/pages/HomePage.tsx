import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Hero } from '../components/Layout';
import { ComparisonAnalysis } from '../components/ComparisonAnalysis';
import { IndividualAnalysis } from '../components/IndividualAnalysis';

export function HomePage() {
  const navigate = useNavigate();

  const handleAnalyze = () => {
    navigate('/results');
  };

  return (
    <main>
      <Hero />
      <ComparisonAnalysis onAnalyze={handleAnalyze} />
      <IndividualAnalysis onAnalyze={handleAnalyze} />
    </main>
  );
}