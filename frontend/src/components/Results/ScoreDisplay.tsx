import { useTheme } from '../../contexts/ThemeContext';
import { CircularProgress } from '../shared/CircularProgress';
import { useAnalysis } from '../../contexts/AnalysisContext';

export function ScoreDisplay() {
  const { colors } = useTheme();
  const { currentResult } = useAnalysis();
  const score = currentResult?.score??0; // Example score

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 
        className="text-xl font-semibold mb-4"
        style={{ color: colors.primary }}
      >
        Overall Score
      </h2>
      <div className="mt-5 flex items-center justify-center">
        <CircularProgress
          value={score}
          size={160}
          strokeWidth={12}
          primaryColor={colors.primary}
          secondaryColor={colors.secondary}
        >
          <span 
            className="text-4xl font-bold"
            style={{ color: colors.primary }}
          >
            {score}
          </span>
        </CircularProgress>
      </div>
    </div>
  );
}