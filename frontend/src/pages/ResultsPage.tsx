import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/shared';
import { KeyFrames } from '../components/Results/KeyFrames';
import { FeedbackSection } from '../components/Results/FeedbackSection';
// import { ScoreDisplay } from '../components/Results/ScoreDisplay';
import { SaveOptions } from '../components/Results/SaveOptions/SaveOptions';
import { VideoPlayer } from '../components/Results/VideoPlayer';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { useAnalysis } from '../contexts/AnalysisContext';

export function ResultsPage() {
  const { setCurrentResult } = useAnalysis();
  const navigate = useNavigate();
  useScrollToTop();

  const goBack = () => {
    navigate('/');
    setCurrentResult(null);
  }; 

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Button 
          variant="secondary" 
          icon={ArrowLeft}
          onClick={goBack}
        >
          Back to Analysis
        </Button>
        
        <div className="mt-8 space-y-8">
          <VideoPlayer 
            title="Your Shot Analysis"
          />
          {/* <KeyFrames /> */}
          <div className="grid md:grid-cols-2 gap-8">
            <KeyFrames />
            {/* <ScoreDisplay /> */}
            <FeedbackSection />
          </div>

          <SaveOptions />
        </div>    
      </div>
    </div>
  );
}