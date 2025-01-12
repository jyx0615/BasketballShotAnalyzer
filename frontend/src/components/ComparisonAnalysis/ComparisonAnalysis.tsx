import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../shared';
import { VideoUpload } from '../shared/VideoUpload';
import { Toast } from '../shared/Toast';
import { useTheme } from '../../contexts/ThemeContext';
import { useAnalyzeShot } from '../../hooks/useAnalyzeShot';
import { TutorialLoading } from '../Analysis/TutorialLoading';

export function ComparisonAnalysis() {
  const { colors } = useTheme();
  const { analyze, isAnalyzing, error, setError,  handleViewResults, handleStop } = useAnalyzeShot();
  const [userVideo, setUserVideo] = useState<File | null>(null);
  const [roleModelVideo, setRoleModelVideo] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleUserVideo = (file: File) => {
    setUserVideo(file);
    setValidationError(null);
  };

  const handleRoleModelVideo = (file: File) => {
    setRoleModelVideo(file);
    setValidationError(null);
  };

  const handleAnalyze = async () => {
    if (!userVideo || !roleModelVideo) {
      setValidationError('Please upload both videos.');
      return;
    }
    await analyze(userVideo, 'comparison', roleModelVideo);
  };

  const closeToast = () => {
    setError(null);
    setValidationError(null);
  };

  return (
    <>
      <section id="comparison" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 
            className="text-3xl font-bold mb-8"
            style={{ color: colors.primary }}
          >
            Comparison Analysis
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <VideoUpload label="Upload Your Shot" onChange={handleUserVideo} />
            <VideoUpload label="Upload Role Model Shot" onChange={handleRoleModelVideo} />
          </div>
          <div className="mt-8 flex justify-center">
            <Button 
              icon={ArrowRight} 
              onClick={handleAnalyze}
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Shots'}
            </Button>
          </div>
        </div>
      </section>
      {isAnalyzing && <TutorialLoading onViewResults={handleViewResults} onStop={handleStop}/>}
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