import { KeyFrame } from '../../../types/analysis';
import { cn } from '../../../utils/styles';

interface KeyFrameCardProps {
  frame: KeyFrame;
  onClick: () => void;
  primaryColor: string;
}

export function KeyFrameCard({ frame, onClick, primaryColor }: KeyFrameCardProps) {
  return (
    <div 
      className="group relative aspect-[4/3] rounded-lg overflow-hidden border-2 cursor-pointer transform transition-transform hover:scale-[1.02]"
      style={{ borderColor: primaryColor }}
      onClick={onClick}
    >
      <img
        src={frame.url}
        alt={frame.label}
        className="w-full h-full object-cover"
      />
      <div className={cn(
        "absolute inset-0 bg-black transition-all duration-200",
        "bg-opacity-0 group-hover:bg-opacity-20",
        "flex flex-col items-center justify-center"
      )}>
        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center px-4">
          {frame.label}
        </span>
        <span className="text-white text-sm opacity-0 group-hover:opacity-75 transition-opacity duration-200">
          Click to enlarge
        </span>
      </div>
    </div>
  );
}