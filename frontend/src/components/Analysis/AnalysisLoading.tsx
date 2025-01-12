import { LoadingSpinner } from '../shared/LoadingSpinner';

export function AnalysisLoading() {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center space-y-4">
        <LoadingSpinner size={40} />
        <p className="text-lg font-medium">Analyzing your shot...</p>
      </div>
    </div>
  );
}