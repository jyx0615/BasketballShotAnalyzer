import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { KeyFrame } from '../../../types/analysis';
import { KeyFrameCard } from './KeyFrameCard';

interface KeyFrameGridProps {
  frames: KeyFrame[];
  onSelect: (frame: KeyFrame) => void;
}

export function KeyFrameGrid({ frames, onSelect }: KeyFrameGridProps) {
  const { colors } = useTheme();

  if (frames.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No key frames available for this analysis.
      </div>
    );
  }

  const gridCols = frames.length <= 2 ? 'md:grid-cols-2' : 'md:grid-cols-3';

  return (
    <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
      {frames.map((frame) => (
        <KeyFrameCard
          key={frame.id}
          frame={frame}
          onClick={() => onSelect(frame)}
          primaryColor={colors.primary}
        />
      ))}
    </div>
  );
}