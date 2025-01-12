import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { ImageModal } from './ImageModal';
import { useAnalysis } from '../../contexts/AnalysisContext';

export function KeyFrames() {
  const { colors } = useTheme();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { currentResult } = useAnalysis();

  const frames = currentResult?.keyFrames;

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 
          className="text-xl font-semibold mb-4"
          style={{ color: colors.primary }}
        >
          Key Moments
        </h2>
        <div className="grid grid-cols-1 gap-6 p-3">
          {frames?.map((frame, index) => (
            <div 
              key={index}
              className="group relative aspect-[4/3] rounded-lg overflow-hidden border-2 cursor-pointer transform transition-transform hover:scale-[1.02]"
              style={{ borderColor: colors.primary }}
              onClick={() => setSelectedImage(frame.url)}
            >
              <img
                src={frame.url}
                alt={`Key frame ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div 
                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center"
              >
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  Click to enlarge
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
}