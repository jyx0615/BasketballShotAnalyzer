import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../shared';
import { VideoUpload } from '../shared/VideoUpload';
import { useTheme } from '../../contexts/ThemeContext';
import { useAnalyzeShot } from '../../hooks/useAnalyzeShot';
import { TutorialLoading } from '../Analysis/TutorialLoading';
import { Toast } from '../shared/Toast';

export function IndividualAnalysis() {
  const { colors } = useTheme();
  const { analyze, isAnalyzing, error, setError, handleViewResults, handleStop } = useAnalyzeShot();
  const [video, setVideo] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const handleVideo = (file: File) => {
    setVideo(file);
    setValidationError(null);
  };

  const handleAnalyze = async () => {
    if (!video) {
      setValidationError('Please upload a video.');
      return;
    }
    await analyze(video, 'individual');
  };

  const closeToast = () => {
    setError(null);
    setValidationError(null);
  };

  return (
    <>
      <section id="individual" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 
            className="text-3xl font-bold mb-8"
            style={{ color: colors.primary }}
          >
            Individual Analysis
          </h2>
          <div className="max-w-xl mx-auto">
            <VideoUpload label="Upload Your Shot for Analysis" onChange={handleVideo} />
            <div className="mt-8 flex justify-center">
              <Button 
                variant="secondary" 
                icon={ArrowRight} 
                onClick={handleAnalyze}
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Technique'}
              </Button>
            </div>
          </div>
        </div>
      </section>
      {isAnalyzing && <TutorialLoading onViewResults={handleViewResults} onStop={handleStop} />}
      {(error || validationError) && (
        <Toast
          message={validationError || error?.message}
          onClose={closeToast}
          type="error"
          duration={5000}
        />
      )}
    </>
  );
}