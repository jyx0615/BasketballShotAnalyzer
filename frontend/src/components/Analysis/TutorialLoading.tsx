import { useEffect, useState } from 'react';
import { fetchRandomTutorial } from '../../api/tutorial';
import { Button } from '../shared';
import { useTheme } from '../../contexts/ThemeContext';
import { useAnalysis } from '../../contexts/AnalysisContext';
import { TutorialVideo } from './TutorialVideo';
import { cn } from '../../utils/styles';

interface TutorialLoadingProps {
  onViewResults: () => void;
  onStop: () => void;
}

export function TutorialLoading({ onViewResults, onStop }: TutorialLoadingProps) {
  const [tutorialUrl, setTutorialUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { colors } = useTheme();
  const { currentResult } = useAnalysis();

  useEffect(() => {
    fetchRandomTutorial().then(url => {
      setTutorialUrl(url);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[99999]">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 relative">
        <h3 
          className="text-xl font-semibold mb-4"
          style={{ color: colors.primary }}
        >
          While we analyze your shot, watch this tutorial
        </h3>
        
        <div className="relative aspect-video mb-4 bg-black rounded-lg overflow-hidden">
          <TutorialVideo
            url={tutorialUrl}
            isLoading={isLoading}
          />
        </div>

        <div className="flex justify-between items-center">
          <button 
            className={cn(
              "px-6 py-3 rounded-lg flex items-center space-x-2",
              "transition-all transform hover:scale-105",
              "bg-red-500 hover:bg-red-600 text-white",
              "shadow-md hover:shadow-lg"
            )}
            onClick={onStop}>
              Stop analysis
          </button>
          {currentResult && (
            <Button onClick={onViewResults}>
              View Analysis Results
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}