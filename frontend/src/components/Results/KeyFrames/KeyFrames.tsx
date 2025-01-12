import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { KeyFrameGrid } from './KeyFrameGrid';
import { ImageModal } from '../ImageModal';
import { useAnalysis } from '../../../contexts/AnalysisContext';

export function KeyFrames() {
  const { colors } = useTheme();
  const { currentResult } = useAnalysis();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  if (!currentResult) {
    return null;
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 
          className="text-xl font-semibold mb-4"
          style={{ color: colors.primary }}
        >
          Key Moments
        </h2>
        <KeyFrameGrid
          frames={currentResult.keyFrames}
          onSelect={(frame) => setSelectedImage(frame.url)}
        />
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