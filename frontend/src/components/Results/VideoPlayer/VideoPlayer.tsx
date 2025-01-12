import { useTheme } from '../../../contexts/ThemeContext';
import { useAnalysis } from '../../../contexts/AnalysisContext';

interface VideoPlayerProps {
  title?: string;
}

export function VideoPlayer({ title }: VideoPlayerProps) {
  const { colors } = useTheme();
  const { currentResult } = useAnalysis();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {title && (
        <h2 
          className="text-xl font-semibold mb-4"
          style={{ color: colors.primary }}
        >
          {title}
        </h2>
      )}
      <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
        <video
          src={currentResult?.videoUrl}
        //   src="https://www.youtube.com/watch?v=nq2bf_TahSU"
          className="w-full h-full object-contain"
          controls
          playsInline
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}