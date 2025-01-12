import { SaveButton } from './SaveButton';
import { downloadImage, generatePDF } from '../../../utils/download';
import { useAnalysis } from '../../../contexts/AnalysisContext';
import { useTheme } from '../../../contexts/ThemeContext';

export function SaveOptions() {
  const { colors } = useTheme();
  const { currentResult } = useAnalysis();
  // Example frames - in production, these would come from analysis context
  const frames = currentResult?.keyFrames.map(frame => frame.url) ?? [];

  const handleSaveImages = async () => {
    frames.forEach((frame, index) => {
      downloadImage(frame, `frame-${index + 1}.jpg`);
    });
  };

  const handleSaveFeedback = () => {
    generatePDF({"feedback": currentResult?.feedback});
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4" style={{ color: colors.primary }}>Save Analysis</h2>
      <div className="flex flex-wrap gap-4 justify-end">
        <SaveButton
          onClick={handleSaveImages}
          label="Save Key Frames"
        />
        <SaveButton
          onClick={handleSaveFeedback}
          label="Save Feedback (PDF)"
        />
      </div>
    </div>
  );
}