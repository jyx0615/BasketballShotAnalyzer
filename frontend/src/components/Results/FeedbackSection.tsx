import { useTheme } from '../../contexts/ThemeContext';
import { useAnalysis } from '../../contexts/AnalysisContext';
import DOMPurify from "dompurify";

export function FeedbackSection() {
  const { colors } = useTheme();
  const { currentResult } = useAnalysis();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 
        className="text-xl font-semibold mb-4"
        style={{ color: colors.primary }}
      >
        Analysis Feedback
      </h2>
      <div className="space-y-4">
        {currentResult?.feedback.map((feedback, index) => (
          <div 
            key={index}
            className="border-l-4 p-4 bg-gray-50"
            style={{ borderColor: feedback.type == "primary"? colors.primary:colors.secondary }}
          >
            <h3 className="font-medium mb-2">{feedback.title}</h3>
            <div 
              className="text-gray-600"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(feedback.content) }}>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}